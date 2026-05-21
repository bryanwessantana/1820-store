import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, QrCode, CreditCard, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/SiteShell";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — 1820 Store" }] }),
  component: Checkout,
});

type PayMethod = "pix" | "card";

function Checkout() {
  const { items, remove, total, placeOrder } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState<PayMethod>("pix");
  const [copied, setCopied] = useState(false);

  const pixCode =
    "00020126580014BR.GOV.BCB.PIX01361820store-" +
    Math.random().toString(36).slice(2, 10).toUpperCase() +
    "5204000053039865802BR5910 1820 STORE 6009PORTO ALEGRE62070503***6304ABCD";

  function confirm(payment: PayMethod) {
    const order = placeOrder(payment);
    navigate({ to: "/order/$id", params: { id: order.id } });
  }

  function copyPix() {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success("Código Pix copiado.");
    setTimeout(() => setCopied(false), 1500);
    // simulate instant approval
    setTimeout(() => confirm("pix"), 1500);
  }

  function payCard(e: React.FormEvent) {
    e.preventDefault();
    toast.loading("Autorizando cartão...", { id: "card" });
    setTimeout(() => {
      toast.success("Pagamento aprovado.", { id: "card" });
      confirm("card");
    }, 1100);
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar à sacola
        </Link>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Checkout</h1>

        {items.length === 0 ? (
          <div className="mt-16 rounded-md border border-dashed border-border p-16 text-center">
            <p className="text-muted-foreground">Sua sacola está vazia.</p>
            <Link
              to="/"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm text-background"
            >
              Explorar coleções
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
            <div>
              <div className="flex gap-2 rounded-full border border-border p-1">
                {(
                  [
                    { k: "pix", label: "Pix", icon: QrCode },
                    { k: "card", label: "Cartão", icon: CreditCard },
                  ] as const
                ).map(({ k, label, icon: Icon }) => (
                  <button
                    key={k}
                    onClick={() => setMethod(k)}
                    className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                      method === k ? "bg-foreground text-background" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {method === "pix" ? (
                  <motion.div
                    key="pix"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-8 rounded-md border border-border bg-card p-8"
                  >
                    <div className="grid items-center gap-8 sm:grid-cols-[200px_1fr]">
                      <div className="grid aspect-square place-items-center rounded-sm bg-background p-3">
                        <div
                          className="grid h-full w-full bg-foreground/5"
                          style={{ gridTemplateColumns: "repeat(21,1fr)" }}
                        >
                          {Array.from({ length: 21 * 21 }).map((_, i) => {
                            const corner =
                              (i < 7 * 21 && (i % 21 < 7 || i % 21 > 13)) ||
                              (i >= 14 * 21 && i % 21 < 7);
                            const on = corner || Math.random() > 0.55;
                            return (
                              <div key={i} className={on ? "bg-foreground" : "bg-background"} />
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl">Pague com Pix</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Aponte a câmera do seu banco ou copie o código abaixo. Aprovação
                          instantânea.
                        </p>
                        <div className="mt-4 break-all rounded-sm border border-border bg-background p-3 text-[11px] text-muted-foreground">
                          {pixCode}
                        </div>
                        <button
                          onClick={copyPix}
                          className="mt-3 inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm text-background"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copied ? "Copiado" : "Copiar código"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="card"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onSubmit={payCard}
                    className="mt-8 grid gap-4 rounded-md border border-border bg-card p-8"
                  >
                    <Field label="Número do cartão">
                      <input required placeholder="0000 0000 0000 0000" className={inputCls} />
                    </Field>
                    <Field label="Nome impresso no cartão">
                      <input required placeholder="Como aparece no cartão" className={inputCls} />
                    </Field>
                    <div className="grid grid-cols-3 gap-4">
                      <Field label="Validade">
                        <input required placeholder="MM/AA" className={inputCls} />
                      </Field>
                      <Field label="CVV">
                        <input required placeholder="000" className={inputCls} />
                      </Field>
                      <Field label="Parcelas">
                        <select className={inputCls}>
                          <option>1x sem juros</option>
                          <option>2x sem juros</option>
                          <option>3x sem juros</option>
                        </select>
                      </Field>
                    </div>
                    <button className="mt-2 h-12 rounded-full bg-foreground text-sm text-background">
                      Pagar {formatBRL(total)}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <aside className="rounded-md border border-border bg-card p-6 lg:sticky lg:top-24 lg:self-start">
              <h2 className="font-serif text-xl">Resumo</h2>
              <ul className="mt-4 divide-y divide-border">
                {items.map((it, idx) => (
                  <li key={idx} className="flex gap-3 py-4">
                    <img
                      src={it.image}
                      alt={it.title}
                      className="h-16 w-12 rounded-sm object-cover"
                    />
                    <div className="flex-1 text-sm">
                      <div className="font-medium">{it.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {it.size} · {it.finish} · {it.qty}x
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{formatBRL(it.price * it.qty)}</div>
                      <button
                        onClick={() => remove(idx)}
                        className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="h-3 w-3" /> Remover
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatBRL(total)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span>{total > 250 ? "Grátis" : "Calculado no envio"}</span>
              </div>
              <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-sm">Total</span>
                <span className="font-serif text-2xl">{formatBRL(total)}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                ou 3x de {formatBRL(total / 3)} sem juros
              </p>
            </aside>
          </div>
        )}
      </div>
    </SiteShell>
  );
}

const inputCls =
  "w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-foreground";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
