'use client';

import { useRef, useEffect, ReactNode, ButtonHTMLAttributes } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export default function MagneticButton({ children, className = '', ...props }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      // Calculate mouse position relative to button center
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Translate the button towards the mouse by a fraction of the distance (max 18px)
      gsap.to(btn, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      // Return to original position
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`relative select-none transition-shadow ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
