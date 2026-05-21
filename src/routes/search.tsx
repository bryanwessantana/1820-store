import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { ProductCard } from "@/components/ProductCard";
import { collections, products } from "@/lib/products";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Buscar — 1820 Store" }] }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string | "all">("all");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = products;
    if (active !== "all") list = list.filter((p) => p.collection === active);
    if (term)
      list = list.filter(
        (p) => p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term),
      );
    return list;
  }, [q, active]);

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <h1 className="font-serif text-4xl sm:text-5xl">Buscar</h1>
        <div className="relative mt-6 max-w-xl">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Busque por nome, coleção..."
            className="w-full rounded-full border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none focus:border-foreground"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { slug: "all", label: "Todas" },
            ...collections.map((c) => ({ slug: c.slug, label: c.label })),
          ].map((c) => (
            <button
              key={c.slug}
              onClick={() => setActive(c.slug)}
              className={`rounded-full border px-4 py-1.5 text-xs transition ${
                active === c.slug
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {results.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">
              Nenhum resultado{q ? ` para "${q}"` : ""}.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
