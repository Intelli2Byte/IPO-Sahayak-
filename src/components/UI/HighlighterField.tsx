'use client';

import { useState } from 'react';

interface HighlighterFieldProps {
  label: React.ReactNode;
  required?: boolean;
  hint?: string;
  error?: string | null;
  children: React.ReactNode;
  /** Small badge shown to the right of the label, e.g. a char counter */
  trailing?: React.ReactNode;
}

/**
 * Wraps a label + input/textarea/select in a panel that glows a warm
 * highlighter-yellow behind the field while it (or any child) has focus,
 * mimicking a physical highlighter pen sweep over paper.
 */
export default function HighlighterField({ label, required, hint, error, children, trailing }: HighlighterFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
      className={`highlighter-field rounded-xl transition-all duration-300 -mx-2.5 px-2.5 py-2 ${
        focused ? 'bg-amber-100/60' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
        {trailing}
      </div>
      {children}
      {hint && !error && <p className="text-[9px] text-slate-400 font-semibold mt-1">{hint}</p>}
      {error && (
        <p className="text-[10px] text-red-600 font-bold mt-1 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}