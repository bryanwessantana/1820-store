import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.jpg";

interface Props {
  className?: string;
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
}

export function Logo({ className = "", size = "md", asLink = true }: Props) {
  // Ajustei os tamanhos para serem um pouco maiores por padrão
  const h = size === "lg" ? "h-24" : size === "md" ? "h-20" : "h-16";
  const inner = (
    <span
      className={`inline-flex items-center overflow-hidden rounded-sm bg-ink ${h} ${className}`}
    >
      <img src={logo} alt="1820 Store" className="h-full w-auto object-contain" />
    </span>
  );

  if (!asLink) return inner;
  return (
    <Link to="/" aria-label="1820 Store">
      {inner}
    </Link>
  );
}
