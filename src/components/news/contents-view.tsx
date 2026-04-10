"use client";

import { motion } from "framer-motion";
import {
  Newspaper,
  Globe,
  Landmark,
  Map,
  Compass,
  Sun,
  Building2,
  Cpu,
  Microscope,
  Trophy,
  CircleDot,
  Gamepad2,
  Theater,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { useAppStore } from "@/store/news-store";
import { cn } from "@/lib/utils";
import type { Category, ContentsSection } from "@/types/news";
import { CATEGORY_META } from "@/types/news";

const contentsSections: ContentsSection[] = [
  {
    title: "Top Stories",
    icon: Newspaper,
    description: "The latest breaking news and headlines from around the world",
    categories: [{ category: "top-stories", label: "Top Stories" }],
  },
  {
    title: "World",
    icon: Globe,
    description: "International news covering every continent",
    categories: [
      { category: "world", label: "World" },
      { category: "uk", label: "UK" },
      { category: "asia", label: "Asia" },
      { category: "middle-east", label: "Middle East" },
      { category: "africa", label: "Africa" },
    ],
  },
  {
    title: "Business",
    icon: Building2,
    description: "Economy, markets, companies, and financial news",
    categories: [{ category: "business", label: "Business" }],
  },
  {
    title: "Technology",
    icon: Cpu,
    description: "Innovation, gadgets, AI, and digital culture",
    categories: [{ category: "technology", label: "Technology" }],
  },
  {
    title: "Science & Environment",
    icon: Microscope,
    description: "Discoveries, research, climate, and space",
    categories: [{ category: "science", label: "Science & Environment" }],
  },
  {
    title: "Sport",
    icon: Trophy,
    description: "Scores, results, and sporting highlights",
    categories: [
      { category: "sport", label: "All Sport" },
      { category: "football", label: "Football" },
      { category: "cricket", label: "Cricket" },
    ],
  },
  {
    title: "Entertainment & Arts",
    icon: Theater,
    description: "Film, music, TV, books, and culture",
    categories: [{ category: "entertainment", label: "Entertainment & Arts" }],
  },
];

const sectionColors: Record<string, string> = {
  "Top Stories": "from-red-500 to-rose-600",
  World: "from-amber-500 to-orange-600",
  Business: "from-emerald-500 to-green-600",
  Technology: "from-violet-500 to-purple-600",
  "Science & Environment": "from-cyan-500 to-teal-600",
  Sport: "from-green-500 to-emerald-600",
  "Entertainment & Arts": "from-pink-500 to-rose-500",
};

const sectionIconBg: Record<string, string> = {
  "Top Stories": "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400",
  World: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  Business: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  Technology: "bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
  "Science & Environment": "bg-cyan-100 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400",
  Sport: "bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400",
  "Entertainment & Arts": "bg-pink-100 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400",
};

export function ContentsView() {
  const { setCategory, currentView } = useAppStore();

  const handleCategoryClick = (category: Category) => {
    setCategory(category);
  };

  return (
    <div className="py-2">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10 text-red-600 dark:text-red-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Contents</h1>
            <p className="text-sm text-muted-foreground">
              Browse all news sections and categories
            </p>
          </div>
        </div>
      </motion.div>

      {/* Contents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {contentsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: sectionIndex * 0.06 }}
            className="group"
          >
            <div className="relative rounded-xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-border/80 h-full">
              {/* Gradient top bar */}
              <div
                className={cn(
                  "h-1 w-full bg-gradient-to-r",
                  sectionColors[section.title] || sectionColors["Top Stories"]
                )}
              />

              <div className="p-5">
                {/* Section header */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      sectionIconBg[section.title] || sectionIconBg["Top Stories"]
                    )}
                  >
                    <section.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base leading-tight">
                      {section.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </div>

                {/* Category links */}
                <div className="space-y-0.5 mt-4">
                  {section.categories.map((cat) => (
                    <button
                      key={cat.category}
                      onClick={() => handleCategoryClick(cat.category)}
                      className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 group/link"
                    >
                      <span className="font-medium">{cat.label}</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all duration-200 group-hover/link:opacity-100 group-hover/link:translate-x-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
