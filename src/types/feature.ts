export interface Feature {
  id: string;
  categorySlug: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  highlight: boolean;
  isActive: boolean;
  isComingSoon?: boolean; // When true, feature is shown in UI but not yet built
  order: number;
  uiType: "converter" | "compressor" | "resizer" | "editor" | "remove-bg" | "border" | "filters";
}
