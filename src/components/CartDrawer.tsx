import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/products";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, total, remove, updateQty } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-serif text-2xl">Sua sacola</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-secondary"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Sua sacola está vazia.</p>
                <button
                  onClick={onClose}
                  className="mt-6 inline-flex h-10 items-center rounded-full bg-foreground px-5 text-sm text-background"
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
                  {items.map((it, idx) => (
                    <li key={idx} className="flex gap-4 py-5">
                      <img
                        src={it.image}
                        alt={it.title}
                        className="h-24 w-20 rounded-sm object-cover"
                      />
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-medium leading-tight">{it.title}</div>
                            <div className="mt-0.5 text-xs text-muted-foreground">
                              {it.size} · {it.finish}
                            </div>
                          </div>
                          <button
                            onClick={() => remove(idx)}
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="Remover"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="inline-flex items-center rounded-full border border-border">
                            <button
                              onClick={() => updateQty(idx, it.qty - 1)}
                              className="px-2.5 py-1.5"
                              aria-label="-"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm">{it.qty}</span>
                            <button
                              onClick={() => updateQty(idx, it.qty + 1)}
                              className="px-2.5 py-1.5"
                              aria-label="+"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-medium">
                            {formatBRL(it.price * it.qty)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <footer className="border-t border-border bg-card px-6 py-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-serif text-xl">{formatBRL(total)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Frete calculado no checkout.</p>
                  <div className="mt-4 grid gap-2">
                    <Link
                      to="/checkout"
                      onClick={onClose}
                      className="inline-flex h-12 items-center justify-center rounded-full bg-foreground text-sm text-background transition hover:opacity-90"
                    >
                      Finalizar compra
                    </Link>
                    <Link
                      to="/cart"
                      onClick={onClose}
                      className="inline-flex h-10 items-center justify-center rounded-full border border-border text-sm"
                    >
                      Ver sacola completa
                    </Link>
                  </div>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
