import { NextRequest, NextResponse } from 'next/server';

type TranslationCache = {
  translatedText: string;
  expiresAt: number;
};

// Server-side in-memory cache
const translationCache = new Map<string, TranslationCache>();

// Cache translations for 1 hour
const CACHE_TTL = 60 * 60 * 1000;

// Maximum number of Google requests allowed within this window
const RATE_LIMIT_WINDOW = 1000; // 1 second
const MAX_REQUESTS_PER_WINDOW = 5;

let requestTimestamps: number[] = [];

function isRateLimited(): boolean {
  const now = Date.now();

  // Remove timestamps older than our window
  requestTimestamps = requestTimestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );

  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  requestTimestamps.push(now);
  return false;
}

function getCacheKey(text: string, targetLanguage: string): string {
  return `${targetLanguage}:${text.trim()}`;
}

function getCachedTranslation(
  text: string,
  targetLanguage: string
): string | null {
  const key = getCacheKey(text, targetLanguage);
  const cached = translationCache.get(key);

  if (!cached) {
    return null;
  }

  // Remove expired cache entries
  if (Date.now() > cached.expiresAt) {
    translationCache.delete(key);
    return null;
  }

  return cached.translatedText;
}

function setCachedTranslation(
  text: string,
  targetLanguage: string,
  translatedText: string
) {
  const key = getCacheKey(text, targetLanguage);

  translationCache.set(key, {
    translatedText,
    expiresAt: Date.now() + CACHE_TTL,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { text, targetLanguage = 'hi' } = await req.json();

    if (
      text === undefined ||
      text === null ||
      (typeof text === 'string' && !text.trim()) ||
      (Array.isArray(text) && text.length === 0)
    ) {
      return NextResponse.json(
        { error: 'Text parameter missing' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Translate API key not configured' },
        { status: 500 }
      );
    }

    const isArray = Array.isArray(text);

    const texts: string[] = isArray ? text : [text];

    // Remove empty values
    const validTexts = texts.filter(
      (value): value is string =>
        typeof value === 'string' && value.trim().length > 0
    );

    if (validTexts.length === 0) {
      return NextResponse.json(
        {
          translatedText: isArray ? [] : '',
        },
        { status: 200 }
      );
    }

    /*
     * ============================================================
     * CHECK CACHE FIRST
     * ============================================================
     */

    const results: (string | null)[] = validTexts.map((item) =>
      getCachedTranslation(item, targetLanguage)
    );

    const missingTexts: string[] = [];

    validTexts.forEach((item, index) => {
      if (results[index] === null) {
        missingTexts.push(item);
      }
    });

    /*
     * ============================================================
     * EVERYTHING WAS CACHED
     * ============================================================
     */

    if (missingTexts.length === 0) {
      const translatedResults = results as string[];

      return NextResponse.json({
        translatedText: isArray
          ? translatedResults
          : translatedResults[0],
        cached: true,
      });
    }

    /*
     * ============================================================
     * RATE LIMIT GOOGLE REQUESTS
     * ============================================================
     */

    if (isRateLimited()) {
      return NextResponse.json(
        {
          error: 'Translation rate limit exceeded. Please try again shortly.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': '1',
          },
        }
      );
    }

    /*
     * ============================================================
     * CALL GOOGLE TRANSLATE
     *
     * IMPORTANT:
     * All missing strings are sent in ONE Google request.
     * ============================================================
     */

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: missingTexts,
          target: targetLanguage,
          format: 'text',
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Google Translation Error:', data);

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            'Translation API error',
        },
        {
          status: response.status,
        }
      );
    }

    const googleTranslations: string[] =
      data?.data?.translations?.map(
        (translation: { translatedText: string }) =>
          translation.translatedText
      ) || [];

    /*
     * ============================================================
     * SAVE NEW TRANSLATIONS TO CACHE
     * ============================================================
     */

    missingTexts.forEach((originalText, index) => {
      const translatedText = googleTranslations[index];

      if (translatedText) {
        setCachedTranslation(
          originalText,
          targetLanguage,
          translatedText
        );
      }
    });

    /*
     * ============================================================
     * COMBINE:
     *
     * cached translations + newly translated values
     * ============================================================
     */

    const finalTranslations = validTexts.map((originalText) => {
      return getCachedTranslation(
        originalText,
        targetLanguage
      ) || originalText;
    });

    return NextResponse.json({
      translatedText: isArray
        ? finalTranslations
        : finalTranslations[0],
      cached: false,
    });
  } catch (error) {
    console.error('Translation error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      {
        status: 500,
      }
    );
  }
}