"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div className="rounded-2xl border bg-card/80 p-4 shadow-sm backdrop-blur">
      <div className="mb-3">
        <p className="text-sm font-semibold">Browse By Category</p>
        <p className="text-xs text-muted-foreground">Jump straight into the content type you want.</p>
      </div>

      {/* Mobile: horizontal scroll chips */}
      <div className="md:hidden -mx-1 px-1 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-1 w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`category-mobile-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => onChange(cat)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-medium border transition-all",
                active === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25"
                  : "bg-background text-muted-foreground border-input hover:border-primary/50 hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: wrapped pills */}
      <div className="hidden flex-wrap gap-2 md:flex">
        {categories.map((cat) => (
          <Button
            key={cat}
            id={`category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
            variant={active === cat ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(cat)}
            className={cn(
              "rounded-full text-xs font-medium transition-all",
              active === cat && "shadow-md shadow-primary/25"
            )}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>
  );
}
