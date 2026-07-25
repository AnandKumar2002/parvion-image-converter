import { categories } from "../data/categories";
import { features } from "../data/features";
import { Category } from "../types/category";
import { Feature } from "../types/feature";

export class FeatureService {
  static async getCategories(): Promise<Category[]> {
    return categories.filter((c) => c.isActive).sort((a, b) => a.order - b.order);
  }

  static async getCategory(slug: string): Promise<Category | undefined> {
    return categories.find((c) => c.slug === slug && c.isActive);
  }

  static async getFeatures(): Promise<Feature[]> {
    return features.filter((f) => f.isActive).sort((a, b) => a.order - b.order);
  }

  static async getFeatureBySlug(slug: string): Promise<Feature | undefined> {
    return features.find((f) => f.slug === slug && f.isActive);
  }

  static async getHighlighted(): Promise<Feature[]> {
    return features.filter((f) => f.highlight && f.isActive).sort((a, b) => a.order - b.order);
  }

  static async getByCategory(categorySlug: string): Promise<Feature[]> {
    return features
      .filter((f) => f.categorySlug === categorySlug && f.isActive)
      .sort((a, b) => a.order - b.order);
  }

  static async search(query: string): Promise<Feature[]> {
    const q = query.toLowerCase();
    return features
      .filter(
        (f) =>
          f.isActive &&
          (f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q))
      )
      .sort((a, b) => a.order - b.order);
  }

  static async getActiveFeatures(): Promise<Feature[]> {
    return this.getFeatures();
  }
}
