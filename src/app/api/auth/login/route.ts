import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { esClient } from '@/lib/elastic/client';
import { createSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const result = await esClient.search({
    index: 'mca21-users-v1',
    size: 1,
    query: { term: { 'email.keyword': normalizedEmail } },
  });

  const hit = result.hits.hits[0];
  if (!hit) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const user = hit._source as { passwordHash: string; cin: string };
  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  await createSession({ email: normalizedEmail, cin: user.cin });

  return NextResponse.json({ success: true });
}