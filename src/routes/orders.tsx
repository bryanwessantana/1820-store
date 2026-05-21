import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Package } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { useCart, orderStatusLabel } from "@/lib/cart";
import { formatBRL } from "@/lib/products";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Meus pedidos — 1820 Store" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const { orders, getOrder } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  function lookup() {
    const id = q.trim().toUpperCase();
    if (!id) return;
    if (getOrder(id)) navigate({ to: "/order/$id", params: { id } });
    else navigate({ to: "/order/$id", params: { id } }); // not found view handled in /order/$id
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Acompanhamento</p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Status do pedido</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Insira o número do seu pedido (ex.: 1820-XXXXXX) ou consulte abaixo os pedidos feitos
          neste navegador.
        </p>

        <div className="mt-8 flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup()}
              placeholder="1820-XXXXXX"
              className="w-full rounded-full border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-foreground"
            />
          </div>
          <button
            onClick={lookup}
            className="rounded-full bg-foreground px-6 text-sm text-background"
          >
            Buscar
          </button>
        </div>

        <h2 className="mt-12 font-serif text-2xl">Pedidos recentes</h2>
        {orders.length === 0 ? (
          <div className="mt-6 grid place-items-center rounded-md border border-dashed border-border p-12 text-center">
            <Package className="h-9 w-9 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">Você ainda não fez nenhum pedido.</p>
            <Link
              to="/"
              className="mt-5 inline-flex h-10 items-center rounded-full bg-foreground px-5 text-sm text-background"
            >
              Explorar coleções
            </Link>
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-border rounded-md border border-border bg-card">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  to="/order/$id"
                  params={{ id: o.id }}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-secondary"
                >
                  <div>
                    <div className="font-mono text-sm">{o.id}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(o.createdAt).toLocaleDateString("pt-BR")} · {o.items.length} ite
                      {o.items.length > 1 ? "ns" : "m"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatBRL(o.total)}</div>
                    <div className="text-xs text-muted-foreground">
                      {orderStatusLabel[o.status]}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SiteShell>
  );
}
