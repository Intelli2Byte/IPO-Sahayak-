// import { NextRequest, NextResponse } from 'next/server';
// import { esClient } from '@/lib/elastic/client';

// export async function GET(req: NextRequest) {
//   const cin = req.nextUrl.searchParams.get('cin')?.trim().toUpperCase();

//   if (!cin || cin.length !== 21) {
//     return NextResponse.json({ error: 'Invalid CIN' }, { status: 400 });
//   }

//   try {
//     console.time('ES lookup');

//     const result = await esClient.search(
//       {
//         index: 'mca21-companies-v1',
//         size: 1,
//         track_total_hits: false,
//         query: {
//           bool: {
//             filter: [{ term: { cin } }],
//           },
//         },
//         _source: ['cin', 'companyName'],
//       },
//       {
//         querystring: {
//           filter_path: 'hits.hits._source',
//         },
//       }
//     );

//     console.timeEnd('ES lookup');

//     const hit = result.hits?.hits?.[0] as
//       | {
//           _source: {
//             cin: string;
//             companyName: string;
//           };
//         }
//       | undefined;

//     if (!hit) {
//       return NextResponse.json({ found: false }, { status: 404 });
//     }

//     return NextResponse.json({
//       found: true,
//       cin: hit._source.cin,
//       companyName: hit._source.companyName,
//     });
//   } catch (err) {
//     console.error('ES lookup error:', err);
//     return NextResponse.json(
//       { error: 'Lookup failed' },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';

import { esClient } from '@/lib/elastic/client';

export async function GET(req: NextRequest) {
  try {
    const cin =
      req.nextUrl.searchParams
        .get('cin')
        ?.trim()
        .toUpperCase();

    if (!cin) {
      return NextResponse.json(
        {
          error: 'CIN is required.',
        },
        {
          status: 400,
        }
      );
    }

    if (!/^[UL][A-Z0-9]{20}$/.test(cin)) {
      return NextResponse.json(
        {
          error: 'Invalid CIN format.',
        },
        {
          status: 400,
        }
      );
    }

    const result = await esClient.search({
      index: 'mca21-users-v1',

      size: 1,

      query: {
        bool: {
          should: [
            {
              term: {
                cin,
              },
            },
            {
              match: {
                cin,
              },
            },
          ],
          minimum_should_match: 1,
        },
      },

      _source: [
        'cin',
        'companyName',
        'dateOfIncorporation',
        'registeredOfficeAddress',
        'objectClause',

        'addressBuilding',
        'addressStreet',
        'addressLocality',
        'addressCity',
        'addressDistrict',
        'addressState',
        'addressPinCode',

        'telephone',
        'officialEmail',
        'websiteUrl',

        'promoters',

        'csName',
        'csIcsiNumber',
        'csEmail',
        'csPhone',
      ],
    });

    const source = result.hits.hits[0]?._source as
      | Record<string, unknown>
      | undefined;

    if (!source) {
      return NextResponse.json(
        {
          error: 'Company not found.',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      cin: source.cin || cin,
      companyName: source.companyName || '',
      dateOfIncorporation:
        source.dateOfIncorporation || '',

      registeredOfficeAddress:
        source.registeredOfficeAddress || '',

      objectClause:
        source.objectClause || '',

      addressBuilding:
        source.addressBuilding || '',

      addressStreet:
        source.addressStreet || '',

      addressLocality:
        source.addressLocality || '',

      addressCity:
        source.addressCity || '',

      addressDistrict:
        source.addressDistrict || '',

      addressState:
        source.addressState || '',

      addressPinCode:
        source.addressPinCode || '',

      telephone:
        source.telephone || '',

      officialEmail:
        source.officialEmail || '',

      websiteUrl:
        source.websiteUrl || '',

      promoters:
        source.promoters || [],

      csName:
        source.csName || '',

      csIcsiNumber:
        source.csIcsiNumber || '',

      csEmail:
        source.csEmail || '',

      csPhone:
        source.csPhone || '',
    });
  } catch (error) {
    console.error(
      'Company lookup error:',
      error
    );

    return NextResponse.json(
      {
        error: 'Company lookup failed.',
      },
      {
        status: 500,
      }
    );
  }
}