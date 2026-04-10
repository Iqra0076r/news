"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/news-store";
import { formatTimeAgo } from "@/lib/helpers";
import { HeroSkeleton } from "@/components/news/skeleton-cards";
import type { NewsArticle } from "@/types/news";
import { cn } from "@/lib/utils";

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
const AUTO_ROTATE_INTERVAL = 6000; // 6 seconds

export function HeroSection() {
  const { selectArticle, toggleBookmark, isBookmarked } = useAppStore();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval>>();

  const fetchTopStories = useCallback(async (useCache: boolean = true) => {
    try {
      const cacheParam = useCache ? "" : "&nocache=true";
      const res = await fetch(`/api/news/rss?category=top-stories${cacheParam}`);
      const data = await res.json();
      if (data.success && data.articles.length > 0) {
        const withImages = data.articles.filter(
          (a: NewsArticle) => a.image && a.image.length > 0
        );
        if (withImages.length > 0) {
          setArticles((prev) => {
            if (!useCache && prev.length > 0) {
              const mergedMap = new Map<string, NewsArticle>();
              withImages.forEach((a: NewsArticle) => mergedMap.set(a.id, a));
              prev.forEach((a) => {
                if (!mergedMap.has(a.id)) mergedMap.set(a.id, a);
              });
              const merged = Array.from(mergedMap.values());
              merged.sort(
                (a, b) =>
                  new Date(b.publishedAt).getTime() -
                  new Date(a.publishedAt).getTime()
              );
              return merged.slice(0, 8);
            }
            return withImages.slice(0, 8);
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch top stories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTopStories(true);
  }, [fetchTopStories]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    refreshTimerRef.current = setInterval(() => {
      fetchTopStories(false);
    }, REFRESH_INTERVAL);

    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [fetchTopStories]);

  // Auto-rotate hero
  useEffect(() => {
    if (articles.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, AUTO_ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, [articles.length, isPaused]);

  // Reset index when top article changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [articles.length > 0 ? articles[0]?.id : ""]);

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  }, [articles.length]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  }, [articles.length]);

  if (loading) return <HeroSkeleton />;

  if (articles.length === 0) return null;

  const featured = articles[currentIndex];
  const bookmarked = isBookmarked(featured.id);

  // Check if article is "hot" (published within last 3 hours)
  const isHot = (Date.now() - new Date(featured.publishedAt).getTime()) < 3 * 60 * 60 * 1000;

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const saved = localStorage.getItem("saveitbro-news-bookmarks-data");
      const existing = saved ? (JSON.parse(saved) as NewsArticle[]) : [];
      if (bookmarked) {
        const filtered = existing.filter((a) => a.id !== featured.id);
        localStorage.setItem(
          "saveitbro-news-bookmarks-data",
          JSON.stringify(filtered)
        );
      } else {
        const exists = existing.find((a) => a.id === featured.id);
        if (!exists) {
          existing.push(featured);
          localStorage.setItem(
            "saveitbro-news-bookmarks-data",
            JSON.stringify(existing)
          );
        }
      }
    } catch {
      // ignore
    }
    toggleBookmark(featured.id);
  };

  const imageVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.08,
      x: dir > 0 ? 40 : -40,
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 0.95,
      x: dir > 0 ? -40 : 40,
    }),
  };

  const textVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      y: 30,
      x: dir > 0 ? 20 : -20,
    }),
    center: {
      opacity: 1,
      y: 0,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      y: -20,
      x: dir > 0 ? -20 : 20,
    }),
  };

  return (
    <section
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full h-[350px] sm:h-[420px] md:h-[500px] lg:h-[560px] xl:h-[600px] overflow-hidden bg-black">
        {/* Animated Image Background */}
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={featured.id}
            custom={direction}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              opacity: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
              scale: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
              x: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
            }}
            className="absolute inset-0"
          >
            <Image
              src={featured.image!}
              alt={featured.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
              unoptimized
              quality={90}
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.3)_100%)]" />

        {/* Clickable area */}
        <motion.article
          key={`click-${featured.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onClick={() => selectArticle(featured)}
          className="absolute inset-0 cursor-pointer z-10"
          aria-label={`Read: ${featured.title}`}
        />

        {/* Text Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pb-8 sm:pb-10 md:pb-12 lg:pb-14">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={featured.id}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  opacity: { duration: 0.5, delay: 0.1 },
                  y: { duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
                  x: { duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
                }}
                className="max-w-3xl lg:max-w-4xl pointer-events-auto"
              >
                {/* Badge + Time */}
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  {isHot && (
                    <Badge className="bg-red-600 text-white border-0 text-[10px] sm:text-xs font-semibold uppercase tracking-wider gap-1 animate-pulse">
                      <Flame className="h-3 w-3" />
                      Breaking
                    </Badge>
                  )}
                  {!isHot && (
                    <Badge className="bg-white/15 backdrop-blur-md text-white border-white/20 text-[10px] sm:text-xs font-semibold uppercase tracking-wider hover:bg-white/25 transition-colors">
                      {featured.source}
                    </Badge>
                  )}
                  <span className="flex items-center gap-1.5 text-white/60 text-[11px] sm:text-xs font-medium">
                    <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    {formatTimeAgo(featured.publishedAt)}
                  </span>
                </div>

                {/* Headline */}
                <h1
                  className="text-white font-extrabold leading-[1.08] tracking-tight cursor-pointer
                    text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl
                    [text-shadow:0_2px_20px_rgba(0,0,0,0.5),0_1px_4px_rgba(0,0,0,0.4)]
                    hover:[text-shadow:0_2px_24px_rgba(0,0,0,0.7),0_1px_6px_rgba(0,0,0,0.5)]
                    transition-all duration-300"
                >
                  {featured.title}
                </h1>

                {/* Description */}
                <p className="hidden sm:block mt-3 sm:mt-4 text-white/70 text-sm sm:text-base lg:text-lg leading-relaxed line-clamp-2 max-w-2xl lg:max-w-3xl [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
                  {featured.description}
                </p>

                {/* Action buttons */}
                <div className="flex items-center gap-3 mt-5 sm:mt-6 pointer-events-auto">
                  <Button
                    className="rounded-full gap-2 bg-white text-black hover:bg-white/90 font-semibold text-xs sm:text-sm px-4 sm:px-5 h-9 sm:h-10 shadow-lg shadow-black/20 transition-all duration-200 hover:shadow-xl hover:shadow-black/30 hover:scale-[1.03] active:scale-[0.98]"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectArticle(featured);
                    }}
                  >
                    Read Story
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-9 w-9 sm:h-10 sm:w-10 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white hover:border-white/40 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg shadow-black/10"
                    onClick={handleBookmark}
                  >
                    {bookmarked ? (
                      <BookmarkCheck className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                    ) : (
                      <Bookmark className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                    )}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Arrows */}
        {articles.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-30
                w-10 h-10 sm:w-11 sm:h-11 rounded-full
                bg-black/20 backdrop-blur-md border border-white/10
                text-white/80 hover:text-white hover:bg-black/40 hover:border-white/30
                flex items-center justify-center
                transition-all duration-200 hover:scale-110 active:scale-95
                [opacity:0] hover:[opacity:1] focus:[opacity:1]
                shadow-lg shadow-black/20"
              aria-label="Previous story"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-30
                w-10 h-10 sm:w-11 sm:h-11 rounded-full
                bg-black/20 backdrop-blur-md border border-white/10
                text-white/80 hover:text-white hover:bg-black/40 hover:border-white/30
                flex items-center justify-center
                transition-all duration-200 hover:scale-110 active:scale-95
                [opacity:0] hover:[opacity:1] focus:[opacity:1]
                shadow-lg shadow-black/20"
              aria-label="Next story"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Indicator Lines */}
        {articles.length > 1 && (
          <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 right-4 sm:right-6 md:right-8 z-30 flex items-center gap-2">
            {articles.map((article, i) => (
              <button
                key={article.id}
                onClick={() => goToSlide(i)}
                className={cn(
                  "h-[2px] rounded-full transition-all duration-500 ease-out",
                  i === currentIndex
                    ? "w-8 sm:w-10 bg-white"
                    : "w-4 sm:w-5 bg-white/30 hover:bg-white/50 hover:w-6"
                )}
                aria-label={`Go to story ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Progress bar */}
        {!isPaused && articles.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 z-30 h-[2px] bg-white/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={featured.id}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                exit={{ width: "100%" }}
                transition={{ duration: AUTO_ROTATE_INTERVAL / 1000, ease: "linear" }}
                className="h-full bg-white/20"
              />
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
