"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div className="rounded-2xl border bg-card/80 p-4 shadow-sm backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Browse By Category</p>
          <p className="text-xs text-muted-foreground">
            Jump straight into the content type you want.
          </p>
        </div>
      </div>

      <div className="md:hidden">
        <Label htmlFor="category-select" className="mb-2 block text-xs text-muted-foreground">
          Select category
        </Label>
        <select
          id="category-select"
          value={active}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

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
