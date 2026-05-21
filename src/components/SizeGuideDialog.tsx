import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { sizes } from "@/lib/products";

const visual: Record<string, { w: number; h: number }> = {
  A5: { w: 28, h: 40 },
  A4: { w: 40, h: 56 },
  A3: { w: 56, h: 80 },
  "50x70": { w: 96, h: 134 },
  "A4-h": { w: 56, h: 40 },
  "A3-h": { w: 80, h: 56 },
  "70x50": { w: 134, h: 96 },
};

const refScale: Record<string, string> = {
  A5: "Cartão postal grande — ideal para nichos, escrivaninhas e galerias compostas.",
  A4: "Folha de impressora — ótimo para corredores, banheiros e composições 2x2.",
  A3: "Destaque sobre cabeceira, console ou poltrona — equilíbrio perfeito.",
  "50x70": "Statement piece — domina uma parede principal, sofá ou hall.",
  "A4-h": "Formato paisagem (horizontal) — ideal para retratos e composições amplas.",
  "A3-h": "Formato paisagem (horizontal) — equilíbrio perfeito para grandes obras.",
  "70x50": "Formato paisagem (horizontal) — destaque para áreas de parede maiores.",
};

export function SizeGuideDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Guia de tamanhos</DialogTitle>
          <DialogDescription>
            Compare visualmente cada formato à escala de uma pessoa de 1,70 m para escolher com
            confiança.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 rounded-md border border-border bg-secondary/40 p-6">
          <div className="flex items-end justify-around gap-6">
            <div className="flex flex-col items-center">
              <div className="relative h-[170px] w-6">
                <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-foreground/70" />
                <div className="absolute left-1/2 top-4 h-[150px] w-2 -translate-x-1/2 rounded-sm bg-foreground/70" />
              </div>
              <span className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                1,70 m
              </span>
            </div>
            {sizes.map((s) => (
              <div key={s.key} className="flex flex-col items-center">
                <div
                  className="rounded-[2px] border border-foreground/60 bg-background shadow-sm"
                  style={{ width: visual[s.key]?.w || 40, height: visual[s.key]?.h || 40 }}
                />
                <span className="mt-2 text-xs font-medium">{s.key}</span>
                <span className="text-[10px] text-muted-foreground">{s.dimensions}</span>
              </div>
            ))}
          </div>
        </div>

        <ul className="mt-2 divide-y divide-border text-sm">
          {sizes.map((s) => (
            <li key={s.key} className="grid grid-cols-[60px_1fr] gap-4 py-3">
              <div>
                <div className="font-medium">{s.key}</div>
                <div className="text-xs text-muted-foreground">{s.dimensions}</div>
              </div>
              <p className="text-sm text-muted-foreground">{refScale[s.key]}</p>
            </li>
          ))}
        </ul>

        <p className="mt-2 text-xs text-muted-foreground">
          Dica: o quadro deve ocupar entre 60% e 75% da largura do móvel abaixo dele.
        </p>
      </DialogContent>
    </Dialog>
  );
}
