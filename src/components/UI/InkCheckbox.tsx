'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface InkCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  id?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * A checkbox styled as a square "print box" on a form. When checked, an
 * ink cross is hand-drawn via an animated SVG stroke rather than a flat fill.
 */
export default function InkCheckbox({ checked, onChange, label, id, disabled, className = '' }: InkCheckboxProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();

    if (checked) {
      gsap.fromTo(
        path,
        { strokeDashoffset: length, strokeDasharray: length },
        { strokeDashoffset: 0, duration: 0.28, ease: 'power2.out' }
      );
    } else {
      gsap.to(path, { strokeDashoffset: length, duration: 0.15, ease: 'power1.in' });
    }
  }, [checked]);

  return (
    <label
      htmlFor={id}
      className={`inline-flex items-start gap-3 cursor-pointer select-none group ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
    >
      <span
        onClick={() => !disabled && onChange(!checked)}
        className={`shrink-0 w-5 h-5 rounded-[3px] border-[1.5px] flex items-center justify-center transition-colors duration-150 mt-0.5 ${
          checked ? 'border-primary bg-primary-subtle/40' : 'border-slate-400 bg-white group-hover:border-slate-600'
        }`}
        style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)' }}
      >
        <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="none">
          <path
            ref={pathRef}
            d="M4 10.2 L8.2 14.5 L16 5"
            stroke="#004b93"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label && <span className="text-xs font-semibold text-slate-700 leading-relaxed">{label}</span>}
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />
    </label>
  );
}