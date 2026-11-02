import { JsonLd } from "./JsonLd";

export function Faq({ items, withSchema = true }: { items: { q: string; a: string }[]; withSchema?: boolean }) {
  if (!items.length) return null;
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q}>
          <summary>
            <span>{f.q}</span>
            <span className="plus" aria-hidden="true" />
          </summary>
          <div><p>{f.a}</p></div>
        </details>
      ))}
      {withSchema ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }}
        />
      ) : null}
    </div>
  );
}
