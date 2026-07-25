export interface Feature {
  id: string;
  categorySlug: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  highlight: boolean;
  isActive: boolean;
  order: number;
  uiType: "converter" | "compressor" | "resizer" | "editor";
}
