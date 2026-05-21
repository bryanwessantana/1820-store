import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, CornerDownLeft } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { products, formatBRL, collections, type CollectionSlug } from "@/lib/products";

type Filter = "all" | CollectionSlug;

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [cursor, setCursor] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    setQ("");
    setFilter("all");
    setCursor(0);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = products;
    if (filter !== "all") list = list.filter((p) => p.collection === filter);
    if (!term) return list.slice(0, 8);
    return list
      .map((p) => {
        const title = p.title.toLowerCase();
        const col = p.collectionLabel.toLowerCase();
        const desc = p.description.toLowerCase();
        if (!title.includes(term) && !col.includes(term) && !desc.includes(term)) return null;
        const score =
          (title.startsWith(term) ? 4 : 0) +
          (title.includes(term) ? 2 : 0) +
          (col.includes(term) ? 1 : 0);
        return { p, score };
      })
      .filter((x): x is { p: (typeof products)[number]; score: number } => x !== null)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.p);
  }, [q, filter]);

  useEffect(() => {
    setCursor(0);
  }, [q, filter]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      }
      if (e.key === "Enter") {
        const r = results[cursor];
        if (r) {
          onClose();
          navigate({ to: "/products/$id", params: { id: r.id } });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, results, cursor, navigate]);

  function highlight(text: string): ReactNode {
    const term = q.trim();
    if (!term) return text;
    const idx = text.toLowerCase().indexOf(term.toLowerCase());
    if (idx < 0) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="rounded bg-foreground/15 px-0.5 text-foreground">
          {text.slice(idx, idx + term.length)}
        </mark>
        {text.slice(idx + term.length)}
      </>
    );
  }

  const chips: { id: Filter; label: string }[] = [
    { id: "all", label: "Todas" },
    ...collections.map((c) => ({ id: c.slug as Filter, label: c.label })),
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed left-1/2 top-24 z-50 w-[92vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-md border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar obras, coleções..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={onClose}
                className="rounded-full p-1.5 hover:bg-secondary"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 border-b border-border px-5 py-3">
              {chips.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilter(c.id)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    filter === c.id
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <ul className="max-h-[55vh] overflow-y-auto">
              {results.length === 0 ? (
                <li className="px-5 py-10 text-center text-sm text-muted-foreground">
                  Nenhum resultado para "{q}".
                </li>
              ) : (
                results.map((p, i) => (
                  <li key={p.id}>
                    <Link
                      to="/products/$id"
                      params={{ id: p.id }}
                      onClick={onClose}
                      onMouseEnter={() => setCursor(i)}
                      className={`flex items-center gap-4 px-5 py-3 transition ${
                        i === cursor ? "bg-secondary" : "hover:bg-secondary"
                      }`}
                    >
                      <img src={p.image} alt="" className="h-14 w-11 rounded-sm object-cover" />
                      <div className="flex-1">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {p.collectionLabel}
                        </div>
                        <div className="font-medium">{highlight(p.title)}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        a partir de {formatBRL(p.basePrice)}
                      </div>
                    </Link>
                  </li>
                ))
              )}
            </ul>

            <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-2.5 text-[11px] text-muted-foreground">
              <span>
                {results.length} resultado{results.length === 1 ? "" : "s"}
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-border px-1.5">↑↓</kbd> navegar
                <CornerDownLeft className="ml-2 h-3 w-3" /> abrir
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
