"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { NewsCard } from "@/components/news/news-card";
import {
  NewsCardSkeleton,
  GridSkeleton,
  ListSkeleton,
} from "@/components/news/skeleton-cards";
import type { NewsArticle, Category } from "@/types/news";

interface CategorySectionProps {
  category: Category;
  limit?: number;
  variant?: "grid" | "list";
  delay?: number;
}

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

export function CategorySection({
  category,
  limit = 4,
  variant = "grid",
  delay = 0,
}: CategorySectionProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [inView, setInView] = useState(delay === 0);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection observer for lazy loading
  useEffect(() => {
    if (delay === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [delay]);

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch(`/api/news/rss?category=${category}`);
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles.slice(0, limit));
      }
    } catch (err) {
      console.error(`Failed to fetch ${category} news:`, err);
    } finally {
      setLoading(false);
    }
  }, [category, limit]);

  // Initial fetch (with delay for lazy loading)
  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(fetchNews, delay);
    return () => clearTimeout(timer);
  }, [fetchNews, inView, delay]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    if (!inView) return;
    const timer = setInterval(() => {
      fetchNews();
    }, REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchNews, inView]);

  return (
    <section ref={sectionRef} className="animate-fade-in">
      {loading ? (
        variant === "grid" ? (
          <GridSkeleton count={limit} />
        ) : (
          <ListSkeleton count={limit} />
        )
      ) : articles.length > 0 ? (
        <div
          className={
            variant === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children"
              : "grid grid-cols-1 md:grid-cols-2 gap-0 stagger-children"
          }
        >
          {articles.map((article, index) => (
            <NewsCard
              key={article.id}
              article={article}
              variant={variant === "grid" ? "default" : "horizontal"}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No articles available at the moment. Please try again later.
        </div>
      )}
    </section>
  );
}

export function TrendingSidebar() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrending = useCallback(async () => {
    try {
      const res = await fetch("/api/news/rss?category=top-stories");
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles.slice(0, 8));
      }
    } catch {
      console.error("Failed to fetch trending");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    const timer = setTimeout(fetchTrending, 500);
    return () => clearTimeout(timer);
  }, [fetchTrending]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const timer = setInterval(fetchTrending, REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchTrending]);

  if (loading) {
    return (
      <div className="flex flex-col gap-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <NewsCardSkeleton key={i} variant="compact" />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Trending news will appear here
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {articles.map((article, index) => (
        <NewsCard
          key={article.id}
          article={article}
          variant="compact"
          index={index}
        />
      ))}
    </div>
  );
}
