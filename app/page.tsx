'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ThemeToggle } from './components/ThemeToggle';

type Suggestion = {
  title: string;
  reason: string;
  image: string;
  affiliateUrl: string;
  prime?: boolean;
  priceBand?: 'under_20' | '20_50' | '50_100' | '100_plus';
  category?: string;
};

type SortOption = 'default' | 'price-low' | 'price-high' | 'category';

// Loading Animation Component
function LoadingAnimation() {
  return (
    <span className="font-semibold">Finding perfect gifts...</span>
  );
}

// Category Badge Component
function CategoryBadge({ category }: { category: string }) {
  const categoryConfig = {
    tech: { text: 'text-blue-400' },
    home: { text: 'text-emerald-400' },
    fashion: { text: 'text-purple-400' },
    hobby: { text: 'text-orange-400' },
    wellness: { text: 'text-pink-400' },
    food: { text: 'text-red-400' },
    books: { text: 'text-amber-400' },
    outdoor: { text: 'text-green-400' },
    beauty: { text: 'text-rose-400' },
    general: { text: 'text-gray-400' }
  };

  const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.general;

  return (
    <span className={`text-xs font-medium ${config.text}`}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
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
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [resultsSearchQuery, setResultsSearchQuery] = useState('');
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Animated placeholder examples
  const placeholderExamples = [
    "Gift for my tech-savvy brother who loves gaming",
    "Something romantic for my wife's anniversary",
    "Fun gift for a coffee-loving friend",
    "Educational toy for my 8-year-old niece",
    "Luxury gift for my boss under £100",
    "Outdoor gear for my hiking enthusiast dad"
  ];

  // Typewriter animation
  useEffect(() => {
    const currentExample = placeholderExamples[currentPlaceholderIndex];
    
    if (isTyping) {
      let charIndex = 0;
      
      const typeNextChar = () => {
        if (charIndex < currentExample.length) {
          setCurrentText(currentExample.slice(0, charIndex + 1));
          charIndex++;
          setTimeout(typeNextChar, 50);
        } else {
          // Wait before starting to delete
          setTimeout(() => setIsTyping(false), 1500);
        }
      };
      
      typeNextChar();
    } else {
      // Delete text
      let charIndex = currentText.length;
      
      const deleteNextChar = () => {
        if (charIndex > 0) {
          setCurrentText((prev) => prev.slice(0, prev.length - 1));
          charIndex--;
          setTimeout(deleteNextChar, 30);
        } else {
          // Move to next example and start typing
          setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholderExamples.length);
          setIsTyping(true);
        }
      };
      
      deleteNextChar();
    }
  }, [currentPlaceholderIndex, isTyping]);

  async function handleQuickSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setResults(null);
    setSortBy('default');
    setSelectedCategory('all');
    setResultsSearchQuery('');
    
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          occasion: '', 
          relationship: '', 
          interests: searchQuery, 
          budget: 100 
        })
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);
    setSortBy('default');
    setSelectedCategory('all');
    setSearchQuery('');
    setResultsSearchQuery('');
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

  // Get unique categories from results
  const categories = results ? [...new Set(results.map(item => item.category || 'general'))] : [];

  // Filter and sort results
  const filteredAndSortedResults = results ? results
    .filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = resultsSearchQuery === '' || 
        item.title.toLowerCase().includes(resultsSearchQuery.toLowerCase()) ||
        item.reason.toLowerCase().includes(resultsSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.priceBand === 'under_20' ? 0 : a.priceBand === '20_50' ? 1 : a.priceBand === '50_100' ? 2 : 3) -
                 (b.priceBand === 'under_20' ? 0 : b.priceBand === '20_50' ? 1 : b.priceBand === '50_100' ? 2 : 3);
        case 'price-high':
          return (b.priceBand === 'under_20' ? 0 : b.priceBand === '20_50' ? 1 : b.priceBand === '50_100' ? 2 : 3) -
                 (a.priceBand === 'under_20' ? 0 : a.priceBand === '20_50' ? 1 : a.priceBand === '50_100' ? 2 : 3);
        case 'category':
          return (a.category || 'general').localeCompare(b.category || 'general');
        default:
          return 0;
      }
    }) : [];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-start mb-16">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] filter">
              GiftFNDR
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-muted">
              Tell us who it&apos;s for, their interests and budget. We&apos;ll match spot-on gift ideas with instant buy links.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>

        {/* Quick Search Box */}
        <div className="mb-12">
          <form onSubmit={handleQuickSearch} className="relative max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentText + (isTyping ? '|' : '')}
                className="w-full rounded-2xl bg-secondary/50 border border-border/50 px-8 py-5 pr-20 outline-none focus:border-primary/30 focus:bg-secondary text-foreground placeholder:text-muted/70 transition-all duration-500 ease-out focus:shadow-xl focus:shadow-primary/5 text-lg"
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <button
                  type="submit"
                  disabled={loading || !searchQuery.trim()}
                  className="bg-primary text-primary-foreground rounded-xl px-6 py-3 font-semibold hover:bg-primary/90 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted/80">
              Or fill out the detailed form below for more specific recommendations
            </p>
          </form>
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
          <div className="mt-10">
            {/* Search and Filters Section */}
            <div className="bg-secondary/50 rounded-2xl p-6 mb-8 border border-border">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative max-w-lg">
                  <input
                    type="text"
                    placeholder="Search gifts by name or description..."
                    value={resultsSearchQuery}
                    onChange={(e) => setResultsSearchQuery(e.target.value)}
                    className="w-full rounded-xl bg-background border border-border px-4 py-3 pl-12 outline-none focus:border-border-hover text-foreground placeholder:text-muted"
                  />
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Filters and Sorting */}
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="rounded-lg bg-background border border-border px-4 py-2 text-sm text-foreground focus:border-border-hover outline-none"
                  >
                    <option value="default">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="category">Category</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">Category:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-lg bg-background border border-border px-4 py-2 text-sm text-foreground focus:border-border-hover outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-sm text-muted ml-auto">
                  {filteredAndSortedResults.length} of {results.length} gifts
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {filteredAndSortedResults.map((item, index) => (
                <div 
                  key={item.title} 
                  className="group relative overflow-hidden rounded-2xl border border-border bg-secondary hover:border-border-hover transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/3 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"></div>
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={640}
                      height={480}
                      className="h-48 w-full object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-105"
                      onError={() => {
                        // Fallback is handled by the src prop
                      }}
                    />
                    
                    {/* Simple shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    
                    {/* Price indicator */}
                    {item.priceBand && (
                      <div className="absolute top-3 right-3">
                        <span className="text-xs rounded-full bg-background/90 backdrop-blur-sm text-foreground px-3 py-1.5 font-semibold shadow-sm border border-border/50 transition-all duration-300 ease-out group-hover:scale-105 group-hover:bg-background/95">
                          {item.priceBand === 'under_20' && 'Under £20'}
                          {item.priceBand === '20_50' && '£20-£50'}
                          {item.priceBand === '50_100' && '£50-£100'}
                          {item.priceBand === '100_plus' && '£100+'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 transition-all duration-300 ease-out group-hover:bg-secondary/60 relative">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-base line-clamp-2 flex-1 transition-all duration-300 ease-out group-hover:text-foreground">{item.title}</h3>
                      {item.category && (
                        <div className="ml-3 flex-shrink-0 transition-all duration-300 ease-out group-hover:scale-105">
                          <CategoryBadge category={item.category} />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted mb-4 line-clamp-2 transition-all duration-300 ease-out group-hover:text-muted/90">{item.reason}</p>
                    
                    {/* Buy Button */}
                    <a
                      href={item.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3 font-semibold hover:from-primary/90 hover:to-primary/70 transition-all duration-300 ease-out text-sm shadow-sm hover:shadow-lg hover:scale-105"
                    >
                      Get This Gift
                      <svg className="ml-2 w-4 h-4 transition-all duration-300 ease-out group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {filteredAndSortedResults.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted">No gifts found for the selected category.</p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="mt-2 text-primary hover:underline"
                >
                  Show all categories
                </button>
              </div>
            )}
          </div>
        )}

        <p className="mt-12 text-xs text-muted">
          As an Amazon Associate, we earn from qualifying purchases.
        </p>
      </div>
    </main>
  );
}


