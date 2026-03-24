"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Play, Eye, FileText } from "lucide-react";
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

interface ReelCardProps {
  reel: Reel;
}

export function ReelCard({ reel }: ReelCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isPost = reel.contentType === "POST";

  const handleOpen = () => {
    setExpanded(true);
    fetch(`/api/reels/${reel.id}`).catch(() => {});
  };

  return (
    <article
      id={`reel-card-${reel.id}`}
      className="reel-card group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm"
    >
      {/* Embed / Preview */}
      <div className="relative overflow-hidden bg-black">
        {expanded ? (
          <div className="fb-iframe-wrapper">
            <ReelEmbed reel={reel} />
          </div>
        ) : (
          <div
            className="group relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900"
            onClick={handleOpen}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleOpen()}
            aria-label={`${isPost ? "Open" : "Play"} ${reel.title}`}
          >
            {reel.thumbnail ? (
              <Image
                src={reel.thumbnail}
                alt={reel.title}
                fill
                className="object-cover opacity-70 transition-all duration-300 group-hover:scale-105 group-hover:opacity-80"
              />
            ) : (
              <>
                <iframe
                  src={reel.embedUrl}
                  title={`${reel.title} preview`}
                  loading="lazy"
                  scrolling="no"
                  frameBorder="0"
                  className="absolute inset-0 h-full w-full border-none pointer-events-none scale-[1.02]"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  style={{ overflow: "hidden" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              </>
            )}
            <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/30 transition-transform group-hover:scale-110">
              {isPost ? (
                <FileText className="h-6 w-6 text-white" />
              ) : (
                <Play className="ml-0.5 h-6 w-6 fill-white text-white" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{reel.title}</h3>
          <Badge variant="secondary" className="shrink-0 whitespace-nowrap text-xs">
            {reel.category}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{reel.contentType === "POST" ? "Facebook Post" : reel.contentType === "VIDEO" ? "Facebook Video" : "Facebook Reel"}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {reel.viewCount.toLocaleString()} views
          </span>
          <span>{formatDate(reel.createdAt)}</span>
        </div>

        <div className="mt-auto flex gap-2 pt-1">
          {!expanded && (
            <Button
              id={`watch-${reel.id}`}
              size="sm"
              className="flex-1"
              onClick={handleOpen}
            >
              {isPost ? (
                <FileText className="mr-1.5 h-3 w-3" />
              ) : (
                <Play className="mr-1.5 h-3 w-3 fill-current" />
              )}{" "}
              {isPost ? "Open" : "Watch"}
            </Button>
          )}
          <Button
            id={`fb-link-${reel.id}`}
            size="sm"
            variant="outline"
            className={expanded ? "flex-1" : ""}
            asChild
          >
            <a href={reel.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 h-3 w-3" /> Facebook
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
