'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from './components/ThemeToggle';
import { NewsletterSignup } from './components/NewsletterSignup';
import { trackEvent } from './utils/analytics';

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

type ShareData = {
  query: string;
  results: Suggestion[];
  timestamp: number;
};

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
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  
  // Smart Search States
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [peopleAlsoSearched, setPeopleAlsoSearched] = useState<string[]>([]);
  
  // Ref for scrolling to loading area
  const loadingRef = useRef<HTMLDivElement>(null);

         // Animated placeholder examples
  const placeholderExamples = [
    "Gift for my tech-savvy brother who loves gaming",
    "Something romantic for my wife&apos;s anniversary",
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

  // Smart Search Suggestions Database
  const searchSuggestionsDB = [
    "tech gifts", "gaming", "coffee", "fitness", "books", "romantic", "anniversary", "birthday",
    "christmas", "valentine", "mother", "father", "sister", "brother", "friend", "colleague",
    "boss", "teacher", "student", "gardener", "cook", "artist", "musician", "photographer",
    "traveler", "hiker", "yoga", "meditation", "cooking", "baking", "wine", "beer", "tea",
    "jewelry", "watches", "bags", "shoes", "clothing", "accessories", "home decor", "kitchen",
    "bathroom", "bedroom", "living room", "garden", "outdoor", "indoor", "pet", "dog", "cat",
    "baby", "toddler", "teenager", "adult", "senior", "luxury", "budget", "affordable", "premium"
  ];

  // People Also Searched For (based on common patterns)
  const peopleAlsoSearchedDB = [
    "tech gifts for dad", "romantic gifts for wife", "coffee gifts for mom", "gaming gifts for brother",
    "fitness gifts for boyfriend", "book gifts for sister", "anniversary gifts for husband",
    "birthday gifts for friend", "christmas gifts for family", "valentine gifts for girlfriend",
    "mother's day gifts", "father's day gifts", "teacher appreciation gifts", "boss gifts",
    "housewarming gifts", "wedding gifts", "baby shower gifts", "graduation gifts"
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

         // Smart Search Logic
         useEffect(() => {
           if (debouncedSearchQuery.trim()) {
             // Generate search suggestions
             const suggestions = searchSuggestionsDB
               .filter(suggestion => 
                 suggestion.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) &&
                 suggestion.toLowerCase() !== debouncedSearchQuery.toLowerCase()
               )
               .slice(0, 8);
             setSearchSuggestions(suggestions);
             setShowSuggestions(true);
           } else {
             // Show popular suggestions when search is empty
             setSearchSuggestions(searchSuggestionsDB.slice(0, 8));
             setShowSuggestions(true);
           }
         }, [debouncedSearchQuery]);

         // Load recent searches from localStorage and initialize suggestions
         useEffect(() => {
           const saved = localStorage.getItem('giftfindr_recent_searches');
           if (saved) {
             try {
               setRecentSearches(JSON.parse(saved));
             } catch (error) {
               console.error('Failed to load recent searches:', error);
             }
           }
           
           // Initialize with popular suggestions
           setSearchSuggestions(searchSuggestionsDB.slice(0, 8));
         }, []);

         // Generate "People Also Searched For" suggestions
         useEffect(() => {
           if (searchQuery.trim()) {
             const related = peopleAlsoSearchedDB
               .filter(item => 
                 item.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 searchQuery.toLowerCase().includes(item.toLowerCase())
               )
               .slice(0, 3);
             setPeopleAlsoSearched(related);
           } else {
             setPeopleAlsoSearched([]);
           }
         }, [searchQuery]);

         // Enhanced share functionality with short URLs
  const shareResults = async () => {
    if (!results || !results.length) return;

    try {
      // Create short share URL
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: searchQuery, 
          results: results 
        })
      });

      if (!response.ok) throw new Error('Failed to create share');
      
      const { shareUrl } = await response.json();
      
      // Better share messages
      const shareMessages = {
        twitter: `🎁 Found perfect gifts for "${searchQuery}" with AI! Check out these recommendations:`,
        facebook: `🎁 Just discovered amazing gift ideas for "${searchQuery}" using GiftFNDR's AI recommendations!`,
        linkedin: `🎁 AI-powered gift recommendations for "${searchQuery}" - perfect for any occasion!`,
        pinterest: `🎁 Gift inspiration for "${searchQuery}" - AI-curated recommendations`,
        whatsapp: `🎁 Hey! I found some great gift ideas for "${searchQuery}" using GiftFNDR:`,
        email: `🎁 Gift Recommendations for "${searchQuery}"`
      };

      // Try native sharing first
      if (navigator.share) {
        await navigator.share({
          title: 'GiftFNDR - AI Gift Recommendations',
          text: shareMessages.twitter,
          url: shareUrl,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareMessages.twitter}\n\n${shareUrl}`);
        setCopiedToClipboard(true);
        setTimeout(() => setCopiedToClipboard(false), 2000);
      }

      // Track share event
      trackEvent.shareResults(searchQuery, results.length);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

    // Social media specific sharing with short URLs
  const shareToSocial = async (platform: 'twitter' | 'facebook' | 'linkedin' | 'pinterest') => {
    if (!results || !results.length) return;

    try {
      // Create short share URL
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: searchQuery, 
          results: results 
        })
      });

      if (!response.ok) throw new Error('Failed to create share');
      
      const { shareUrl } = await response.json();
      
      // Platform-specific messages
      const shareMessages = {
        twitter: `🎁 Found perfect gifts for "${searchQuery}" with AI! Check out these recommendations:`,
        facebook: `🎁 Just discovered amazing gift ideas for "${searchQuery}" using GiftFNDR's AI recommendations!`,
        linkedin: `🎁 AI-powered gift recommendations for "${searchQuery}" - perfect for any occasion!`,
        pinterest: `🎁 Gift inspiration for "${searchQuery}" - AI-curated recommendations`
      };
      
      let url = '';
      switch (platform) {
        case 'twitter':
          url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareMessages.twitter)}&url=${encodeURIComponent(shareUrl)}&hashtags=gifts,AI,recommendations`;
          break;
        case 'facebook':
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareMessages.facebook)}`;
          break;
        case 'linkedin':
          url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
          break;
        case 'pinterest':
          url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareMessages.pinterest)}`;
          break;
      }
      
      // Mobile-friendly link opening
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      trackEvent.shareResults(searchQuery, results.length);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  // Share functionality
  function generateShareUrl(data: ShareData): string {
    const baseUrl = window.location.origin;
    const encodedData = btoa(JSON.stringify(data));
    return `${baseUrl}?share=${encodedData}`;
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    });
  }

  async function handleShareResults() {
    if (!results || !searchQuery.trim()) return;
    
    try {
      // Create short share URL
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: searchQuery, 
          results: results 
        })
      });

      if (!response.ok) throw new Error('Failed to create share');
      
      const { shareUrl } = await response.json();
      setShareUrl(shareUrl);
      setShowShareModal(true);
    } catch (error) {
      console.error('Share failed:', error);
    }
  }

  // Smart Search Helper Functions
  const addToRecentSearches = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('giftfindr_recent_searches', JSON.stringify(updated));
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Track suggestion click
    trackEvent.search(suggestion, 'suggestion');
    
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    addToRecentSearches(suggestion);
  };

  const handleRecentSearchClick = (recentQuery: string) => {
    setSearchQuery(recentQuery);
    setShowSuggestions(false);
    // Move to top of recent searches
    addToRecentSearches(recentQuery);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('giftfindr_recent_searches');
  };

  // Load shared results from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shareParam = urlParams.get('share');
    
    if (shareParam) {
      // Check if it's a short ID (6 characters) or old encoded data
      if (shareParam.length === 6) {
        // New short share ID - fetch from API
        fetch(`/api/share/${shareParam}`)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Share not found');
          })
          .then(data => {
            setSearchQuery(data.query);
            setResults(data.results);
            setAllResults(data.results);
            setDisplayedCount(data.results.length);
            setSortBy('default');
            setSelectedCategory('all');
            setResultsSearchQuery('');
            
            // Clear the URL parameter
            window.history.replaceState({}, document.title, window.location.pathname);
          })
          .catch(error => {
            console.error('Failed to load shared results:', error);
          });
      } else {
        // Old encoded data format - try to decode
        try {
          const decodedData = JSON.parse(atob(shareParam));
          const data: ShareData = decodedData;
          
          // Check if data is not too old (7 days)
          const isExpired = Date.now() - data.timestamp > 7 * 24 * 60 * 60 * 1000;
          
          if (!isExpired) {
            setSearchQuery(data.query);
            setResults(data.results);
            setAllResults(data.results);
            setDisplayedCount(data.results.length);
            setSortBy('default');
            setSelectedCategory('all');
            setResultsSearchQuery('');
            
            // Clear the URL parameter
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (error) {
          console.error('Failed to load shared results:', error);
        }
      }
    }
  }, []);

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
    
    // Track search event
    trackEvent.search(searchQuery, 'quick');
    
    const cacheKey = `quick_${searchQuery.toLowerCase()}`;
    
    // Check cache first
    if (searchCache[cacheKey]) {
      setResults(searchCache[cacheKey]);
      setAllResults(searchCache[cacheKey]);
      setDisplayedCount(9);
      setSortBy('default');
      setSelectedCategory('all');
      setResultsSearchQuery('');
      addToRecentSearches(searchQuery);
      setShowSuggestions(false);
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
    
    // Add to recent searches
    addToRecentSearches(searchQuery);
    setShowSuggestions(false);
    
    // Scroll to loading area
    setTimeout(() => {
      loadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
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
    
    // Scroll to loading area
    setTimeout(() => {
      loadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
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
    
    // Track load more event
    trackEvent.loadMore(allResults.length, allResults.length + 9);
    
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
      trackEvent.error('Failed to load more results', 'load_more');
    } finally {
      setLoadingMore(false);
    }
  }

  

         async function handlePopularSearch(query: string) {
    // Track popular search event
    trackEvent.search(query, 'popular');
    
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
    
    // Scroll to loading area
    setTimeout(() => {
      loadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
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

  // Filter and sort results with deduplication
  const filteredAndSortedResults = results ? results
    .filter((item, index, self) => {
      // Remove duplicates based on title
      const isDuplicate = self.findIndex(i => i.title === item.title) !== index;
      if (isDuplicate) return false;
      
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
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 mr-6">
              <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/gift-guides" className="text-sm text-muted hover:text-foreground transition-colors">
                Gift Guides
              </Link>
              <Link href="/blog" className="text-sm text-muted hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-sm text-muted hover:text-foreground transition-colors">
                About
              </Link>
            </nav>
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
              💡 Start typing for smart suggestions • Or explore categories and occasions below
            </p>
          </form>

          {/* Smart Search Suggestions - Naturally positioned */}
          {showSuggestions && (
            <div className="mt-4 bg-background border border-border/50 rounded-2xl shadow-lg max-h-96 overflow-hidden">
              {/* Search Suggestions */}
              {searchSuggestions.length > 0 && (
                <div className="p-4 border-b border-border/30">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="text-sm font-medium text-foreground">Popular Suggestions</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
                    <div className="space-y-2 pr-2">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors duration-200 text-sm text-foreground/80 hover:text-foreground"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="p-4 border-b border-border/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-foreground">Recent Searches</span>
                    </div>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-muted hover:text-foreground transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
                    <div className="space-y-2 pr-2">
                      {recentSearches.map((recentQuery, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentSearchClick(recentQuery)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors duration-200 text-sm text-foreground/80 hover:text-foreground flex items-center gap-2"
                        >
                          <svg className="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {recentQuery}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* People Also Searched For */}
              {peopleAlsoSearched.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm font-medium text-foreground">People Also Searched For</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
                    <div className="space-y-2 pr-2">
                      {peopleAlsoSearched.map((relatedQuery, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(relatedQuery)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors duration-200 text-sm text-foreground/80 hover:text-foreground"
                        >
                          {relatedQuery}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

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
          <div ref={loadingRef} className="mt-10 flex flex-col items-center justify-center py-16">
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
            {/* Results Header with Share Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Found {results.length} perfect gifts
                </h2>
                <p className="text-muted mt-1">
                  for &quot;{searchQuery}&quot; • Budget: £{budget}
                </p>
              </div>
              <button
                onClick={handleShareResults}
                className="group relative px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share Results
              </button>
            </div>

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
                       onClick={() => trackEvent.giftClick(item.title, item.category || 'general', item.estimatedPrice)}
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

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl border border-border/50 max-w-md w-full p-6 animate-in fade-in-0 zoom-in-95 duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-foreground">Share Your Gift Results</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-muted hover:text-foreground transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-muted mb-4">
                  Share these amazing gift ideas with friends and family!
                </p>
                
                {/* Share URL */}
                <div className="relative">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="w-full px-3 py-2 bg-secondary/50 border border-border/50 rounded-lg text-sm text-foreground pr-20"
                  />
                  <button
                    onClick={() => copyToClipboard(shareUrl)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors"
                  >
                    {copiedToClipboard ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Mobile Native Share Button */}
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/share', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        query: searchQuery, 
                        results: results 
                      })
                    });

                    if (!response.ok) throw new Error('Failed to create share');
                    
                    const { shareUrl } = await response.json();
                    const shareText = `🎁 Found perfect gifts for "${searchQuery}" with AI! Check out these recommendations:`;
                    
                    // Use native Web Share API
                    if (navigator.share) {
                      await navigator.share({
                        title: 'GiftFNDR - AI Gift Recommendations',
                        text: shareText,
                        url: shareUrl,
                      });
                    } else {
                      // Fallback to clipboard
                      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
                      setCopiedToClipboard(true);
                      setTimeout(() => setCopiedToClipboard(false), 2000);
                    }
                    
                    trackEvent.shareResults(searchQuery, results?.length || 0);
                  } catch (error) {
                    console.error('Share failed:', error);
                  }
                }}
                className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-colors touch-manipulation min-h-[44px] mb-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share Results</span>
              </button>

              {/* Social Share Buttons - Mobile Optimized */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/share', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          query: searchQuery, 
                          results: results 
                        })
                      });

                      if (!response.ok) throw new Error('Failed to create share');
                      
                      const { shareUrl } = await response.json();
                      const shareText = `🎁 Found perfect gifts for "${searchQuery}" with AI! Check out these recommendations:`;
                      
                      // Direct X (Twitter) sharing - simple approach
                      const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=gifts,AI,recommendations`;
                      window.location.href = xUrl;
                      
                      trackEvent.shareResults(searchQuery, results?.length || 0);
                    } catch (error) {
                      console.error('Share failed:', error);
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors touch-manipulation min-h-[44px]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="hidden sm:inline">X</span>
                  <span className="sm:hidden">Share</span>
                </button>
                
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/share', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          query: searchQuery, 
                          results: results 
                        })
                      });

                      if (!response.ok) throw new Error('Failed to create share');
                      
                      const { shareUrl } = await response.json();
                      const shareText = `🎁 Just discovered amazing gift ideas for "${searchQuery}" using GiftFNDR's AI recommendations!`;
                      
                      // Direct Facebook sharing - simple approach
                      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
                      window.location.href = fbUrl;
                      
                      trackEvent.shareResults(searchQuery, results?.length || 0);
                    } catch (error) {
                      console.error('Share failed:', error);
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#1877F2]/90 active:bg-[#1877F2]/80 transition-colors touch-manipulation min-h-[44px]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="hidden sm:inline">Facebook</span>
                  <span className="sm:hidden">Share</span>
                </button>
                
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/share', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          query: searchQuery, 
                          results: results 
                        })
                      });

                      if (!response.ok) throw new Error('Failed to create share');
                      
                      const { shareUrl } = await response.json();
                      const shareText = `🎁 Hey! I found some great gift ideas for "${searchQuery}" using GiftFNDR:`;
                      
                      // Direct WhatsApp sharing - simple approach
                      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
                      window.location.href = whatsappUrl;
                      
                      trackEvent.shareResults(searchQuery, results?.length || 0);
                    } catch (error) {
                      console.error('Share failed:', error);
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#25D366]/90 active:bg-[#25D366]/80 transition-colors touch-manipulation min-h-[44px]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span className="hidden sm:inline">WhatsApp</span>
                  <span className="sm:hidden">Share</span>
                </button>
                
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/share', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          query: searchQuery, 
                          results: results 
                        })
                      });

                      if (!response.ok) throw new Error('Failed to create share');
                      
                      const { shareUrl } = await response.json();
                      const shareText = `🎁 Gift Recommendations for "${searchQuery}"\n\nI found these amazing gift ideas using GiftFNDR's AI recommendations:\n\n${shareUrl}`;
                      
                      // Direct email sharing - simple approach
                      const emailUrl = `mailto:?subject=${encodeURIComponent('Gift Recommendations from GiftFNDR')}&body=${encodeURIComponent(shareText)}`;
                      window.location.href = emailUrl;
                      
                      trackEvent.shareResults(searchQuery, results?.length || 0);
                    } catch (error) {
                      console.error('Share failed:', error);
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 active:bg-secondary/90 transition-colors touch-manipulation min-h-[44px]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Email</span>
                  <span className="sm:hidden">Share</span>
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted">
                  Share link expires in 7 days
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16">
          <NewsletterSignup />
        </div>

        <p className="mt-12 text-xs text-muted">
          As an Amazon Associate, we earn from qualifying purchases.
        </p>
      </div>
    </main>
  );
}


