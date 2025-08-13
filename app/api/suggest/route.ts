import { NextResponse } from 'next/server';

const MODEL = 'gpt-4o-mini'; // fast + cheap, perfect for this
const AFFILIATE_TAG = 'giftfndr0d8-21'; // <-- replace with your Amazon Associates tag

function band(budget: number) {
  if (budget < 20) return 'under_20';
  if (budget <= 50) return '20_50';
  if (budget <= 100) return '50_100';
  return '100_plus';
}

console.log('OPENAI key present?', !!process.env.OPENAI_API_KEY, 'tag', process.env.AFFILIATE_TAG);


// Simple helpers for images + affiliate links (MVP)
// const imgFor = (q: string) =>
//   `https://source.unsplash.com/featured/640x480/?gift,${encodeURIComponent(q)}`;
const imgFor = (q: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(q)}/640/480`;
const amazonSearch = (q: string) =>
  `https://www.amazon.co.uk/s?k=${encodeURIComponent(q)}&tag=${AFFILIATE_TAG}`;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { occasion = '', relationship = '', interests = '', budget = 50 } = body as {
    occasion?: string; relationship?: string; interests?: string; budget?: number;
  };

  const priceBand = band(Number(budget) || 50);

  // Build the prompt for structured JSON ideas
  const userMsg = `
Occasion: ${occasion}
Relationship: ${relationship}
Interests: ${interests}
Budget: £${budget}
Country: UK

Return STRICT JSON: { "ideas": [ { "title": string, "reason": string, "keywords": string[] } ] }
- 6 items max
- 'title' should be specific enough to search on Amazon
- 'reason' <= 160 characters, persuasive, UK context
- 'keywords' 3–6 terms to help pick an image/search
`;

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are GiftFNDR, a crisp, practical gift-matching assistant.' },
          { role: 'user', content: userMsg }
        ]
      })
    });

    if (!resp.ok) {
      console.error('OpenAI error:', await resp.text());
      throw new Error('openai_fail');
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content || '{"ideas":[]}';
    const parsed = JSON.parse(content) as { ideas?: Array<{ title: string; reason: string; keywords?: string[] }> };

    const ideas = (parsed.ideas || []).slice(0, 6);
    const results = ideas.map((i) => {
      const k = i.keywords?.[0] || i.title;
      return {
        title: i.title,
        reason: i.reason,
        image: imgFor(k),
        affiliateUrl: amazonSearch(i.title),
        prime: true,
        priceBand
      };
    });

    // Fallback if AI returns nothing
    if (!results.length) throw new Error('no_ideas');

    return NextResponse.json({ results });
  } catch (e) {
    console.warn('Falling back to static ideas:', e);
    // graceful fallback so the site never breaks
    const fallback = [
      {
        title: 'Insulated Stainless Water Bottle 750ml',
        reason: `Great for ${interests || 'active people'} — perfect ${occasion} gift for your ${relationship}.`,
        image: imgFor('water bottle'),
        affiliateUrl: amazonSearch('insulated stainless water bottle 750ml'),
        prime: true,
        priceBand
      },
      {
        title: 'Scented Candle Set (3-Pack)',
        reason: `Relaxing and affordable pick — easy win for ${relationship}.`,
        image: imgFor('scented candles'),
        affiliateUrl: amazonSearch('scented candle set 3 pack'),
        prime: true,
        priceBand
      },
      {
        title: 'Wireless Earbuds with Charging Case',
        reason: `For music-loving ${relationship}. Solid sound without breaking the bank.`,
        image: imgFor('wireless earbuds'),
        affiliateUrl: amazonSearch('wireless earbuds charging case'),
        prime: true,
        priceBand
      }
    ];
    return NextResponse.json({ results: fallback });
  }
}

