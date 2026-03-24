"use client";

import { ReelCard } from "@/components/reel-card";

interface Reel {
  id: string;
  title: string;
  url: string;
  embedUrl: string;
  category: string;
  contentType: "REEL" | "POST" | "VIDEO";
  thumbnail?: string | null;
  viewCount: number;
  createdAt: string | Date;
}

interface ReelGridProps {
  reels: Reel[];
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card">
      <div className="skeleton aspect-video w-full" />
      <div className="flex flex-col gap-3 p-4">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-8 w-full rounded" />
      </div>
    </div>
  );
}

export function ReelGrid({ reels, loading }: ReelGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 text-6xl">🎬</div>
        <h3 className="text-xl font-semibold">No reels found</h3>
        <p className="mt-2 text-muted-foreground text-sm">
          Try a different search or category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {reels.map((reel, i) => (
        <div
          key={reel.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <ReelCard reel={reel} />
        </div>
      ))}
    </div>
  );
}
