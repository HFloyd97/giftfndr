import { track } from '@vercel/analytics';

// Custom event tracking for GiftFNDR
export const trackEvent = {
  // Search events
  search: (query: string, method: 'quick' | 'popular' | 'category' | 'suggestion') => {
    track('search', { query, method });
  },

  // Gift selection events
  giftClick: (giftTitle: string, category: string, price: number) => {
    track('gift_click', { giftTitle, category, price });
  },

  // Share events
  shareResults: (query: string, resultCount: number) => {
    track('share_results', { query, resultCount });
  },

  // Theme changes
  themeChange: (theme: 'dark' | 'light' | 'blue') => {
    track('theme_change', { theme });
  },

  // Page views (custom)
  pageView: (page: string) => {
    track('page_view', { page });
  },

  // Load more results
  loadMore: (currentCount: number, newCount: number) => {
    track('load_more', { currentCount, newCount });
  },

           // Error tracking
         error: (error: string, context: string) => {
           track('error', { error, context });
         },

         // Newsletter tracking
         newsletterSignup: (email: string) => {
           track('newsletter_signup', { email: email.substring(0, 3) + '***' });
         },

         newsletterSignupSuccess: (email: string) => {
           track('newsletter_signup_success', { email: email.substring(0, 3) + '***' });
         }
};
