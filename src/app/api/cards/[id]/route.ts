export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { getSQL, ensureTable } from '@/lib/db';
import { slugify } from '@/lib/slugify';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await ensureTable();
  const sql = getSQL();
  const rows = await sql`
    SELECT id, user_id, slug, card_name, card_data, template, views, created_at, updated_at
    FROM cards
    WHERE id = ${id} AND user_id = ${session.user.id}
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { cardData, cardName, slug: customSlug } = body;

  await ensureTable();
  const sql = getSQL();

  // Verify ownership
  const existing = await sql`SELECT id FROM cards WHERE id = ${id} AND user_id = ${session.user.id}`;
  if (existing.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Handle slug update
  let slugUpdate: string | null = null;
  if (customSlug !== undefined) {
    const newSlug = slugify(customSlug);
    const conflict = await sql`SELECT id FROM cards WHERE slug = ${newSlug} AND id != ${id}`;
    if (conflict.length > 0) {
      return NextResponse.json({ error: 'Slug already taken' }, { status: 409 });
    }
    slugUpdate = newSlug;
  }

  const rows = await sql`
    UPDATE cards SET
      card_data = COALESCE(${cardData ? JSON.stringify(cardData) : null}::jsonb, card_data),
      card_name = COALESCE(${cardName ?? null}, card_name),
      template = COALESCE(${cardData?.template ?? null}, template),
      slug = COALESCE(${slugUpdate}, slug),
      updated_at = NOW()
    WHERE id = ${id} AND user_id = ${session.user.id}
    RETURNING id, slug, card_name, template, views, created_at, updated_at
  `;

  return NextResponse.json(rows[0]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await ensureTable();
  const sql = getSQL();
  const rows = await sql`
    DELETE FROM cards WHERE id = ${id} AND user_id = ${session.user.id}
    RETURNING id
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
