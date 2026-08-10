export interface CategoryContent {
  slug: string;
  editorNote: string;
  bodyParagraphs: string[];
  supportedFormats: { input: string[]; output: string[] };
  faqs: { question: string; answer: string }[];
}

export const categoryContents: Record<string, CategoryContent> = {
  convert: {
    slug: "convert",
    editorNote:
      "Switch between image formats instantly — all processing happens directly in your browser.",
    bodyParagraphs: [
      "Image format conversion is the process of re-encoding a digital image from one file format to another, such as converting a PNG to a JPG, or a JPEG to a modern WebP. Different formats suit different use cases: JPG is the universal choice for photographs shared online, PNG is preferred for graphics with text or transparent backgrounds, and WebP is the modern web standard that achieves the smallest file sizes without sacrificing quality.",
      "Parvion's browser-based converter handles all common format conversions without requiring any software download or file upload to a server. The conversion uses your browser's native Canvas API and image encoding capabilities, making it extremely fast — most images convert in well under a second. Because everything runs locally, your files are completely private.",
      "Whether you need to convert a batch of raw PNG exports from a design tool into deployment-ready WebP files, turn HEIC photos from your iPhone into universally viewable JPGs, or rasterize SVG icons into high-resolution PNGs for print, all of these workflows are covered by a single, free, browser-based converter.",
    ],
    supportedFormats: {
      input: ["JPG / JPEG", "PNG", "WebP", "GIF", "SVG", "HEIC / HEIF", "AVIF"],
      output: ["JPG / JPEG", "PNG", "WebP", "GIF", "SVG", "PDF"],
    },
    faqs: [
      {
        question: "Which image format should I use for my website?",
        answer:
          "WebP is the recommended format for modern websites — it delivers the smallest file sizes while maintaining excellent visual quality, and is supported by all major browsers released since 2020. Use JPG for photographs where you need broad legacy compatibility, and PNG for logos, icons, and any image requiring a transparent background.",
      },
      {
        question: "Does converting between formats degrade my image quality?",
        answer:
          "It depends on the conversion direction. Converting from a lossless format (PNG) to a lossy one (JPG or WebP lossy) will cause some compression artefacts, controllable via the quality slider. Converting from JPG to PNG does not improve quality — it just prevents further degradation. Converting between two lossless formats (PNG to lossless WebP) is always quality-neutral.",
      },
      {
        question: "Can I convert multiple images at once?",
        answer:
          "Yes. Upload as many files as you need — the converter processes them all simultaneously in your browser and lets you download the results as a ZIP archive.",
      },
    ],
  },

  compress: {
    slug: "compress",
    editorNote:
      "Shrink image files dramatically while keeping them looking great — no uploads, no wait.",
    bodyParagraphs: [
      "Image compression is the process of reducing a digital image's file size by encoding its pixel data more efficiently. There are two fundamentally different types: lossy compression (like JPEG and lossy WebP) discards fine detail that the human visual system is unlikely to notice, achieving dramatic file size reductions of 60–80%. Lossless compression (like PNG optimisation or lossless WebP) reorganises the data more cleverly without throwing any information away, typically achieving savings of 5–30%.",
      "Smaller image files load faster on websites, consume less storage on devices, and are easier to share via email or messaging apps. A study by Google found that 53% of mobile users abandon a website that takes longer than 3 seconds to load — and uncompressed images are one of the biggest causes of slow load times. Compressing images before uploading to a website is therefore one of the highest-impact optimisations a web developer or content creator can make.",
      "Parvion's image compressor runs entirely in your browser, which means no upload wait times — compression begins the instant your file is selected. You can choose between fully automatic 'smart' compression, a precision mode that compresses to an exact target file size (perfect for portal upload limits), or lossless-only mode for production assets that must remain pixel-perfect.",
    ],
    supportedFormats: {
      input: ["JPG / JPEG", "PNG", "WebP"],
      output: ["JPG / JPEG", "PNG", "WebP"],
    },
    faqs: [
      {
        question: "What is a good file size for website images?",
        answer:
          "As a rule of thumb: hero/banner images should be under 200KB, product and content images should be under 100KB, and thumbnails under 30KB. These targets ensure fast loading on mobile connections. Always compress images before uploading them to your CMS or website builder.",
      },
      {
        question: "Will compressed images look different to my visitors?",
        answer:
          "At moderate compression settings (quality 75–85 for JPG/WebP), the human eye cannot distinguish compressed images from the original in normal viewing conditions. The auto-compress mode uses perceptual quality analysis to stay within this 'visually lossless' threshold automatically.",
      },
      {
        question: "Can I compress PNG files without losing quality?",
        answer:
          "Yes — use lossless mode. PNG files can be losslessly optimised by stripping embedded metadata (EXIF, colour profiles, comments) and re-packing the pixel data with a more efficient filter strategy. Typical PNG savings in lossless mode range from 5–20%.",
      },
    ],
  },

  tools: {
    slug: "tools",
    editorNote:
      "A complete editing toolkit for crops, resizes, filters, borders, and more — all in your browser.",
    bodyParagraphs: [
      "Image editing tools are software features that let you transform a digital image beyond simple format conversion: cropping to a specific composition, resizing to meet platform dimension requirements, rotating to correct orientation, adding watermarks or text overlays for branding, removing backgrounds for product photography, applying colour filters for aesthetic stylization, and framing images with decorative borders.",
      "Parvion's Tools category brings all of these capabilities into a single browser-based suite that requires no installation and no subscription. The tools are powered by standard web technologies — HTML5 Canvas for rendering, WebAssembly for the AI background removal neural network, and FFmpeg (compiled to WebAssembly) for video-adjacent tasks. All processing happens on your device, ensuring your images remain completely private.",
      "Whether you are a small business owner resizing product photos for your online store, a social media manager preparing images in the right aspect ratios for each platform, a designer adding copyright watermarks to client deliverables, or a blogger quickly cropping and filtering photos before publishing — Parvion's tools handle each of these workflows without requiring a desktop application like Photoshop or a cloud subscription.",
    ],
    supportedFormats: {
      input: ["JPG / JPEG", "PNG", "WebP", "AVIF", "SVG", "GIF"],
      output: ["JPG / JPEG", "PNG", "WebP", "PDF"],
    },
    faqs: [
      {
        question: "Do I need to create an account to use these tools?",
        answer:
          "No. All tools are completely free and require no account, registration, or email address. Open any tool, upload your image, and download the result — that is the entire workflow.",
      },
      {
        question: "Which tool should I use to prepare images for Instagram?",
        answer:
          "Use the 'Change Aspect Ratio' tool to crop to 1:1 (square posts), 4:5 (portrait posts), or 16:9 (landscape posts). Then use the Image Compressor to bring the file under Instagram's recommended 1MB upload size. If you want to add branding, run the image through the Watermark tool before uploading.",
      },
      {
        question: "Can I use these tools on images from my phone?",
        answer:
          "Yes. All tools work in modern mobile browsers on iOS and Android. You can access the site, upload photos directly from your camera roll, edit them, and download the results — without installing any app.",
      },
    ],
  },
};
