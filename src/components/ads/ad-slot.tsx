"use client";

import { useEffect, useRef, memo, useCallback } from "react";

/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║  HILLTOPADS AD INTEGRATION — LIVE                               ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║  Publisher Zone ID: 25f22cc3711edbecd5b0                       ║
  ║                                                                  ║
  ║  4 Active Zones:                                                 ║
  ║    • Header  — 728x90 (top of page)                             ║
  ║    • Sidebar — 300x250 (right sidebar)                          ║
  ║    • Content — 300x250 (between news sections, used 2x)         ║
  ║    • Footer  — 300x250 (bottom of page)                         ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

/* ── HilltopAds Ad Script URLs ── */
const AD_SCRIPTS: Record<string, string> = {
  header:  "//pricklyassociation.com/b/XXV.sJdZGil/0QYtWhcW/iePml9pukZiU/lNk/PtTiYr5FN/Dokh2-MRz/cUtsNZj/kM0NO/T/YG0/MiQn",
  sidebar: "//pricklyassociation.com/bVXmVRs.dmGHl/0qYgWIch/xe/m/9cu/ZyU/lJkZPNTeYE5RNUDPkD2dNIDVkYtkN_j/kT0mOMTVYQ1WMdw_",
  content: "//pricklyassociation.com/btX.VwssdWGplD0hYgWXcd/Ienmu9ju/ZlUVlnk/PWTFYB5yN/DxkS2AN/jqU/tpNXj/k/0sOzTgYg2QOeQm",
  footer:  "//pricklyassociation.com/b/XpV.s/dJGnlq0QYyWkcJ/XezmH9/uEZIUNlpkgPOT/Y/5SNFDpkn2eOHD-EctvN/jak/0kOZTjY/4WNvQC",
};

interface AdSlotProps {
  placement: "header" | "sidebar" | "content" | "footer";
  className?: string;
  format?: "leaderboard" | "rectangle" | "in-article";
  label?: boolean;
}

/* ── Generic Ad Slot with script injection ── */
export const AdSlot = memo(function AdSlot({
  placement,
  className = "",
  format = "rectangle",
  label = false,
}: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  const loadAd = useCallback(() => {
    if (loadedRef.current || !containerRef.current) return;

    const scriptUrl = AD_SCRIPTS[placement];
    if (!scriptUrl) return;

    // Clear placeholder
    containerRef.current.innerHTML = "";

    // Create HilltopAds script element
    const script = document.createElement("script");
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    script.src = scriptUrl;

    containerRef.current.appendChild(script);
    loadedRef.current = true;
  }, [placement]);

  useEffect(() => {
    // Use IntersectionObserver to load ads only when visible
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadAd();
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px" }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [loadAd]);

  const sizeLabel =
    format === "leaderboard"
      ? "728 × 90"
      : format === "rectangle"
        ? "300 × 250"
        : "Ad";

  return (
    <div className={`ad-container flex flex-col items-center ${className}`}>
      {label && (
        <span className="text-[10px] text-muted-foreground/40 uppercase tracking-widest mb-1">
          Advertisement
        </span>
      )}
      <div
        ref={containerRef}
        className={`relative w-full flex items-center justify-center overflow-hidden rounded-lg bg-muted/30 border border-border/20 transition-all
          ${format === "leaderboard" ? "max-w-[728px] h-[90px]" : ""}
          ${format === "rectangle" ? "w-full max-w-[300px] h-[250px]" : ""}
          ${format === "in-article" ? "min-h-[250px] py-3" : ""}
        `}
        aria-label="Advertisement"
        role="complementary"
      >
        <span className="text-xs text-muted-foreground/30 select-none">
          {sizeLabel}
        </span>
      </div>
    </div>
  );
});

/* ── Pre-configured Ad Components ── */

export function HeaderAd() {
  return (
    <div className="w-full flex justify-center py-2 bg-background/80">
      <AdSlot
        placement="header"
        format="rectangle"
        label={false}
      />
    </div>
  );
}

export function SidebarAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      placement="sidebar"
      format="rectangle"
      className={className}
    />
  );
}

export function InContentAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      placement="content"
      format="rectangle"
      label
      className={className}
    />
  );
}

export function InContentAd2({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      placement="content"
      format="rectangle"
      label
      className={className}
    />
  );
}

export function InArticleAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      placement="content"
      format="in-article"
      label
      className={className}
    />
  );
}

export function FooterAd() {
  return (
    <div className="w-full flex justify-center py-2 bg-background/80">
      <AdSlot
        placement="footer"
        format="rectangle"
        label={false}
      />
    </div>
  );
}
