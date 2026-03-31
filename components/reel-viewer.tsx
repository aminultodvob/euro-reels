"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ExternalLink, Eye, Play, X, Share2, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReelEmbed } from "@/components/reel-embed";
import { formatDate, cn } from "@/lib/utils";

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
  onClose: () => void;
}

function ViewerItem({ reel, active, onActive, onClose }: ViewerItemProps) {
  const viewedRef = useRef(false);
  const itemRef = useRef<HTMLDivElement | null>(null);
  const [liked, setLiked] = useState(false);

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
    <section ref={itemRef} className="snap-start relative h-screen w-full flex items-center justify-center bg-black">
      {/* Background Dim */}
      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md h-full sm:h-[90vh] flex flex-col sm:justify-center overflow-hidden">
        
        {/* Video Area */}
        <div className="relative flex-1 bg-black sm:rounded-[2rem] overflow-hidden lg:shadow-2xl">
          {active ? (
            <div className="absolute inset-0">
              <ReelEmbed reel={reel} autoplay />
            </div>
          ) : reel.thumbnail ? (
            <div className="absolute inset-x-0 inset-y-0">
              <Image
                src={reel.thumbnail}
                alt={reel.title}
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="h-20 w-20 text-white/50" />
              </div>
            </div>
          ) : (
             <div className="absolute inset-0 bg-slate-900" />
          )}

          {/* Top Actions (Mobile only) */}
          <div className="absolute top-4 left-4 sm:hidden">
            <Badge className="bg-black/40 backdrop-blur-md border-none text-white px-3 py-1">
              {reel.category}
            </Badge>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 h-10 w-10 sm:hidden flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Right Side Interactions (Mobile specific style) */}
          <div className="absolute right-4 bottom-32 sm:bottom-12 z-20 flex flex-col gap-5 items-center">
             <button onClick={() => setLiked(!liked)} className="flex flex-col items-center gap-1 group">
               <div className={cn("h-12 w-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md transition-all group-active:scale-90", liked ? "text-red-500 bg-red-500/20" : "text-white")}>
                 <Heart className={cn("h-7 w-7", liked && "fill-red-500")} />
               </div>
               <span className="text-white text-[10px] font-bold text-shadow">Like</span>
             </button>

             <button onClick={() => {
                if(navigator.share) navigator.share({title: reel.title, url: reel.url});
                else { navigator.clipboard.writeText(reel.url); alert("Copied!"); }
             }} className="flex flex-col items-center gap-1 group">
               <div className="h-12 w-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white transition-all group-active:scale-90">
                 <Share2 className="h-7 w-7" />
               </div>
               <span className="text-white text-[10px] font-bold text-shadow">Share</span>
             </button>

             <div className="flex flex-col items-center gap-1">
               <div className="h-12 w-12 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white">
                 <Eye className="h-7 w-7" />
               </div>
               <span className="text-white text-[10px] font-bold text-shadow">{reel.viewCount >= 1000 ? `${(reel.viewCount/1000).toFixed(1)}k` : reel.viewCount}</span>
             </div>
          </div>

          {/* Bottom Info Overlay (Mobile Style) */}
          <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white pointer-events-none">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">{contentLabel}</p>
            <h2 className="text-xl font-bold leading-tight line-clamp-2 drop-shadow-md">{reel.title}</h2>
            <div className="mt-3 flex items-center gap-3">
               <Badge variant="secondary" className="sm:inline-flex hidden bg-white/20 text-white border-transparent backdrop-blur-sm">{reel.category}</Badge>
               <span className="text-xs opacity-70 font-medium">{formatDate(reel.createdAt)}</span>
            </div>
            <div className="mt-4 pointer-events-auto sm:flex hidden">
               <Button size="sm" className="w-full sm:w-auto rounded-full px-6" asChild>
                 <a href={reel.url} target="_blank" rel="noopener noreferrer">
                   <ExternalLink className="mr-2 h-4 w-4" /> Open on Facebook
                 </a>
               </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop side button for info/actions if needed? No, overlay is cleaner even on desktop for this view */}
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
    <div className="fixed inset-0 z-[100] bg-black animate-in fade-in duration-300">
      {/* Desktop Close Button */}
      <div className="absolute right-6 top-6 z-[110] hidden sm:block">
        <Button variant="ghost" size="icon" onClick={onClose} className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md">
          <X className="h-7 w-7" />
        </Button>
      </div>

      <div className="h-screen snap-y snap-mandatory overflow-y-auto overscroll-y-contain scrollbar-hide">
        {reels.map((reel) => (
          <ViewerItem
            key={reel.id}
            reel={reel}
            active={activeId === reel.id}
            onActive={setActiveId}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}
