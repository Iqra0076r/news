export const dynamic='force-static';
import type { MetadataRoute } from 'next';export default function robots():MetadataRoute.Robots{const site=process.env.NEXT_PUBLIC_SITE_URL||'https://iqra0076r.github.io/news';return {rules:[{userAgent:'*',allow:'/',disallow:['/admin','/api/']}],sitemap:[`${site}/sitemap.xml`,`${site}/news-sitemap.xml`]}}

