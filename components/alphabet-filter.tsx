"use client";

import { cn } from "@/lib/utils";

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

      {/* Mobile & Desktop: horizontal scroll row */}
      <div className="-mx-1 px-1 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1.5 pb-1 w-max">
          {LETTERS.map((letter) => (
            <button
              key={letter}
              onClick={() => onChange(letter)}
              aria-label={`Filter by ${letter}`}
              className={cn(
                "shrink-0 h-9 min-w-[2.25rem] px-2 rounded-xl text-xs font-semibold border transition-all",
                active === letter
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25"
                  : "bg-background text-muted-foreground border-input hover:border-primary/50 hover:text-foreground"
              )}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
