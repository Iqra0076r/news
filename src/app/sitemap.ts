import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://saveitbro.com";

const categories = [
  { slug: "top-stories", priority: 1.0, changeFrequency: "always" as const },
  { slug: "world", priority: 0.9, changeFrequency: "hourly" as const },
  { slug: "uk", priority: 0.9, changeFrequency: "hourly" as const },
  { slug: "asia", priority: 0.9, changeFrequency: "hourly" as const },
  { slug: "middle-east", priority: 0.9, changeFrequency: "hourly" as const },
  { slug: "africa", priority: 0.9, changeFrequency: "hourly" as const },
  { slug: "business", priority: 0.9, changeFrequency: "hourly" as const },
  { slug: "technology", priority: 0.9, changeFrequency: "hourly" as const },
  { slug: "science", priority: 0.9, changeFrequency: "hourly" as const },
  { slug: "sport", priority: 0.9, changeFrequency: "hourly" as const },
  { slug: "football", priority: 0.9, changeFrequency: "hourly" as const },
  { slug: "cricket", priority: 0.9, changeFrequency: "hourly" as const },
  { slug: "entertainment", priority: 0.9, changeFrequency: "hourly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const homeEntry = {
    url: SITE_URL,
    lastModified: now,
    changeFrequency: "always" as const,
    priority: 1.0,
  };

  const categoryEntries = categories.map((cat) => ({
    url: `${SITE_URL}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: cat.changeFrequency,
    priority: cat.priority,
  }));

  return [homeEntry, ...categoryEntries];
}
