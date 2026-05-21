import { createContext, useContext, useState, type ReactNode } from "react";

interface UICtx {
  cartOpen: boolean;
  searchOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
}
const Ctx = createContext<UICtx | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <Ctx.Provider
      value={{
        cartOpen,
        searchOpen,
        openCart: () => setCartOpen(true),
        closeCart: () => setCartOpen(false),
        openSearch: () => setSearchOpen(true),
        closeSearch: () => setSearchOpen(false),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
export function useUI() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useUI outside provider");
  return c;
}
