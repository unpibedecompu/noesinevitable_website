import SocialIcons from "@/components/SocialIcons";
import siteCopy from "@/data/site-copy.json";

/** Bloque de redes. Se repite en el paso 4 del formulario y en la home (/). */
export default function FollowSection({ location }: { location: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-ink/50">
        Mantenete informado
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/70">
        {siteCopy.seguimeDescription}
      </p>
      <SocialIcons location={location} size="lg" className="mt-3 justify-center" />
    </div>
  );
}
