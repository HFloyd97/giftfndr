'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ThemeToggle } from './components/ThemeToggle';

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
    <span className="font-semibold">Finding perfect gifts...</span>
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
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">GiftFNDR</h1>
            <p className="mt-4 text-lg/7 text-muted">
              Tell us who it&apos;s for, their interests and budget. We&apos;ll match spot-on gift ideas with instant buy links.
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-secondary-foreground">Occasion</span>
            <input
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="Birthday, Anniversary, Christmas…"
              className="rounded-xl bg-secondary border border-border px-4 py-3 outline-none focus:border-border-hover text-foreground placeholder:text-muted"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-secondary-foreground">Relationship</span>
            <input
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="Mum, Partner, Friend, Boss…"
              className="rounded-xl bg-secondary border border-border px-4 py-3 outline-none focus:border-border-hover text-foreground placeholder:text-muted"
              required
            />
          </label>

          <label className="sm:col-span-2 flex flex-col gap-2">
            <span className="text-sm text-secondary-foreground">Interests</span>
            <input
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Gaming, gym, cooking, travel…"
              className="rounded-xl bg-secondary border border-border px-4 py-3 outline-none focus:border-border-hover text-foreground placeholder:text-muted"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-secondary-foreground">Budget (£)</span>
            <input
              type="number"
              min={5}
              max={1000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="rounded-xl bg-secondary border border-border px-4 py-3 outline-none focus:border-border-hover text-foreground"
              required
            />
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-primary text-primary-foreground px-5 py-3 font-semibold disabled:opacity-60 hover:opacity-90 transition-opacity"
            >
              {loading ? <LoadingAnimation /> : 'Find a gift'}
            </button>
          </div>
        </form>

        {error && <p className="mt-6 text-error">{error}</p>}

        {/* Loading Overlay */}
        {loading && !results && (
          <div className="mt-10 flex flex-col items-center justify-center py-16">
            <div className="mb-6">
              <div className="w-16 h-16 border-4 border-border border-t-primary rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Searching for perfect gifts...</h3>
              <p className="text-muted">This usually takes 5-10 seconds</p>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-secondary p-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={640}
                  height={480}
                  className="h-40 w-full object-cover rounded-xl mb-3 bg-accent"
                  onError={() => {
                    // Fallback is handled by the src prop
                  }}
                />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted mt-1">{item.reason}</p>
                <div className="mt-3 flex items-center gap-2">
                  {item.prime && <span className="text-xs rounded bg-accent px-2 py-1">Prime</span>}
                  {item.priceBand && (
                    <span className="text-xs rounded bg-accent px-2 py-1">
                      {item.priceBand.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <a
                  href={item.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 rounded-xl bg-primary text-primary-foreground px-4 py-2 font-semibold hover:opacity-90 transition-opacity"
                >
                  Buy
                </a>
              </div>
            ))}
          </div>
        )}

        <p className="mt-12 text-xs text-muted">
          As an Amazon Associate, we earn from qualifying purchases.
        </p>
      </div>
    </main>
  );
}


