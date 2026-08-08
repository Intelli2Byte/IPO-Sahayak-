'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

type StampVariant = 'success' | 'error' | 'pending';

interface PaperStampProps {
  visible: boolean;
  text: string;
  subtext?: string;
  variant?: StampVariant;
  /** Position inside a `relative` parent. Defaults to top-right corner. */
  position?: 'top-right' | 'top-left' | 'center' | 'inline';
  size?: 'sm' | 'md' | 'lg';
}

const VARIANT_STYLES: Record<StampVariant, { ink: string; border: string; shadow: string; rotate: string }> = {
  success: {
    ink: 'text-emerald-700',
    border: 'border-emerald-700/70',
    shadow: 'shadow-[0_0_0_2px_rgba(4,120,87,0.08)]',
    rotate: '-rotate-6',
  },
  error: {
    ink: 'text-red-700',
    border: 'border-red-700/70',
    shadow: 'shadow-[0_0_0_2px_rgba(185,28,28,0.08)]',
    rotate: 'rotate-3',
  },
  pending: {
    ink: 'text-amber-700',
    border: 'border-amber-700/70',
    shadow: 'shadow-[0_0_0_2px_rgba(180,83,9,0.08)]',
    rotate: '-rotate-2',
  },
};

const SIZE_STYLES = {
  sm: 'px-3 py-1.5 text-[9px] gap-1 border-[2px]',
  md: 'px-4 py-2 text-[11px] gap-1.5 border-[3px]',
  lg: 'px-6 py-3 text-sm gap-2 border-[3px]',
};

const POSITION_STYLES: Record<NonNullable<PaperStampProps['position']>, string> = {
  'top-right': 'absolute -top-3 -right-2 md:right-4 z-20',
  'top-left': 'absolute -top-3 -left-2 md:left-4 z-20',
  center: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20',
  inline: 'relative inline-flex',
};

/**
 * Renders a rubber-stamp style badge: distressed border, translucent ink,
 * slight rotation, and a "thump" entrance animation when it first appears.
 */
export default function PaperStamp({
  visible,
  text,
  subtext,
  variant = 'success',
  position = 'top-right',
  size = 'md',
}: PaperStampProps) {
  const ref = useRef<HTMLDivElement>(null);
  const v = VARIANT_STYLES[variant];

  useEffect(() => {
    if (visible && ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, scale: 2.2, rotate: variant === 'error' ? 8 : -12 },
        {
          opacity: 1,
          scale: 1,
          rotate: variant === 'error' ? 3 : -6,
          duration: 0.45,
          ease: 'power4.out',
        }
      );
    }
  }, [visible, variant]);

  if (!visible) return null;

  return (
    <div className={POSITION_STYLES[position]}>
      <div
        ref={ref}
        className={`stamp-texture select-none ${v.rotate} ${v.border} ${v.shadow} ${SIZE_STYLES[size]} rounded-sm border-double bg-white/40 backdrop-blur-[1px] font-display font-black uppercase tracking-widest ${v.ink} flex flex-col items-center justify-center leading-none`}
        style={{ mixBlendMode: 'multiply' }}
      >
        <span className="flex items-center gap-1.5">
          {variant === 'success' && <span className="text-current">✓</span>}
          {variant === 'error' && <span className="text-current">✕</span>}
          {text}
        </span>
        {subtext && <span className="text-[8px] tracking-wider opacity-80 mt-0.5 font-bold">{subtext}</span>}
      </div>
    </div>
  );
}