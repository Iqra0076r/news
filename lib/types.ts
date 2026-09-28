export type ArticleStatus = 'draft' | 'review' | 'published' | 'updated' | 'unpublished' | 'rejected' | 'duplicate';

export type Article = {
  id: string;
  slug: string;
  headline: string;
  standfirst: string;
  body: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  modifiedAt: string;
  imageUrl: string;
  imageAlt: string;
  imageCredit?: string;
  featured?: boolean;
  breaking?: boolean;
  status: ArticleStatus;
  seoTitle: string;
  seoDescription: string;
  sourceFingerprint?: string;
  storyCluster?: string;
  provenance?: Record<string, unknown>;
};

export type FeedConfig = {
  id: string;
  url: string;
  category: string;
  language: string;
  imageReuseAllowed: boolean;
  publicAttributionRequired: boolean;
  enabled: boolean;
};

export type FeedItem = {
  guid: string;
  link: string;
  title: string;
  description: string;
  publishedAt: string;
  imageUrl?: string;
  sourceId: string;
  category: string;
  imageReuseAllowed: boolean;
  publicAttributionRequired: boolean;
};
