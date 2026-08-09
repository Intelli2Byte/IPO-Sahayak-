import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, targetLanguage = 'hi' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text parameter missing' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Google Translate API key not configured' }, { status: 500 });
    }

    // Call Google Cloud Translation API v2
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: Array.isArray(text) ? text : [text],
          target: targetLanguage,
          format: 'text',
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Google Translation Error:', data);
      return NextResponse.json({ error: 'Translation API error' }, { status: response.status });
    }

    const translations = data.data.translations.map((t: { translatedText: string }) => t.translatedText);

    return NextResponse.json({
      translatedText: Array.isArray(text) ? translations : translations[0],
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}