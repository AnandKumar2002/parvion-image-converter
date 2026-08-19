import { MetadataRoute } from "next";
import { categories } from "@/src/data/categories";
import { features } from "@/src/data/features";
import { guides } from "@/src/data/guides";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://parvion.in";

  // Static/Main routes
  const routes = ["", "/about", "/contact", "/privacy", "/terms", "/guides"];
  const staticUrls = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic Category routes
  const categoryUrls = categories
    .filter((c) => c.isActive)
    .map((cat) => ({
      url: `${baseUrl}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // Dynamic Feature/Tool routes
  const featureUrls = features
    .filter((f) => f.isActive && !f.isComingSoon)
    .map((feat) => ({
      url: `${baseUrl}/${feat.categorySlug}/${feat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

  // Dynamic Guide routes
  const guideUrls = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...categoryUrls, ...featureUrls, ...guideUrls];
}
