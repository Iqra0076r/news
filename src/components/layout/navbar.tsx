"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bookmark,
  Moon,
  Sun,
  Menu,
  X,
  Home,
  Newspaper,
  Globe,
  MapPin,
  Compass,
  Building2,
  Cpu,
  Microscope,
  Trophy,
  CircleDot,
  Theater,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/news-store";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/news";
import { CATEGORY_META } from "@/types/news";

interface NavGroup {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: { category: Category; label: string }[];
}

const navGroups: NavGroup[] = [
  {
    label: "News",
    icon: Newspaper,
    items: [
      { category: "top-stories", label: "Top Stories" },
      { category: "world", label: "World" },
      { category: "uk", label: "UK" },
      { category: "asia", label: "Asia" },
      { category: "middle-east", label: "Middle East" },
      { category: "africa", label: "Africa" },
    ],
  },
  {
    label: "Sport",
    icon: Trophy,
    items: [
      { category: "sport", label: "Sport" },
      { category: "football", label: "Football" },
      { category: "cricket", label: "Cricket" },
    ],
  },
];

const standaloneCategories: { category: Category; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { category: "business", label: "Business", icon: Building2 },
  { category: "technology", label: "Technology", icon: Cpu },
  { category: "science", label: "Science", icon: Microscope },
  { category: "entertainment", label: "Entertainment", icon: Theater },
];

