import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Film, Eye, TrendingUp, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getStats() {
  const [totalReels, totalViews, recentReels, categories] = await Promise.all([
    prisma.reel.count(),
    prisma.reel.aggregate({ _sum: { viewCount: true } }),
    prisma.reel.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.reel.groupBy({ by: ["category"], _count: { category: true } }),
  ]);

  return { totalReels, totalViews: totalViews._sum.viewCount ?? 0, recentReels, categories };
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const { totalReels, totalViews, recentReels, categories } = await getStats();

  const stats = [
    { label: "Total Reels", value: totalReels, icon: Film, color: "text-blue-500" },
    { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye, color: "text-green-500" },
    { label: "Categories", value: categories.length, icon: TrendingUp, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back, {session?.user?.email}</p>
        </div>
        <Button asChild id="add-reel-btn">
          <Link href="/admin/reels?action=new">
            <Plus className="mr-2 h-4 w-4" /> Add Reel
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Reels</CardTitle>
            <Link href="/admin/reels" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentReels.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No reels yet.</p>
            ) : (
              recentReels.map((reel) => (
                <div key={reel.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{reel.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {reel.contentType} · {formatDate(reel.createdAt)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                    {reel.category}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Reels by Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No categories yet.</p>
            ) : (
              categories.map(({ category, _count }) => (
                <div key={category} className="flex items-center gap-3">
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{category}</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${Math.max(8, (_count.category / totalReels) * 120)}px` }}
                    />
                    <span className="w-6 text-right text-xs text-muted-foreground">
                      {_count.category}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">All Categories</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {categories.map(({ category, _count }) => (
            <Badge key={category} variant="secondary" className="px-3 py-1 text-xs">
              {category} ({_count.category})
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
