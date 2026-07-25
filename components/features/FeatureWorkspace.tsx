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
  loading: () => <LoadingFallback />
});
const CompressorUI = dynamic(() => import("./CompressorUI").then(mod => mod.CompressorUI), { 
  loading: () => <LoadingFallback /> 
});
const ImageEditorUI = dynamic(() => import("./ImageEditor/ImageEditorUI").then(mod => mod.ImageEditorUI), { 
  loading: () => <LoadingFallback /> 
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
    default:
      return (
        <div className="space-y-8 animate-fade-in-up">
           <UploadZone title={`Upload images to ${feature.name.toLowerCase()}`} />
        </div>
      );
  }
}
