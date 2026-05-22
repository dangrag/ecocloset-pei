import { Leaf, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-display font-semibold text-foreground">EcoCloset</span>
            <span className="text-sm text-muted-foreground">- Projeto PEI</span>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Feito com <Heart className="h-3 w-3 text-red-500 fill-red-500" /> para um futuro sustentavel
          </p>
          <p className="text-xs text-muted-foreground">
            Analise e Desenvolvimento de Sistemas - 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
