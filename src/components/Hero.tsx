import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import roomBg from "@/assets/room-living.jpg";
import primeiravisao from "@/assets/primeira-visao.png";
import me from "@/assets/me-2.jpg";
import cl from "@/assets/cl-2.jpg";
import type { CollectionSlug } from "@/lib/products";

const frames: {
  slug: CollectionSlug;
  label: string;
  tagline: string;
  img: string;
  pos: string;
  frameClass: string;
}[] = [
  {
    slug: "sud",
    label: "SUD",
    tagline: "Pampas & horizonte",
    img: primeiravisao,
    pos: "left-[18%] top-[18%] w-[18%]",
    frameClass: "wood-grain",
  },
  {
    slug: "middle-earth",
    label: "Middle-earth",
    tagline: "Da CoFmarca a Mordor",
    img: me,
    pos: "left-[42%] top-[12%] w-[20%]",
    frameClass: "wood-grain-dark",
  },
  {
    slug: "classics",
    label: "Classics",
    tagline: "Releituras da história",
    img: cl,
    pos: "left-[68%] top-[20%] w-[18%]",
    frameClass: "wood-grain",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-5 pt-12 lg:px-8 lg:pt-16">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Coleção 2026 — Edição Inverno
            </p>
            <h1 className="mt-4 text-balance text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              A parede em branco
              <br />
              merece uma história.
            </h1>
            <p className="mt-5 max-w-lg text-balance text-base text-muted-foreground">
              Três coleções, papel algodão e molduras de madeira feitas à mão. Passe o mouse sobre
              uma obra para começar.
            </p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-10 max-w-7xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-md border border-border/60 soft-shadow">
          <img
            src={roomBg}
            alt="Parede minimalista para arte 1820"
            width={1920}
            height={1280}
            className="block h-auto w-full"
          />

          {frames.map((f, i) => (
            <motion.div
              key={f.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute ${f.pos}`}
            >
              <Link to="/collections/$slug" params={{ slug: f.slug }} className="group block">
                <motion.div
                  whileHover={{ scale: 1.07, y: -4 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  className="relative"
                >
                  <div className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.85_0.12_70/0.55),transparent_70%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div
                    className={`relative rounded-[3px] ${f.frameClass} p-[8px] frame-shadow transition-shadow duration-500 group-hover:shadow-[0_40px_80px_-20px_oklch(0.15_0.04_50/0.6)]`}
                  >
                    <div className="overflow-hidden bg-background p-2">
                      <div className="relative overflow-hidden">
                        <img
                          src={f.img}
                          alt={f.label}
                          className="block aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap text-center opacity-0 transition-all duration-500 group-hover:translate-y-1 group-hover:opacity-100">
                    <div className="font-serif text-base text-foreground">{f.label}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {f.tagline}
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>Passe o mouse sobre as obras para iluminar a coleção.</span>
          <div className="flex gap-3">
            <span>Frete grátis acima de R$ 250</span>
            <span aria-hidden>·</span>
            <span>Pix com aprovação instantânea</span>
          </div>
        </div>
      </div>
    </section>
  );
}
