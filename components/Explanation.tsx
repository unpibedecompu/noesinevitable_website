import siteCopy from "@/data/site-copy.json";

/**
 * Párrafo de explicación. La frase `explanationLinkText` (que tiene que
 * aparecer tal cual en `explanation`) enlaza a la declaración.
 */
export default function Explanation() {
  const { explanation, explanationLinkText, explanationSourceUrl } = siteCopy;
  const i = explanation.indexOf(explanationLinkText);
  if (i === -1) return <p className="mt-3 text-base text-ink/70">{explanation}</p>;
  return (
    <p className="mt-3 text-base text-ink/70">
      {explanation.slice(0, i)}
      <a
        href={explanationSourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-accent-dark underline underline-offset-2"
      >
        {explanationLinkText}
      </a>
      {explanation.slice(i + explanationLinkText.length)}
    </p>
  );
}
