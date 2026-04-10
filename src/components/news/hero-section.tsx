"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/news-store";
import { formatTimeAgo } from "@/lib/helpers";
import { HeroSkeleton } from "@/components/news/skeleton-cards";
import type { NewsArticle } from "@/types/news";

export function HeroSection() {
  const { selectArticle, toggleBookmark, isBookmarked } = useAppStore();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch("/api/news?category=general");
        const data = await res.json();
        if (data.success && data.articles.length > 0) {
          setArticles(data.articles.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch trending:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);

  // Auto-rotate hero
  useEffect(() => {
    if (articles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [articles.length]);

  if (loading) return <HeroSkeleton />;

  if (articles.length === 0) return null;

  const featured = articles[currentIndex];
  const bookmarked = isBookmarked(featured.id);

  return (
    <section className="relative">
      <AnimatePresence mode="wait">
        <motion.article
          key={featured.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => selectArticle(featured)}
          className="group cursor-pointer relative rounded-2xl overflow-hidden bg-card border border-border/50 card-hover"
        >
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[400px] lg:min-h-[500px] overflow-hidden">
              <Image
                src={featured.image || "/api/placeholder"}
                alt={featured.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden" />

              {/* Overlay content on mobile */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:hidden">
                <Badge className="bg-primary/90 text-primary-foreground border-0 text-[10px] font-medium mb-2">
                  Featured
                </Badge>
                <h2 className="text-xl font-bold text-white leading-tight line-clamp-2">
                  {featured.title}
                </h2>
              </div>
            </div>

            {/* Content (desktop) */}
            <div className="hidden md:flex flex-col justify-center p-8 lg:p-10 gap-4 relative">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground text-xs font-medium">
                  Featured
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {featured.source}
                </Badge>
              </div>

              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight group-hover:text-primary transition-colors">
                {featured.title}
              </h2>

              <p className="text-muted-foreground leading-relaxed line-clamp-3">
                {featured.description}
              </p>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatTimeAgo(featured.publishedAt)}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button className="rounded-xl gap-2">
                  Read Full Story
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(featured.id);
                  }}
                >
                  {bookmarked ? (
                    <BookmarkCheck className="h-4 w-4 text-primary" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.article>
      </AnimatePresence>

      {/* Hero indicators */}
      {articles.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {articles.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-8 bg-primary"
                  : "w-1.5 bg-muted-foreground/20 hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
