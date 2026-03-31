"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Play, Moon, Sun, X, LayoutDashboard, LogIn, Search, UserPlus, LogOut } from "lucide-react";
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

  const handleSignOut = async () => {
    const result = await signOut({
      callbackUrl: "/admin/login",
      redirect: false,
    });

    window.location.assign(result.url || "/admin/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-lg">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="shrink-0 text-lg font-bold">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Play className="h-3.5 w-3.5 fill-primary-foreground text-primary-foreground" />
            </div>
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              EuroReel
            </span>
          </div>
        </Link>

        <div className="mx-8 hidden max-w-md flex-1 md:block">
          {onSearch && <SearchBar onSearch={onSearch} placeholder="Search reels..." />}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
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
            <>
              <Link href="/admin/dashboard" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="hidden items-center gap-2 sm:inline-flex"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/admin/login" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
              <Link href="/admin/signup" className="hidden sm:block">
                <Button size="sm" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Button>
              </Link>
            </>
          )}

          <Button
            id="theme-toggle"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {searchOpen && onSearch && (
        <div className="border-t border-border/40 bg-background/95 px-4 py-3 md:hidden">
          <SearchBar onSearch={(q) => onSearch(q)} placeholder="Search reels..." className="w-full" />
        </div>
      )}

      <div className="border-t border-border/30 bg-background/95 px-4 py-2 sm:hidden">
        {session ? (
          <div className="flex gap-2">
            <Link href="/admin/dashboard" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Button variant="default" size="sm" className="flex-1" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/admin/login" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
            <Link href="/admin/signup" className="flex-1">
              <Button size="sm" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
