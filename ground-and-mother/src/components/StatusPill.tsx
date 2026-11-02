import type { ProductStatus } from "@/content/products";

export function StatusPill({ status, label }: { status: ProductStatus; label: string }) {
  return <span className={`pill pill--${status === "available" ? "available" : "soon"}`}>{label}</span>;
}
