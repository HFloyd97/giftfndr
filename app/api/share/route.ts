import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for share data (in production, use a database)
const shareData: { [key: string]: { query: string; results: unknown[]; timestamp: number } } = {};

// Generate a random 6-character ID
function generateShortId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Clean up old entries (older than 7 days)
function cleanupOldEntries() {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  Object.keys(shareData).forEach(key => {
    if (shareData[key].timestamp < sevenDaysAgo) {
      delete shareData[key];
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const { query, results } = await request.json();

    if (!query || !results) {
      return NextResponse.json({ error: 'Missing query or results' }, { status: 400 });
    }

    // Clean up old entries
    cleanupOldEntries();

    // Generate unique short ID
    let shortId: string;
    do {
      shortId = generateShortId();
    } while (shareData[shortId]);

    // Store the data (limit results to 6 items to keep URLs manageable)
    shareData[shortId] = {
      query,
      results: results.slice(0, 6),
      timestamp: Date.now()
    };

    const shareUrl = `${request.nextUrl.origin}/share/${shortId}`;

    return NextResponse.json({ 
      shortId, 
      shareUrl 
    });

  } catch (error) {
    console.error('Share creation error:', error);
    return NextResponse.json({ error: 'Failed to create share' }, { status: 500 });
  }
}
