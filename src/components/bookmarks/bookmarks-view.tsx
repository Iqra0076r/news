"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Trash2, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/news-store";
import { formatTimeAgo, cn } from "@/lib/helpers";
import { NewsCardSkeleton } from "@/components/news/skeleton-cards";
import type { NewsArticle } from "@/types/news";

export function BookmarksView() {
  const { bookmarks, toggleBookmark, selectArticle } = useAppStore();
  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved articles from localStorage
  useEffect(() => {
    async function loadSavedArticles() {
      try {
        const saved = localStorage.getItem("pulse-news-bookmarks-data");
        if (saved) {
          const parsed = JSON.parse(saved) as NewsArticle[];
          setSavedArticles(parsed.filter((a) => bookmarks.includes(a.id)));
        }
      } catch {
        console.error("Failed to load saved articles");
      } finally {
        setLoading(false);
      }
    }
    loadSavedArticles();
  }, [bookmarks]);

  const handleRemove = (articleId: string) => {
    toggleBookmark(articleId);
    // Also remove from localStorage data
    try {
      const saved = localStorage.getItem("pulse-news-bookmarks-data");
      if (saved) {
        const parsed = JSON.parse(saved) as NewsArticle[];
        const filtered = parsed.filter((a) => a.id !== articleId);
        localStorage.setItem("pulse-news-bookmarks-data", JSON.stringify(filtered));
        setSavedArticles((prev) => prev.filter((a) => a.id !== articleId));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bookmark className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Saved Articles</h1>
          <p className="text-sm text-muted-foreground">
            {savedArticles.length} article{savedArticles.length !== 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <NewsCardSkeleton key={i} variant="horizontal" />
          ))}
        </div>
      )}

      {/* Bookmarked Articles */}
      {!loading && savedArticles.length > 0 && (
        <div className="flex flex-col">
          <AnimatePresence>
            {savedArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group flex gap-4 p-3 -mx-3 rounded-xl hover:bg-muted/50 transition-colors border-b border-border/20 last:border-0"
              >
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => selectArticle(article)}>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-[10px] font-medium">
                      {article.source}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(article.publishedAt)}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {article.description}
                  </p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemove(article.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary"
                    asChild
                  >
                    <a href={article.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!loading && savedArticles.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Bookmark className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No saved articles</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Articles you bookmark will appear here. Click the bookmark icon on any article to save it for later.
          </p>
        </motion.div>
      )}
    </div>
  );
}

// Hook to save article data when bookmarking
export function useBookmarkPersistence() {
  const { bookmarks, toggleBookmark: storeToggle } = useAppStore();

  const toggleBookmark = (article: NewsArticle) => {
    const isCurrentlyBookmarked = bookmarks.includes(article.id);

    // Save/remove article data in localStorage
    try {
      const saved = localStorage.getItem("pulse-news-bookmarks-data");
      const existing = saved ? (JSON.parse(saved) as NewsArticle[]) : [];

      if (isCurrentlyBookmarked) {
        const filtered = existing.filter((a) => a.id !== article.id);
        localStorage.setItem("pulse-news-bookmarks-data", JSON.stringify(filtered));
      } else {
        const exists = existing.find((a) => a.id === article.id);
        if (!exists) {
          existing.push(article);
          localStorage.setItem("pulse-news-bookmarks-data", JSON.stringify(existing));
        }
      }
    } catch {
      // ignore
    }

    storeToggle(article.id);
  };

  return { toggleBookmark };
}
