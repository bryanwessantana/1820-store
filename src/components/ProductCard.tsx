import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { formatBRL } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to="/products/$id" params={{ id: product.id }} className="group block">
      <div className="relative overflow-hidden rounded-sm bg-secondary">
        <div className="relative aspect-[3/4]">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <motion.img
            src={product.hoverImage}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {product.collectionLabel}
          </p>
          <h3 className="mt-0.5 font-serif text-lg leading-tight">{product.title}</h3>
        </div>
        <div className="text-right text-sm">
          <div className="text-muted-foreground">a partir de</div>
          <div className="font-medium">{formatBRL(product.basePrice)}</div>
        </div>
      </div>
    </Link>
  );
}
