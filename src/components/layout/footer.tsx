"use client";

import { Zap, Github, ExternalLink } from "lucide-react";
import { useAppStore } from "@/store/news-store";
import { cn } from "@/lib/utils";

const footerLinks = {
  categories: [
    { label: "World", value: "world" },
    { label: "Technology", value: "technology" },
    { label: "Business", value: "business" },
    { label: "Sports", value: "sports" },
    { label: "Health", value: "health" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Science", value: "science" },
  ],
};

export function Footer() {
  const { setCategory, setView } = useAppStore();

  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Pulse<span className="text-muted-foreground font-light ml-0.5">News</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium real-time news from trusted sources around the world. Stay informed, stay ahead.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.value}>
                  <button
                    onClick={() => {
                      setCategory(link.value as "world" | "technology" | "business" | "sports" | "health" | "entertainment" | "science");
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">About</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Contact</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Terms of Service</span>
              </li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Connect</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Powered by real-time web search technology
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} PulseNews. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Real-time news aggregation from trusted sources
          </p>
        </div>
      </div>
    </footer>
  );
}
