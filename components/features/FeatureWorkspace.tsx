import { Feature } from "@/src/types/feature";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { UploadZone } from "./UploadZone";

const LoadingFallback = () => (
  <div className="w-full h-96 flex flex-col items-center justify-center bg-card/20 rounded-3xl border border-border/50 backdrop-blur-sm animate-pulse">
    <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
    <p className="text-muted-foreground font-medium">Loading tool...</p>
  </div>
);

const UniversalConverter = dynamic(() => import("./UniversalConverter/UniversalConverter").then(mod => mod.UniversalConverter), { 
  loading: () => <LoadingFallback />,
  ssr: false
});
const CompressorUI = dynamic(() => import("./CompressorUI").then(mod => mod.CompressorUI), { 
  loading: () => <LoadingFallback />,
  ssr: false
});
const ImageEditorUI = dynamic(() => import("./ImageEditor/ImageEditorUI").then(mod => mod.ImageEditorUI), { 
  loading: () => <LoadingFallback />,
  ssr: false
});
const RemoveBgUI = dynamic(() => import("./RemoveBgUI").then(mod => mod.RemoveBgUI), {
  loading: () => <LoadingFallback />,
  ssr: false
});
const ImageBorderUI = dynamic(() => import("./ImageBorderUI").then(mod => mod.ImageBorderUI), {
  loading: () => <LoadingFallback />,
  ssr: false
});
const ImageFiltersUI = dynamic(() => import("./ImageFiltersUI").then(mod => mod.ImageFiltersUI), {
  loading: () => <LoadingFallback />,
  ssr: false
});
const ImageToPdfUI = dynamic(() => import("./ImageToPdfUI").then(mod => mod.ImageToPdfUI), {
  loading: () => <LoadingFallback />,
  ssr: false
});

export function FeatureWorkspace({ feature }: { feature: Feature }) {
  // Component Registry / Strategy Pattern
  switch (feature.uiType) {
    case "converter":
      return <UniversalConverter featureSlug={feature.slug} />;
    case "compressor":
      return <CompressorUI feature={feature} />;
    case "editor":
      return <ImageEditorUI feature={feature} />;
    case "remove-bg":
      return <RemoveBgUI feature={feature} />;
    case "border":
      return <ImageBorderUI feature={feature} />;
    case "filters":
      return <ImageFiltersUI feature={feature} />;
    case "image-to-pdf":
      return <ImageToPdfUI feature={feature} />;
    default:
      return (
        <div className="space-y-8 animate-fade-in-up">
           <UploadZone title={`Upload images to ${feature.name.toLowerCase()}`} />
        </div>
      );
  }
}
