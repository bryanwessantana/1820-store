import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Menu, X, Search, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { collections } from "@/lib/products";
import { Logo } from "@/components/Logo";

export function Navbar({
  onOpenCart,
  onOpenSearch,
}: {
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
}) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenSearch?.();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onOpenSearch]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 text-background backdrop-blur-xl">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-9 text-sm md:flex">
          <div className="group relative">
            <button className="text-background/80 transition hover:text-background">
              Coleções
            </button>
            <div className="invisible absolute left-1/2 top-full -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="w-60 rounded-md border border-border bg-card p-2 soft-shadow">
                {collections.map((c) => (
                  <Link
                    key={c.slug}
                    to="/collections/$slug"
                    params={{ slug: c.slug }}
                    className="block rounded px-3 py-2 text-sm text-foreground transition hover:bg-secondary"
                  >
                    <div className="font-medium">{c.label}</div>
                    <div className="text-xs text-muted-foreground">{c.tagline}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link
            to="/collections/$slug"
            params={{ slug: "sud" }}
            className="text-background/80 transition hover:text-background"
          >
            SUD
          </Link>
          <Link
            to="/collections/$slug"
            params={{ slug: "middle-earth" }}
            className="text-background/80 transition hover:text-background"
          >
            Middle-earth
          </Link>
          <Link
            to="/collections/$slug"
            params={{ slug: "classics" }}
            className="text-background/80 transition hover:text-background"
          >
            Classics
          </Link>
          <Link to="/shipping" className="text-background/80 transition hover:text-background">
            Frete
          </Link>
          <Link to="/orders" className="text-background/80 transition hover:text-background">
            Meu pedido
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => (onOpenSearch ? onOpenSearch() : navigate({ to: "/search" }))}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 px-3 text-sm text-background/70 transition hover:border-white/40 hover:text-background"
            aria-label="Buscar"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">Buscar</span>
            <kbd className="ml-1 hidden rounded border border-white/20 px-1.5 text-[10px] lg:inline">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={() => (onOpenCart ? onOpenCart() : navigate({ to: "/cart" }))}
            className="relative inline-flex h-10 items-center gap-2 rounded-full border border-white/20 px-4 text-sm text-background transition hover:bg-white/10"
            aria-label="Sacola"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Sacola</span>
            {count > 0 && (
              <span className="ml-1 rounded-full bg-background px-1.5 py-0.5 text-[10px] font-medium text-ink">
                {count}
              </span>
            )}
          </button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-background md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink text-background md:hidden">
          <div className="mx-auto max-w-7xl px-5 py-3">
            {collections.map((c) => (
              <Link
                key={c.slug}
                to="/collections/$slug"
                params={{ slug: c.slug }}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm"
              >
                {c.label} — <span className="text-background/60">{c.tagline}</span>
              </Link>
            ))}
            <Link
              to="/shipping"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 py-3 text-sm"
            >
              <Truck className="h-4 w-4" /> Frete e prazos
            </Link>
            <Link
              to="/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 py-3 text-sm"
            >
              <Package className="h-4 w-4" /> Meu pedido
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
