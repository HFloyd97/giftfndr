import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Gift Guides - Expert Gift Recommendations for Every Occasion | GiftFNDR",
  description: "Comprehensive gift guides for birthdays, Christmas, anniversaries, weddings, and more. Expert recommendations for every budget and personality.",
  keywords: "gift guides, birthday gift guide, christmas gift guide, anniversary gifts, wedding gifts, gift ideas by occasion",
  openGraph: {
    title: "Gift Guides - Expert Gift Recommendations for Every Occasion",
    description: "Comprehensive gift guides for birthdays, Christmas, anniversaries, weddings, and more.",
    url: 'https://giftfindr.vercel.app/gift-guides',
  },
};

const giftGuides = [
  {
    title: "Birthday Gift Guide",
    description: "Find the perfect birthday gift for anyone, from kids to adults",
    image: "🎂",
    slug: "birthday-gifts",
    categories: ["Kids", "Teens", "Adults", "Seniors"]
  },
  {
    title: "Christmas Gift Guide",
    description: "Holiday gift ideas that will make everyone smile",
    image: "🎄",
    slug: "christmas-gifts",
    categories: ["Family", "Friends", "Colleagues", "Kids"]
  },
  {
    title: "Anniversary Gift Guide",
    description: "Romantic and thoughtful gifts for your special someone",
    image: "💕",
    slug: "anniversary-gifts",
    categories: ["1st Year", "5th Year", "10th Year", "25th Year"]
  },
  {
    title: "Wedding Gift Guide",
    description: "Perfect wedding gifts for newlyweds",
    image: "💒",
    slug: "wedding-gifts",
    categories: ["Kitchen", "Home", "Luxury", "Practical"]
  },
  {
    title: "Valentine's Day Gift Guide",
    description: "Sweet and romantic gifts for your valentine",
    image: "💝",
    slug: "valentines-gifts",
    categories: ["Romantic", "Sweet", "Luxury", "Fun"]
  },
  {
    title: "Father's Day Gift Guide",
    description: "Show dad how much you care with these thoughtful gifts",
    image: "👨‍👧‍👦",
    slug: "fathers-day-gifts",
    categories: ["Tech", "Outdoor", "Hobbies", "Luxury"]
  },
  {
    title: "Mother's Day Gift Guide",
    description: "Beautiful gifts to celebrate the special women in your life",
    image: "👩‍👧‍👦",
    slug: "mothers-day-gifts",
    categories: ["Beauty", "Home", "Luxury", "Personal"]
  },
  {
    title: "Graduation Gift Guide",
    description: "Celebrate achievements with meaningful graduation gifts",
    image: "🎓",
    slug: "graduation-gifts",
    categories: ["High School", "College", "University", "Professional"]
  }
];

export default function GiftGuidesPage() {
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
              <Link href="/gift-guides" className="text-sm text-primary font-medium">
                Gift Guides
              </Link>
              <Link href="/blog" className="text-sm text-muted hover:text-foreground transition-colors">
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
            Gift Guides
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Expert gift recommendations for every occasion, budget, and personality. 
            Find the perfect gift with our comprehensive guides.
          </p>
        </div>

        {/* Gift Guides Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {giftGuides.map((guide) => (
            <div 
              key={guide.slug}
              className="group relative overflow-hidden rounded-2xl border border-border/30 bg-secondary/50 hover:border-primary/40 hover:bg-secondary/70 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="text-4xl mb-4">{guide.image}</div>
                <h2 className="text-xl font-semibold mb-3 text-foreground">
                  {guide.title}
                </h2>
                <p className="text-muted/70 mb-4 line-clamp-2">
                  {guide.description}
                </p>
                
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {guide.categories.map((category) => (
                    <span 
                      key={category}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  href={`/gift-guides/${guide.slug}`}
                  className="inline-flex items-center justify-center w-full rounded-lg bg-primary text-primary-foreground px-4 py-2 font-medium hover:bg-primary/90 transition-colors"
                >
                  View Guide
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* SEO Content - Redesigned */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Why Choose Our Gift Guides?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-secondary/30 rounded-2xl p-8 border border-border/30 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Expert Curation</h3>
              <p className="text-muted/80 leading-relaxed">
                Each gift guide is carefully curated by our team of gift-giving experts. We consider factors like 
                budget, personality, interests, and the relationship between the giver and recipient.
              </p>
            </div>
            
            <div className="bg-secondary/30 rounded-2xl p-8 border border-border/30 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Budget-Friendly Options</h3>
              <p className="text-muted/80 leading-relaxed">
                From affordable finds to luxury items, our guides include options for every budget. We believe 
                that thoughtful gifts don&apos;t have to break the bank.
              </p>
            </div>
            
            <div className="bg-secondary/30 rounded-2xl p-8 border border-border/30 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">AI-Powered Personalization</h3>
              <p className="text-muted/80 leading-relaxed">
                Our AI-powered gift finder takes into account the recipient&apos;s interests, hobbies, and preferences 
                to suggest truly personalized gifts.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
                      <h2 className="text-3xl font-bold mb-4">Can&apos;t Find What You&apos;re Looking For?</h2>
          <p className="text-muted mb-8">
            Use our AI-powered gift finder to get personalized recommendations for any occasion.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Find Perfect Gifts Now
          </Link>
        </div>
      </div>
    </main>
  );
}
