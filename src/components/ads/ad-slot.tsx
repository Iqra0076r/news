"use client";

import { useEffect, useRef, memo } from "react";

interface AdSlotProps {
  id: string;
  size?: string;
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

export const AdSlot = memo(function AdSlot({
  id,
  format = "rectangle",
  className = "",
  label = false,
}: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    // Mark the slot as available for Media.net ad injection
    // When you get your Media.net account, replace this with:
    // (function() { ... Media.net ad code ... })();
    if (containerRef.current && !loadedRef.current) {
      containerRef.current.dataset.adSlot = id;
      loadedRef.current = true;
    }
  }, [id]);

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
          MEDIA.NET AD INTEGRATION:
          Replace this placeholder with your Media.net ad tag.
          Example:
          <script type="text/javascript">
            window._mNHandle = window._mNHandle || {};
            window._mNHandle.queue = window._mNHandle.queue || [];
            medianet_versionId = "3121199";
          </script>
          <script id="SNIPPET" src="//contextual.media.net/nmedianet.js?cid=YOUR_CID" async="async"></script>
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
      <AdSlot id="div-ad-header" format="leaderboard" label={false} />
    </div>
  );
}

export function SidebarAd({ className = "" }: { className?: string }) {
  return <AdSlot id="div-ad-sidebar" format="rectangle" className={className} />;
}

export function InContentAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot id="div-ad-content" format="leaderboard" label className={className} />
  );
}

export function InArticleAd({ className = "" }: { className?: string }) {
  return (
    <AdSlot id="div-ad-article" format="in-article" label className={className} />
  );
}

export function FooterAd() {
  return (
    <div className="w-full flex justify-center py-2 bg-background/80">
      <AdSlot id="div-ad-footer" format="leaderboard" label={false} />
    </div>
  );
}
