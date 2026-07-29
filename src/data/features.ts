import { Feature } from "../types/feature";

export const features: Feature[] = [
  // Convert
  { id: "feat_png-to-jpg", categorySlug: "convert", name: "PNG to JPG", slug: "png-to-jpg", description: "Make files smaller and easier to share.", icon: "lucide:image", highlight: true, isActive: true, order: 0, uiType: "converter" },
  { id: "feat_jpg-to-png", categorySlug: "convert", name: "JPG to PNG", slug: "jpg-to-png", description: "Keep high quality and transparent backgrounds.", icon: "lucide:images", highlight: true, isActive: true, order: 1, uiType: "converter" },
  { id: "feat_webp-converter", categorySlug: "convert", name: "WebP Converter", slug: "webp-converter", description: "Create modern, fast-loading images for the web.", icon: "lucide:globe", highlight: true, isActive: true, order: 2, uiType: "converter" },
  { id: "feat_svg-to-png", categorySlug: "convert", name: "SVG to PNG", slug: "svg-to-png", description: "Rasterize vector graphics easily.", icon: "lucide:shapes", highlight: false, isActive: true, order: 3, uiType: "converter" },
  { id: "feat_gif-to-mp4", categorySlug: "convert", name: "GIF to MP4", slug: "gif-to-mp4", description: "Convert animations to video files.", icon: "lucide:film", highlight: false, isActive: true, order: 4, uiType: "converter" },

  // Compress
  { id: "feat_compress-images", categorySlug: "compress", name: "Compress images", slug: "compress-images", description: "Quickly shrink image file sizes.", icon: "lucide:shrink", highlight: true, isActive: true, order: 0, uiType: "compressor" },
  { id: "feat_reduce-file-size", categorySlug: "compress", name: "Reduce file size", slug: "reduce-file-size", description: "Compress to a specific target KB size.", icon: "lucide:minimize-2", highlight: true, isActive: true, order: 1, uiType: "compressor" },
  { id: "feat_lossless", categorySlug: "compress", name: "Lossless compression", slug: "lossless", description: "Reduce size without losing any visual quality.", icon: "lucide:layers", highlight: true, isActive: true, order: 2, uiType: "compressor" },

  // Tools
  { id: "feat_image-editor", categorySlug: "tools", name: "Image Editor", slug: "image-editor", description: "All-in-one studio to crop, resize, rotate, and edit images.", icon: "lucide:palette", highlight: true, isActive: true, order: 0, uiType: "editor" },
  { id: "feat_background-remover", categorySlug: "tools", name: "Background Remover", slug: "background-remover", description: "Instantly remove image backgrounds using AI, right in your browser.", icon: "lucide:eraser", highlight: true, isActive: true, order: 1, uiType: "remove-bg" },
  { id: "feat_crop-images", categorySlug: "tools", name: "Crop images", slug: "crop-images", description: "Cut out parts of the image you don't need.", icon: "lucide:crop", highlight: true, isActive: true, order: 2, uiType: "editor" },
  { id: "feat_resize-images", categorySlug: "tools", name: "Resize images", slug: "resize-images", description: "Make your image larger or smaller.", icon: "lucide:expand", highlight: true, isActive: true, order: 3, uiType: "editor" },
  { id: "feat_aspect-ratio", categorySlug: "tools", name: "Change aspect ratio", slug: "aspect-ratio", description: "Change the shape to fit social media.", icon: "lucide:monitor", highlight: true, isActive: true, order: 4, uiType: "editor" },
  { id: "feat_watermark", categorySlug: "tools", name: "Add Watermark", slug: "watermark", description: "Protect your images with a custom watermark.", icon: "lucide:stamp", highlight: true, isActive: true, order: 5, uiType: "editor" },
  { id: "feat_rotate-images", categorySlug: "tools", name: "Rotate images", slug: "rotate-images", description: "Turn your image left or right.", icon: "lucide:rotate-cw", highlight: false, isActive: true, order: 6, uiType: "editor" },
  { id: "feat_flip-images", categorySlug: "tools", name: "Flip images", slug: "flip-images", description: "Flip your image like a mirror.", icon: "lucide:flip-horizontal", highlight: false, isActive: true, order: 7, uiType: "editor" },
  { id: "feat_size-checker", categorySlug: "tools", name: "Image size checker", slug: "size-checker", description: "See exactly how big your file is.", icon: "lucide:info", highlight: false, isActive: true, order: 8, uiType: "editor" },

  // --- IN PROGRESS: Unfinished Features (isActive: false) ---
  { id: "feat_image-border", categorySlug: "tools", name: "Image Border & Frame", slug: "image-border", description: "Add stylish borders and frames around your images.", icon: "lucide:frame", highlight: false, isActive: false, isComingSoon: true, order: 9, uiType: "editor" },
  { id: "feat_image-filters", categorySlug: "tools", name: "Image Filters", slug: "image-filters", description: "Apply beautiful filters like grayscale, sepia, and vintage to your photos.", icon: "lucide:sparkles", highlight: false, isActive: false, isComingSoon: true, order: 10, uiType: "editor" },
  { id: "feat_image-to-pdf", categorySlug: "convert", name: "Image to PDF", slug: "image-to-pdf", description: "Convert any image into a PDF document instantly.", icon: "lucide:file-text", highlight: false, isActive: false, isComingSoon: true, order: 11, uiType: "converter" },
  { id: "feat_add-text", categorySlug: "tools", name: "Add Text to Image", slug: "add-text", description: "Add custom text, captions, and labels on top of your images.", icon: "lucide:type", highlight: false, isActive: false, isComingSoon: true, order: 12, uiType: "editor" },
];
