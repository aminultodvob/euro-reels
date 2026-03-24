import { z } from "zod";

export const reelSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  url: z
    .string()
    .url("Must be a valid URL")
    .refine(
      (url) => url.includes("facebook.com") || url.includes("fb.watch"),
      "Must be a Facebook URL"
    ),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category too long"),
  contentType: z.enum(["REEL", "POST", "VIDEO"]).default("REEL"),
  thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const updateReelSchema = reelSchema.partial();

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type ReelInput = z.input<typeof reelSchema>;
export type UpdateReelInput = z.input<typeof updateReelSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
