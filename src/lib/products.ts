import primeiravisao from "@/assets/primeira-visao.png";
import abraco from "@/assets/abraco.png";
import luz from "@/assets/luz.png";
import ovelha from "@/assets/ovelha.png";
import virtude from "@/assets/virtude.png";
import me1 from "@/assets/me-1.jpg";
import me2 from "@/assets/me-2.jpg";
import cl1 from "@/assets/cl-1.jpg";
import cl2 from "@/assets/cl-2.jpg";
import detailPaper from "@/assets/detail-paper.png";
import detailFrame from "@/assets/detail-frame.png";

export type CollectionSlug = "sud" | "middle-earth" | "classics";

export interface Product {
  id: string;
  title: string;
  collection: CollectionSlug;
  collectionLabel: string;
  description: string;
  image: string;
  hoverImage: string;
  basePrice: number;
}

export const collections: { slug: CollectionSlug; label: string; tagline: string }[] = [
  { slug: "sud", label: "SUD", tagline: "Pampas, vento e horizonte." },
  { slug: "middle-earth", label: "Middle-earth", tagline: "Da Comarca a Mordor." },
  { slug: "classics", label: "Classics", tagline: "Releituras da história da arte." },
];

export const products: Product[] = [
  {
    id: "primeira-visao",
    title: "Primeira Visão",
    collection: "sud",
    collectionLabel: "SUD",
    description:
      "Uma representação épica da Primeira Visão, com Joseph Smith envolto em sombras, buscando proteção enquanto a luz celestial revela o Pai e o Filho. Uma peça de profunda reverência.",
    image: primeiravisao,
    hoverImage: detailPaper,
    basePrice: 139,
  },
  {
    id: "abraco",
    title: "O Abraço do Mestre",
    collection: "sud",
    collectionLabel: "SUD",
    description:
      "A representação íntima do amor redentor: o Salvador acolhendo um jovem em um abraço terno. Uma obra que transmite consolo, paz e aceitação divina.",
    image: abraco,
    hoverImage: detailFrame,
    basePrice: 139,
  },
  {
    id: "luz",
    title: "A Luz do Mundo",
    collection: "sud",
    collectionLabel: "SUD",
    description:
      "Uma imagem detalhada e solene da mão do Salvador segurando uma lamparina antiga. Simboliza a luz que guia o caminho e a presença constante do Espírito.",
    image: luz,
    hoverImage: detailPaper,
    basePrice: 139,
  },
  {
    id: "ovelha",
    title: "O Bom Pastor",
    collection: "sud",
    collectionLabel: "SUD",
    description:
      "O terno cuidado do Pastor por Sua ovelha. Uma composição focada na delicadeza e na proteção absoluta, capturando o coração da missão de resgate de Cristo.",
    image: ovelha,
    hoverImage: detailFrame,
    basePrice: 139,
  },
  {
    id: "virtude",
    title: "Virtude e Fé",
    collection: "sud",
    collectionLabel: "SUD",
    description:
      "A cena bíblica da mulher que busca cura ao tocar na orla das vestes de Jesus. Um momento de fé inabalável, capturado com luz divina e emoção profunda.",
    image: virtude,
    hoverImage: detailPaper,
    basePrice: 139,
  },
  {
    id: "valfenda",
    title: "Valfenda",
    collection: "middle-earth",
    collectionLabel: "Middle-earth",
    description:
      "A elegância atemporal de Valfenda, o Refúgio Acolhedor. Uma obra que captura a arquitetura élfica em perfeita harmonia com a natureza exuberante das Montanhas Sombrias.",
    image: me1,
    hoverImage: detailFrame,
    basePrice: 159,
  },
  {
    id: "bag-end",
    title: "Bolsão",
    collection: "middle-earth",
    collectionLabel: "Middle-earth",
    description: "A porta redonda mais famosa do Condado em aquarela serena.",
    image: me2,
    hoverImage: detailFrame,
    basePrice: 129,
  },
  {
    id: "serras-na-bruma",
    title: "Serras na Bruma",
    collection: "classics",
    collectionLabel: "Classics",
    description: "Camadas de montanhas se diluindo no horizonte enevoado da madrugada.",
    image: cl2,
    hoverImage: detailPaper,
    basePrice: 129,
  },
  {
    id: "campos-dourados",
    title: "Campos Dourados",
    collection: "classics",
    collectionLabel: "Classics",
    description: "Trigais ao vento sob um céu vasto e quente — a planície que respira.",
    image: cl1,
    hoverImage: detailFrame,
    basePrice: 129,
  },
];

export type SizeKey = "A5" | "A4" | "A3" | "50x70" | "A4-h" | "A3-h" | "70x50";
export const sizes: { key: SizeKey; dimensions: string; multiplier: number; hint: string }[] = [
  {
    key: "A5",
    dimensions: "14,8 × 21 cm",
    multiplier: 0.6,
    hint: "Tamanho de um cartão postal grande.",
  },
  {
    key: "A4",
    dimensions: "21 × 29,7 cm",
    multiplier: 1,
    hint: "O tamanho de uma folha de impressora.",
  },
  {
    key: "A3",
    dimensions: "29,7 × 42 cm",
    multiplier: 1.6,
    hint: "Dobro do A4 — ótimo para destaque.",
  },
  {
    key: "50x70",
    dimensions: "50 × 70 cm",
    multiplier: 2.4,
    hint: "Statement piece para a parede principal.",
  },
  {
    key: "A4-h",
    dimensions: "29,7 × 21 cm",
    multiplier: 1,
    hint: "Formato paisagem (horizontal).",
  },
  {
    key: "A3-h",
    dimensions: "42 × 29,7 cm",
    multiplier: 1.6,
    hint: "Formato paisagem (horizontal).",
  },
  {
    key: "70x50",
    dimensions: "70 × 50 cm",
    multiplier: 2.4,
    hint: "Formato paisagem (horizontal).",
  },
];

export type FinishKey = "poster" | "black" | "wood" | "glass";
export const finishes: { key: FinishKey; label: string; add: number; note: string }[] = [
  { key: "poster", label: "Somente Pôster", add: 0, note: "Apenas o papel, enrolado em tubo." },
  { key: "black", label: "Moldura Preta", add: 80, note: "Madeira maciça com acabamento fosco." },
  { key: "wood", label: "Moldura Madeira", add: 90, note: "Carvalho natural com veio à mostra." },
  {
    key: "glass",
    label: "Vidro Antirreflexo",
    add: 130,
    note: "Moldura preta + vidro museológico.",
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function priceFor(base: number, size: SizeKey, finish: FinishKey) {
  const s = sizes.find((x) => x.key === size)!;
  const f = finishes.find((x) => x.key === finish)!;
  return Math.round(base * s.multiplier + f.add);
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
