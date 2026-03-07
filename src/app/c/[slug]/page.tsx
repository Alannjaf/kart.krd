import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSQL, ensureTable } from '@/lib/db';
import { CardData } from '@/types/card';
import ProfileClient from './ProfileClient';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCard(slug: string) {
  await ensureTable();
  const sql = getSQL();
  const rows = await sql`
    SELECT id, slug, card_name, card_data, template, views
    FROM cards WHERE slug = ${slug}
  `;
  return rows[0] || null;
}

async function incrementViews(id: string) {
  const sql = getSQL();
  await sql`UPDATE cards SET views = views + 1 WHERE id = ${id}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const card = await getCard(slug);
  if (!card) return { title: 'Card not found' };

  const data = card.card_data as CardData;
  const title = data.name ? `${data.name} — kart.krd` : 'kart.krd';
  const description = [data.title, data.company].filter(Boolean).join(' — ') || 'Business Card';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://kart.krd/c/${slug}`,
      siteName: 'kart.krd',
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  const card = await getCard(slug);
  if (!card) notFound();

  // Fire-and-forget view increment
  incrementViews(card.id);

  const data = card.card_data as CardData;

  return (
    <ProfileClient
      cardData={data}
      cardId={card.id}
      slug={slug}
      views={(card.views as number) + 1}
    />
  );
}
