import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] filter">
            404
          </h1>
        </div>

        {/* Main Message */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-muted/80 leading-relaxed">
            The page you&apos;re looking for seems to have wandered off. 
            Don&apos;t worry, we&apos;ll help you find your way back to the perfect gifts!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
          
          <Link
            href="/gift-guides"
            className="inline-flex items-center justify-center px-8 py-4 bg-secondary/50 text-foreground rounded-xl font-semibold hover:bg-secondary/70 transition-all duration-300 hover:scale-105 border border-border/30 hover:border-primary/40"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Browse Gift Guides
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/blog"
            className="group bg-secondary/30 rounded-2xl p-6 border border-border/30 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
              Gift Blog
            </h3>
            <p className="text-sm text-muted/80">
              Read our latest gift-giving tips and trends
            </p>
          </Link>
          
          <Link
            href="/about"
            className="group bg-secondary/30 rounded-2xl p-6 border border-border/30 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="text-3xl mb-3">ℹ️</div>
            <h3 className="font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
              About Us
            </h3>
            <p className="text-sm text-muted/80">
              Learn more about GiftFNDR and our mission
            </p>
          </Link>
          
          <Link
            href="/"
            className="group bg-secondary/30 rounded-2xl p-6 border border-border/30 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="text-3xl mb-3">🎁</div>
            <h3 className="font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
              Find Gifts
            </h3>
            <p className="text-sm text-muted/80">
              Use our AI to find the perfect gift
            </p>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </main>
  );
}
