import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { esClient } from '@/lib/elastic/client';
import { createSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing credentials' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const result = await esClient.search({
      index: 'mca21-users-v1',
      size: 10,
      track_total_hits: false,
      query: {
        bool: {
          filter: [
            {
              term: {
                email: normalizedEmail,
              },
            },
          ],
        },
      },
      _source: ['email', 'passwordHash', 'cin'],
    });

    const hits = result.hits.hits;

    if (hits.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    /*
     * We may currently have duplicate documents for the same email
     * because the old registration code allowed them.
     *
     * Therefore, temporarily check all matching documents and find
     * the one whose password actually matches.
     */
    let matchedUser:
      | {
          passwordHash: string;
          cin: string;
        }
      | undefined;

    for (const hit of hits) {
      const user = hit._source as
        | {
            email: string;
            passwordHash: string;
            cin: string;
          }
        | undefined;

      if (!user?.passwordHash || !user?.cin) {
        continue;
      }

      const valid = await bcrypt.compare(
        password,
        user.passwordHash
      );

      if (valid) {
        matchedUser = {
          passwordHash: user.passwordHash,
          cin: user.cin,
        };
        break;
      }
    }

    if (!matchedUser) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    await createSession({
      email: normalizedEmail,
      cin: matchedUser.cin,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}