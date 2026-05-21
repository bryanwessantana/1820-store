import { Link } from "@tanstack/react-router";
import { Instagram, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-background/60">
            Arte impressa em papel algodão 310g, emoldurada à mão em madeira no sul do Brasil.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-background/50">
            Coleções
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                to="/collections/$slug"
                params={{ slug: "sud" }}
                className="text-background/80 hover:text-background"
              >
                SUD
              </Link>
            </li>
            <li>
              <Link
                to="/collections/$slug"
                params={{ slug: "middle-earth" }}
                className="text-background/80 hover:text-background"
              >
                Middle-earth
              </Link>
            </li>
            <li>
              <Link
                to="/collections/$slug"
                params={{ slug: "classics" }}
                className="text-background/80 hover:text-background"
              >
                Classics
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-background/50">
            Ajuda
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-background/80">
            <li>
              <Link to="/orders" className="hover:text-background">
                Status do pedido
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:text-background">
                Frete e prazos
              </Link>
            </li>
            <li>Guia de tamanhos</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-background/50">
            Contato
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-background/80">
            <li>
              <a
                href="https://instagram.com/1820.store"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-background"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            </li>
            <li>
              <a
                href="mailto:ola@1820.store"
                className="inline-flex items-center gap-2 hover:text-background"
              >
                <Mail className="h-4 w-4" /> Entre em contato
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-background/50">
        © {new Date().getFullYear()} · 1820 Store. Emoldurado com carinho.
      </div>
    </footer>
  );
}
