import { NextRequest, NextResponse } from 'next/server';
import { esClient } from '@/lib/elastic/client';

export async function GET(req: NextRequest) {
  const cin = req.nextUrl.searchParams.get('cin')?.trim().toUpperCase();

  if (!cin || cin.length !== 21) {
    return NextResponse.json({ error: 'Invalid CIN' }, { status: 400 });
  }

  try {
    const result = await esClient.search({
      index: 'mca21-companies-v1',
      size: 1,
      query: {
        term: { cin: cin }, // Changed 'CIN.keyword' to 'cin'
      },
    });

    const hit = result.hits.hits[0] as
      | { _source: { cin: string; companyName: string } } // Changed keys to lowercase
      | undefined;

    if (!hit) {
      return NextResponse.json({ found: false }, { status: 404 });
    }

    return NextResponse.json({
      found: true,
      cin: hit._source.cin, // Changed to lowercase
      companyName: hit._source.companyName, // Changed to lowercase
    });
  } catch (err) {
    console.error('ES lookup error:', err);
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
  }
}
