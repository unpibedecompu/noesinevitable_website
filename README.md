# No Es Inevitable — sitio web

Sitio de [noesinevitable.org](https://noesinevitable.org): un formulario para
que cualquier persona de **Argentina o Uruguay** le mande un mail pre-escrito
(editable) a sus representantes políticos sobre los riesgos del desarrollo de
IA de frontera. Idea basada en <https://controlai.org/take-action>.

Estrategia, investigación y financiamiento del proyecto: repo privado
`unpibedecompu/noesinevitable_operations`. Estado del sitio, analytics y
pendientes: [`PROJECT_STATUS.md`](./PROJECT_STATUS.md).

## Páginas

- **`/`** — qué es la iniciativa, la participación en vivo (personas y mails
  enviados, por país y región) y los cursos de BlueDot.
- **`/contacta-representantes/`** — el formulario (4 pasos, abajo). Es el link
  que se comparte (`SHARE_URL` en `lib/share.ts`).

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS.
- **Export estático** (`output: "export"` → carpeta `out/`), servido como static
  assets de un Cloudflare Worker: sin servidor ni funciones por request, gratis
  y sin límite de tráfico.
- Los mails salen del cliente de correo del usuario (Gmail, Outlook o
  `mailto:`), uno por representante. Sin backend de envío.
- Cada mail lleva en CC `registro@noesinevitable.org`: el Worker aparte
  [`workers/cc-counter/`](./workers/cc-counter/README.md) cuenta esas copias y
  publica los totales que muestra `/`.
- Analytics: Cloudflare Web Analytics (pageviews) + Umami Cloud (eventos del
  embudo, vía `trackFunnel` en `lib/analytics.ts`).
- Datos de representantes: `data/representatives.json` estático (sin base de
  datos). El texto del mail y del sitio: `data/site-copy.json`.

## Correr localmente

```bash
npm install
npm run dev        # http://localhost:3000
```

En dev se muestran también los representantes con `verified: false` para poder
probar la UI. En producción (`NODE_ENV=production`) sólo se sirven los
verificados.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | servidor de desarrollo (`localhost:3000`) |
| `npm run build` | build + export estático a `out/` |
| `npm run preview` | build y sirve `out/` localmente (`localhost:4173`) |
| `npm run lint` | ESLint (config de Next) |
| `npm run check:data` | valida `data/representatives.json` (campos, emails, fuentes) |
| `npm run check:senadores-ar` | compara los senadores AR con los datos abiertos del Senado |
| `npm run edit:mail` | editor local del asunto y texto del mail (`localhost:3001`) |

## Flujo del usuario

1. **Paso 1** — elegí país (auto-sugerido por IP vía `/cdn-cgi/trace` de
   Cloudflare, editable), provincia/departamento, nombre y sexo (para
   "ciudadana"/"ciudadano") → "Generar mi mensaje".
2. **Paso 2** — revisá/editá asunto y cuerpo.
3. **Paso 3** — lista de representantes, un botón por representante
   ("Enviar con Gmail" / "Enviar con Outlook", o "Abrir formulario"). Cada
   uno abre un mail individual, con el saludo personalizado para ese
   representante (`lib/message-template.ts`); al usarlo, la tarjeta queda con
   ✓ y atenuada. Si el cliente no abre, hay un fallback para copiar el
   mensaje.
4. **Paso 4** — gracias + compartir (WhatsApp / X / Facebook), cursos de
   BlueDot y redes.

## Datos de representantes

`data/representatives.json` es un array de objetos:

```jsonc
{
  "country": "AR",                       // ISO alpha-2
  "region": "Córdoba",                   // provincia/estado, o null si es cargo nacional
  "office": "diputado_nacional",         // valores válidos: `Office` en lib/types.ts
  "channel": "email",                    // "email" (default) | "form"
  "email": "email@hcdn.gob.ar",          // "" si channel es "form"
  "formUrl": "https://...",              // obligatorio si channel es "form"
  "name": "Nombre Apellido",
  "gender": "f",                         // "f" | "m", para el saludo ("Estimada Diputada")
  "institutional": false,                // true si es una casilla institucional (Presidencia…)
  "addressee": "Nombre del titular",     // sólo institucionales: a quién va el saludo
  "party": "Partido",                    // opcional, sólo para la UI
  "verified": false,                     // true SOLO si se chequeó contra la fuente oficial
  "source": "https://www.hcdn.gob.ar/..." // URL de la fuente oficial
}
```

- **`channel: "email"`** → se abre `mailto:`. **`channel: "form"`** → el usuario
  copia el mensaje y se le abre `formUrl` (para cargos que sólo tienen formulario
  web).
- Hoy hay datos sólo de AR y UY (`lib/countries.ts`). En producción sólo se
  muestran los `verified: true`.

## Deploy — Cloudflare Workers (static assets, gratis, tráfico ilimitado)

El dashboard actual de Cloudflare unificó Pages dentro de "Workers & Pages": al
conectar un repo por Git ahora crea un **Worker**, no un proyecto Pages
clásico. El plan free sirve assets estáticos con **requests y ancho de banda
ilimitados** (único límite real: 500 builds/mes). Como el sitio es un export
estático servido desde el CDN, aguanta picos virales sin costo.

El repo trae `wrangler.jsonc` con `assets.directory: "out"`, que le dice a
Wrangler que esto es un sitio estático puro. **Es importante que ese archivo
exista antes del primer deploy**: si `wrangler deploy` no encuentra
`wrangler.jsonc`, autodetecta "Next.js" e intenta migrar el proyecto al
adaptador OpenNext (pensado para SSR), lo cual falla porque este proyecto usa
`output: "export"` (build estático, no server build) — el error se ve como
`ENOENT: .../.next/standalone/.next/server/pages-manifest.json`.

**Cómo está hoy:** Worker `noesinevitable`, conectado por Git a este repo:
cada push a `master` hace build y deploy a noesinevitable.org (dominio propio
en Worker → Settings → Domains). Cada push a otra rama hace un build de
preview. **El `name` de `wrangler.jsonc` tiene que coincidir con el nombre del
Worker en el dashboard**, o el build falla.

**Setup desde cero (referencia):**

1. Cloudflare Dash → Workers & Pages → Create → Connect to Git → elegir este
   repo.
2. Build settings:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Root directory: dejar el default (`/`) — este repo ya es la raíz del proyecto
3. Analytics: en Worker → Settings → **Builds → Variables and secrets**
   (son variables de build, no de runtime) agregar
   `NEXT_PUBLIC_CF_BEACON_TOKEN` (Cloudflare Web Analytics) y
   `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (Umami). Un cambio ahí necesita un push
   nuevo para tomar efecto.
4. Conectar el dominio propio (Worker → Settings → Domains) y, si cambia,
   actualizar `SHARE_URL` en `lib/share.ts`.

La detección de país usa `/cdn-cgi/trace`, que Cloudflare responde
automáticamente en cualquier sitio que aloje. En local ese endpoint no existe →
el país arranca sin preseleccionar y el usuario elige a mano.

**Deploy manual (alternativa, sin Git):**

```bash
npm run build
npx wrangler deploy
```

## Fuera de scope

- **Backend de envío (Resend/SES): descartado** (2026-09-29). Los mails salen
  del proveedor del usuario, uno por representante — ver `PROJECT_STATUS.md` → "Envío de mails".
- No implementar todavía: representantes provinciales/locales, login,
  dashboard de analytics avanzado, Turnstile (sólo si hay abuso de bots).
- Otros países: están comentados en `lib/countries.ts`; se reactivan cuando
  haya datos verificados.

Próximos pasos y pendientes: [`PROJECT_STATUS.md`](./PROJECT_STATUS.md).
