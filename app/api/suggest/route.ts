import { NextResponse } from 'next/server';

const MODEL = 'gpt-3.5-turbo'; // fastest model for quick responses
const AFFILIATE_TAG = 'giftfndr0d8-21'; // <-- replace with your Amazon Associates tag

function band(budget: number) {
  if (budget < 20) return 'under_20';
  if (budget <= 50) return '20_50';
  if (budget <= 100) return '50_100';
  return '100_plus';
}

console.log('OPENAI key present?', !!process.env.OPENAI_API_KEY, 'tag', process.env.AFFILIATE_TAG);


// Bulletproof image system using reliable image URLs
const imgFor = (title: string, category: string) => {
  // Extract key terms from the title for better image matching
  const titleLower = title.toLowerCase();
  
  // Category-based image selection with specific product matching
  if (category === 'tech') {
    if (titleLower.includes('earbuds') || titleLower.includes('headphones')) {
      return 'https://picsum.photos/seed/headphones/640/480';
    }
    if (titleLower.includes('charger') || titleLower.includes('wireless')) {
      return 'https://picsum.photos/seed/charger/640/480';
    }
    if (titleLower.includes('phone') || titleLower.includes('smartphone')) {
      return 'https://picsum.photos/seed/phone/640/480';
    }
    return 'https://picsum.photos/seed/tech/640/480';
  }
  
  if (category === 'home') {
    if (titleLower.includes('candle') || titleLower.includes('scented')) {
      return 'https://picsum.photos/seed/candle/640/480';
    }
    if (titleLower.includes('frame') || titleLower.includes('photo')) {
      return 'https://picsum.photos/seed/frame/640/480';
    }
    if (titleLower.includes('plant') || titleLower.includes('garden')) {
      return 'https://picsum.photos/seed/plant/640/480';
    }
    return 'https://picsum.photos/seed/home/640/480';
  }
  
  if (category === 'wellness') {
    if (titleLower.includes('yoga') || titleLower.includes('mat')) {
      return 'https://picsum.photos/seed/yoga/640/480';
    }
    if (titleLower.includes('skincare') || titleLower.includes('beauty')) {
      return 'https://picsum.photos/seed/skincare/640/480';
    }
    if (titleLower.includes('fitness') || titleLower.includes('gym')) {
      return 'https://picsum.photos/seed/fitness/640/480';
    }
    return 'https://picsum.photos/seed/wellness/640/480';
  }
  
  if (category === 'food') {
    if (titleLower.includes('coffee') || titleLower.includes('tea')) {
      return 'https://picsum.photos/seed/coffee/640/480';
    }
    if (titleLower.includes('wine') || titleLower.includes('drink')) {
      return 'https://picsum.photos/seed/wine/640/480';
    }
    if (titleLower.includes('chocolate') || titleLower.includes('sweet')) {
      return 'https://picsum.photos/seed/chocolate/640/480';
    }
    return 'https://picsum.photos/seed/food/640/480';
  }
  
  if (category === 'books') {
    return 'https://picsum.photos/seed/books/640/480';
  }
  
  if (category === 'outdoor') {
    if (titleLower.includes('bottle') || titleLower.includes('water')) {
      return 'https://picsum.photos/seed/bottle/640/480';
    }
    if (titleLower.includes('hiking') || titleLower.includes('camping')) {
      return 'https://picsum.photos/seed/hiking/640/480';
    }
    return 'https://picsum.photos/seed/outdoor/640/480';
  }
  
  if (category === 'fashion') {
    return 'https://picsum.photos/seed/fashion/640/480';
  }
  
  if (category === 'hobby') {
    if (titleLower.includes('puzzle') || titleLower.includes('game')) {
      return 'https://picsum.photos/seed/puzzle/640/480';
    }
    if (titleLower.includes('art') || titleLower.includes('craft')) {
      return 'https://picsum.photos/seed/art/640/480';
    }
    return 'https://picsum.photos/seed/hobby/640/480';
  }
  
  // Fallback for general items
  return 'https://picsum.photos/seed/gift/640/480';
};
const amazonSearch = (q: string) =>
  `https://www.amazon.co.uk/s?k=${encodeURIComponent(q)}&tag=${AFFILIATE_TAG}`;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { occasion = '', relationship = '', interests = '', budget = 50 } = body as {
    occasion?: string; relationship?: string; interests?: string; budget?: number;
  };

  const priceBand = band(Number(budget) || 50);

  // Build the prompt for structured JSON ideas
  const userMsg = `Gift ideas for ${relationship} (${occasion}) who likes ${interests}. Budget £${budget}. UK.

Return JSON: { "ideas": [ { "title": string, "reason": string, "keywords": string[], "category": string, "estimatedPrice": number } ] }
- 9 items max
- 'title': specific Amazon searchable product
- 'reason': <= 120 chars, persuasive
- 'category': "tech", "home", "fashion", "hobby", "wellness", "food", "books", "outdoor", "beauty"
- 'estimatedPrice': realistic UK price (number only)
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
        temperature: 0.3, // Lower temperature for faster, more consistent responses
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
    const parsed = JSON.parse(content) as { ideas?: Array<{ title: string; reason: string; keywords?: string[]; category?: string; estimatedPrice?: number }> };

    const ideas = (parsed.ideas || []).slice(0, 9);
    const results = ideas.map((i) => {
      return {
        title: i.title,
        reason: i.reason,
        image: imgFor(i.title, i.category || 'general'),
        affiliateUrl: amazonSearch(i.title),
        prime: true,
        estimatedPrice: i.estimatedPrice || Math.floor(Math.random() * 50) + 15, // Fallback price between £15-65
        category: i.category || 'general'
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
        image: imgFor('Insulated Stainless Water Bottle 750ml', 'outdoor'),
        affiliateUrl: amazonSearch('insulated stainless water bottle 750ml'),
        prime: true,
        estimatedPrice: 25,
        category: 'outdoor'
      },
      {
        title: 'Scented Candle Set (3-Pack)',
        reason: `Relaxing and affordable pick — easy win for ${relationship}.`,
        image: imgFor('Scented Candle Set (3-Pack)', 'home'),
        affiliateUrl: amazonSearch('scented candle set 3 pack'),
        prime: true,
        estimatedPrice: 18,
        category: 'home'
      },
      {
        title: 'Wireless Earbuds with Charging Case',
        reason: `For music-loving ${relationship}. Solid sound without breaking the bank.`,
        image: imgFor('Wireless Earbuds with Charging Case', 'tech'),
        affiliateUrl: amazonSearch('wireless earbuds charging case'),
        prime: true,
        estimatedPrice: 35,
        category: 'tech'
      },
      {
        title: 'Personalized Photo Frame',
        reason: `A thoughtful way to display memories — perfect for ${relationship}.`,
        image: imgFor('Personalized Photo Frame', 'home'),
        affiliateUrl: amazonSearch('personalized photo frame'),
        prime: true,
        estimatedPrice: 22,
        category: 'home'
      },
      {
        title: 'Gourmet Coffee Gift Set',
        reason: `For the coffee lover in your life. Premium beans and accessories.`,
        image: imgFor('Gourmet Coffee Gift Set', 'food'),
        affiliateUrl: amazonSearch('gourmet coffee gift set'),
        prime: true,
        estimatedPrice: 28,
        category: 'food'
      },
      {
        title: 'Yoga Mat with Carrying Strap',
        reason: `Perfect for wellness enthusiasts. Non-slip and portable.`,
        image: imgFor('Yoga Mat with Carrying Strap', 'wellness'),
        affiliateUrl: amazonSearch('yoga mat with carrying strap'),
        prime: true,
        estimatedPrice: 32,
        category: 'wellness'
      },
      {
        title: 'Wireless Phone Charger',
        reason: `Modern convenience that everyone appreciates.`,
        image: imgFor('Wireless Phone Charger', 'tech'),
        affiliateUrl: amazonSearch('wireless phone charger'),
        prime: true,
        estimatedPrice: 45,
        category: 'tech'
      },
      {
        title: 'Cookbook Collection',
        reason: `For the home chef. Inspiring recipes and beautiful photography.`,
        image: imgFor('Cookbook Collection', 'books'),
        affiliateUrl: amazonSearch('cookbook collection'),
        prime: true,
        estimatedPrice: 20,
        category: 'books'
      },
      {
        title: 'Skincare Gift Set',
        reason: `Luxury skincare products for pampering and self-care.`,
        image: imgFor('Skincare Gift Set', 'beauty'),
        affiliateUrl: amazonSearch('skincare gift set'),
        prime: true,
        estimatedPrice: 38,
        category: 'beauty'
      }
    ];
    return NextResponse.json({ results: fallback });
  }
}

