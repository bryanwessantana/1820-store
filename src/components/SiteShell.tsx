import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchDialog } from "@/components/SearchDialog";
import { useUI } from "@/lib/ui";

export function SiteShell({ children }: { children: ReactNode }) {
  const { cartOpen, searchOpen, openCart, openSearch, closeCart, closeSearch } = useUI();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onOpenCart={openCart} onOpenSearch={openSearch} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={closeCart} />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </div>
  );
}
