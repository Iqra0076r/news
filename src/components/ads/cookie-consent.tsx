"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "saveitbro-cookie-consent";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      // Show after a short delay so the page loads first
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = useCallback(() => {
    localStorage.setItem(
      COOKIE_KEY,
      JSON.stringify({
        accepted: true,
        date: new Date().toISOString(),
        version: 1,
      })
    );
    setShow(false);
  }, []);

  const acceptNecessary = useCallback(() => {
    localStorage.setItem(
      COOKIE_KEY,
      JSON.stringify({
        accepted: "necessary",
        date: new Date().toISOString(),
        version: 1,
      })
    );
    setShow(false);
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:p-4"
      >
        <div className="mx-auto max-w-3xl rounded-xl border border-border/50 bg-card shadow-2xl shadow-black/20 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <Cookie className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold">We value your privacy</h3>
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                We use cookies and similar technologies to enhance your browsing
                experience, serve personalized ads, and analyze our traffic. By
                clicking &quot;Accept All&quot;, you consent to our use of cookies.{" "}
                <button
                  onClick={() => {
                    setShow(false);
                    // Navigate to privacy view via store
                    window.location.hash = "#privacy";
                  }}
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  Privacy Policy
                </button>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs h-8 px-4 rounded-lg"
                >
                  Accept All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptNecessary}
                  className="text-xs h-8 px-4 rounded-lg"
                >
                  Necessary Only
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={acceptNecessary}
                  className="text-xs h-8 px-3 rounded-lg text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
