export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { getSQL, ensureTable } from '@/lib/db';
import { slugify } from '@/lib/slugify';

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await ensureTable();
  const sql = getSQL();
  const rows = await sql`
    SELECT id, slug, card_name, template, views, created_at, updated_at
    FROM cards
    WHERE user_id = ${session.user.id}
    ORDER BY updated_at DESC
  `;
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { cardData, cardName, slug: customSlug } = body;

  if (!cardData || !cardName) {
    return NextResponse.json({ error: 'cardData and cardName are required' }, { status: 400 });
  }

  await ensureTable();
  const sql = getSQL();

  // Generate unique slug
  const baseSlug = slugify(customSlug || cardData.name || cardName);
  let slug = baseSlug;
  let attempt = 0;

  while (true) {
    const existing = await sql`SELECT id FROM cards WHERE slug = ${slug}`;
    if (existing.length === 0) break;
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  const rows = await sql`
    INSERT INTO cards (user_id, slug, card_name, card_data, template)
    VALUES (${session.user.id}, ${slug}, ${cardName}, ${JSON.stringify(cardData)}, ${cardData.template})
    RETURNING id, slug, card_name, template, views, created_at, updated_at
  `;

  return NextResponse.json(rows[0], { status: 201 });
}
