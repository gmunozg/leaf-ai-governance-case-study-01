import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { absolute } from "@/lib/seo";

export function Crumbs({ items, label }: { items: { name: string; href: string }[]; label: string }) {
  return (
    <>
      <nav aria-label={label}>
        <ol className="crumbs">
          {items.map((it, i) => (
            <li key={it.href}>
              {i === items.length - 1 ? <span aria-current="page">{it.name}</span> : <Link href={it.href}>{it.name}</Link>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absolute(it.href) })),
        }}
      />
    </>
  );
}
