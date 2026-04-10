import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState, AppView, Category, NewsArticle } from "@/types/news";

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentView: "home" as AppView,
      selectedArticle: null,
      selectedCategory: "top-stories" as Category,
      searchQuery: "",
      bookmarks: [] as string[],
      isLoading: false,
      sidebarOpen: false,
      mobileMenuOpen: false,

      setView: (view: AppView) => {
        set({ currentView: view, mobileMenuOpen: false });
        if (view !== "article") {
          set({ selectedArticle: null });
        }
      },

      selectArticle: (article: NewsArticle) => {
        set({ selectedArticle: article, currentView: "article" });
      },

      setCategory: (category: Category) => {
        set({ selectedCategory: category, currentView: "category", searchQuery: "" });
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
        if (query.trim().length > 0) {
          set({ currentView: "search" });
        }
      },

      toggleBookmark: (articleId: string) => {
        const bookmarks = get().bookmarks;
        const isBookmarked = bookmarks.includes(articleId);
        set({
          bookmarks: isBookmarked
            ? bookmarks.filter((id) => id !== articleId)
            : [...bookmarks, articleId],
        });
      },

      isBookmarked: (articleId: string) => {
        return get().bookmarks.includes(articleId);
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
      setMobileMenuOpen: (open: boolean) => set({ mobileMenuOpen: open }),
      clearArticle: () => {
        set({ selectedArticle: null });
      },
    }),
    {
      name: "saveitbro-news-storage",
      partialize: (state) => ({
        bookmarks: state.bookmarks,
      }),
    }
  )
);
