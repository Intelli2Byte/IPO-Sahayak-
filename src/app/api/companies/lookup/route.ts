import { NextRequest, NextResponse } from 'next/server';
import { esClient } from '@/lib/elastic/client';

export async function GET(req: NextRequest) {
  const cin = req.nextUrl.searchParams.get('cin')?.trim().toUpperCase();

  if (!cin || cin.length !== 21) {
    return NextResponse.json({ error: 'Invalid CIN' }, { status: 400 });
  }

  try {
    console.time('ES lookup');

    const result = await esClient.search(
      {
        index: 'mca21-companies-v1',
        size: 1,
        track_total_hits: false,
        query: {
          bool: {
            filter: [{ term: { cin } }],
          },
        },
        _source: ['cin', 'companyName'],
      },
      {
        querystring: {
          filter_path: 'hits.hits._source',
        },
      }
    );

    console.timeEnd('ES lookup');

    const hit = result.hits?.hits?.[0] as
      | {
          _source: {
            cin: string;
            companyName: string;
          };
        }
      | undefined;

    if (!hit) {
      return NextResponse.json({ found: false }, { status: 404 });
    }

    return NextResponse.json({
      found: true,
      cin: hit._source.cin,
      companyName: hit._source.companyName,
    });
  } catch (err) {
    console.error('ES lookup error:', err);
    return NextResponse.json(
      { error: 'Lookup failed' },
      { status: 500 }
    );
  }
}