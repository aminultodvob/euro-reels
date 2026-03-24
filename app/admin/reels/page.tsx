"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, ExternalLink, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ReelForm } from "@/components/reel-form";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

interface Reel {
  id: string;
  title: string;
  url: string;
  embedUrl: string;
  category: string;
  contentType: "REEL" | "POST" | "VIDEO";
  thumbnail?: string | null;
  viewCount: number;
  createdAt: string;
}

export default function AdminReelsPage() {
  const { toast } = useToast();
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReel, setEditingReel] = useState<Reel | null>(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReels = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "200" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/reels?${params}`);
      const data = await res.json();
      setReels(data.reels ?? []);
    } catch {
      toast({ title: "Error", description: "Failed to fetch reels", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [search, toast]);

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/reels/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: "Deleted", description: `"${title}" was removed.` });
      fetchReels();
    } catch {
      toast({ title: "Error", description: "Failed to delete reel", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSuccess = () => {
    toast({
      title: editingReel ? "Updated!" : "Reel added!",
      description: editingReel ? "Reel updated successfully." : "New reel is now live.",
    });
    setShowForm(false);
    setEditingReel(null);
    fetchReels();
  };

  const openAdd = () => { setEditingReel(null); setShowForm(true); };
  const openEdit = (reel: Reel) => { setEditingReel(reel); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingReel(null); };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Content</h1>
          <p className="text-sm text-muted-foreground mt-1">{reels.length} total items</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={fetchReels} id="refresh-btn">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={openAdd} id="add-reel-btn">
            <Plus className="mr-2 h-4 w-4" /> Add Content
          </Button>
        </div>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="mb-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            {editingReel ? "Edit Content" : "Add New Content"}
          </h2>
          <ReelForm
            reel={editingReel ?? undefined}
            onSuccess={handleFormSuccess}
            onCancel={closeForm}
          />
        </div>
      )}

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="admin-search"
          placeholder="Search content by title or category..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Views</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3" colSpan={5}>
                      <div className="skeleton h-5 w-full rounded" />
                    </td>
                  </tr>
                ))
              ) : reels.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No content found. Add your first item.
                  </td>
                </tr>
              ) : (
                reels.map((reel) => (
                  <tr key={reel.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium line-clamp-1 max-w-[240px] block">{reel.title}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge variant="secondary">{reel.category}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                      {reel.contentType}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                      {reel.viewCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                      {formatDate(reel.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8"
                          id={`view-${reel.id}`}
                        >
                          <a href={reel.url} target="_blank" rel="noopener noreferrer" title="Open on Facebook">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(reel)}
                          className="h-8 w-8"
                          id={`edit-${reel.id}`}
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(reel.id, reel.title)}
                          disabled={deletingId === reel.id}
                          className="h-8 w-8 hover:text-destructive"
                          id={`delete-${reel.id}`}
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
