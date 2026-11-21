import { COUNTRIES, COUNTRY_CODES } from "@/lib/countries";
import Link from "next/link";
import SocialIcons from "@/components/SocialIcons";
import Explanation from "@/components/Explanation";
import { getRepresentatives } from "@/lib/representatives";
import ContactForm from "@/components/ContactForm";
import MeanwhileTeaser from "@/components/MeanwhileTeaser";
import Reveal from "@/components/Reveal";
import siteCopy from "@/data/site-copy.json";

// Página 100% estática. La detección de país pasó al cliente
// (components/ContactForm → /cdn-cgi/trace, gratis en Cloudflare).
export default function Page() {
  const representatives = getRepresentatives().filter((r) =>
    COUNTRY_CODES.includes(r.country),
  );

  const unverified = representatives.filter((r) => !r.verified).length;

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-8 sm:pt-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
          {siteCopy.callToAction}
        </h1>
        <Explanation />
        <MeanwhileTeaser />
      </header>

      {unverified > 0 && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Sólo en desarrollo:</strong> se están mostrando {unverified}{" "}
          contacto{unverified === 1 ? "" : "s"} sin verificar (<code>verified: false</code> en{" "}
          <code>data/representatives.json</code>). En producción sólo aparecen los chequeados
          contra la fuente oficial.
        </div>
      )}

      <Reveal>
        <ContactForm countries={COUNTRIES} representatives={representatives} />
      </Reveal>

      <footer className="mt-12 border-t border-ink/10 pt-6 text-xs text-ink/50">
        <p>
          El mail se abre en tu propio cliente de correo (Gmail, Outlook,
          la app de tu celular). No mandamos nada por vos y no guardamos tus
          datos. Sólo contamos cuántos mails se mandan, con una copia a
          registro@noesinevitable.org.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="font-semibold text-accent-dark underline">
            Sobre esta iniciativa →
          </Link>
          <SocialIcons location="footer_form" />
        </div>
      </footer>
    </main>
  );
}
