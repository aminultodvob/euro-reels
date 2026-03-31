"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Search, LayoutDashboard, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // On pages where we want it hidden, e.g., admin dashboard
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-around border-t border-border/40 bg-background/95 pb-safe backdrop-blur-lg md:hidden">
      <Link
        href="/"
        className={cn(
          "flex flex-col items-center justify-center gap-1 w-full h-full text-muted-foreground transition-colors hover:text-foreground",
          pathname === "/" && "text-primary hover:text-primary"
        )}
      >
        <Home className="h-5 w-5" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>

      <button
        onClick={() => {
          // A simple way to focus or open search logic if needed
          // For now, it will just scroll to top
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-1 w-full h-full text-muted-foreground transition-colors hover:text-foreground"
        )}
      >
        <Search className="h-5 w-5" />
        <span className="text-[10px] font-medium">Search</span>
      </button>

      {session ? (
        <Link
          href="/admin/dashboard"
          className={cn(
            "flex flex-col items-center justify-center gap-1 w-full h-full text-muted-foreground transition-colors hover:text-foreground",
            pathname.startsWith("/admin") && "text-primary hover:text-primary"
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[10px] font-medium">Admin</span>
        </Link>
      ) : (
        <Link
          href="/admin/login"
          className={cn(
            "flex flex-col items-center justify-center gap-1 w-full h-full text-muted-foreground transition-colors hover:text-foreground",
            pathname === "/admin/login" && "text-primary hover:text-primary"
          )}
        >
          <LogIn className="h-5 w-5" />
          <span className="text-[10px] font-medium">Login</span>
        </Link>
      )}
    </div>
  );
}
