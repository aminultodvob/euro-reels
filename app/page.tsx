"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { ReelGrid } from "@/components/reel-grid";
import { CategoryFilter } from "@/components/category-filter";
import { AlphabetFilter } from "@/components/alphabet-filter";
import { Pagination } from "@/components/pagination";
import { ReelViewer } from "@/components/reel-viewer";

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

interface ApiResponse {
  reels: Reel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CategoryResponse {
  categories: Array<{ name: string }>;
}

const LIMIT = 12;

export default function HomePage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLetter, setActiveLetter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerReels, setViewerReels] = useState<Reel[]>([]);

  const fetchReels = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
      });
      if (activeCategory !== "All") params.set("category", activeCategory);
      if (activeLetter !== "All") params.set("letter", activeLetter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/reels?${params}`);
      if (!res.ok) throw new Error("Failed to fetch reels");
      const data: ApiResponse = await res.json();
      setReels(data.reels || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
      setReels([]);
    } finally {
      setLoading(false);
    }
  }, [page, activeCategory, activeLetter, search]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error();
        const data: CategoryResponse = await res.json();
        setAllCategories(["All", ...(data.categories ?? []).map((item) => item.name)]);
      } catch {
        try {
          const res = await fetch("/api/reels?limit=200");
          if (!res.ok) return;
          const data: ApiResponse = await res.json();
          const names = Array.from(new Set((data.reels || []).map((item) => item.category))).sort(
            (a, b) => a.localeCompare(b)
          );
          setAllCategories(["All", ...names]);
        } catch (error) {
          console.error(error);
        }
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handleSearch = (q: string) => {
    setSearch(q);
    setPage(1);
  };

  const handleLetterChange = (letter: string) => {
    setActiveLetter(letter);
    setPage(1);
  };

  const handleOpenViewer = async (selected: Reel) => {
    try {
      if (selected.contentType === "POST") {
        window.open(selected.url, "_blank", "noopener,noreferrer");
        return;
      }

      const params = new URLSearchParams({ limit: "500" });
      if (activeCategory !== "All") params.set("category", activeCategory);
      if (activeLetter !== "All") params.set("letter", activeLetter);
      if (search) params.set("search", search);

      const response = await fetch(`/api/reels?${params}`);
      if (!response.ok) throw new Error("Failed to fetch viewer reels");
      const data: ApiResponse = await response.json();
      const items = (data.reels ?? []).filter((item) => item.contentType !== "POST");
      const others = items.filter((item) => item.id !== selected.id);

      for (let i = others.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [others[i], others[j]] = [others[j], others[i]];
      }

      setViewerReels([selected, ...others]);
      setViewerOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={handleSearch} />

      <section className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-background py-12 text-center">
        <h1 className="mb-3 bg-gradient-to-r from-primary via-blue-400 to-purple-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
          Euro & Lika Facebook Reels, Posts & Videos
        </h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          Facebook content by category, including reels, posts, and videos, all in one place.
        </p>
      </section>

      <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <CategoryFilter
            categories={allCategories}
            active={activeCategory}
            onChange={handleCategoryChange}
          />
        </div>

        <div className="mb-6">
          <AlphabetFilter active={activeLetter} onChange={handleLetterChange} />
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `Showing ${reels.length} items`}
          </p>
          <p className="text-sm text-muted-foreground">
            Sorted alphabetically{activeLetter !== "All" ? ` | ${activeLetter}` : ""}
          </p>
        </div>

        <ReelGrid reels={reels} loading={loading} onOpenViewer={handleOpenViewer} />

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </main>

      <ReelViewer reels={viewerReels} open={viewerOpen} onClose={() => setViewerOpen(false)} />

      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} EuroReel. All rights reserved.</p>
      </footer>
    </div>
  );
}
