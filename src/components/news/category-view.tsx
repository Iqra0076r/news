"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsCard } from "@/components/news/news-card";
import { GridSkeleton } from "@/components/news/skeleton-cards";
import { useAppStore } from "@/store/news-store";
import { CATEGORY_META } from "@/types/news";
import type { NewsArticle, Category } from "@/types/news";

export function CategoryView() {
  const { selectedCategory } = useAppStore();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategoryNews = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch(
        `/api/news/rss?category=${encodeURIComponent(selectedCategory)}`
      );
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.error("Failed to fetch category news:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategoryNews();
  }, [selectedCategory]);

  const meta = CATEGORY_META[selectedCategory as Category];
  const label = meta?.label || selectedCategory;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10 text-red-600 dark:text-red-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{label}</h1>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${articles.length} articles from BBC`}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-lg"
          onClick={() => fetchCategoryNews(true)}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Loading */}
      {loading && <GridSkeleton count={6} />}

      {/* Articles */}
      {!loading && articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {articles.map((article, index) => (
            <NewsCard key={article.id} article={article} index={index} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && articles.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No articles found</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Couldn&apos;t load articles for this category. Please try again later.
          </p>
        </motion.div>
      )}
    </div>
  );
}
