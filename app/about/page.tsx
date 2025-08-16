import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "About GiftFNDR - AI-Powered Gift Recommendations | Our Story",
  description: "Learn about GiftFNDR's mission to revolutionize gift-giving with AI technology. Discover how we help people find perfect gifts for every occasion.",
  keywords: "about GiftFNDR, gift recommendation company, AI gift finder, our story, gift giving technology",
  openGraph: {
    title: "About GiftFNDR - AI-Powered Gift Recommendations",
    description: "Learn about GiftFNDR's mission to revolutionize gift-giving with AI technology.",
    url: 'https://giftfindr.vercel.app/about',
  },
};

export default function AboutPage() {
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
              <Link href="/blog" className="text-sm text-muted hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-sm text-primary font-medium">
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
            About GiftFNDR
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Revolutionizing gift-giving with AI technology to help you find the perfect present 
            for every occasion and person in your life.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted/80 mb-6">
                We believe that giving the perfect gift should be effortless, not stressful. 
                Our mission is to eliminate the anxiety and uncertainty that often comes with 
                gift shopping by providing intelligent, personalized recommendations.
              </p>
              <p className="text-lg text-muted/80 mb-6">
                Using cutting-edge AI technology, we analyze personality traits, interests, 
                relationships, and occasions to suggest gifts that truly resonate with both 
                the giver and the recipient.
              </p>
              <p className="text-lg text-muted/80">
                Whether you&apos;re shopping for a birthday, anniversary, holiday, or just because, 
                GiftFNDR helps you find thoughtful, meaningful gifts that strengthen relationships 
                and create lasting memories.
              </p>
            </div>
            <div className="bg-secondary/30 rounded-2xl p-8 border border-border/30">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold mb-4">Why We Started</h3>
              <p className="text-muted/80">
                GiftFNDR was born from the frustration of countless hours spent searching for 
                the perfect gift, only to end up with something generic or last-minute. We 
                wanted to create a solution that makes gift-giving thoughtful, personal, and enjoyable.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">What Makes Us Different</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Intelligence</h3>
              <p className="text-muted/80">
                Our advanced AI analyzes multiple factors to provide truly personalized 
                gift recommendations that match the recipient&apos;s personality and interests.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-3">Expert Curation</h3>
              <p className="text-muted/80">
                Every recommendation is carefully curated by our team of gift-giving 
                experts who understand the psychology behind meaningful presents.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">Instant Results</h3>
              <p className="text-muted/80">
                Get personalized gift suggestions in seconds, not hours. No more endless 
                scrolling or second-guessing your choices.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-secondary/30 rounded-xl p-6 border border-border/30">
              <h3 className="font-semibold mb-2">Thoughtfulness</h3>
              <p className="text-sm text-muted/80">
                We believe every gift should be meaningful and personal.
              </p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-6 border border-border/30">
              <h3 className="font-semibold mb-2">Innovation</h3>
              <p className="text-sm text-muted/80">
                We continuously improve our AI technology to provide better recommendations.
              </p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-6 border border-border/30">
              <h3 className="font-semibold mb-2">Accessibility</h3>
              <p className="text-sm text-muted/80">
                Great gift-giving should be available to everyone, regardless of budget.
              </p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-6 border border-border/30">
              <h3 className="font-semibold mb-2">Trust</h3>
              <p className="text-sm text-muted/80">
                We build lasting relationships through reliable, honest recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👨‍💻</span>
              </div>
              <h3 className="font-semibold mb-2">AI Engineers</h3>
              <p className="text-sm text-muted/80">
                Building intelligent algorithms that understand human preferences and relationships.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">Gift Experts</h3>
              <p className="text-sm text-muted/80">
                Curating the best gift recommendations based on psychology and trends.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="font-semibold mb-2">Customer Success</h3>
              <p className="text-sm text-muted/80">
                Ensuring every user finds the perfect gift and has an amazing experience.
              </p>
            </div>
          </div>
        </div>

        {/* SEO Content - Redesigned */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            How GiftFNDR Works
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="bg-secondary/30 rounded-2xl p-8 border border-border/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">🤖</div>
                  <h3 className="text-xl font-semibold text-foreground">AI-Powered Intelligence</h3>
                </div>
                <p className="text-muted/80 leading-relaxed">
                  Our platform analyzes various factors including the recipient&apos;s interests, personality traits, 
                  the relationship between giver and recipient, the occasion, and budget constraints.
                </p>
              </div>
              
              <div className="bg-secondary/30 rounded-2xl p-8 border border-border/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">🔬</div>
                  <h3 className="text-xl font-semibold text-foreground">Advanced Technology</h3>
                </div>
                <p className="text-muted/80 leading-relaxed">
                  We use advanced machine learning algorithms trained on thousands of successful 
                  gift-giving scenarios. Our AI understands the nuances of different relationships, 
                  occasions, and personal preferences.
                </p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="bg-secondary/30 rounded-2xl p-8 border border-border/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">✅</div>
                  <h3 className="text-xl font-semibold text-foreground">Quality Assurance</h3>
                </div>
                <p className="text-muted/80 leading-relaxed">
                  Every gift recommendation is reviewed by our team of gift-giving experts to ensure 
                  quality and relevance. We maintain partnerships with trusted retailers.
                </p>
              </div>
              
              <div className="bg-secondary/30 rounded-2xl p-8 border border-border/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">📈</div>
                  <h3 className="text-xl font-semibold text-foreground">Continuous Improvement</h3>
                </div>
                <p className="text-muted/80 leading-relaxed">
                  We&apos;re constantly learning from user feedback and gift-giving outcomes to improve 
                  our recommendations. Our AI gets smarter with every interaction.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Better Gift-Giving?</h2>
          <p className="text-muted mb-8">
            Join thousands of users who have discovered the joy of giving perfect gifts.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Start Finding Perfect Gifts
          </Link>
        </div>
      </div>
    </main>
  );
}
