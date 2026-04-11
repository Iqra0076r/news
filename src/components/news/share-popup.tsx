"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Twitter,
  Facebook,
  MessageCircle,
  Send,
  Linkedin,
  Link2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SharePopupProps {
  open: boolean;
  onClose: () => void;
  title: string;
  url: string;
  description: string;
}

export function SharePopup({
  open,
  onClose,
  title,
  url,
  description,
}: SharePopupProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const encodedDesc = encodeURIComponent(`${title} ${url}`);

  const shareButtons = [
    {
      name: "X / Twitter",
      icon: <Twitter className="h-5 w-5" />,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      hoverBg: "hover:bg-[#000000]/10 dark:hover:bg-[#ffffff]/10",
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      hoverBg: "hover:bg-[#1877F2]/10",
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="h-5 w-5" />,
      href: `https://wa.me/?text=${encodedDesc}`,
      hoverBg: "hover:bg-[#25D366]/10",
    },
    {
      name: "Telegram",
      icon: <Send className="h-5 w-5" />,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      hoverBg: "hover:bg-[#26A5E4]/10",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      hoverBg: "hover:bg-[#0A66C2]/10",
    },
  ];

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The share link has been copied to your clipboard.",
      });
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast({
          title: "Link copied!",
          description: "The share link has been copied to your clipboard.",
        });
      } catch {
        toast({
          title: "Failed to copy",
          description: "Please copy the link manually from the address bar.",
          variant: "destructive",
        });
      }
    }
  }, [url]);

  const handleShareClick = useCallback((href: string) => {
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=500");
  }, []);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  // Register escape key listener
  useState(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  });

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Glassmorphism backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Popup panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 28,
            }}
            className="fixed left-1/2 top-1/2 z-[80] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2"
            role="dialog"
            aria-modal="true"
            aria-label="Share article"
          >
            <div className="rounded-2xl border border-border/50 bg-card/90 p-6 shadow-2xl backdrop-blur-xl">
              {/* Header */}
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">
                  Share this article
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={onClose}
                  aria-label="Close share popup"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Article preview */}
              <div className="mb-5 rounded-xl border border-border/30 bg-muted/50 p-3">
                <p className="mb-1 line-clamp-2 text-sm font-semibold text-foreground">
                  {title}
                </p>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {description}
                </p>
              </div>

              {/* Social share buttons — 3-column grid on all sizes */}
              <div className="mb-4 grid grid-cols-3 gap-3">
                {shareButtons.map((btn) => (
                  <Button
                    key={btn.name}
                    variant="outline"
                    className={cn(
                      "h-auto flex-col gap-2 rounded-xl border-border/50 bg-transparent",
                      "px-2 py-3 transition-all duration-200",
                      btn.hoverBg,
                      "hover:shadow-md hover:border-border/80"
                    )}
                    onClick={() => handleShareClick(btn.href)}
                  >
                    <span className="text-foreground">{btn.icon}</span>
                    <span className="text-xs font-medium text-foreground/70">
                      {btn.name}
                    </span>
                  </Button>
                ))}
              </div>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card/90 px-3 text-xs text-muted-foreground backdrop-blur-xl">
                    or
                  </span>
                </div>
              </div>

              {/* Copy link */}
              <Button
                variant="outline"
                className={cn(
                  "w-full h-auto flex items-center gap-3 rounded-xl border-border/50",
                  "bg-transparent py-3 px-4 transition-all duration-200",
                  "hover:bg-muted/50 hover:border-border/80 hover:shadow-md"
                )}
                onClick={handleCopyLink}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600/10">
                  <Link2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">
                    Copy share link
                  </p>
                  <p className="max-w-[240px] truncate text-xs text-muted-foreground">
                    {url}
                  </p>
                </div>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
