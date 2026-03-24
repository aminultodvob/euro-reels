"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reelSchema, type ReelInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";

interface Reel {
  id: string;
  title: string;
  url: string;
  category: string;
  contentType: "REEL" | "POST" | "VIDEO";
  thumbnail?: string | null;
}

interface ReelFormProps {
  reel?: Reel;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReelForm({ reel, onSuccess, onCancel }: ReelFormProps) {
  const isEdit = !!reel;
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReelInput>({
    resolver: zodResolver(reelSchema),
    defaultValues: reel
      ? {
          title: reel.title,
          url: reel.url,
          category: reel.category,
          contentType: reel.contentType,
          thumbnail: reel.thumbnail ?? "",
        }
      : {
          contentType: "REEL",
        },
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories((data.categories ?? []).map((item: { name: string }) => item.name)))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (reel) {
      reset({
        title: reel.title,
        url: reel.url,
        category: reel.category,
        contentType: reel.contentType,
        thumbnail: reel.thumbnail ?? "",
      });
    }
  }, [reel, reset]);

  const onSubmit = async (data: ReelInput) => {
    setLoading(true);
    setApiError("");

    try {
      const url = isEdit ? `/api/reels/${reel!.id}` : "/api/reels";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Request failed");
      }

      onSuccess();
      if (!isEdit) reset();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {apiError && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {apiError}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reel-title">Title *</Label>
        <Input id="reel-title" placeholder="Enter reel title" {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reel-url">Facebook URL *</Label>
        <Input
          id="reel-url"
          placeholder="https://www.facebook.com/reel/... or /posts/..."
          {...register("url")}
        />
        {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
        <p className="text-xs text-muted-foreground">
          Supports: facebook.com/reel/..., /posts/..., /videos/..., ?v=..., fb.watch/...
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content-type">Content Type *</Label>
        <select
          id="content-type"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          {...register("contentType")}
        >
          <option value="REEL">Reel</option>
          <option value="POST">Post</option>
          <option value="VIDEO">Video</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reel-category">Category *</Label>
        <select
          id="reel-category"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          {...register("category")}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reel-thumbnail">Thumbnail URL (optional, mostly for reels/videos)</Label>
        <Input
          id="reel-thumbnail"
          placeholder="https://example.com/image.jpg"
          {...register("thumbnail")}
        />
        {errors.thumbnail && (
          <p className="text-xs text-destructive">{errors.thumbnail.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Saving..." : "Adding..."}
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Add Content"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          <X className="mr-1.5 h-4 w-4" /> Cancel
        </Button>
      </div>
    </form>
  );
}
