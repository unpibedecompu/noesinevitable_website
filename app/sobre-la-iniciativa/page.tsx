import type { Metadata } from "next";
import Link from "next/link";
import SocialIcons from "@/components/SocialIcons";
import Explanation from "@/components/Explanation";
import siteCopy from "@/data/site-copy.json";

const TITLE = `Sobre esta iniciativa · ${siteCopy.pageTitle}`;
const DESCRIPTION =
  "Qué busca No Es Inevitable, qué riesgos de la IA nos preocupan, qué acuerdos internacionales impulsamos y cómo trabajamos.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const p = "mt-3 text-base text-ink/70";
const h2 = "mt-10 text-xl font-bold leading-tight sm:text-2xl";
const ol = "mt-3 list-decimal space-y-2 pl-6 text-base text-ink/70 marker:font-semibold marker:text-accent-dark";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:pt-12">
      <header>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
          Sobre esta iniciativa
        </h1>
      </header>

      <article>
        <Explanation />
        <p className={p}>
          {siteCopy.pageTitle} te ayuda a escribirle a tus representantes
          políticos para expresarles tu preocupación por el desarrollo
          acelerado de la IA de frontera.
        </p>

        <h2 className={h2}>Qué buscamos</h2>
        <p className={p}>{siteCopy.pageTitle} busca:</p>
        <ol className={ol}>
          <li>
            Informar a las personas relevantes del proceso democrático sobre
            los riesgos existenciales de la IA, para que implementen medidas
            que los reduzcan.
          </li>
          <li>
            Comunicar los riesgos existenciales de la IA al público general y
            orientar a las personas para que tomen acciones costo-efectivas
            para reducirlos.
          </li>
        </ol>
        <p className={p}>
          Nuestro trabajo se enfoca principalmente en los países
          hispanohablantes.
        </p>

        <h2 className={h2}>Los riesgos</h2>
        <p className={p}>Estos riesgos se pueden resumir en:</p>
        <ol className={ol}>
          <li>
            Uso indebido catastrófico: por ejemplo, terroristas que usen la IA
            para crear armas biológicas.
          </li>
          <li>Concentración de poder.</li>
          <li>Pérdida de control de la IA.</li>
        </ol>
        <p className={p}>
          Cada uno de ellos ya es, o muy probablemente llevaría a, eventos
          catastróficos o incluso la extinción humana.
        </p>

        <h2 className={h2}>Qué proponemos</h2>
        <p className={p}>
          Impulsamos acuerdos internacionales, similares al Tratado de No
          Proliferación de Armas Nucleares, que prohíban el desarrollo de
          sistemas de IA totalmente autónomos que superen a los humanos en
          todas las tareas.
        </p>
        <p className={p}>
          Como camino hacia esos acuerdos, tomamos como referencia tratados
          impulsados por potencias medias, como el Tratado de Ottawa sobre
          minas antipersonales y el Protocolo de Montreal sobre los CFC
          (sustancias químicas que dañan la capa de ozono).
        </p>
        <p className={p}>
          Si, en cambio, otro actor, como una gran potencia, propone un tratado
          efectivo, nuestro objetivo es que los países hispanohablantes lo
          apoyen.
        </p>

        <h2 className={h2}>Estrategia</h2>
        <p className={p}>Para lograr estos objetivos, {siteCopy.pageTitle}:</p>
        <ol className={ol}>
          <li>
            Capacita a la ciudadanía para explicarles a sus legisladores los
            riesgos existenciales de la IA.
          </li>
          <li>
            Contacta a creadores de contenido reconocidos y a medios masivos
            para generar conciencia sobre los riesgos existenciales de la IA y
            sobre cómo mitigarlos.
          </li>
        </ol>
      </article>

      <Link
        href="/contacta-representantes/"
        className="mt-10 inline-block rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink transition hover:bg-accent-dark"
      >
        Escribile a tus representantes →
      </Link>

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-6 text-xs text-ink/50">
        <Link href="/" className="font-semibold text-accent-dark underline">
          ← Volver al inicio
        </Link>
        <SocialIcons location="footer_about" />
      </footer>
    </main>
  );
}
