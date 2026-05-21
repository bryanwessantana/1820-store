import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Package, Hammer, Truck, Home, Copy } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/SiteShell";
import { useCart, orderStatusFlow, orderStatusLabel, type OrderStatus } from "@/lib/cart";
import { formatBRL } from "@/lib/products";

export const Route = createFileRoute("/order/$id")({
  head: () => ({ meta: [{ title: "Confirmação do pedido — 1820 Store" }] }),
  component: OrderPage,
});

const stepIcon: Record<OrderStatus, React.ComponentType<{ className?: string }>> = {
  received: Check,
  production: Package,
  framing: Hammer,
  shipped: Truck,
  delivered: Home,
};

function OrderPage() {
  const { id } = Route.useParams();
  const { getOrder } = useCart();
  const order = getOrder(id);

  if (!order) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-xl px-5 py-24 text-center">
          <h1 className="font-serif text-3xl">Pedido não encontrado</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Verifique o número ou veja todos os seus pedidos.
          </p>
          <Link
            to="/orders"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm text-background"
          >
            Meus pedidos
          </Link>
        </div>
      </SiteShell>
    );
  }

  const currentIdx = orderStatusFlow.indexOf(order.status);

  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-foreground text-background"
        >
          <Check className="h-7 w-7" />
        </motion.div>
        <div className="mt-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Pedido confirmado
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Obrigado pela sua compra.</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Número do pedido:&nbsp;
            <button
              onClick={() => {
                navigator.clipboard.writeText(order.id);
                toast.success("Número copiado.");
              }}
              className="inline-flex items-center gap-1 font-mono text-foreground hover:underline"
            >
              {order.id} <Copy className="h-3 w-3" />
            </button>
          </p>
        </div>

        {/* Status tracker */}
        <div className="mt-12 rounded-md border border-border bg-card p-6 sm:p-8">
          <h2 className="font-serif text-2xl">Status do pedido</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Previsão de entrega: {order.shippingEstimate}
          </p>

          <ol className="mt-8 grid gap-6 sm:grid-cols-5">
            {orderStatusFlow.map((s, i) => {
              const Icon = stepIcon[s];
              const done = i <= currentIdx;
              const active = i === currentIdx;
              return (
                <li key={s} className="relative flex flex-col items-center text-center">
                  {i < orderStatusFlow.length - 1 && (
                    <div
                      className={`absolute left-1/2 top-5 hidden h-px w-full ${done ? "bg-foreground" : "bg-border"} sm:block`}
                    />
                  )}
                  <div
                    className={`relative z-10 grid h-10 w-10 place-items-center rounded-full border ${
                      done
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-muted-foreground"
                    } ${active ? "ring-4 ring-accent/30" : ""}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className={`mt-3 text-xs ${done ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {orderStatusLabel[s]}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Items */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-md border border-border bg-card p-6">
            <h3 className="font-serif text-xl">Itens</h3>
            <ul className="mt-4 divide-y divide-border">
              {order.items.map((it, i) => (
                <li key={i} className="flex gap-4 py-4">
                  <img
                    src={it.image}
                    alt={it.title}
                    className="h-20 w-16 rounded-sm object-cover"
                  />
                  <div className="flex-1 text-sm">
                    <div className="font-medium">{it.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {it.size} · {it.finish} · {it.qty}x
                    </div>
                  </div>
                  <div className="text-sm font-medium">{formatBRL(it.price * it.qty)}</div>
                </li>
              ))}
            </ul>
          </div>
          <aside className="rounded-md border border-border bg-card p-6">
            <h3 className="font-serif text-xl">Pagamento</h3>
            <div className="mt-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Método</span>
                <span className="capitalize">{order.payment}</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span>{formatBRL(order.total)}</span>
              </div>
            </div>
            <Link
              to="/"
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground text-sm text-background"
            >
              Voltar à galeria
            </Link>
            <Link
              to="/orders"
              className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full border border-border text-sm"
            >
              Ver todos os pedidos
            </Link>
          </aside>
        </div>
      </div>
    </SiteShell>
  );
}
