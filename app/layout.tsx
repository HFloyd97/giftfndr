import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GiftFNDR - AI-Powered Gift Recommendations | Find Perfect Gifts Instantly",
  description: "Discover the perfect gift with AI-powered recommendations. Get personalized gift suggestions for any occasion, person, or budget. Instant Amazon affiliate links included.",
  keywords: "gift finder, gift recommendations, AI gifts, personalized gifts, gift ideas, birthday gifts, christmas gifts, anniversary gifts, amazon gifts",
  authors: [{ name: "GiftFNDR" }],
  creator: "GiftFNDR",
  publisher: "GiftFNDR",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://giftfindr.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "GiftFNDR - AI-Powered Gift Recommendations",
    description: "Find the perfect gift instantly with AI-powered recommendations. Personalized suggestions for any occasion, person, or budget.",
    url: 'https://giftfindr.vercel.app',
    siteName: 'GiftFNDR',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GiftFNDR - AI Gift Recommendations',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "GiftFNDR - AI-Powered Gift Recommendations",
    description: "Find the perfect gift instantly with AI-powered recommendations. Personalized suggestions for any occasion, person, or budget.",
    images: ['/og-image.png'],
    creator: '@giftfindr',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "GiftFNDR",
              "description": "AI-powered gift recommendation platform",
              "url": "https://giftfindr.vercel.app",
              "applicationCategory": "ShoppingApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "GiftFNDR"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
