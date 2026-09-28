import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const metadata: Metadata = {
  metadataBase: new URL(site), title: { default: 'Atlas Newsroom — Clear news, built for now', template: '%s | Atlas Newsroom' },
  description: 'Fast, clear and contextual reporting across world news, business, technology, sports, science and culture.',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  openGraph: { type: 'website', siteName: 'Atlas Newsroom', title: 'Atlas Newsroom', description: 'Fast, clear and contextual reporting.' }
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Header/>{children}<Footer/></body></html>}
