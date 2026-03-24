import type { CatalogContentType } from "@/lib/catalog";

/**
 * Generates a Facebook embed URL from a reel/video URL.
 * Falls back to the plugin embed format which works for public videos.
 */
export function inferContentType(url: string): CatalogContentType {
  const value = url.toLowerCase();

  if (value.includes("/posts/") || value.includes("story.php")) {
    return "POST";
  }

  if (value.includes("/videos/") || value.includes("watch/?v=") || value.includes("watch?v=")) {
    return "VIDEO";
  }

  return "REEL";
}

export function generateEmbedUrl(url: string, contentType?: CatalogContentType): string {
  const type = contentType ?? inferContentType(url);
  const encoded = encodeURIComponent(url);
  if (type === "POST") {
    return `https://www.facebook.com/plugins/post.php?href=${encoded}&show_text=true&width=500`;
  }

  return `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&appId=`;
}

/**
 * Extracts a reel/video ID from various Facebook URL formats.
 */
export function extractReelId(url: string): string | null {
  try {
    const u = new URL(url);

    // format: /reel/123456789
    const reelMatch = u.pathname.match(/\/reel\/(\d+)/);
    if (reelMatch) return reelMatch[1];

    // format: /videos/123456789
    const videoMatch = u.pathname.match(/\/videos\/(\d+)/);
    if (videoMatch) return videoMatch[1];

    // format: ?v=123456789
    const v = u.searchParams.get("v");
    if (v) return v;

    // format: fb.watch/xxxxx => use full url
    if (u.hostname === "fb.watch") return u.pathname.replace("/", "");

    return null;
  } catch {
    return null;
  }
}

/**
 * Returns an array of unique category names from reels.
 */
export function extractCategories(
  reels: Array<{ category: string }>
): string[] {
  const seen = new Set<string>();
  const cats: string[] = ["All"];
  for (const r of reels) {
    if (!seen.has(r.category)) {
      seen.add(r.category);
      cats.push(r.category);
    }
  }
  return cats;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
