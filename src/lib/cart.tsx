/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { FinishKey, SizeKey } from "./products";

export interface CartItem {
  productId: string;
  title: string;
  image: string;
  size: SizeKey;
  finish: FinishKey;
  price: number;
  qty: number;
}

export type OrderStatus = "received" | "production" | "framing" | "shipped" | "delivered";
export const orderStatusFlow: OrderStatus[] = [
  "received",
  "production",
  "framing",
  "shipped",
  "delivered",
];
export const orderStatusLabel: Record<OrderStatus, string> = {
  received: "Pedido recebido",
  production: "Em impressão",
  framing: "Em moldura",
  shipped: "A caminho",
  delivered: "Entregue",
};

export interface Order {
  id: string;
  createdAt: number;
  items: CartItem[];
  total: number;
  payment: "pix" | "card";
  status: OrderStatus;
  shippingEstimate: string;
}

interface CartCtx {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (idx: number) => void;
  updateQty: (idx: number, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  orders: Order[];
  placeOrder: (payment: "pix" | "card") => Order;
  getOrder: (id: string) => Order | undefined;
}

const Ctx = createContext<CartCtx | null>(null);

function genId() {
  return "1820-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const c = localStorage.getItem("1820-cart");
      if (c) setItems(JSON.parse(c));
      const o = localStorage.getItem("1820-orders");
      if (o) setOrders(JSON.parse(o));
    } catch (err) {
      // log and ignore localStorage parse errors
      // keep behavior of falling back to empty state
      // eslint-disable-next-line no-console
      console.error("cart:init", err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("1820-cart", JSON.stringify(items));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("cart:save", err);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem("1820-orders", JSON.stringify(orders));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("orders:save", err);
    }
  }, [orders]);

  const add = (item: CartItem) =>
    setItems((prev) => {
      const i = prev.findIndex(
        (p) => p.productId === item.productId && p.size === item.size && p.finish === item.finish,
      );
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + item.qty };
        return next;
      }
      return [...prev, item];
    });
  const remove = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const updateQty = (idx: number, qty: number) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, qty: Math.max(1, qty) } : it)));
  const clear = () => setItems([]);

  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  function placeOrder(payment: "pix" | "card"): Order {
    const order: Order = {
      id: genId(),
      createdAt: Date.now(),
      items: [...items],
      total,
      payment,
      status: "received",
      shippingEstimate: "5–9 dias úteis após despacho",
    };
    setOrders((prev) => [order, ...prev]);
    setItems([]);
    // Simulated status advancement
    const advance = (i: number) => {
      if (i >= orderStatusFlow.length) return;
      setTimeout(() => {
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, status: orderStatusFlow[i] } : o)),
        );
        advance(i + 1);
      }, 4000);
    };
    advance(1);
    return order;
  }

  const getOrder = (id: string) => orders.find((o) => o.id === id);

  return (
    <Ctx.Provider
      value={{ items, add, remove, updateQty, clear, total, count, orders, placeOrder, getOrder }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
