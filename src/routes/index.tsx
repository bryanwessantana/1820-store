import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { collections, products } from "@/lib/products";

<link rel="icon" href="/favicon.ico" />;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "1820 Store — Arte impressa, emoldurada à mão" },
      {
        name: "description",
        content:
          "Coleções SUD, Middle-earth e Classics. Pôsteres em papel algodão com molduras de madeira.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = products.slice(0, 4);
  return (
    <SiteShell>
      <Hero />

      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Selecionadas</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Em destaque</h2>
          </div>
          <Link
            to="/collections/$slug"
            params={{ slug: "sud" }}
            className="hidden items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground sm:inline-flex"
          >
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden bg-border sm:grid-cols-3">
          {collections.map((c) => (
            <Link
              key={c.slug}
              to="/collections/$slug"
              params={{ slug: c.slug }}
              className="group bg-background px-8 py-14 transition hover:bg-card"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Coleção</p>
              <h3 className="mt-3 font-serif text-3xl">{c.label}</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">{c.tagline}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm">
                Explorar
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-24 text-center lg:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Feito com cuidado
        </p>
        <h2 className="mt-4 font-serif text-3xl text-balance sm:text-4xl">
          Papel algodão 310g, tinta pigmentada e moldura de madeira cortada à mão no sul do Brasil.
        </h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-6 text-left">
          {[
            { t: "Impressão Giclée", d: "Cores fiéis que duram mais de 100 anos sem desbotar." },
            {
              t: "Madeira Maciça",
              d: "Cortes em 45° e cantos invisíveis. Cada moldura é montada à mão.",
            },
            {
              t: "Embalagem Segura",
              d: "Caixa estruturada e proteção tripla — sua arte chega impecável.",
            },
          ].map((b) => (
            <div key={b.t}>
              <h3 className="font-serif text-xl">{b.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
