import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Sua sacola — 1820 Store" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, updateQty, total } = useCart();
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Continuar comprando
        </Link>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Sua sacola</h1>

        {items.length === 0 ? (
          <div className="mt-16 grid place-items-center rounded-md border border-dashed border-border p-16 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Sua sacola está vazia.</p>
            <Link
              to="/"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm text-background"
            >
              Explorar coleções
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
            <ul className="divide-y divide-border">
              {items.map((it, idx) => (
                <li key={idx} className="flex gap-5 py-6">
                  <img
                    src={it.image}
                    alt={it.title}
                    className="h-32 w-24 rounded-sm object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-xl leading-tight">{it.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {it.size} · {it.finish}
                        </p>
                      </div>
                      <button
                        onClick={() => remove(idx)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="h-3 w-3" /> Remover
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button onClick={() => updateQty(idx, it.qty - 1)} className="px-3 py-2">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{it.qty}</span>
                        <button onClick={() => updateQty(idx, it.qty + 1)} className="px-3 py-2">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {formatBRL(it.price)} cada
                        </div>
                        <div className="font-medium">{formatBRL(it.price * it.qty)}</div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="rounded-md border border-border bg-card p-6 lg:sticky lg:top-24 lg:self-start">
              <h2 className="font-serif text-xl">Resumo</h2>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatBRL(total)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span>{total > 250 ? "Grátis" : "Calculado no checkout"}</span>
              </div>
              <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-sm">Total</span>
                <span className="font-serif text-2xl">{formatBRL(total)}</span>
              </div>
              <Link
                to="/checkout"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm text-background"
              >
                Ir para o checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
