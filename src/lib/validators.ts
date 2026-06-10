import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  service: z.enum(["marketing", "printing", "flyers", "digital", "full"]),
  brief: z.string().max(2000).optional(),
});

export const portfolioProjectSchema = z.object({
  title_en: z.string().max(200),
  title_ar: z.string().max(200),
  category: z.string().max(100),
  description_en: z.string().max(2000),
  description_ar: z.string().max(2000),
  image_url: z.string().max(500),
  sort_order: z.number().int().min(0),
  visible: z.boolean(),
});

export const serviceSchema = z.object({
  name_en: z.string().max(200),
  name_ar: z.string().max(200),
  description_en: z.string().max(2000),
  description_ar: z.string().max(2000),
  icon: z.string().max(50),
  price: z.string().max(100),
  image_url: z.string().max(500),
  sort_order: z.number().int().min(0),
  visible: z.boolean(),
});

export const contentTranslationSchema = z.object({
  section: z.string().min(1).max(50),
  key: z.string().min(1).max(100),
  locale: z.enum(["en", "ar"]),
  value: z.string().max(5000),
});

export const siteSettingsSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().max(1000),
});

export const invitationSchema = z.object({
  email: z.string().email(),
  role: z.enum(["Super_Admin", "Admin", "Editor"]),
});

export const apiCredentialSchema = z.object({
  name: z.string().min(1).max(100),
  value: z.string().min(1),
  provider: z.string().min(1).max(50),
});

export const urlSchema = z.string().url().max(500);

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(2000),
});
