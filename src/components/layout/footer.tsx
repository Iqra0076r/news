"use client";

import { Newspaper } from "lucide-react";
import { useAppStore } from "@/store/news-store";
import { CATEGORY_META } from "@/types/news";
import type { Category } from "@/types/news";

export function Footer() {
  const { setCategory } = useAppStore();

  const newsCategories: Category[] = [
    "top-stories",
    "world",
    "uk",
    "asia",
    "middle-east",
    "africa",
    "business",
    "technology",
    "science",
    "entertainment",
  ];

  const sportCategories: Category[] = ["sport", "football", "cricket"];

  return (
    <footer className="border-t border-border/50 bg-card/50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
                <Newspaper className="h-4 w-4" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold tracking-tight">
                  SaveitBro News
                </span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
                  Live
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Real-time news aggregated from trusted sources. Stay informed with
              the latest stories from around the world.
            </p>
          </div>

          {/* News Categories */}
          <div>
            <h3 className="text-sm font-semibold mb-4">News</h3>
            <ul className="space-y-2">
              {newsCategories.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setCategory(cat)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {CATEGORY_META[cat]?.label || cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h3 className="text-sm font-semibold mb-4">More</h3>
            <ul className="space-y-2">
              {newsCategories.slice(6).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setCategory(cat)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {CATEGORY_META[cat]?.label || cat}
                  </button>
                </li>
              ))}
              {sportCategories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setCategory(cat)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {CATEGORY_META[cat]?.label || cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">About</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Contact</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Terms of Service
                </span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4">
              Aggregated from trusted news sources
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SaveitBro News. All content belongs to
            its original publishers.
          </p>
          <p className="text-xs text-muted-foreground">
            News sourced from trusted RSS feeds
          </p>
        </div>
      </div>
    </footer>
  );
}
