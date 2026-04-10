"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/news/hero-section";
import { CategoryTabs } from "@/components/news/category-tabs";
import { CategorySection, TrendingSidebar } from "@/components/news/category-section";
import { SearchResults } from "@/components/news/search-results";
import { CategoryView } from "@/components/news/category-view";
import { ArticleDetail } from "@/components/news/article-detail";
import { BookmarksView } from "@/components/bookmarks/bookmarks-view";
import { useAppStore } from "@/store/news-store";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";

export default function Home() {
  const { currentView, selectedArticle } = useAppStore();

  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Article Detail Overlay */}
      <AnimatePresence>
        {currentView === "article" && selectedArticle && <ArticleDetail />}
      </AnimatePresence>

      {/* Main Content */}
      {currentView !== "article" && (
        <main className="flex-1">
          <AnimatePresence mode="wait">
            {/* SEARCH VIEW */}
            {currentView === "search" && (
              <motion.div
                key="search"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-7xl px-4 sm:px-6 py-6"
              >
                <SearchResults />
              </motion.div>
            )}

            {/* BOOKMARKS VIEW */}
            {currentView === "bookmarks" && (
              <motion.div
                key="bookmarks"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-4xl px-4 sm:px-6 py-6"
              >
                <BookmarksView />
              </motion.div>
            )}

            {/* CATEGORY VIEW */}
            {currentView === "category" && (
              <motion.div
                key="category"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-7xl px-4 sm:px-6 py-6"
              >
                <CategoryView />
              </motion.div>
            )}

            {/* HOME VIEW */}
            {currentView === "home" && (
              <motion.div
                key="home"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {/* Hero */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-8">
                  <HeroSection />
                </div>

                {/* Category Tabs */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-8">
                  <CategoryTabs />
                </div>

                {/* Trending + Technology Section */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-10">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Featured News */}
                    <div className="lg:col-span-2">
                      <SectionHeader title="Technology" category="technology" />
                      <div className="mt-4">
                        <CategorySection category="technology" limit={6} variant="grid" delay={800} />
                      </div>
                    </div>

                    {/* Trending Sidebar */}
                    <div className="lg:col-span-1">
                      <div className="sticky top-20">
                        <SectionHeader title="Trending Now" />
                        <div className="mt-4 bg-card rounded-2xl border border-border/50 p-4">
                          <TrendingSidebar />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="mx-auto max-w-7xl px-4 sm:px-6" />

                {/* World News */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
                  <SectionHeader title="World" category="world" />
                  <div className="mt-4">
                    <CategorySection category="world" limit={4} variant="list" delay={1500} />
                  </div>
                </div>

                <Separator className="mx-auto max-w-7xl px-4 sm:px-6" />

                {/* Business + Sports */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <SectionHeader title="Business" category="business" />
                      <div className="mt-4">
                        <CategorySection category="business" limit={3} variant="grid" delay={2500} />
                      </div>
                    </div>
                    <div>
                      <SectionHeader title="Sports" category="sports" />
                      <div className="mt-4">
                        <CategorySection category="sports" limit={3} variant="grid" delay={3500} />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="mx-auto max-w-7xl px-4 sm:px-6" />

                {/* Health + Entertainment */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <SectionHeader title="Health" category="health" />
                      <div className="mt-4">
                        <CategorySection category="health" limit={3} variant="grid" delay={4500} />
                      </div>
                    </div>
                    <div>
                      <SectionHeader title="Entertainment" category="entertainment" />
                      <div className="mt-4">
                        <CategorySection category="entertainment" limit={3} variant="grid" delay={5500} />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="mx-auto max-w-7xl px-4 sm:px-6" />

                {/* Science */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
                  <SectionHeader title="Science" category="science" />
                  <div className="mt-4">
                    <CategorySection category="science" limit={4} variant="grid" delay={6500} />
                  </div>
                </div>

                {/* Bottom Spacer */}
                <div className="h-8" />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}

      {/* Footer - only show on non-article views */}
      {currentView !== "article" && <Footer />}
    </div>
  );
}

function SectionHeader({
  title,
  category,
}: {
  title: string;
  category?: string;
}) {
  const { setCategory } = useAppStore();

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold">{title}</h2>
      {category && (
        <button
          onClick={() => setCategory(category as "world" | "technology" | "business" | "sports" | "health" | "entertainment" | "science")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          See all
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      )}
    </div>
  );
}
