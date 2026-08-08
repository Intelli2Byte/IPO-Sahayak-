'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface InkRadioProps {
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
  name: string;
  value: string;
  disabled?: boolean;
  className?: string;
}

/**
 * A radio button styled as a circular ink bubble on a scantron-style form.
 * On selection, an ink dot "fills in" with a quick radial scale-up.
 */
export default function InkRadio({ checked, onChange, label, name, value, disabled, className = '' }: InkRadioProps) {
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (checked && dotRef.current) {
      gsap.fromTo(dotRef.current, { scale: 0 }, { scale: 1, duration: 0.22, ease: 'back.out(3)' });
    }
  }, [checked]);

  return (
    <label
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
    >
      <span
        onClick={() => !disabled && onChange()}
        className={`shrink-0 w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors duration-150 ${
          checked ? 'border-primary' : 'border-slate-400 group-hover:border-slate-600'
        } bg-white`}
        style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)' }}
      >
        {checked && <span ref={dotRef} className="w-2.5 h-2.5 rounded-full bg-primary" />}
      </span>
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
      />
    </label>
  );
}