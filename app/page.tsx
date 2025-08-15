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
  estimatedPrice: number;
  category?: string;
};

type SortOption = 'default' | 'price-low' | 'price-high' | 'category';

       // Enhanced Loading Animation Component
       function LoadingAnimation() {
         return (
           <div className="flex flex-col items-center space-y-4">
             <div className="relative">
               <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
               <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-primary/60 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
             </div>
             <div className="text-center">
               <p className="font-semibold text-foreground">Finding perfect gifts...</p>
               <p className="text-sm text-muted/70 mt-1">This usually takes 10-15 seconds</p>
             </div>
           </div>
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [results, setResults] = useState<Suggestion[] | null>(null);
  const [allResults, setAllResults] = useState<Suggestion[]>([]);
  const [displayedCount, setDisplayedCount] = useState(9);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [resultsSearchQuery, setResultsSearchQuery] = useState('');
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
           const [searchCache, setSearchCache] = useState<Record<string, Suggestion[]>>({});
         const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

         // Animated placeholder examples
  const placeholderExamples = [
    "Gift for my tech-savvy brother who loves gaming",
    "Something romantic for my wife's anniversary",
    "Fun gift for a coffee-loving friend",
    "Educational toy for my 8-year-old niece",
    "Luxury gift for my boss under £100",
    "Outdoor gear for my hiking enthusiast dad"
  ];

  // Popular quick searches for instant results
  const popularSearches = [
    { text: "Tech gifts", query: "tech gadgets" },
    { text: "Romantic gifts", query: "romantic" },
    { text: "Coffee lover", query: "coffee" },
    { text: "Gaming", query: "gaming" },
    { text: "Fitness", query: "fitness" },
    { text: "Books", query: "books" }
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

         // Debounced search effect
         useEffect(() => {
           const timer = setTimeout(() => {
             setDebouncedSearchQuery(searchQuery);
           }, 300);

           return () => clearTimeout(timer);
         }, [searchQuery]);

         async function handleSearchButtonClick() {
           if (!searchQuery.trim()) return;
           
           const cacheKey = `quick_${searchQuery.toLowerCase()}`;
           
           // Check cache first
           if (searchCache[cacheKey]) {
             setResults(searchCache[cacheKey]);
             setAllResults(searchCache[cacheKey]);
             setDisplayedCount(9);
             setSortBy('default');
             setSelectedCategory('all');
             setResultsSearchQuery('');
             return;
           }
           
           setLoading(true);
           setError(null);
           setResults(null);
           setAllResults([]);
           setDisplayedCount(9);
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
             
             // Cache the results
             setSearchCache(prev => ({ ...prev, [cacheKey]: data.results }));
             
             setAllResults(data.results);
             setResults(data.results.slice(0, 9));
           } catch {
             setError('Something went wrong. Please try again.');
           } finally {
             setLoading(false);
           }
         }

         async function handleQuickSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const cacheKey = `quick_${searchQuery.toLowerCase()}`;
    
    // Check cache first
    if (searchCache[cacheKey]) {
      setResults(searchCache[cacheKey]);
      setAllResults(searchCache[cacheKey]);
      setDisplayedCount(9);
      setSortBy('default');
      setSelectedCategory('all');
      setResultsSearchQuery('');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults(null);
    setAllResults([]);
    setDisplayedCount(9);
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
      
      // Cache the results
      setSearchCache(prev => ({ ...prev, [cacheKey]: data.results }));
      
      setAllResults(data.results);
      setResults(data.results.slice(0, 9));
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const cacheKey = `detailed_${occasion}_${relationship}_${interests}_${budget}`;
    
    // Check cache first
    if (searchCache[cacheKey]) {
      setResults(searchCache[cacheKey]);
      setAllResults(searchCache[cacheKey]);
      setDisplayedCount(9);
      setSortBy('default');
      setSelectedCategory('all');
      setSearchQuery('');
      setResultsSearchQuery('');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults(null);
    setAllResults([]);
    setDisplayedCount(9);
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
      
      // Cache the results
      setSearchCache(prev => ({ ...prev, [cacheKey]: data.results }));
      
      setAllResults(data.results);
      setResults(data.results.slice(0, 9));
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function loadMoreResults() {
    if (loadingMore) return;
    
    setLoadingMore(true);
    
    try {
      // Generate additional gifts on-demand
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          occasion: occasion || 'general', 
          relationship: relationship || 'friend', 
          interests: interests || searchQuery || 'gift', 
          budget: budget || 50 
        })
      });
      
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      
      // Add new results to existing ones
      const newResults = [...allResults, ...data.results];
      setAllResults(newResults);
      setResults(newResults);
      setDisplayedCount(newResults.length);
      
    } catch (error) {
      console.error('Failed to load more results:', error);
    } finally {
      setLoadingMore(false);
    }
  }

  

         async function handlePopularSearch(query: string) {
    setSearchQuery(query);
    
    const cacheKey = `quick_${query.toLowerCase()}`;
    
    // Check cache first
    if (searchCache[cacheKey]) {
      setResults(searchCache[cacheKey]);
      setAllResults(searchCache[cacheKey]);
      setDisplayedCount(9);
      setSortBy('default');
      setSelectedCategory('all');
      setResultsSearchQuery('');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults(null);
    setAllResults([]);
    setDisplayedCount(9);
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
          interests: query, 
          budget: 100 
        })
      });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      
      // Cache the results
      setSearchCache(prev => ({ ...prev, [cacheKey]: data.results }));
      
      setAllResults(data.results);
      setResults(data.results.slice(0, 9));
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
          return a.estimatedPrice - b.estimatedPrice;
        case 'price-high':
          return b.estimatedPrice - a.estimatedPrice;
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
          <form onSubmit={handleQuickSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentText + (isTyping ? '|' : '')}
                className="w-full rounded-2xl bg-secondary/50 border border-border/50 px-8 py-5 pr-16 outline-none focus:border-primary/40 focus:bg-secondary text-foreground placeholder:text-muted/70 text-lg"
                disabled={loading}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <button
                  type="submit"
                  disabled={loading || !searchQuery.trim()}
                  className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative z-20"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted/80">
              Or explore categories and occasions below
            </p>
          </form>

          {/* Quick Search Options */}
          <div className="mt-8 popular-searches-container">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-1">Quick Search</h3>
              <p className="text-sm text-muted/70">Discover trending gift ideas</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {popularSearches.map((search, index) => (
                <button
                  key={search.query}
                  onClick={() => handlePopularSearch(search.query)}
                  disabled={loading}
                  className="group relative px-5 py-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground/90 hover:text-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden popular-search-button"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  
                  {/* Content */}
                  <span className="relative z-10 font-medium">{search.text}</span>
                  
                  {/* Subtle glow on hover */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ))}
            </div>

            {/* Occasions */}
            <div className="text-center">
              <h4 className="text-base font-medium text-foreground mb-4">Occasions</h4>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { name: 'Birthday', query: 'birthday gift' },
                  { name: 'Christmas', query: 'christmas gift' },
                  { name: 'Anniversary', query: 'anniversary gift' },
                  { name: 'Wedding', query: 'wedding gift' },
                  { name: 'Graduation', query: 'graduation gift' },
                  { name: 'Housewarming', query: 'housewarming gift' }
                ].map((occasion, index) => (
                  <button
                    key={occasion.name}
                    onClick={() => handlePopularSearch(occasion.query)}
                    disabled={loading}
                    className="group relative px-5 py-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground/90 hover:text-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden popular-search-button"
                    style={{
                      animationDelay: `${(index + 6) * 150}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                    
                    {/* Content */}
                    <span className="relative z-10 font-medium">{occasion.name}</span>
                    
                    {/* Subtle glow on hover */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Category Selection */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">What are you looking for?</h2>
            <p className="text-muted/80">Choose categories that interest you</p>
          </div>
          
          {/* Category Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { name: 'Tech & Gadgets', icon: '💻', query: 'tech gadgets' },
              { name: 'Home & Living', icon: '🏠', query: 'home decor' },
              { name: 'Fashion & Style', icon: '👗', query: 'fashion accessories' },
              { name: 'Sports & Fitness', icon: '🏃‍♂️', query: 'fitness equipment' },
              { name: 'Books & Learning', icon: '📚', query: 'books' },
              { name: 'Beauty & Wellness', icon: '💄', query: 'beauty products' },
              { name: 'Food & Drink', icon: '🍷', query: 'food drink' },
              { name: 'Outdoor & Adventure', icon: '🏕️', query: 'outdoor gear' }
            ].map((category) => (
              <button
                key={category.name}
                onClick={() => handlePopularSearch(category.query)}
                disabled={loading}
                className="group relative p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/40 hover:bg-secondary/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                  <div className="text-sm font-medium text-foreground/90 group-hover:text-foreground">{category.name}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Budget Slider */}
          <div className="max-w-md mx-auto mb-8">
            <label className="block text-sm font-medium text-foreground mb-4 text-center">
              Budget: £{budget}
            </label>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-muted/70 mt-2">
              <span>£10</span>
              <span>£200</span>
            </div>
          </div>




        </div>

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
                  className="group relative overflow-hidden rounded-2xl border border-border/30 bg-secondary/50 hover:border-primary/40 hover:bg-secondary/70 transition-all duration-600 ease-out hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {/* Single elegant glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/3 opacity-0 group-hover:opacity-100 transition-all duration-600 ease-out"></div>
                  
                  {/* Enhanced Image Container with Loading States */}
                  <div className="relative overflow-hidden">
                    {/* Skeleton Loading State */}
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/50 via-secondary/30 to-secondary/50 animate-pulse">
                      <div className="h-full w-full bg-gradient-to-br from-border/20 via-transparent to-border/20"></div>
                    </div>
                    
                    {/* Actual Image with Loading States */}
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={640}
                      height={480}
                      className="h-48 w-full object-cover transition-all duration-600 ease-out group-hover:scale-105 group-hover:brightness-105 relative z-10"
                      onLoad={(e) => {
                        // Hide skeleton when image loads
                        const target = e.target as HTMLImageElement;
                        target.style.opacity = '1';
                        const skeleton = target.parentElement?.querySelector('.animate-pulse') as HTMLElement;
                        if (skeleton) {
                          skeleton.style.opacity = '0';
                          setTimeout(() => skeleton.style.display = 'none', 300);
                        }
                      }}
                      onError={(e) => {
                        // Enhanced fallback with loading state
                        const target = e.target as HTMLImageElement;
                        target.style.opacity = '0';
                        
                        // Show error state briefly, then load fallback
                        setTimeout(() => {
                          target.src = 'https://picsum.photos/seed/gift/640/480';
                          target.style.opacity = '1';
                        }, 200);
                      }}
                      style={{ opacity: 0 }}
                    />
                    
                    {/* Single elegant shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-out z-20"></div>
                    
                                         {/* Clean price indicator */}
                     <div className="absolute top-3 right-3 z-30">
                       <span className="text-xs rounded-full bg-background/90 backdrop-blur-sm text-foreground px-3 py-1.5 font-semibold shadow-sm border border-border/40 transition-all duration-400 ease-out group-hover:scale-105 group-hover:bg-primary/15 group-hover:text-primary">
                         £{item.estimatedPrice}
                       </span>
                     </div>
                     

                  </div>
                  
                  {/* Clean Content */}
                  <div className="p-5 transition-all duration-400 ease-out group-hover:bg-secondary/60 relative">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-base line-clamp-2 flex-1 transition-all duration-400 ease-out group-hover:text-foreground leading-tight">{item.title}</h3>
                      {item.category && (
                        <div className="ml-3 flex-shrink-0 transition-all duration-400 ease-out group-hover:scale-105">
                          <CategoryBadge category={item.category} />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted/70 mb-4 line-clamp-2 transition-all duration-400 ease-out group-hover:text-muted">{item.reason}</p>
                    
                    {/* Clean CTA Button */}
                                         <a
                       href={item.affiliateUrl}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="inline-flex items-center justify-center w-full rounded-lg bg-foreground/5 hover:bg-primary/10 active:bg-primary/20 text-foreground/80 hover:text-primary active:text-primary border border-border/40 hover:border-primary/40 active:border-primary/60 px-4 py-3 font-medium transition-all duration-200 ease-out text-sm hover:scale-[1.01] active:scale-[0.98] touch-manipulation"
                     >
                      <span>View Gift</span>
                      <svg className="ml-2 w-4 h-4 transition-all duration-400 ease-out group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {results && results.length > 0 && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMoreResults}
                  disabled={loadingMore}
                  className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out hover:scale-[1.02]"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                      Finding More Gifts...
                    </>
                  ) : (
                    <>
                      Find More Gifts
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Results Count */}
            {allResults.length > 0 && (
              <div className="text-center mt-8">
                <p className="text-sm text-muted">
                  Showing {displayedCount} of {allResults.length} gifts
                </p>
              </div>
            )}

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


