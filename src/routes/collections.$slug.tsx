import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { ProductCard } from "@/components/ProductCard";
import { collections, products, type CollectionSlug } from "@/lib/products";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const col = collections.find((c) => c.slug === (params.slug as CollectionSlug));
    if (!col) throw notFound();
    return { col };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.col.label ?? "Coleção"} — 1820 Store` },
      { name: "description", content: loaderData?.col.tagline ?? "" },
    ],
  }),
  notFoundComponent: () => <div className="p-20 text-center">Coleção não encontrada.</div>,
  errorComponent: ({ error }) => <div className="p-20 text-center">{error.message}</div>,
  component: CollectionPage,
});

function CollectionPage() {
  const { col } = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [maxPrice, setMaxPrice] = useState(300);

  const items = useMemo(() => {
    let list = products.filter((p) => p.collection === col.slug);
    const term = q.trim().toLowerCase();
    if (term)
      list = list.filter(
        (p) => p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term),
      );
    list = list.filter((p) => p.basePrice <= maxPrice);
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "name":
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return list;
  }, [col.slug, q, sort, maxPrice]);

  return (
    <SiteShell>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Coleção</p>
          <h1 className="mt-4 font-serif text-5xl sm:text-6xl">{col.label}</h1>
          <p className="mt-4 max-w-xl text-balance text-muted-foreground">{col.tagline}</p>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-20 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-4 lg:px-8">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar nesta coleção..."
              className="w-full rounded-full border border-border bg-background py-2 pl-10 pr-4 text-sm outline-none focus:border-foreground"
            />
          </div>
          <label className="flex items-center gap-3 rounded-full border border-border px-4 py-2 text-xs">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="text-muted-foreground">Até</span>
            <input
              type="range"
              min={80}
              max={300}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="accent-[var(--color-wood)]"
            />
            <span className="tabular-nums">R$ {maxPrice}</span>
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-full border border-border bg-background px-4 py-2 text-sm outline-none"
          >
            <option value="featured">Em destaque</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="name">Nome A-Z</option>
          </select>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        {items.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            Nenhuma obra encontrada com esses filtros.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
