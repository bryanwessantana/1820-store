import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, MapPin, Clock, PackageCheck, Loader2 } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Frete e prazos — 1820 Store" },
      {
        name: "description",
        content:
          "Calcule o frete pelo CEP e veja os prazos estimados de produção e entrega das nossas molduras.",
      },
      { property: "og:title", content: "Frete e prazos — 1820 Store" },
      {
        property: "og:description",
        content: "Calcule o frete pelo CEP e veja os prazos estimados de entrega.",
      },
    ],
  }),
  component: ShippingPage,
});

interface Quote {
  service: string;
  days: string;
  price: number;
  note?: string;
}

function maskCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

function quoteFor(cep: string): Quote[] {
  const digits = cep.replace(/\D/g, "");
  const region = parseInt(digits[0] || "0", 10);
  // Simple simulated table by first digit (region of Brazil)
  const table: Record<number, { base: number; days: [number, number] }> = {
    0: { base: 32, days: [4, 7] },
    1: { base: 28, days: [3, 6] },
    2: { base: 26, days: [3, 6] },
    3: { base: 22, days: [2, 5] },
    4: { base: 24, days: [3, 6] },
    5: { base: 34, days: [5, 9] },
    6: { base: 38, days: [6, 11] },
    7: { base: 30, days: [4, 8] },
    8: { base: 18, days: [2, 4] },
    9: { base: 20, days: [2, 5] },
  };
  const row = table[region] ?? table[0];
  return [
    {
      service: "PAC (econômico)",
      days: `${row.days[0] + 2}–${row.days[1] + 3} dias úteis`,
      price: row.base,
    },
    {
      service: "SEDEX (expresso)",
      days: `${row.days[0]}–${row.days[1]} dias úteis`,
      price: Math.round(row.base * 1.9),
    },
    {
      service: "Retirada em Pelotas/RS",
      days: "Pronto em 3–5 dias úteis",
      price: 0,
      note: "Combine horário por DM no Instagram.",
    },
  ];
}

function formatBRL(n: number) {
  return n === 0 ? "Grátis" : n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function ShippingPage() {
  const [cep, setCep] = useState("");
  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function calculate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      setError("Informe um CEP válido com 8 dígitos.");
      setQuotes(null);
      return;
    }
    setLoading(true);
    setQuotes(null);
    setTimeout(() => {
      setQuotes(quoteFor(cep));
      setLoading(false);
    }, 600);
  }

  return (
    <SiteShell>
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Logística</p>
          <h1 className="mt-3 font-serif text-5xl sm:text-6xl">Frete & prazos</h1>
          <p className="mt-4 max-w-xl text-balance text-muted-foreground">
            Cada quadro é impresso e emoldurado sob demanda no sul do Brasil. Calcule o frete pelo
            seu CEP e confira os prazos estimados.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-5 py-12 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:py-16">
        <div>
          <h2 className="font-serif text-2xl">Calcular pelo CEP</h2>
          <form onSubmit={calculate} className="mt-5 flex gap-2">
            <div className="relative flex-1">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                inputMode="numeric"
                value={cep}
                onChange={(e) => setCep(maskCep(e.target.value))}
                placeholder="00000-000"
                className="w-full rounded-full border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-foreground"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 text-sm text-background disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Truck className="h-4 w-4" />
              )}
              Calcular
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          <AnimatePresence mode="wait">
            {quotes && (
              <motion.ul
                key="quotes"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-6 divide-y divide-border rounded-md border border-border bg-card"
              >
                {quotes.map((q) => (
                  <li key={q.service} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <div className="font-medium">{q.service}</div>
                      <div className="text-xs text-muted-foreground">{q.days}</div>
                      {q.note && <div className="mt-1 text-xs text-muted-foreground">{q.note}</div>}
                    </div>
                    <div className="text-right text-sm font-medium tabular-nums">
                      {formatBRL(q.price)}
                    </div>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <p className="mt-4 text-xs text-muted-foreground">
            Valores estimados. O frete final é confirmado no checkout.
          </p>
        </div>

        <aside className="space-y-5">
          <h2 className="font-serif text-2xl">Como funciona</h2>
          <div className="rounded-md border border-border bg-card p-5">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h3 className="mt-3 font-medium">Produção sob demanda</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Impressão giclée + montagem da moldura: 3–5 dias úteis antes do envio.
            </p>
          </div>
          <div className="rounded-md border border-border bg-card p-5">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <h3 className="mt-3 font-medium">Envio rastreado</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Despachamos via Correios com código de rastreio. Embalagem reforçada com cantoneiras e
              plástico bolha.
            </p>
          </div>
          <div className="rounded-md border border-border bg-card p-5">
            <PackageCheck className="h-5 w-5 text-muted-foreground" />
            <h3 className="mt-3 font-medium">Frete grátis</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Em pedidos acima de R$ 499 para todo o Brasil (modalidade PAC).
            </p>
          </div>
        </aside>
      </section>
    </SiteShell>
  );
}
