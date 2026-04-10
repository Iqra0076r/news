"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Bookmark,
  BookmarkCheck,
  Share2,
  Calendar,
  Loader2,
  AlertCircle,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/store/news-store";
import { formatFullDate, getDomainFromUrl, generatePlaceholderGradient } from "@/lib/helpers";
import { cn } from "@/lib/utils";

interface ArticleContent {
  title: string;
  html: string;
  image: string | null;
  publishedTime: string | null;
}

export function ArticleDetail() {
  const { selectedArticle, setView, toggleBookmark, isBookmarked, clearArticle } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState<ArticleContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // Fetch full article content
  const fetchContent = useCallback(async () => {
    if (!selectedArticle) return;

    // If we already have full content from the list fetch, use it
    if (selectedArticle.content && selectedArticle.content.includes("<") && selectedArticle.content.length > 200) {
      setContent({
        title: selectedArticle.title,
        html: selectedArticle.content,
        image: selectedArticle.image,
        publishedTime: selectedArticle.publishedAt,
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/news/article?url=${encodeURIComponent(selectedArticle.url)}`
      );
      const data = await res.json();

      if (data.success) {
        setContent({
          title: data.title || selectedArticle.title,
          html: data.html || "",
          image: data.image || selectedArticle.image,
          publishedTime: data.publishedTime || selectedArticle.publishedAt,
        });
      } else {
        setError(data.error || "Failed to load article content");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedArticle]);

  useEffect(() => {
    if (mounted && selectedArticle) {
      fetchContent();
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mounted, selectedArticle, fetchContent]);

  const handleBack = () => {
    clearArticle();
    setView("home");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedArticle?.title,
          text: selectedArticle?.description,
          url: selectedArticle?.url,
        });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(selectedArticle?.url || "");
    }
  };

  const handleRetry = () => {
    fetchContent();
  };

  if (!selectedArticle) return null;

  const bookmarked = isBookmarked(selectedArticle.id);
  const displayImage = content?.image || selectedArticle.image;
  const displayTitle = content?.title || selectedArticle.title;
  const displayDate = content?.publishedTime || selectedArticle.publishedAt;
  const gradientClass = generatePlaceholderGradient(selectedArticle.category);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-background"
    >
      <div className="h-full overflow-y-auto">
        {/* Sticky header */}
        <div className="sticky top-0 z-10">
          <div className="glass border-b border-border/30">
            <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2 rounded-xl">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back</span>
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => toggleBookmark(selectedArticle.id)}
                >
                  {bookmarked ? (
                    <BookmarkCheck className="h-5 w-5 text-primary" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-[16/9] max-h-[60vh] overflow-hidden bg-muted">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={displayTitle}
              fill
              className="object-cover"
              sizes="100vw"
              priority
              unoptimized
            />
          ) : (
            <div className={cn("w-full h-full bg-gradient-to-br", gradientClass)} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        {/* Article Content */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 -mt-20 relative z-[1]">
          <article className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl">
            {/* Category & Source */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="text-xs font-medium">
                {selectedArticle.category.charAt(0).toUpperCase() + selectedArticle.category.slice(1)}
              </Badge>
              <Badge variant="secondary" className="text-xs gap-1">
                <Newspaper className="h-3 w-3" />
                Al Jazeera
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
              {displayTitle}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatFullDate(displayDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Source: aljazeera.com
              </span>
            </div>

            {/* Description (always visible from search data) */}
            {selectedArticle.description && (
              <p className="text-lg font-medium leading-relaxed text-foreground/90 mb-6 border-b border-border/50 pb-6">
                {selectedArticle.description}
              </p>
            )}

            {/* Loading state for full content */}
            {loading && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">Loading full article...</span>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="flex flex-col items-center py-8 text-center">
                <AlertCircle className="h-10 w-10 text-destructive mb-3" />
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button variant="outline" size="sm" onClick={handleRetry} className="rounded-xl gap-2">
                  Retry
                </Button>
              </div>
            )}

            {/* Full article content */}
            {content && content.html && !loading && !error && (
              <div
                className="article-content prose prose-neutral dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-base prose-p:leading-relaxed prose-p:mb-4
                  prose-img:rounded-xl prose-img:my-6 prose-img:mx-auto prose-img:max-w-full
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-4
                  prose-ul:my-4 prose-ol:my-4 prose-li:mb-1
                  prose-strong:text-foreground
                  prose-figure:my-6
                  prose-figcaption:text-sm prose-figcaption:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: content.html }}
              />
            )}

            {/* Bookmark action */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <Button
                variant="outline"
                className={cn(
                  "gap-2 rounded-xl w-full sm:w-auto",
                  bookmarked && "border-primary/50 text-primary"
                )}
                onClick={() => toggleBookmark(selectedArticle.id)}
              >
                {bookmarked ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" />
                    Saved to Bookmarks
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    Save to Bookmarks
                  </>
                )}
              </Button>
            </div>

            {/* Source attribution */}
            <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border/30">
              <p className="text-xs text-muted-foreground">
                Source: <span className="font-medium text-foreground">Al Jazeera</span> — This article content is fetched from Al Jazeera for reading convenience. All content belongs to its original publisher.
              </p>
            </div>
          </article>
        </div>

        <div className="h-12" />
      </div>
    </motion.div>
  );
}
