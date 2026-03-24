"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ExternalLink, Eye, Play, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReelEmbed } from "@/components/reel-embed";
import { formatDate } from "@/lib/utils";

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

interface ReelViewerProps {
  reels: Reel[];
  open: boolean;
  onClose: () => void;
}

interface ViewerItemProps {
  reel: Reel;
  active: boolean;
  onActive: (id: string) => void;
}

function ViewerItem({ reel, active, onActive }: ViewerItemProps) {
  const viewedRef = useRef(false);
  const itemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = itemRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
          onActive(reel.id);
          if (!viewedRef.current) {
            viewedRef.current = true;
            fetch(`/api/reels/${reel.id}`).catch(() => {});
          }
        }
      },
      { threshold: [0.35, 0.7, 0.9] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onActive, reel.id]);

  const contentLabel = useMemo(() => {
    if (reel.contentType === "VIDEO") return "Facebook Video";
    return "Facebook Reel";
  }, [reel.contentType]);

  return (
    <section ref={itemRef} className="snap-start">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center gap-4 px-4 py-6 lg:flex-row lg:items-center lg:justify-center lg:gap-8">
        <div className="relative w-full max-w-[390px] overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl">
          <div className="relative aspect-[9/16] w-full overflow-hidden">
            {active ? (
              <div className="absolute inset-0">
                <ReelEmbed reel={reel} autoplay />
              </div>
            ) : reel.thumbnail ? (
              <>
                <Image
                  src={reel.thumbnail}
                  alt={reel.title}
                  fill
                  className="object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur ring-2 ring-white/30">
                    <Play className="ml-1 h-7 w-7 fill-white text-white" />
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur ring-2 ring-white/30">
                  <Play className="ml-1 h-7 w-7 fill-white text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="w-full rounded-3xl border bg-card/90 p-5 shadow-xl backdrop-blur lg:max-w-sm">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {contentLabel}
              </p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight">{reel.title}</h2>
            </div>
            <Badge variant="secondary">{reel.category}</Badge>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="rounded-2xl border bg-background/70 p-3">
              <p className="text-xs uppercase tracking-wide">Views</p>
              <p className="mt-1 flex items-center gap-1 font-medium text-foreground">
                <Eye className="h-4 w-4" />
                {reel.viewCount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border bg-background/70 p-3">
              <p className="text-xs uppercase tracking-wide">Published</p>
              <p className="mt-1 font-medium text-foreground">{formatDate(reel.createdAt)}</p>
            </div>
          </div>

          <Button className="w-full" asChild>
            <a href={reel.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> Open on Facebook
            </a>
          </Button>
        </aside>
      </div>
    </section>
  );
}

export function ReelViewer({ reels, open, onClose }: ReelViewerProps) {
  const [activeId, setActiveId] = useState<string | null>(reels[0]?.id ?? null);

  useEffect(() => {
    setActiveId(reels[0]?.id ?? null);
  }, [reels]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open || reels.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm">
      <div className="absolute right-4 top-4 z-10">
        <Button variant="secondary" size="icon" onClick={onClose} aria-label="Close viewer">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-screen snap-y snap-mandatory overflow-y-auto overscroll-y-contain">
        {reels.map((reel) => (
          <ViewerItem
            key={reel.id}
            reel={reel}
            active={activeId === reel.id}
            onActive={setActiveId}
          />
        ))}
      </div>
    </div>
  );
}
