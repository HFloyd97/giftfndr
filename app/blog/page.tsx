import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Gift Giving Blog - Tips, Trends & Ideas | GiftFNDR",
  description: "Expert gift-giving advice, trending gift ideas, and helpful tips for choosing the perfect present. Stay updated with the latest gift trends and recommendations.",
  keywords: "gift giving tips, gift trends, gift ideas blog, how to choose gifts, gift giving advice",
  openGraph: {
    title: "Gift Giving Blog - Tips, Trends & Ideas",
    description: "Expert gift-giving advice, trending gift ideas, and helpful tips for choosing the perfect present.",
    url: 'https://giftfindr.vercel.app/blog',
  },
};

const blogPosts = [
  {
    title: "How to Choose the Perfect Gift: A Complete Guide",
    excerpt: "Master the art of gift-giving with our comprehensive guide. Learn how to consider personality, interests, and budget to find the ideal present.",
    slug: "how-to-choose-perfect-gift",
    category: "Gift Giving Tips",
    readTime: "5 min read",
    date: "2024-01-15",
    featured: true
  },
  {
    title: "Top 10 Trending Gifts for 2024",
    excerpt: "Discover the most popular and innovative gifts that are trending this year. From tech gadgets to sustainable options.",
    slug: "trending-gifts-2024",
    category: "Gift Trends",
    readTime: "4 min read",
    date: "2024-01-10"
  },
  {
    title: "Budget-Friendly Gift Ideas That Don't Look Cheap",
    excerpt: "Learn how to give thoughtful, impressive gifts without breaking the bank. Quality doesn't always mean expensive.",
    slug: "budget-friendly-gift-ideas",
    category: "Budget Tips",
    readTime: "6 min read",
    date: "2024-01-08"
  },
  {
    title: "The Psychology of Gift Giving: Why We Give and Receive",
    excerpt: "Explore the fascinating psychology behind gift-giving and how it affects our relationships and emotional well-being.",
    slug: "psychology-of-gift-giving",
    category: "Psychology",
    readTime: "7 min read",
    date: "2024-01-05"
  },
  {
    title: "Eco-Friendly Gift Ideas for the Environmentally Conscious",
    excerpt: "Sustainable gift options that are good for the planet and still thoughtful and meaningful for your loved ones.",
    slug: "eco-friendly-gift-ideas",
    category: "Sustainable Gifts",
    readTime: "5 min read",
    date: "2024-01-03"
  },
  {
    title: "Last-Minute Gift Ideas That Still Feel Thoughtful",
    excerpt: "Don't panic! Here are quick gift solutions that show you care, even when you're short on time.",
    slug: "last-minute-gift-ideas",
    category: "Quick Tips",
    readTime: "3 min read",
    date: "2024-01-01"
  }
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <div className="border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              GiftFNDR
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/gift-guides" className="text-sm text-muted hover:text-foreground transition-colors">
                Gift Guides
              </Link>
              <Link href="/blog" className="text-sm text-primary font-medium">
                Blog
              </Link>
              <Link href="/about" className="text-sm text-muted hover:text-foreground transition-colors">
                About
              </Link>
            </div>
          </nav>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
            Gift Giving Blog
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Expert advice, trending gift ideas, and helpful tips to make your gift-giving 
            more meaningful and successful.
          </p>
        </div>

        {/* Featured Post */}
        {blogPosts.filter(post => post.featured).map((post) => (
          <div key={post.slug} className="mb-16">
            <div className="bg-secondary/30 rounded-2xl p-8 border border-border/30">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
                  {post.category}
                </span>
                <span className="text-sm text-muted">{post.readTime}</span>
                <span className="text-sm text-muted">{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                {post.title}
              </h2>
              <p className="text-lg text-muted/80 mb-6">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Read Full Article
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))}

        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.filter(post => !post.featured).map((post) => (
            <article 
              key={post.slug}
              className="group relative overflow-hidden rounded-2xl border border-border/30 bg-secondary/50 hover:border-primary/40 hover:bg-secondary/70 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted">{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-muted/70 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary hover:text-primary/80 font-medium text-sm"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* SEO Content - Redesigned */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            About Our Gift Giving Blog
          </h2>
          
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg text-muted/80 text-center leading-relaxed">
              Welcome to the GiftFNDR blog, your go-to resource for all things gift-giving. Our team of 
              gift experts and psychologists share their knowledge to help you become a better gift giver.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-secondary/30 rounded-2xl p-8 border border-border/30">
              <h3 className="text-xl font-semibold mb-6 text-foreground">What You'll Find Here</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="text-primary text-lg">💡</div>
                  <div>
                    <strong className="text-foreground">Gift Giving Tips:</strong>
                    <p className="text-muted/80 text-sm mt-1">Learn the fundamentals of choosing thoughtful gifts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-primary text-lg">🔥</div>
                  <div>
                    <strong className="text-foreground">Trending Gift Ideas:</strong>
                    <p className="text-muted/80 text-sm mt-1">Stay updated with the latest gift trends and innovations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-primary text-lg">💰</div>
                  <div>
                    <strong className="text-foreground">Budget-Friendly Options:</strong>
                    <p className="text-muted/80 text-sm mt-1">Discover quality gifts at every price point</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-primary text-lg">🧠</div>
                  <div>
                    <strong className="text-foreground">Psychology Insights:</strong>
                    <p className="text-muted/80 text-sm mt-1">Understand the science behind gift-giving</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-primary text-lg">🌱</div>
                  <div>
                    <strong className="text-foreground">Sustainable Choices:</strong>
                    <p className="text-muted/80 text-sm mt-1">Eco-friendly gift options for conscious consumers</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary/30 rounded-2xl p-8 border border-border/30">
              <h3 className="text-xl font-semibold mb-6 text-foreground">Why Trust Our Advice?</h3>
              <p className="text-muted/80 leading-relaxed mb-6">
                Our blog combines years of gift-giving expertise with psychological research and current trends. 
                We understand that giving the perfect gift is both an art and a science.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted/80">Expert-curated content</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted/80">Research-backed insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted/80">Practical, actionable advice</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted/80">Regularly updated content</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-primary/5 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-muted mb-6">
            Get the latest gift-giving tips and trends delivered to your inbox.
          </p>
          <div className="flex max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-border/50 bg-background text-foreground placeholder:text-muted/70"
            />
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find the Perfect Gift?</h2>
          <p className="text-muted mb-8">
            Put our tips into practice with our AI-powered gift finder.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Start Finding Gifts
          </Link>
        </div>
      </div>
    </main>
  );
}
