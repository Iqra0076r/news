"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Share2,
  Calendar,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/news-store";
import { formatFullDate, getDomainFromUrl, generatePlaceholderGradient } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@/types/news";

export function ArticleDetail() {
  const { selectedArticle, setView, toggleBookmark, isBookmarked, clearArticle } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (mounted) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mounted, selectedArticle]);

  if (!selectedArticle) return null;

  const bookmarked = isBookmarked(selectedArticle.id);
  const gradientClass = generatePlaceholderGradient(selectedArticle.category);

  const handleBack = () => {
    clearArticle();
    setView("home");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedArticle.title,
          text: selectedArticle.description,
          url: selectedArticle.url,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(selectedArticle.url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-background"
    >
      {/* Scrollable content */}
      <div className="h-full overflow-y-auto">
        {/* Back button overlay */}
        <div className="sticky top-0 z-10">
          <div className="glass border-b border-border/30">
            <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="gap-2 rounded-xl"
              >
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-[16/9] max-h-[60vh] overflow-hidden">
          {selectedArticle.image ? (
            <Image
              src={selectedArticle.image}
              alt={selectedArticle.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
              unoptimized
            />
          ) : (
            <div className={cn("w-full h-full bg-gradient-to-br", gradientClass)} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Article Content */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 -mt-16 relative z-[1]">
          <article className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-xl">
            {/* Category & Source */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="text-xs font-medium">
                {selectedArticle.category.charAt(0).toUpperCase() + selectedArticle.category.slice(1)}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {selectedArticle.source}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
              {selectedArticle.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatFullDate(selectedArticle.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                {getDomainFromUrl(selectedArticle.url)}
              </span>
            </div>

            <Separator className="mb-6" />

            {/* Description */}
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                {selectedArticle.description}
              </p>
              <p className="text-base leading-relaxed text-muted-foreground mt-4">
                {selectedArticle.content && selectedArticle.content !== selectedArticle.description
                  ? selectedArticle.content
                  : "For the complete story with all details, analysis, and context, please visit the original source linked below."}
              </p>
            </div>

            <Separator className="my-6" />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button asChild className="gap-2 rounded-xl w-full sm:w-auto">
                <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer">
                  Read Full Article
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
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
            <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/30">
              <p className="text-xs text-muted-foreground">
                Source: <span className="font-medium text-foreground">{selectedArticle.source}</span> — This article is linked from its original publisher. PulseNews aggregates headlines from trusted global sources.
              </p>
            </div>
          </article>
        </div>

        {/* Spacer at bottom */}
        <div className="h-12" />
      </div>
    </motion.div>
  );
}
