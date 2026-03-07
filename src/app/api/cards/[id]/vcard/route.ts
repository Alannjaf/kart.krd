export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getSQL, ensureTable } from '@/lib/db';
import { CardData } from '@/types/card';

function escapeVCard(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

function buildVCard(data: CardData): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    data.name ? `FN:${escapeVCard(data.name)}` : '',
    data.name ? `N:;${escapeVCard(data.name)};;;` : '',
    data.title ? `TITLE:${escapeVCard(data.title)}` : '',
    data.company ? `ORG:${escapeVCard(data.company)}` : '',
    data.phone ? `TEL:${data.phone}` : '',
    data.email ? `EMAIL:${data.email}` : '',
    data.website ? `URL:${data.website}` : '',
    data.address ? `ADR:;;${escapeVCard(data.address)};;;;` : '',
    'END:VCARD',
  ].filter(Boolean);

  return lines.join('\r\n');
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await ensureTable();
  const sql = getSQL();
  const rows = await sql`SELECT card_data, card_name FROM cards WHERE id = ${id}`;

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const cardData = rows[0].card_data as CardData;
  const vcf = buildVCard(cardData);
  const filename = `${(cardData.name || rows[0].card_name || 'contact').replace(/[^a-zA-Z0-9-_ ]/g, '')}.vcf`;

  return new NextResponse(vcf, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
