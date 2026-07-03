import type { PropsWithChildren } from 'react';

import { cn } from '@/utils/cn';

type GlassCardProps = PropsWithChildren<{
  className?: string;
}>;

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-[2rem] border border-white/10 bg-white/6 shadow-[0_24px_100px_rgba(0,0,0,0.32)] backdrop-blur-2xl',
        className,
      )}
    >
      {children}
    </div>
  );
}