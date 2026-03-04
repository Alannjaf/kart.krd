import { neon } from "@neondatabase/serverless";
import { auth } from "@/lib/auth/server";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const getDb = () => neon(process.env.DATABASE_URL!);

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const sql = getDb();
  const rows = await sql.query(
    `SELECT id, name, card_data, updated_at FROM cards WHERE id = $1 AND user_id = $2`,
    [id, session.user.id]
  );

  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const sql = getDb();
  const result = await sql.query(
    `DELETE FROM cards WHERE id = $1 AND user_id = $2 RETURNING id`,
    [id, session.user.id]
  );

  if (!result.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}