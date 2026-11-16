#!/usr/bin/env node
/**
 * Compara las tablas de la base D1 remota con `schema.sql` y falla si no
 * coinciden. Corre solo antes de `npm run deploy` (`predeploy`), o a mano con
 * `npm run check:schema` (`-- --local` para la base local de `wrangler dev`).
 *
 * Por qué: `schema.sql` usa `CREATE TABLE IF NOT EXISTS`, así que si una tabla
 * ya existe con otra forma, `npm run schema` no la toca y el Worker falla en
 * cada mail sin que se note. Pasó en 2026-11 con `counts` (le faltaba `day`):
 * se perdieron los conteos de semanas.
 *
 * Cómo: carga `schema.sql` en una SQLite en memoria (`node:sqlite`, Node 22+),
 * lee las columnas de cada tabla con `pragma_table_info` y las compara con las
 * de la base D1 (nombre, tipo, NOT NULL, default y clave primaria). Las tablas
 * de la base que no están en `schema.sql` (restos de versiones viejas) se
 * ignoran.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

const DB_NAME = "noesinevitable-cc-counter";
const where = process.argv.includes("--local") ? "--local" : "--remote";

const COLUMNS_SQL =
  "SELECT m.name AS tbl, p.* FROM sqlite_master m JOIN pragma_table_info(m.name) p " +
  // Las tablas internas de D1 (`_cf_*`) dan "not authorized".
  "WHERE m.type = 'table' AND substr(m.name, 1, 4) != '_cf_' ORDER BY tbl, p.cid";

/** Columnas por tabla: `tabla → ["nombre TIPO NOT NULL DEFAULT x PK1", ...]`. */
function byTable(rows) {
  const tables = new Map();
  for (const r of rows) {
    const col = [
      r.name,
      r.type,
      r.notnull ? "NOT NULL" : "",
      r.dflt_value != null ? `DEFAULT ${r.dflt_value}` : "",
      r.pk ? `PK${r.pk}` : "",
    ]
      .filter(Boolean)
      .join(" ");
    if (!tables.has(r.tbl)) tables.set(r.tbl, []);
    tables.get(r.tbl).push(col);
  }
  return tables;
}

// Lo que dice schema.sql.
const mem = new DatabaseSync(":memory:");
mem.exec(readFileSync(new URL("../schema.sql", import.meta.url), "utf8"));
const expected = byTable(mem.prepare(COLUMNS_SQL).all());

// Lo que hay en D1.
const res = spawnSync(
  "npx",
  ["wrangler", "d1", "execute", DB_NAME, where, "--json", "--command", `"${COLUMNS_SQL}"`],
  { encoding: "utf8", shell: true },
);
let actual;
try {
  actual = byTable(JSON.parse(res.stdout)[0].results);
} catch {
  console.error(`✘ No pude leer el esquema de D1 (${where}):\n${res.stdout}\n${res.stderr}`);
  process.exit(1);
}

const problems = [];
for (const [table, cols] of expected) {
  const got = actual.get(table);
  if (!got) {
    problems.push(`- falta la tabla \`${table}\` (crearla con \`npm run schema\`)`);
  } else if (got.join("\n") !== cols.join("\n")) {
    problems.push(
      `- \`${table}\` no coincide con schema.sql:`,
      `    esperado: ${cols.join(", ")}`,
      `    en D1:    ${got.join(", ")}`,
    );
  }
}

if (problems.length) {
  console.error(
    [
      `✘ El esquema de D1 (${where}) no coincide con schema.sql:`,
      ...problems,
      "",
      "`npm run schema` no arregla esto: CREATE TABLE IF NOT EXISTS no cambia",
      "tablas que ya existen. Migrar la tabla a mano (ALTER TABLE, o DROP +",
      "`npm run schema` si se pueden perder sus filas) y volver a correr esto.",
    ].join("\n"),
  );
  process.exit(1);
}
console.log(`✔ El esquema de D1 (${where}) coincide con schema.sql (${expected.size} tablas).`);
