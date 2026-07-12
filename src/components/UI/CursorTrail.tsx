'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CursorTrail() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on desktop devices with fine pointers
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setIsEnabled(true);

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Set initial positions (aligning the tip of the arrow to the mouse coordinate)
    gsap.set(cursor, { xPercent: 0, yPercent: 0 });

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05, // Faster, tighter follow response
        ease: 'power2.out',
      });
    };

    const handleHoverStart = () => {
      setIsHovered(true);
      gsap.to(cursor, {
        scale: 1.15,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    const handleHoverEnd = () => {
      setIsHovered(false);
      gsap.to(cursor, {
        scale: 1.0,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', moveCursor);

    // Attach listeners to all interactive items
    const attachListeners = () => {
      const targets = document.querySelectorAll('button, a, input, select, textarea, [role="button"], .clickable-card');
      targets.forEach((target) => {
        target.addEventListener('mouseenter', handleHoverStart);
        target.addEventListener('mouseleave', handleHoverEnd);
      });
    };

    attachListeners();

    // Re-attach listeners periodically or on DOM mutations since tab content updates
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
      const targets = document.querySelectorAll('button, a, input, select, textarea, [role="button"], .clickable-card');
      targets.forEach((target) => {
        target.removeEventListener('mouseenter', handleHoverStart);
        target.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-50 select-none hidden md:block"
      style={{ transform: 'translate(-100px, -100px)' }}
    >
      {isHovered ? (
        // Larger Green Clicking Hand
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 24 24" 
          fill="#10b981" 
          stroke="#ffffff" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="drop-shadow-lg -ml-2 -mt-1"
        >
          <path d="M10 3a1 1 0 0 1 1 1v7h1a1 1 0 0 1 1 1v-3a1 1 0 0 1 2 0v3h1a1 1 0 0 1 1 1v-2a1 1 0 0 1 2 0v5a7 7 0 0 1-14 0V9a1 1 0 0 1 2 0v2h1V4a1 1 0 0 1 1-1z" />
        </svg>
      ) : (
        // Larger Standard Green Pointer Arrow
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 24 24" 
          fill="#10b981" 
          stroke="#ffffff" 
          strokeWidth="1.8" 
          strokeLinejoin="miter"
          className="drop-shadow-lg -ml-1 -mt-1"
        >
          <path d="M4.5 3v15.2l3.8-3.8 2.2 4.9 2.5-1.1-2.2-4.9h5.7L4.5 3z" />
        </svg>
      )}
    </div>
  );
}
