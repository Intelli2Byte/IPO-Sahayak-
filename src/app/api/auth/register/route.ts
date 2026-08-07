import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { esClient } from '@/lib/elastic/client';
import { createSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  const { email, password, cin, companyName } = await req.json();

  if (!email?.includes('@') || !password || password.length < 8 || !cin || !companyName) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await esClient.search({
    index: 'mca21-users-v1',
    query: { term: { 'email.keyword': normalizedEmail } },
  });

  if (existing.hits.hits.length > 0) {
    return NextResponse.json({ error: 'Account already exists' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await esClient.index({
    index: 'mca21-users-v1',
    document: {
      email: normalizedEmail,
      passwordHash,
      cin,
      companyName,
      createdAt: new Date().toISOString(),
    },
    refresh: 'wait_for',
  });

  await createSession({ email: normalizedEmail, cin });

  return NextResponse.json({ success: true });
}