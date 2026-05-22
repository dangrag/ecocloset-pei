'use client';

import { Leaf, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SustainabilityBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function SustainabilityBadge({ score = 0, size = 'md', showLabel = true }: SustainabilityBadgeProps) {
  const safeScore = score ?? 0;
  const getColor = () => {
    if (safeScore >= 8) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (safeScore >= 5) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  const getLabel = () => {
    if (safeScore >= 8) return 'Excelente';
    if (safeScore >= 5) return 'Moderado';
    return 'Baixo';
  };

  const sizeClasses: Record<string, string> = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2',
  };

  const iconSize: Record<string, number> = { sm: 12, md: 14, lg: 16 };
  const s = size ?? 'md';

  return (
    <span className={cn('inline-flex items-center rounded-full font-medium', getColor(), sizeClasses[s])}>
      <Leaf style={{ width: iconSize[s], height: iconSize[s] }} />
      {safeScore}/10
      {showLabel && <span className="opacity-80">- {getLabel()}</span>}
    </span>
  );
}

export function LocalSupplierBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-sm px-3 py-1 gap-1.5'
    )}>
      <Award className="h-3 w-3" />
      Fornecedor Local
    </span>
  );
}
