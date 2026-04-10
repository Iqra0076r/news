"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function NewsCardSkeleton({ variant = "default" }: { variant?: "default" | "featured" | "compact" | "horizontal" }) {
  if (variant === "featured") {
    return (
      <div className="rounded-2xl border border-border/50 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <Skeleton className="aspect-[16/10] md:aspect-auto md:h-full" />
          <div className="p-6 flex flex-col gap-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className="flex gap-4 p-2">
        <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl shrink-0" />
        <div className="flex flex-col gap-2 flex-1 justify-center">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-start gap-3 py-3 border-b border-border/30">
        <Skeleton className="h-5 w-6" />
        <div className="flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3 mt-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/50 overflow-hidden">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-4 flex flex-col gap-2">
        <div className="flex gap-2">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-16" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <Skeleton className="h-[300px] sm:h-[400px] md:h-[500px] w-full" />
      <div className="p-6 flex flex-col gap-3 bg-card border-x border-b border-border/50 rounded-b-2xl">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} variant="horizontal" />
      ))}
    </div>
  );
}

export function CompactListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} variant="compact" />
      ))}
    </div>
  );
}
