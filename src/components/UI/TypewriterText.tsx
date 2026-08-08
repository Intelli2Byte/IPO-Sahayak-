'use client';

import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number; // ms per character
}

/**
 * Renders text letter-by-letter to simulate ink hitting paper as a field
 * auto-fills from a verified record (e.g. MCA lookup).
 */
export default function TypewriterText({ text, className = '', speed = 18 }: TypewriterTextProps) {
  const [shown, setShown] = useState('');

  useEffect(() => {
    setShown('');
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {shown}
      <span className="typewriter-caret" />
    </span>
  );
}
