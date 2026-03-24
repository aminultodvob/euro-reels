"use client";

import { useState, useCallback } from "react";
import { ExternalLink, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Reel {
  id: string;
  title: string;
  url: string;
  embedUrl: string;
  contentType: "REEL" | "POST" | "VIDEO";
}

export function ReelEmbed({ reel }: { reel: Reel }) {
  const [iframeError, setIframeError] = useState(false);
  const [key, setKey] = useState(0);

  const handleError = useCallback(() => {
    setIframeError(true);
  }, []);

  const handleRetry = useCallback(() => {
    setIframeError(false);
    setKey((k) => k + 1);
  }, []);

  if (iframeError) {
    return (
      <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-4 bg-muted/50 p-6 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground" />
        <div>
          <p className="font-medium text-sm">Embed Blocked</p>
          <p className="text-xs text-muted-foreground mt-1">
            Facebook blocked this {reel.contentType.toLowerCase()} embed. Open it directly on Facebook.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleRetry}>
            <RefreshCw className="mr-1.5 h-3 w-3" /> Retry
          </Button>
          <Button size="sm" asChild>
            <a href={reel.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 h-3 w-3" /> Watch on Facebook
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <iframe
      key={key}
      src={reel.embedUrl}
      title={reel.title}
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      allowFullScreen
      scrolling="no"
      frameBorder="0"
      onError={handleError}
      className="absolute inset-0 h-full w-full border-none"
      style={{ overflow: "hidden" }}
    />
  );
}
