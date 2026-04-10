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

export const metadata: Metadata = {
  title: "SaveitBro News — Live Breaking News",
  description:
    "Real-time news aggregated from trusted sources. Stay informed with breaking headlines, world news, business, technology, science, sport, and entertainment stories.",
  keywords: [
    "SaveitBro News",
    "breaking news",
    "world news",
    "UK news",
    "technology",
    "business",
    "sport",
    "science",
    "entertainment",
    "Asia news",
    "Middle East news",
    "Africa news",
  ],
  authors: [{ name: "SaveitBro News" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📰</text></svg>",
  },
  openGraph: {
    title: "SaveitBro News",
    description: "Your source for real-time breaking news",
    type: "website",
  },
};

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
