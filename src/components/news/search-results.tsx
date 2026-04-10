"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { useAppStore } from "@/store/news-store";
import { NewsCard } from "@/components/news/news-card";
import { GridSkeleton } from "@/components/news/skeleton-cards";
import type { NewsArticle } from "@/types/news";

export function SearchResults() {
  const { searchQuery } = useAppStore();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setArticles([]);
      setHasSearched(false);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    async function search() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/news/search?q=${encodeURIComponent(searchQuery)}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (data.success) {
          setArticles(data.articles);
        }
        setHasSearched(true);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Search error:", err);
        setHasSearched(true);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(search, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  return (
    <div>
      {/* Search Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10 text-red-600 dark:text-red-400">
          <Search className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Search News</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? (
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Searching for &quot;{searchQuery}&quot;...
              </span>
            ) : hasSearched ? (
              <>
                {articles.length} result
                {articles.length !== 1 ? "s" : ""} for &quot;{searchQuery}
                &quot;
              </>
            ) : (
              "Type to search news articles"
            )}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && <GridSkeleton count={6} />}

      {/* Results */}
      {!loading && hasSearched && articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {articles.map((article, index) => (
            <NewsCard key={article.id} article={article} index={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && hasSearched && articles.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            We couldn&apos;t find any articles matching &quot;{searchQuery}
            &quot;. Try different keywords or browse categories.
          </p>
        </motion.div>
      )}
    </div>
  );
}
