"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Film, LogOut, Play, ChevronRight, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/reels", label: "Manage Reels", icon: Film },
  { href: "/admin/categories", label: "Categories", icon: Tags },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border/60 bg-card">
      <div className="flex items-center gap-3 border-b border-border/60 p-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Play className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
        </div>
        <div>
          <p className="font-bold leading-none">EuroReel</p>
          <p className="mt-0.5 text-xs leading-none text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              id={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {active && <ChevronRight className="ml-auto h-4 w-4 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-border/60 p-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          id="sidebar-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {"<-"} View Public Site
        </Link>
      </div>
    </aside>
  );
}
