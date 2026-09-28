import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://iqra0076r.github.io/news';
export const metadata: Metadata = {
  metadataBase: new URL(site), icons:{icon:"/news/favicon.svg"}, title: { default: 'BingNews — Clear news, built for now', template: '%s | BingNews' },
  description: 'Fast, clear and contextual reporting across world news, business, technology, sports, science and culture.',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  openGraph: { type: 'website', siteName: 'BingNews', title: 'BingNews', description: 'Fast, clear and contextual reporting.' }
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skipLink" href="#main">Skip to content</a><Header/><div id="main">{children}</div><Footer/></body></html>}

