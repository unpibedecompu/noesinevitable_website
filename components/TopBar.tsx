import Link from "next/link";
import siteCopy from "@/data/site-copy.json";

/**
 * Barra superior fija en todas las páginas: marca a la izquierda (vuelve a la
 * home) y, a la derecha, "Sobre esta iniciativa" y el botón de acción
 * principal. En mobile la marca pasa a ser el ícono para que entren los dos
 * botones.
 */
export default function TopBar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-ink/10 bg-[#f7f7f5]/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 max-[379px]:px-2">
        <Link href="/" aria-label={`${siteCopy.pageTitle}: inicio`} className="flex shrink-0 items-center gap-2 max-[379px]:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" width={36} height={36} className="h-8 w-8 sm:h-9 sm:w-9" />
          <span className="hidden text-sm font-bold uppercase tracking-wide text-accent-dark sm:inline">
            {siteCopy.pageTitle}
          </span>
        </Link>
        <div className="flex items-center gap-1.5 max-[379px]:mx-auto sm:gap-2">
          <Link
            href="/sobre-la-iniciativa/"
            className="whitespace-nowrap rounded-full border border-ink/20 px-2.5 py-1.5 text-[11px] font-semibold text-ink transition hover:border-ink/40 hover:bg-white sm:px-4 sm:py-2 sm:text-sm"
          >
            Sobre esta iniciativa
          </Link>
          <Link
            href="/contacta-representantes/"
            className="whitespace-nowrap rounded-full border border-transparent bg-accent px-2.5 py-1.5 text-[11px] font-semibold text-ink shadow-sm transition hover:bg-accent-dark sm:px-4 sm:py-2 sm:text-sm"
          >
            Escribile a tus representantes
          </Link>
        </div>
      </div>
    </nav>
  );
}
