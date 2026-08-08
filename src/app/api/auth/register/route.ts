import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { esClient } from '@/lib/elastic/client';
import { createSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const { email, password, cin, companyName } = await req.json();

    if (
      !email?.includes('@') ||
      !password ||
      password.length < 8 ||
      !cin ||
      !companyName
    ) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    /*
     * Check whether this email already exists.
     *
     * IMPORTANT:
     * email is mapped directly as Keyword, so we must query:
     *
     *     email
     *
     * NOT:
     *
     *     email.keyword
     */
    const existing = await esClient.search({
      index: 'mca21-users-v1',
      size: 1,
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
      _source: false,
    });

    if (existing.hits.hits.length > 0) {
      return NextResponse.json(
        { error: 'Account already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    /*
     * Use the normalized email as the Elasticsearch document ID.
     *
     * op_type: 'create' means Elasticsearch will create the document
     * only if that ID does not already exist.
     *
     * This gives us an additional uniqueness protection against
     * two registration requests arriving at the same time.
     */
    try {
      await esClient.index({
        index: 'mca21-users-v1',
        id: normalizedEmail,
        op_type: 'create',
        document: {
          email: normalizedEmail,
          passwordHash,
          cin,
          companyName,
          createdAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      const statusCode = (error as { statusCode?: number }).statusCode;

      if (statusCode === 409) {
        return NextResponse.json(
          { error: 'Account already exists' },
          { status: 409 }
        );
      }

      throw error;
    }

    await createSession({
      email: normalizedEmail,
      cin,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);

    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}