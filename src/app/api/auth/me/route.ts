// import { NextResponse } from 'next/server';
// import { getSession } from '@/lib/auth/session';
// import { esClient } from '@/lib/elastic/client';

// export async function GET() {
//   try {
//     const session = await getSession();
    
//     if (!session || !session.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     // Fetch the company name from ElasticSearch using the email to guarantee we have all data
//     const result = await esClient.search({
//       index: 'mca21-users-v1',
//       size: 1,
//       query: { term: { email: session.email } },
//       _source: ['email', 'cin', 'companyName'],
//     });

//     // We cast _source to an explicit TypeScript type so it stops complaining about missing properties
//     const userDoc = result.hits.hits[0]?._source as {
//       email?: string;
//       cin?: string;
//       companyName?: string;
//     } | undefined;

//     return NextResponse.json({
//       email: session.email,
//       cin: session.cin || userDoc?.cin,
//       companyName: userDoc?.companyName,
//     });
    
//   } catch (error) {
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';

import { getSession } from '@/lib/auth/session';
import { esClient } from '@/lib/elastic/client';

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.email) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    const email = session.email.toLowerCase().trim();

    const result = await esClient.search({
      index: 'mca21-users-v1',

      size: 1,

      query: {
        term: {
          email,
        },
      },

      _source: [
        'email',
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

        'complianceOfficerName',
        'complianceOfficerEmail',
        'complianceOfficerPhone',
      ],
    });

    const source = result.hits.hits[0]?._source as
      | Record<string, unknown>
      | undefined;

    return NextResponse.json({
      success: true,

      user: {
        email,

        cin:
          session.cin ||
          source?.cin ||
          '',

        companyName:
          source?.companyName ||
          '',

        dateOfIncorporation:
          source?.dateOfIncorporation ||
          '',

        registeredOfficeAddress:
          source?.registeredOfficeAddress ||
          '',

        objectClause:
          source?.objectClause ||
          '',

        addressBuilding:
          source?.addressBuilding ||
          '',

        addressStreet:
          source?.addressStreet ||
          '',

        addressLocality:
          source?.addressLocality ||
          '',

        addressCity:
          source?.addressCity ||
          '',

        addressDistrict:
          source?.addressDistrict ||
          '',

        addressState:
          source?.addressState ||
          'Maharashtra',

        addressPinCode:
          source?.addressPinCode ||
          '',

        telephone:
          source?.telephone ||
          '',

        officialEmail:
          source?.officialEmail ||
          email,

        websiteUrl:
          source?.websiteUrl ||
          '',

        promoters:
          source?.promoters ||
          [],

        csName:
          source?.csName ||
          '',

        csIcsiNumber:
          source?.csIcsiNumber ||
          '',

        csEmail:
          source?.csEmail ||
          '',

        csPhone:
          source?.csPhone ||
          '',

        complianceOfficerName:
          source?.complianceOfficerName ||
          '',

        complianceOfficerEmail:
          source?.complianceOfficerEmail ||
          '',

        complianceOfficerPhone:
          source?.complianceOfficerPhone ||
          '',
      },
    });
  } catch (error) {
    console.error('Auth/me error:', error);

    return NextResponse.json(
      {
        error: 'Server error',
      },
      {
        status: 500,
      }
    );
  }
}