'use client';

import { useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import gsap from 'gsap';
import { ToastType } from '@/types/team-access';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number; // ms
  onDismiss: () => void;
}

const CONFIG: Record<ToastType, { icon: typeof CheckCircle2; bg: string; border: string; text: string }> = {
  success: { icon: CheckCircle2, bg: 'bg-success-subtle', border: 'border-success-light/20', text: 'text-success' },
  error: { icon: XCircle, bg: 'bg-red/5', border: 'border-red/20', text: 'text-red' },
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
};

export default function Toast({ message, type = 'success', duration = 3500, onDismiss }: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const dismissedRef = useRef(false);

  const dismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    if (toastRef.current) {
      gsap.to(toastRef.current, {
        opacity: 0,
        y: -12,
        scale: 0.96,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onDismiss,
      });
    } else {
      onDismiss();
    }
  };

  useEffect(() => {
    const el = toastRef.current;
    if (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: -12, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' }
      );
    }

    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const { icon: Icon, bg, border, text } = CONFIG[type];

  return (
    <div
      ref={toastRef}
      className={`fixed top-6 right-6 z-50 flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-lg border ${bg} ${border} max-w-sm`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${text}`} />
      <p className={`text-xs font-semibold ${text} leading-relaxed pr-2`}>{message}</p>
      <button onClick={dismiss} className="ml-auto text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}