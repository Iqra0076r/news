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
  | "general"
  | "world"
  | "technology"
  | "business"
  | "sports"
  | "health"
  | "entertainment"
  | "science";

export type AppView = "home" | "search" | "category" | "article" | "bookmarks";

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

export const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: "general", label: "Top Stories", icon: "Newspaper" },
  { value: "world", label: "World", icon: "Globe" },
  { value: "technology", label: "Technology", icon: "Cpu" },
  { value: "business", label: "Business", icon: "TrendingUp" },
  { value: "sports", label: "Sports", icon: "Trophy" },
  { value: "health", label: "Health", icon: "Heart" },
  { value: "entertainment", label: "Entertainment", icon: "Film" },
  { value: "science", label: "Science", icon: "Atom" },
];

export const CATEGORY_QUERIES: Record<Category, string> = {
  general: "breaking news today latest headlines",
  world: "world news international today",
  technology: "technology news latest today",
  business: "business news finance economy today",
  sports: "sports news latest today",
  health: "health news medical breakthroughs today",
  entertainment: "entertainment news movies music today",
  science: "science news space discovery today",
};
