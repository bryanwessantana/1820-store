import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Truck, Check, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/SiteShell";
import { SizeGuideDialog } from "@/components/SizeGuideDialog";
import { useUI } from "@/lib/ui";
import roomBg from "@/assets/room-living.jpg";
import {
  finishes,
  formatBRL,
  getProduct,
  priceFor,
  sizes,
  type FinishKey,
  type SizeKey,
} from "@/lib/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const p = getProduct(params.id);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.title ?? "Obra"} — 1820 Store` },
      { name: "description", content: loaderData?.product.description ?? "" },
      { property: "og:image", content: loaderData?.product.image ?? "" },
    ],
  }),
  notFoundComponent: () => <div className="p-20 text-center">Obra não encontrada.</div>,
  errorComponent: ({ error }) => <div className="p-20 text-center">{error.message}</div>,
  component: ProductPage,
});

const sizeScale: Record<SizeKey, number> = {
  A5: 0.14,
  A4: 0.2,
  A3: 0.27,
  "50x70": 0.34,
  "A4-h": 0.2,
  "A3-h": 0.27,
  "70x50": 0.34,
};

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const { openCart } = useUI();
  const [size, setSize] = useState<SizeKey>("A4");
  const [finish, setFinish] = useState<FinishKey>("black");
  const [cep, setCep] = useState("");
  const [shipping, setShipping] = useState<null | { days: string; price: number }>(null);
  const [calculating, setCalculating] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const price = useMemo(() => priceFor(product.basePrice, size, finish), [product, size, finish]);
  const installment = (price / 3).toFixed(2).replace(".", ",");
  const frameWidth = sizeScale[size] * 100;
  const isFramed = finish !== "poster";
  const isLandscape = size === "A4-h" || size === "A3-h" || size === "70x50";

  function calcShipping() {
    if (cep.replace(/\D/g, "").length < 8) {
      toast.error("Informe um CEP válido.");
      return;
    }
    setCalculating(true);
    setShipping(null);
    setTimeout(() => {
      const seed = parseInt(cep.replace(/\D/g, "").slice(0, 3) || "100", 10);
      const days = `${4 + (seed % 5)}–${8 + (seed % 6)} dias úteis`;
      const value = price > 250 ? 0 : 19 + (seed % 25);
      setShipping({ days, price: value });
      setCalculating(false);
    }, 700);
  }

  function addToCart() {
    add({
      productId: product.id,
      title: product.title,
      image: product.image,
      size,
      finish,
      price,
      qty: 1,
    });
    openCart();
  }

  const frameBg = finish === "wood" ? "wood-grain" : finish === "poster" ? "" : "wood-grain-dark";

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-5 pt-8 text-xs text-muted-foreground lg:px-8">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          to="/collections/$slug"
          params={{ slug: product.collection }}
          className="hover:text-foreground"
        >
          {product.collectionLabel}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.title}</span>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:px-8 lg:py-14">
        <div>
          <div className="relative overflow-hidden rounded-md border border-border soft-shadow">
            <img src={roomBg} alt="" width={1920} height={1280} className="block h-auto w-full" />
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: `${frameWidth}%`, maxHeight: "85%" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${size}-${finish}`}
                  initial={{ opacity: 0, scale: 0.96, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={
                    isFramed ? `relative frame-shadow ${frameBg} p-[3%]` : "relative soft-shadow"
                  }
                >
                  <div className={isFramed ? "bg-background p-[6%]" : ""}>
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className={`block w-full object-cover ${
                          isLandscape ? "aspect-[4/3]" : "aspect-[3/4]"
                        }`}
                      />
                      {finish === "glass" && (
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-white/5" />
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Pré-visualização ilustrativa em ambiente real.</span>
            <span>{sizes.find((s) => s.key === size)?.dimensions}</span>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {product.collectionLabel}
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight">{product.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">{product.description}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-serif text-3xl">{formatBRL(price)}</span>
            <span className="text-sm text-muted-foreground">
              ou 3x de R$ {installment} sem juros
            </span>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium uppercase tracking-[0.2em]">Tamanho</h3>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                <Info className="h-3 w-3" /> Guia de tamanhos
              </button>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {sizes.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSize(s.key)}
                  className={`relative rounded-sm border px-2 py-3 text-center text-sm transition ${
                    size === s.key
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground/40"
                  }`}
                >
                  <div className="font-medium">{s.key}</div>
                  <div
                    className={`mt-0.5 text-[10px] ${size === s.key ? "opacity-80" : "text-muted-foreground"}`}
                  >
                    {s.dimensions}
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {sizes.find((s) => s.key === size)?.hint}
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em]">Acabamento</h3>
            <div className="mt-3 grid gap-2">
              {finishes.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFinish(f.key)}
                  className={`flex items-center justify-between rounded-sm border px-4 py-3 text-left text-sm transition ${
                    finish === f.key
                      ? "border-foreground bg-secondary"
                      : "border-border hover:border-foreground/40"
                  }`}
                >
                  <div>
                    <div className="font-medium">{f.label}</div>
                    <div className="text-xs text-muted-foreground">{f.note}</div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    {f.add === 0 ? "incluso" : `+ ${formatBRL(f.add)}`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={addToCart}
            className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm text-background transition hover:opacity-90"
          >
            <ShoppingBag className="h-4 w-4" />
            Adicionar à sacola — {formatBRL(price)}
          </button>

          <div className="mt-6 rounded-sm border border-border p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Truck className="h-4 w-4" /> Calcular frete e prazo
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="00000-000"
                inputMode="numeric"
                className="flex-1 rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
              <button
                onClick={calcShipping}
                disabled={calculating}
                className="rounded-sm border border-foreground bg-foreground px-4 text-sm text-background transition hover:opacity-90 disabled:opacity-60"
              >
                {calculating ? "Calculando..." : "Calcular"}
              </button>
            </div>
            {shipping && (
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="text-muted-foreground">PAC — {shipping.days}</div>
                <div className="font-medium">
                  {shipping.price === 0 ? "Grátis" : formatBRL(shipping.price)}
                </div>
              </div>
            )}
          </div>

          <ul className="mt-6 space-y-2 text-xs text-muted-foreground">
            {[
              "Papel algodão 310g, livre de ácido",
              "Tinta pigmentada com 100+ anos de durabilidade",
              "Embalagem reforçada — chega impecável",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-3 w-3" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <SizeGuideDialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen} />
    </SiteShell>
  );
}
