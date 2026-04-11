export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  source: string;
  sourceIcon: string | null;
  publishedAt: string;
  category: string;
  author?: string;
}

export interface NewsResponse {
  success: boolean;
  articles: NewsArticle[];
  totalResults: number;
  query?: string;
  category?: string;
}

export type Category =
  | "top-stories"
  | "world"
  | "uk"
  | "asia"
  | "middle-east"
  | "africa"
  | "business"
  | "technology"
  | "science"
  | "sport"
  | "football"
  | "cricket"
  | "entertainment";

export type AppView = "home" | "search" | "category" | "article" | "bookmarks" | "about" | "contact" | "privacy" | "terms";

export interface AppState {
  currentView: AppView;
  selectedArticle: NewsArticle | null;
  selectedCategory: Category;
  searchQuery: string;
  bookmarks: string[];
  isLoading: boolean;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;

  setView: (view: AppView) => void;
  selectArticle: (article: NewsArticle) => void;
  setCategory: (category: Category) => void;
  setSearchQuery: (query: string) => void;
  toggleBookmark: (articleId: string) => void;
  isBookmarked: (articleId: string) => boolean;
  setLoading: (loading: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  clearArticle: () => void;
}

export const RSS_FEEDS: Record<Category, string> = {
  "top-stories": "http://feeds.bbci.co.uk/news/rss.xml",
  world: "http://feeds.bbci.co.uk/news/world/rss.xml",
  uk: "http://feeds.bbci.co.uk/news/uk/rss.xml",
  asia: "http://feeds.bbci.co.uk/news/world/asia/rss.xml",
  "middle-east": "http://feeds.bbci.co.uk/news/world/middle_east/rss.xml",
  africa: "http://feeds.bbci.co.uk/news/world/africa/rss.xml",
  business: "http://feeds.bbci.co.uk/news/business/rss.xml",
  technology: "http://feeds.bbci.co.uk/news/technology/rss.xml",
  science: "http://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
  sport: "http://feeds.bbci.co.uk/sport/rss.xml",
  football: "http://feeds.bbci.co.uk/sport/football/rss.xml",
  cricket: "http://feeds.bbci.co.uk/sport/cricket/rss.xml",
  entertainment: "http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
};

export const CATEGORY_META: Record<Category, { label: string; section: string }> = {
  "top-stories": { label: "Top Stories", section: "news" },
  world: { label: "World", section: "news" },
  uk: { label: "UK", section: "news" },
  asia: { label: "Asia", section: "news" },
  "middle-east": { label: "Middle East", section: "news" },
  africa: { label: "Africa", section: "news" },
  business: { label: "Business", section: "news" },
  technology: { label: "Technology", section: "news" },
  science: { label: "Science & Environment", section: "news" },
  sport: { label: "Sport", section: "sport" },
  football: { label: "Football", section: "sport" },
  cricket: { label: "Cricket", section: "sport" },
  entertainment: { label: "Entertainment & Arts", section: "entertainment" },
};

export const NEWS_CATEGORIES: Category[] = [
  "top-stories",
  "world",
  "uk",
  "asia",
  "middle-east",
  "africa",
  "business",
  "technology",
  "science",
  "entertainment",
];

export const SPORT_CATEGORIES: Category[] = [
  "sport",
  "football",
  "cricket",
];
