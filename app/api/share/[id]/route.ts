import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo (in production, use a database)
interface ShareData {
  query: string;
  results: unknown[];
  timestamp: number;
}

const shareData: { [key: string]: ShareData } = {};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (!shareData[id]) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect to home page with share data
  const url = new URL('/', request.url);
  url.searchParams.set('share', id);
  
  return NextResponse.redirect(url);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, results } = body;
    
    // Generate a short ID (6 characters)
    const shortId = Math.random().toString(36).substring(2, 8);
    
    // Store the data
    shareData[shortId] = {
      query,
      results: results.slice(0, 6), // Limit to 6 results for sharing
      timestamp: Date.now()
    };
    
    // Clean up old entries (older than 7 days)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    Object.keys(shareData).forEach(key => {
      if (shareData[key].timestamp < sevenDaysAgo) {
        delete shareData[key];
      }
    });
    
    return NextResponse.json({ 
      shareId: shortId,
      shareUrl: `${request.nextUrl.origin}/share/${shortId}`
    });
  } catch {
    return NextResponse.json({ error: 'Failed to create share' }, { status: 500 });
  }
}
