import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://saveitbro.com";

const SITE_NAME = "SaveitBro News";

const SITE_DESCRIPTION =
  "Real-time news aggregated from trusted sources. Stay informed with breaking headlines, world news, business, technology, science, sport, and entertainment stories.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} — Live Breaking News`,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,

  keywords: [
    // Brand
    "SaveitBro News",
    "SaveitBro",
    "live news",
    "breaking news",
    // Categories — all 13
    "top stories",
    "world news",
    "UK news",
    "Asia news",
    "Middle East news",
    "Africa news",
    "business news",
    "technology news",
    "science news",
    "sport news",
    "football news",
    "cricket news",
    "entertainment news",
    // General discoverability
    "current events",
    "headline news",
    "news aggregator",
    "real-time headlines",
    "latest news updates",
    "today's news",
    "daily news",
    "global news",
    "international news",
  ],

  authors: [{ name: SITE_NAME, url: SITE_URL }],

  creator: SITE_NAME,

  publisher: SITE_NAME,

  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: `${SITE_NAME} — Live Breaking News`,
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    url: SITE_URL,
  },

  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Live Breaking News`,
    description: SITE_DESCRIPTION,
  },

  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📰</text></svg>",
  },

  category: "news",

  classification: "news",
};

/* ------------------------------------------------------------------ */
/*  JSON-LD Structured Data                                           */
/* ------------------------------------------------------------------ */

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  sameAs: [
    "https://twitter.com/saveitbro",
    "https://www.facebook.com/saveitbro",
    "https://www.instagram.com/saveitbro",
    "https://www.linkedin.com/company/saveitbro",
  ],
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  publisher: {
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

/* ------------------------------------------------------------------ */
/*  Root Layout                                                       */
/* ------------------------------------------------------------------ */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {/* JSON-LD: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdOrganization),
          }}
        />

        {/* JSON-LD: WebSite with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdWebSite),
          }}
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
