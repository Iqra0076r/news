"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, ExternalLink, Bookmark, BookmarkCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/news-store";
import { formatTimeAgo } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@/types/news";

interface NewsCardProps {
  article: NewsArticle;
  variant?: "default" | "featured" | "compact" | "horizontal";
  index?: number;
}

export function NewsCard({ article, variant = "default", index = 0 }: NewsCardProps) {
  const { selectArticle, toggleBookmark, isBookmarked } = useAppStore();
  const bookmarked = isBookmarked(article.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(article.id);
  };

  if (variant === "featured") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onClick={() => selectArticle(article)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-card border border-border/50 card-hover"
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
            <Image
              src={article.image || `/api/placeholder?category=${article.category}`}
              alt={article.title}
              fill
              className="object-cover img-zoom"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <Badge className="absolute top-3 left-3 glass text-white border-0 text-xs font-medium">
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </Badge>
          </div>
          <div className="p-6 flex flex-col justify-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs font-medium">
                {article.source}
              </Badge>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTimeAgo(article.publishedAt)}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-3">
              {article.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {article.description}
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                Read more <ExternalLink className="h-3 w-3" />
              </span>
              <button
                onClick={handleBookmark}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  bookmarked
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {bookmarked ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  if (variant === "horizontal") {
    return (
      <motion.article
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        onClick={() => selectArticle(article)}
        className="group flex gap-4 cursor-pointer p-2 -mx-2 rounded-xl hover:bg-muted/50 transition-colors"
      >
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0">
          <Image
            src={article.image || `/api/placeholder?category=${article.category}`}
            alt={article.title}
            fill
            className="object-cover img-zoom"
            sizes="112px"
            unoptimized
          />
        </div>
        <div className="flex flex-col justify-center gap-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">{article.source}</span>
            <span className="text-xs text-muted-foreground/60">{formatTimeAgo(article.publishedAt)}</span>
          </div>
          <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
        </div>
        <button
          onClick={handleBookmark}
          className={cn(
            "p-1.5 rounded-lg transition-colors self-start shrink-0 mt-1",
            bookmarked ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {bookmarked ? (
            <BookmarkCheck className="h-3.5 w-3.5" />
          ) : (
            <Bookmark className="h-3.5 w-3.5" />
          )}
        </button>
      </motion.article>
    );
  }

  if (variant === "compact") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        onClick={() => selectArticle(article)}
        className="group cursor-pointer"
      >
        <div className="flex items-start gap-3 py-3 border-b border-border/30 last:border-0">
          <span className="text-lg font-bold text-muted-foreground/40 w-6 shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h4>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-muted-foreground">{article.source}</span>
              <span className="text-xs text-muted-foreground/50">{formatTimeAgo(article.publishedAt)}</span>
            </div>
          </div>
          <button
            onClick={handleBookmark}
            className={cn(
              "p-1.5 rounded-lg transition-colors shrink-0",
              bookmarked ? "text-primary" : "text-muted-foreground/40 hover:text-muted-foreground"
            )}
          >
            <Bookmark className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.article>
    );
  }

  // Default card
  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onClick={() => selectArticle(article)}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-card border border-border/50 card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={article.image || `/api/placeholder?category=${article.category}`}
          alt={article.title}
          fill
          className="object-cover img-zoom"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <Badge className="absolute top-3 left-3 glass text-white border-0 text-[10px] font-medium">
          {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
        </Badge>
        <button
          onClick={handleBookmark}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-lg backdrop-blur-sm transition-all",
            bookmarked
              ? "bg-primary/90 text-primary-foreground"
              : "bg-black/20 text-white/80 hover:bg-black/40 hover:text-white"
          )}
        >
          {bookmarked ? (
            <BookmarkCheck className="h-3.5 w-3.5" />
          ) : (
            <Bookmark className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">{article.source}</span>
          <span className="text-muted-foreground/30">·</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimeAgo(article.publishedAt)}
          </span>
        </div>
        <h3 className="text-base font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {article.description}
        </p>
      </div>
    </motion.article>
  );
}
