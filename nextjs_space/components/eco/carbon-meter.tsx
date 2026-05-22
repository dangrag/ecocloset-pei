'use client';

import { TreePine, Droplets, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CarbonMeterProps {
  totalCarbon: number;
  itemCount: number;
}

export default function CarbonMeter({ totalCarbon = 0, itemCount = 0 }: CarbonMeterProps) {
  const safeCO2 = totalCarbon ?? 0;
  const safeItems = itemCount ?? 0;
  const fastFashionAvg = safeItems * 10;
  const savings = Math.max(0, fastFashionAvg - safeCO2);
  const savingsPercent = fastFashionAvg > 0 ? Math.round((savings / fastFashionAvg) * 100) : 0;
  const treesEquivalent = safeCO2 / 22;
  const waterSaved = safeItems * 1800;

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TreePine className="h-5 w-5 text-primary" />
          Pegada de Carbono do Carrinho
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">CO2 estimado</span>
            <span className="font-mono font-semibold text-foreground">{safeCO2?.toFixed?.(1) ?? '0.0'} kg</span>
          </div>
          <Progress value={Math.min(100, (safeCO2 / Math.max(1, fastFashionAvg)) * 100)} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            vs. {fastFashionAvg?.toFixed?.(1) ?? '0.0'} kg na moda convencional
          </p>
        </div>

        {safeItems > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <TreePine className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{savingsPercent}%</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">Menos CO2</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Droplets className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{(waterSaved / 1000)?.toFixed?.(1) ?? '0'}k</p>
              <p className="text-xs text-blue-600 dark:text-blue-500">Litros salvos</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <Zap className="h-5 w-5 text-amber-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-amber-700 dark:text-amber-400">{treesEquivalent?.toFixed?.(2) ?? '0'}</p>
              <p className="text-xs text-amber-600 dark:text-amber-500">Arvores/ano</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
