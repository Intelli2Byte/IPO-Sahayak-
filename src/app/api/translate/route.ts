import { NextRequest, NextResponse } from 'next/server';

const LIBRE_TRANSLATE_URL =
  process.env.LIBRE_TRANSLATE_URL ||
  'http://127.0.0.1:5000/translate';

function isGarbageText(text: string): boolean {
  if (!text) return true;

  const value = text.trim();

  if (!value) return true;

  if (value.length > 500) {
    return true;
  }

  if (/^(A-?){8,}$/i.test(value.replace(/\s+/g, ''))) {
    return true;
  }

  if (/^(.)\1{15,}$/s.test(value)) {
    return true;
  }

  const words = value.split(/\s+/);

  if (words.length >= 8) {
    const counts: Record<string, number> = {};

    for (const word of words) {
      counts[word] = (counts[word] || 0) + 1;
    }

    const maxCount = Math.max(
      ...Object.values(counts)
    );

    if (maxCount / words.length > 0.7) {
      return true;
    }
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const text = body?.text;

    const targetLanguage =
      body?.targetLanguage || 'hi';

    if (!text) {
      return NextResponse.json(
        {
          error: 'Text parameter missing',
        },
        { status: 400 }
      );
    }

    const texts = Array.isArray(text)
      ? text
      : [text];

    /*
     * Remove garbage before it reaches Argos.
     */
    const validTexts = texts.map(
      (value: unknown) =>
        typeof value === 'string'
          ? value
          : String(value)
    );

    /*
     * If every string is garbage, don't call
     * LibreTranslate at all.
     */
    const shouldTranslate =
      validTexts.some(
        (value) => !isGarbageText(value)
      );

    if (!shouldTranslate) {
      return NextResponse.json({
        translatedText: validTexts,
      });
    }

    const translatedText: string[] = [];

    /*
     * LibreTranslate accepts one q at a time reliably
     * with the local Argos setup.
     */
    for (const original of validTexts) {
      if (isGarbageText(original)) {
        translatedText.push(original);
        continue;
      }

      try {
        const response = await fetch(
          LIBRE_TRANSLATE_URL,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              q: original,
              source: 'en',
              target: targetLanguage,
              format: 'text',
            }),
          }
        );

        if (!response.ok) {
          console.warn(
            'LibreTranslate returned:',
            response.status
          );

          translatedText.push(original);
          continue;
        }

        const data =
          await response.json();

        const translated =
          typeof data?.translatedText ===
          'string'
            ? data.translatedText
            : original;

        /*
         * Don't accept garbage returned by
         * the translation engine.
         */
        if (
          isGarbageText(translated)
        ) {
          translatedText.push(original);
        } else {
          translatedText.push(
            translated.trim()
          );
        }
      } catch (error) {
        console.warn(
          'LibreTranslate request failed:',
          error
        );

        /*
         * Translation failure should never
         * break the website.
         */
        translatedText.push(original);
      }
    }

    return NextResponse.json({
      translatedText: Array.isArray(text)
        ? translatedText
        : translatedText[0],
    });
  } catch (error) {
    console.error(
      'Translation route error:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Translation service unavailable',
      },
      { status: 200 }
    );
  }
}