"use client";

import Image from "next/image";
import { Play, Eye, FileText, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

interface ReelCardProps {
  reel: Reel;
  onOpenViewer?: (reel: Reel) => void;
}

export function ReelCard({ reel, onOpenViewer }: ReelCardProps) {
  const isPost = reel.contentType === "POST";

  const handleOpen = () => {
    if (!isPost && onOpenViewer) {
      onOpenViewer(reel);
      return;
    }

    fetch(`/api/reels/${reel.id}`).catch(() => {});
    window.open(reel.url, "_blank", "noopener,noreferrer");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: reel.title,
        url: reel.url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(reel.url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <article
      id={`reel-card-${reel.id}`}
      className="reel-card group flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleOpen()}
    >
      <div className="relative overflow-hidden bg-black aspect-[9/16] sm:aspect-video">
        <div className="group relative h-full w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
          {reel.thumbnail ? (
            <Image
              src={reel.thumbnail}
              alt={reel.title}
              fill
              className="object-cover opacity-80 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
            />
          ) : (
            <>
              <iframe
                src={reel.embedUrl}
                title={`${reel.title} preview`}
                loading="lazy"
                scrolling="no"
                frameBorder="0"
                className="pointer-events-none absolute inset-0 h-full w-full scale-[1.02] border-none"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                style={{ overflow: "hidden" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </>
          )}

          {/* Type Badge Overlay */}
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="secondary" className="bg-black/50 text-white border-transparent backdrop-blur-md px-2 py-0.5 text-[10px] uppercase tracking-wider">
              {reel.contentType === "POST" ? "Post" : reel.contentType === "VIDEO" ? "Video" : "Reel"}
            </Badge>
          </div>

          {/* Share Button Overlay */}
          <button 
            onClick={handleShare}
            className="absolute top-3 right-3 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
          >
            <Share2 className="h-4 w-4" />
          </button>

          {/* Play Icon Overlay */}
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/30 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
            {isPost ? (
              <FileText className="h-7 w-7 text-white" />
            ) : (
              <Play className="ml-1 h-7 w-7 fill-white text-white" />
            )}
          </div>

          {/* View Count Overlay Background */}
          <div className="absolute bottom-0 inset-x-0 h-2/5 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          
          <div className="absolute bottom-3 left-3 text-white z-10 flex items-center gap-1 text-xs font-medium">
            <Eye className="h-3.5 w-3.5" />
            <span>{reel.viewCount >= 1000 ? `${(reel.viewCount / 1000).toFixed(1)}k` : reel.viewCount} views</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug group-hover:text-primary transition-colors">{reel.title}</h3>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md">
            {reel.category}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            {formatDate(reel.createdAt)}
          </span>
        </div>
      </div>
    </article>
  );
}
