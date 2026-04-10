"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Search,
  Bookmark,
  Moon,
  Sun,
  Menu,
  X,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/news-store";
import { cn } from "@/lib/utils";

export function Navbar() {
  const {
    currentView,
    setView,
    setSearchQuery,
    bookmarks,
    setMobileMenuOpen,
    mobileMenuOpen,
  } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 400);
  };

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

  const navItems = [
    { view: "home" as const, label: "Home", icon: Home },
    { view: "bookmarks" as const, label: "Saved", icon: Bookmark },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <div className="glass border-b border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex h-16 items-center justify-between gap-4">
              {/* Logo */}
              <button
                onClick={() => {
                  setView("home");
                  setSearchValue("");
                }}
                className="flex items-center gap-2 shrink-0 group"
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                  <Zap className="h-5 w-5" />
                </div>
                <span className="hidden sm:block text-xl font-bold tracking-tight">
                  Pulse<span className="text-muted-foreground font-light ml-0.5">News</span>
                </span>
              </button>

              {/* Desktop Search */}
              <div className="hidden md:flex flex-1 max-w-xl mx-4">
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
                    placeholder="Search news, topics, sources..."
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/60 border border-border/50 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
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
                  {(searchFocused || searchValue) && (
                    <div className="absolute top-full mt-2 left-0 right-0 p-2 rounded-lg bg-popover border border-border shadow-lg text-xs text-muted-foreground">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Enter</kbd> to search, <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Esc</kbd> to clear
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Nav Actions */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Button
                    key={item.view}
                    variant={currentView === item.view ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setView(item.view);
                      setSearchValue("");
                    }}
                    className={cn(
                      "gap-2 rounded-xl",
                      currentView === item.view && "bg-secondary font-medium"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {item.view === "bookmarks" && bookmarks.length > 0 && (
                      <Badge variant="default" className="h-5 min-w-5 px-1.5 text-[10px] rounded-full">
                        {bookmarks.length}
                      </Badge>
                    )}
                  </Button>
                ))}

                <div className="w-px h-6 bg-border/60 mx-1" />

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
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

              {/* Mobile Menu Button */}
              <div className="flex md:hidden items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl relative"
                  onClick={() => {
                    setView("bookmarks");
                  }}
                >
                  <Bookmark className="h-5 w-5" />
                  {bookmarks.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {bookmarks.length}
                    </span>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {mounted ? (
                    theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )
                  ) : (
                    <div className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {/* Mobile Search (always visible on mobile) */}
            <div className="md:hidden pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/60 border border-border/50 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 top-16 z-40"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <nav className="relative mx-4 mt-2 rounded-2xl border border-border/50 bg-card p-2 shadow-xl">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => {
                    setView(item.view);
                    setSearchValue("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors",
                    currentView === item.view
                      ? "bg-secondary font-medium"
                      : "hover:bg-muted/50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {item.view === "bookmarks" && bookmarks.length > 0 && (
                    <Badge variant="default" className="ml-auto h-5 min-w-5 px-1.5 text-[10px] rounded-full">
                      {bookmarks.length}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
