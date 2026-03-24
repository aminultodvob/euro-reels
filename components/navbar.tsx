"use client";

import Link from "next/link";
import { useState } from "react";
import { Play, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";

interface NavbarProps {
  onSearch?: (q: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    if (theme === "dark") setTheme("light");
    else setTheme("dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Play className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
          </div>
          <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            EuroReel
          </span>
        </Link>

        {/* Center search - desktop */}
        <div className="hidden flex-1 max-w-md mx-8 md:block">
          {onSearch && <SearchBar onSearch={onSearch} placeholder="Search reels..." />}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <Button
            id="theme-toggle"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile search */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/40 px-4 py-3">
          {onSearch && (
            <SearchBar onSearch={(q) => { onSearch(q); setMenuOpen(false); }} placeholder="Search reels..." />
          )}
        </div>
      )}
    </header>
  );
}