export function Navbar() {
  const {
    currentView,
    selectedCategory,
    setView,
    setSearchQuery,
    bookmarks,
    setMobileMenuOpen,
    mobileMenuOpen,
    setCategory,
  } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => setOpenDropdown(null);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setOpenDropdown(null);
    if (openDropdown) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [openDropdown]);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 400);
  }, [setSearchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSearchQuery(searchValue);
    }
    if (e.key === "Escape") {
      setSearchValue("");
      setSearchFocused(false);
      searchInputRef.current?.blur();
    }
  };

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const handleCategoryClick = (category: Category) => {
    setCategory(category);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    setMobileSubmenu(null);
  };

  const isActiveCategory = (category: Category) =>
    currentView === "category" && selectedCategory === category;

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        {/* Top bar */}
        <div className="glass border-b border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex h-14 items-center justify-between gap-4">
              {/* Logo */}
              <button
                onClick={() => {
                  setView("home");
                  setSearchValue("");
                }}
                className="flex items-center gap-2 shrink-0 group"
              >
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow-lg shadow-red-600/20 transition-transform group-hover:scale-105">
                  <Newspaper className="h-4 w-4" />
                </div>
                <div className="hidden sm:flex flex-col leading-none">
                  <span className="text-base font-bold tracking-tight">BBC News</span>
                  <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Pulse</span>
                </div>
              </button>

              {/* Desktop Search */}
              <div className="hidden lg:flex flex-1 max-w-md mx-4">
                <div
                  className={cn(
                    "relative w-full transition-all duration-300",
                    searchFocused && "scale-[1.02]"
                  )}
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search BBC News..."
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-9 pl-10 pr-4 rounded-lg bg-muted/60 border border-border/50 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/30 transition-all"
                  />
                  {searchValue && (
                    <button
                      onClick={() => {
                        setSearchValue("");
                        setSearchQuery("");
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Desktop Nav Actions */}
              <div className="hidden lg:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setView("bookmarks");
                    setSearchValue("");
                  }}
                  className={cn(
                    "gap-2 rounded-lg",
                    currentView === "bookmarks" && "bg-secondary font-medium"
                  )}
                >
                  <Bookmark className="h-4 w-4" />
                  Saved
                  {bookmarks.length > 0 && (
                    <Badge variant="default" className="h-5 min-w-5 px-1.5 text-[10px] rounded-full">
                      {bookmarks.length}
                    </Badge>
                  )}
                </Button>

                <div className="w-px h-5 bg-border/60 mx-1" />

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {mounted ? (
                    theme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )
                  ) : (
                    <div className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Mobile Actions */}
              <div className="flex lg:hidden items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg relative"
                  onClick={() => setView("bookmarks")}
                >
                  <Bookmark className="h-4 w-4" />
                  {bookmarks.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {bookmarks.length}
                    </span>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {mounted ? (
                    theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
                  ) : (
                    <div className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar - BBC style */}
        <nav className="hidden lg:block border-b border-border/50 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center gap-0.5 h-10 overflow-x-auto no-scrollbar">
              {/* Home */}
              <button
                onClick={() => { setView("home"); setSearchValue(""); }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                  currentView === "home"
                    ? "bg-red-600 text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Home className="h-3.5 w-3.5" />
                Home
              </button>

              <div className="w-px h-5 bg-border/40 mx-1" />

              {/* Dropdown groups */}
              {navGroups.map((group) => (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(group.label)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                      openDropdown === group.label
                        ? "bg-red-600 text-white"
                        : group.items.some((i) => isActiveCategory(i.category))
                          ? "text-red-600 dark:text-red-400 font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === group.label ? null : group.label);
                    }}
                  >
                    <group.icon className="h-3.5 w-3.5" />
                    {group.label}
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {openDropdown === group.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-48 py-1 rounded-lg border border-border/50 bg-popover shadow-xl z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {group.items.map((item) => (
                          <button
                            key={item.category}
                            onClick={() => handleCategoryClick(item.category)}
                            className={cn(
                              "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors",
                              isActiveCategory(item.category)
                                ? "bg-muted font-medium text-foreground"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                          >
                            {item.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <div className="w-px h-5 bg-border/40 mx-1" />

              {/* Standalone categories */}
              {standaloneCategories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => handleCategoryClick(cat.category)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                    isActiveCategory(cat.category)
                      ? "bg-red-600 text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <cat.icon className="h-3.5 w-3.5" />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 top-14 z-40"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <nav className="relative mx-3 mt-2 rounded-xl border border-border/50 bg-card shadow-xl max-h-[80vh] overflow-y-auto">
              {/* Mobile search */}
              <div className="p-3 border-b border-border/30">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search BBC News..."
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-9 pl-10 pr-4 rounded-lg bg-muted/60 border border-border/50 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              {/* Home */}
              <div className="p-1">
                <button
                  onClick={() => { setView("home"); setSearchValue(""); setMobileMenuOpen(false); }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    currentView === "home" ? "bg-red-600 text-white font-medium" : "hover:bg-muted/50"
                  )}
                >
                  <Home className="h-4 w-4" />
                  Home
                </button>
              </div>

              {/* News group */}
              <div className="border-t border-border/30">
                <button
                  onClick={() => setMobileSubmenu(mobileSubmenu === "news" ? null : "news")}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Newspaper className="h-4 w-4" />
                    News
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", mobileSubmenu === "news" && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {mobileSubmenu === "news" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {navGroups[0].items.map((item) => (
                        <button
                          key={item.category}
                          onClick={() => handleCategoryClick(item.category)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2 pl-10 text-sm transition-colors",
                            isActiveCategory(item.category)
                              ? "bg-muted font-medium"
                              : "text-muted-foreground hover:bg-muted/50"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sport group */}
              <div className="border-t border-border/30">
                <button
                  onClick={() => setMobileSubmenu(mobileSubmenu === "sport" ? null : "sport")}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Trophy className="h-4 w-4" />
                    Sport
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", mobileSubmenu === "sport" && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {mobileSubmenu === "sport" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {navGroups[1].items.map((item) => (
                        <button
                          key={item.category}
                          onClick={() => handleCategoryClick(item.category)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2 pl-10 text-sm transition-colors",
                            isActiveCategory(item.category)
                              ? "bg-muted font-medium"
                              : "text-muted-foreground hover:bg-muted/50"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Standalone categories */}
              <div className="border-t border-border/30 p-1">
                {standaloneCategories.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => handleCategoryClick(cat.category)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      isActiveCategory(cat.category)
                        ? "bg-muted font-medium"
                        : "text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <cat.icon className="h-4 w-4" />
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Saved */}
              <div className="border-t border-border/30 p-1">
                <button
                  onClick={() => { setView("bookmarks"); setMobileMenuOpen(false); }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    currentView === "bookmarks" ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <Bookmark className="h-4 w-4" />
                  Saved Articles
                  {bookmarks.length > 0 && (
                    <Badge variant="default" className="ml-auto h-5 min-w-5 px-1.5 text-[10px] rounded-full">
                      {bookmarks.length}
                    </Badge>
                  )}
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
