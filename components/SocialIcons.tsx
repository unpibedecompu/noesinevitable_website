"use client";

import type { IconType } from "react-icons";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { SiSubstack } from "react-icons/si";
import { trackFunnel } from "@/lib/analytics";
import { NEWSLETTER_URL, SOCIAL_LINKS } from "@/lib/social";

const ICONS: Record<(typeof SOCIAL_LINKS)[number]["network"], IconType> = {
  x: FaXTwitter,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  whatsapp: FaWhatsapp,
};

const LINKS: { network: string; label: string; url: string; Icon: IconType }[] = [
  ...SOCIAL_LINKS.map((l) => ({ ...l, Icon: ICONS[l.network] })),
  { network: "newsletter", label: "Newsletter", url: NEWSLETTER_URL, Icon: SiSubstack },
];

const SIZES = {
  /** Fila chica del footer. */
  sm: { gap: "gap-3", link: "p-1", icon: 16 },
  /** Bloque "Mantenete informado". */
  lg: { gap: "gap-2", link: "p-2.5", icon: 24 },
};

/** Fila de íconos de redes (y newsletter) de la organización. */
export default function SocialIcons({
  location,
  size = "sm",
  className = "",
}: {
  location: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <ul className={`flex flex-wrap items-center ${s.gap} ${className}`}>
      {LINKS.map(({ network, label, url, Icon }) => (
        <li key={network}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            onClick={() => trackFunnel("social_link_clicked", { network, location })}
            className={`block rounded-full ${s.link} text-ink/60 transition hover:bg-ink/5 hover:text-ink`}
          >
            <Icon size={s.icon} aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}
