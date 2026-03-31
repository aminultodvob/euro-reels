"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Play, Moon, Sun, X, LayoutDashboard, LogIn, Search } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";

interface NavbarProps {
  onSearch?: (q: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: session } = useSession();

  const toggleTheme = () => {
    if (theme === "dark") setTheme("light");
    else setTheme("dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-lg">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Play className="h-3.5 w-3.5 fill-primary-foreground text-primary-foreground" />
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
        <div className="flex items-center gap-1">
          {/* Mobile search toggle */}
          {onSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
          )}

          {session ? (
            <Link href="/admin/dashboard" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
          ) : (
            <Link href="/admin/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
            </Link>
          )}

          <Button
            id="theme-toggle"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile search bar — slides open */}
      {searchOpen && onSearch && (
        <div className="md:hidden border-t border-border/40 px-4 py-3 bg-background/95">
          <SearchBar
            onSearch={(q) => { onSearch(q); }}
            placeholder="Search reels..."
            className="w-full"
          />
        </div>
      )}
    </header>
  );
}
