"use client";

import { useEffect, useRef, memo } from "react";

/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║  HILLTOPADS AD INTEGRATION                                      ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║  Publisher Zone ID: 25f22cc3711edbecd5b0                       ║
  ║                                                                  ║
  ║  HOW TO ACTIVATE ADS:                                           ║
  ║  1. Log in to your HilltopAds publisher dashboard                ║
  ║  2. Create ad zones (e.g., "Header 728x90", "Sidebar 300x250")   ║
  ║  3. Copy the JavaScript ad tag for each zone                    ║
  ║  4. Replace the placeholder divs below with your actual tags     ║
  ║                                                                  ║
  ║  Each zone gets a unique zone ID. Replace ZONE_ID_HERE with     ║
  ║  your actual HilltopAds zone IDs from the dashboard.            ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

// Your main publisher token from HilltopAds
const HILLTOPADS_PUBLISHER_ID = "25f22cc3711edbecd5b0";

interface AdSlotProps {
  id: string;
  zoneId: string;
  className?: string;
  format?: "leaderboard" | "rectangle" | "banner" | "mobile" | "in-article" | "fluid";
  label?: boolean;
}

const SIZE_MAP: Record<string, string> = {
  leaderboard: "728 × 90",
  rectangle: "300 × 250",
  banner: "320 × 50",
  mobile: "320 × 100",
  "in-article": "fluid",
  fluid: "fluid",
};

/*
  HilltopAds Zone IDs for each placement.
  IMPORTANT: Replace these with your actual zone IDs from the HilltopAds dashboard.
  To create zones: Dashboard → Zones → Create New Zone
*/
const ZONE_IDS: Record<string, string> = {
  header: HILLTOPADS_PUBLISHER_ID,       // Create a 728x90 zone → paste its ID here
  sidebar: HILLTOPADS_PUBLISHER_ID,      // Create a 300x250 zone → paste its ID here
  content: HILLTOPADS_PUBLISHER_ID,      // Create a 728x90 zone → paste its ID here
  "content-2": HILLTOPADS_PUBLISHER_ID,  // Create a 728x90 zone → paste its ID here
  article: HILLTOPADS_PUBLISHER_ID,      // Create a fluid zone → paste its ID here
  footer: HILLTOPADS_PUBLISHER_ID,       // Create a 728x90 zone → paste its ID here
};

export const AdSlot = memo(function AdSlot({
  id,
  zoneId,
  format = "rectangle",
  className = "",
  label = false,
}: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (containerRef.current && !loadedRef.current) {
      containerRef.current.dataset.adSlot = id;
      containerRef.current.dataset.zoneId = zoneId;
      loadedRef.current = true;
    }
  }, [id, zoneId]);

  const sizeLabel = SIZE_MAP[format] || format;

  return (
    <div className={`ad-container flex flex-col items-center ${className}`}>
      {label && (
        <span className="text-[10px] text-muted-foreground/40 uppercase tracking-widest mb-1">
          Advertisement
        </span>
      )}
      <div
        ref={containerRef}
        id={id}
        className={`relative w-full flex items-center justify-center overflow-hidden rounded-lg bg-muted/30 border border-border/20 transition-all
          ${format === "leaderboard" ? "max-w-[728px] h-[90px]" : ""}
          ${format === "rectangle" ? "w-full max-w-[300px] h-[250px]" : ""}
          ${format === "banner" ? "max-w-[320px] h-[50px]" : ""}
          ${format === "mobile" ? "max-w-[320px] h-[100px]" : ""}
          ${format === "in-article" ? "min-h-[100px] py-3" : ""}
          ${format === "fluid" ? "min-h-[250px]" : ""}
        `}
        aria-label="Advertisement"
        role="complementary"
      >
        {/*
          ┌─────────────────────────────────────────────────────┐
          │  PASTE YOUR HILLTOPADS AD TAG HERE                  │
          │                                                     │
          │  Example (replace with your actual tag):             │
          │  <ins class="hilltopads"                            │
          │       data-zone="YOUR_ZONE_ID_HERE"                 │
          │       data-sub="ZONE_ID_HERE"></ins>                 │
          │  <script>                                           │
          │    (hilltopads = window.hilltopads || []).push({});  │
          │    var s = document.createElement("script");         │
          │    s.type = "text/javascript";                       │
          │    s.async = true;                                  │
          │    s.src = "//ad.hilltopads.net/...";               │
          │    document.head.appendChild(s);                    │
          │  </script>                                          │
          └─────────────────────────────────────────────────────┘
        */}
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
        id="div-ad-header"
        zoneId={ZONE_IDS.header}
        format="leaderboard"
        label={false}
      />
    </div>
  );
}

export function SidebarAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      id="div-ad-sidebar"
      zoneId={ZONE_IDS.sidebar}
      format="rectangle"
      className={className}
    />
  );
}

export function InContentAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      id="div-ad-content"
      zoneId={ZONE_IDS.content}
      format="leaderboard"
      label
      className={className}
    />
  );
}

export function InContentAd2({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      id="div-ad-content-2"
      zoneId={ZONE_IDS["content-2"]}
      format="leaderboard"
      label
      className={className}
    />
  );
}

export function InArticleAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot
      id="div-ad-article"
      zoneId={ZONE_IDS.article}
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
        id="div-ad-footer"
        zoneId={ZONE_IDS.footer}
        format="leaderboard"
        label={false}
      />
    </div>
  );
}
