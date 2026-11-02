export function Marquee({ items }: { items: string[] }) {
  const group = (hidden: boolean) => (
    <ul className="marquee__group" aria-hidden={hidden || undefined}>
      {items.map((it) => (
        <li key={it} className="marquee__item">{it}</li>
      ))}
    </ul>
  );
  return (
    <div className="marquee">
      <div className="marquee__track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
