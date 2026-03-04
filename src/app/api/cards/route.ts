import { neon } from "@neondatabase/serverless";
import { auth } from "@/lib/auth/server";
import { NextRequest, NextResponse } from "next/server";
import type { CardData } from "@/types/card";

export const runtime = "nodejs";

const getDb = () => neon(process.env.DATABASE_URL!);

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getDb();
  const rows = await sql.query(
    `SELECT id, name, card_data, updated_at FROM cards WHERE user_id = $1 ORDER BY updated_at DESC`,
    [session.user.id]
  );

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { cardData: CardData; name?: string; id?: string };
  const { cardData, name = "کارتەکەم", id } = body;

  const sql = getDb();

  if (id) {
    const existing = await sql.query(
      `SELECT id FROM cards WHERE id = $1 AND user_id = $2`,
      [id, session.user.id]
    );
    if (!existing.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const updated = await sql.query(
      `UPDATE cards SET card_data = $1::jsonb, name = $2, updated_at = now() WHERE id = $3 AND user_id = $4 RETURNING id, name, updated_at`,
      [JSON.stringify(cardData), name, id, session.user.id]
    );
    return NextResponse.json(updated[0]);
  } else {
    const created = await sql.query(
      `INSERT INTO cards (user_id, card_data, name) VALUES ($1, $2::jsonb, $3) RETURNING id, name, updated_at`,
      [session.user.id, JSON.stringify(cardData), name]
    );
    return NextResponse.json(created[0], { status: 201 });
  }
}