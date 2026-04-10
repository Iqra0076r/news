"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  Newspaper,
  Globe,
  Cpu,
  TrendingUp,
  Trophy,
  Heart,
  Film,
  Atom,
} from "lucide-react";
import { useAppStore } from "@/store/news-store";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/news";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Newspaper,
  Globe,
  Cpu,
  TrendingUp,
  Trophy,
  Heart,
  Film,
  Atom,
};

const categories: { value: Category; label: string; icon: string }[] = [
  { value: "general", label: "Top Stories", icon: "Newspaper" },
  { value: "world", label: "World", icon: "Globe" },
  { value: "technology", label: "Technology", icon: "Cpu" },
  { value: "business", label: "Business", icon: "TrendingUp" },
  { value: "sports", label: "Sports", icon: "Trophy" },
  { value: "health", label: "Health", icon: "Heart" },
  { value: "entertainment", label: "Entertainment", icon: "Film" },
  { value: "science", label: "Science", icon: "Atom" },
];

export function CategoryTabs() {
  const { selectedCategory, setCategory, currentView } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const checkOverflow = useCallback(() => {
    if (scrollRef.current) {
      setIsOverflowing(
        scrollRef.current.scrollWidth > scrollRef.current.clientWidth
      );
    }
  }, []);

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [checkOverflow]);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-1.5 overflow-x-auto no-scrollbar py-1"
      >
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon];
          const isActive =
            currentView === "category" && selectedCategory === cat.value;

          return (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Gradient fade on overflow */}
      {isOverflowing && (
        <>
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background to-transparent z-10" />
        </>
      )}
    </div>
  );
}

export function CategorySection({
  category,
  title,
}: {
  category: Category;
  title: string;
}) {
  return (
    <button
      onClick={() => useAppStore.getState().setCategory(category)}
      className="group text-left"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
          See all →
        </span>
      </div>
    </button>
  );
}
