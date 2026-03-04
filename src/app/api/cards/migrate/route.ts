import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const sql = neon(process.env.DATABASE_URL!);

  await sql.query(`
    CREATE TABLE IF NOT EXISTS cards (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL,
      card_data JSONB NOT NULL,
      name TEXT NOT NULL DEFAULT 'My Card',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  await sql.query(`CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id)`);

  return NextResponse.json({ ok: true, message: "Migration complete" });
}