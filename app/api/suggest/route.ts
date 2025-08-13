import { NextResponse } from 'next/server';

function band(budget: number) {
  if (budget < 20) return 'under_20';
  if (budget <= 50) return '20_50';
  if (budget <= 100) return '50_100';
  return '100_plus';
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { occasion = '', relationship = '', interests = '', budget = 50 } = body;

  const priceBand = band(Number(budget) || 50);

  // TODO: replace affiliateUrl values with your real Amazon SiteStripe links
  const results = [
    {
      title: 'Insulated Stainless Water Bottle 750ml',
      reason: `Great for ${interests || 'active people'} — perfect ${occasion} gift for your ${relationship}.`,
      image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=800&auto=format&fit=crop',
      affiliateUrl: 'https://www.amazon.co.uk/dp/EXAMPLE?tag=YOURTAG-21',
      prime: true,
      priceBand
    },
    {
      title: 'Scented Candle Set (3-Pack)',
      reason: `Relaxing and affordable pick — easy win for ${relationship}.`,
      image: 'https://images.unsplash.com/photo-1514820720301-4c4790309f46?q=80&w=800&auto=format&fit=crop',
      affiliateUrl: 'https://www.amazon.co.uk/dp/EXAMPLE?tag=YOURTAG-21',
      prime: true,
      priceBand
    },
    {
      title: 'Wireless Earbuds with Charging Case',
      reason: `For music-loving ${relationship}. Solid sound without breaking the bank.`,
      image: 'https://images.unsplash.com/photo-1585386959984-a41552231658?q=80&w=800&auto=format&fit=crop',
      affiliateUrl: 'https://www.amazon.co.uk/dp/EXAMPLE?tag=YOURTAG-21',
      prime: true,
      priceBand
    }
  ];

  return NextResponse.json({ results });
}
