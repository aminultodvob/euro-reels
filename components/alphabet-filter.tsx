"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const LETTERS = ["All", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

interface AlphabetFilterProps {
  active: string;
  onChange: (letter: string) => void;
}

export function AlphabetFilter({ active, onChange }: AlphabetFilterProps) {
  return (
    <div className="rounded-2xl border bg-card/80 p-4 shadow-sm backdrop-blur">
      <div className="mb-3">
        <p className="text-sm font-semibold">A-Z Navigation</p>
        <p className="text-xs text-muted-foreground">Filter content by the first letter of the title.</p>
      </div>

      <div className="md:hidden">
        <Label htmlFor="alphabet-select" className="mb-2 block text-xs text-muted-foreground">
          Jump to letter
        </Label>
        <select
          id="alphabet-select"
          value={active}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        >
          {LETTERS.map((letter) => (
            <option key={letter} value={letter}>
              {letter}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden flex-wrap gap-2 md:flex">
        {LETTERS.map((letter) => (
          <Button
            key={letter}
            variant={active === letter ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(letter)}
            className={cn(
              "min-w-9 rounded-full px-3 text-xs font-medium transition-all",
              active === letter && "shadow-md shadow-primary/25"
            )}
          >
            {letter}
          </Button>
        ))}
      </div>
    </div>
  );
}
