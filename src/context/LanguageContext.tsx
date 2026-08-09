'use client';

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (englishText: string) => string;
  isTranslating: boolean;
  /** Call this in a useEffect for text that only renders conditionally
   *  (dropdowns, menus, tooltips) so it's known about BEFORE the user
   *  ever opens that dropdown and hits toggle. */
  preRegister: (texts: string[]) => void;
  showBanner: boolean;
  bannerMessage: string;
  dismissBanner: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const CHUNK_SIZE = 40; // keep each Google Translate request small & safe

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [translationsCache, setTranslationsCache] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');

  // Every string ever passed to t() ends up here. A ref (not state) so
  // writing to it during render never triggers a re-render loop.
  const registryRef = useRef<Set<string>>(new Set());
  // Mirrors translationsCache so t() always reads the latest value
  // without needing to be re-created every time the cache updates.
  const cacheRef = useRef<Record<string, string>>({});
  cacheRef.current = translationsCache;

  const t = useCallback((englishText: string): string => {
    if (!englishText) return englishText;
    registryRef.current.add(englishText);
    if (language === 'en') return englishText;
    return cacheRef.current[englishText] || englishText;
  }, [language]);

  const preRegister = useCallback((texts: string[]) => {
    texts.forEach((txt) => txt && registryRef.current.add(txt));
  }, []);

  const translateChunk = async (texts: string[]): Promise<Record<string, string>> => {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: texts, targetLanguage: 'hi' }),
      });
      const data = await res.json();
      const map: Record<string, string> = {};
      if (Array.isArray(data.translatedText)) {
        texts.forEach((original, idx) => {
          map[original] = data.translatedText[idx] ?? original;
        });
      }
      return map;
    } catch (err) {
      console.error('Translation chunk failed:', err);
      return {};
    }
  };

  const translateBatch = async (texts: string[]): Promise<Record<string, string>> => {
    const result: Record<string, string> = {};
    for (let i = 0; i < texts.length; i += CHUNK_SIZE) {
      const chunk = texts.slice(i, i + CHUNK_SIZE);
      const translated = await translateChunk(chunk);
      Object.assign(result, translated);
    }
    return result;
  };

  const toggleLanguage = async () => {
    if (language === 'en') {
      // EN -> HI: translate everything registered so far that we don't
      // already have cached, THEN switch — avoids flash of English text.
      const allTexts = Array.from(registryRef.current);
      const missing = allTexts.filter((txt) => !translationsCache[txt]);

      if (missing.length > 0) {
        setIsTranslating(true);
        const translated = await translateBatch(missing);
        setTranslationsCache((prev) => ({ ...prev, ...translated }));
        setIsTranslating(false);
      }

      setLanguage('hi');
      setBannerMessage(
        'Page translated to Hindi via Google Translate. Some technical, legal, or financial terms may not translate perfectly — please verify anything critical before submitting.'
      );
      setShowBanner(true);
    } else {
      // HI -> EN: instant, nothing to fetch.
      setLanguage('en');
      setBannerMessage('Switched back to English.');
      setShowBanner(true);
    }
  };

  const dismissBanner = () => setShowBanner(false);

  return (
    <LanguageContext.Provider
      value={{ language, toggleLanguage, t, isTranslating, preRegister, showBanner, bannerMessage, dismissBanner }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}