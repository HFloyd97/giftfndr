'use client';
import { useState } from 'react';

type Suggestion = {
  title: string;
  reason: string;
  image: string;
  affiliateUrl: string;
  prime?: boolean;
  priceBand?: 'under_20' | '20_50' | '50_100' | '100_plus';
};

// Loading Animation Component
function LoadingAnimation() {
  return (
    <div className="flex items-center gap-3">
      {/* Spinning Gift Box */}
      <div className="relative">
        <div className="w-6 h-6 border-2 border-white/30 rounded-md animate-spin">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/60 rounded-full"></div>
        </div>
      </div>
      
      {/* Pulsing Text */}
      <span className="font-semibold animate-pulse">Finding perfect gifts</span>
      
      {/* Animated Dots */}
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}

export default function Home() {
  const [occasion, setOccasion] = useState('');
  const [relationship, setRelationship] = useState('');
  const [interests, setInterests] = useState('');
  const [budget, setBudget] = useState<number>(50);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Suggestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);



  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasion, relationship, interests, budget })
      });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold tracking-tight">GiftFNDR</h1>
        <p className="mt-4 text-lg/7 text-white/80">
          Tell us who it’s for, their interests and budget. We’ll match spot-on gift ideas with instant buy links.
        </p>

        {/* Form */}
        <form onSubmit={onSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-white/70">Occasion</span>
            <input
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="Birthday, Anniversary, Christmas…"
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-white/70">Relationship</span>
            <input
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="Mum, Partner, Friend, Boss…"
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
              required
            />
          </label>

          <label className="sm:col-span-2 flex flex-col gap-2">
            <span className="text-sm text-white/70">Interests</span>
            <input
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Gaming, gym, cooking, travel…"
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-white/70">Budget (£)</span>
            <input
              type="number"
              min={5}
              max={1000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/30"
              required
            />
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-white text-black px-5 py-3 font-semibold disabled:opacity-60"
            >
              {loading ? <LoadingAnimation /> : 'Find a gift'}
            </button>
          </div>
        </form>



        {error && <p className="mt-6 text-red-400">{error}</p>}

        {/* Loading Overlay */}
        {loading && !results && (
          <div className="mt-10 flex flex-col items-center justify-center py-16">
            <div className="mb-6">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Searching for perfect gifts...</h3>
              <p className="text-white/60">This usually takes 5-10 seconds</p>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                {/* use <img> for simplicity; add fallback so an image always shows */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-40 w-full object-cover rounded-xl mb-3 bg-white/10"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://placehold.co/640x480?text=Gift+Idea';
                  }}
                />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-white/70 mt-1">{item.reason}</p>
                <div className="mt-3 flex items-center gap-2">
                  {item.prime && <span className="text-xs rounded bg-white/10 px-2 py-1">Prime</span>}
                  {item.priceBand && (
                    <span className="text-xs rounded bg-white/10 px-2 py-1">
                      {item.priceBand.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <a
                  href={item.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 rounded-xl bg-white text-black px-4 py-2 font-semibold"
                >
                  Buy
                </a>
              </div>
            ))}
          </div>
        )}

        <p className="mt-12 text-xs text-white/60">
          As an Amazon Associate, we earn from qualifying purchases.
        </p>
      </div>
    </main>
  );
}


