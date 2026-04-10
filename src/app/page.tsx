"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/news/hero-section";
import { CategoryTabs } from "@/components/news/category-tabs";
import { CategorySection, TrendingSidebar } from "@/components/news/category-section";
import { CategorySectionHeader } from "@/components/news/category-tabs";
import { SearchResults } from "@/components/news/search-results";
import { CategoryView } from "@/components/news/category-view";
import { ArticleDetail } from "@/components/news/article-detail";
import { BookmarksView } from "@/components/bookmarks/bookmarks-view";
import { ContentsView } from "@/components/news/contents-view";
import { useAppStore } from "@/store/news-store";
import { Separator } from "@/components/ui/separator";

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

            {/* CONTENTS VIEW */}
            {currentView === "contents" && (
              <motion.div
                key="contents"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-7xl px-4 sm:px-6 py-6"
              >
                <ContentsView />
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
                {/* Hero - Top Stories (full-width bleed) */}
                <HeroSection />

                {/* Category Tabs */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-8">
                  <CategoryTabs />
                </div>

                {/* World + Trending */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-10">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <CategorySectionHeader category="world" title="World" />
                      <div className="mt-4">
                        <CategorySection category="world" limit={6} variant="grid" delay={800} />
                      </div>
                    </div>
                    <div className="lg:col-span-1">
                      <div className="sticky top-36">
                        <h2 className="text-lg font-bold mb-4">Most Read</h2>
                        <div className="bg-card rounded-xl border border-border/50 p-4">
                          <TrendingSidebar />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="mx-auto max-w-7xl px-4 sm:px-6" />

                {/* Business + Technology */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <CategorySectionHeader category="business" title="Business" />
                      <div className="mt-4">
                        <CategorySection category="business" limit={3} variant="grid" delay={1500} />
                      </div>
                    </div>
                    <div>
                      <CategorySectionHeader category="technology" title="Technology" />
                      <div className="mt-4">
                        <CategorySection category="technology" limit={3} variant="grid" delay={2500} />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="mx-auto max-w-7xl px-4 sm:px-6" />

                {/* Sport + Entertainment */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <CategorySectionHeader category="sport" title="Sport" />
                      <div className="mt-4">
                        <CategorySection category="sport" limit={3} variant="grid" delay={3500} />
                      </div>
                    </div>
                    <div>
                      <CategorySectionHeader category="entertainment" title="Entertainment & Arts" />
                      <div className="mt-4">
                        <CategorySection category="entertainment" limit={3} variant="grid" delay={4500} />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="mx-auto max-w-7xl px-4 sm:px-6" />

                {/* Science & Environment */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
                  <CategorySectionHeader category="science" title="Science & Environment" />
                  <div className="mt-4">
                    <CategorySection category="science" limit={4} variant="grid" delay={5500} />
                  </div>
                </div>

                {/* Bottom Spacer */}
                <div className="h-8" />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}

      {/* Footer */}
      {currentView !== "article" && <Footer />}
    </div>
  );
}
