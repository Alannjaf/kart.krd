import { neon } from '@neondatabase/serverless';

let tableChecked = false;

function getSQL() {
  return neon(process.env.DATABASE_URL!);
}

async function ensureTable() {
  if (tableChecked) return;
  const sql = getSQL();
  await sql`
    CREATE TABLE IF NOT EXISTS cards (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      card_name TEXT NOT NULL,
      card_data JSONB NOT NULL,
      template TEXT NOT NULL,
      views INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_cards_slug ON cards(slug)`;
  tableChecked = true;
}

export { getSQL, ensureTable };
