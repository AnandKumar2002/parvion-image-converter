export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolGuide {
  title: string;
  steps: string[];
  features: string[];
  faqs: FAQItem[];
  privacyNotes: string;
}

export const toolContents: Record<string, ToolGuide> = {
  // ─────────────────────────────────────────────
  // CONVERT CATEGORY — Individual slug entries
  // ─────────────────────────────────────────────

  "png-to-jpg": {
    title: "PNG to JPG Converter",
    steps: [
      "Upload one or more PNG files by clicking the upload area or dragging them in.",
      "The converter automatically targets JPG as the output format.",
      "Adjust the JPG quality slider (1–100) to control file size vs. visual clarity.",
      "Click 'Export' to download the converted JPG files, or grab a ZIP if you uploaded multiple.",
    ],
    features: [
      "Batch PNG-to-JPG: Convert a whole folder of PNGs to JPG in one operation.",
      "Quality Control Slider: Fine-tune JPEG compression from high-fidelity (90+) down to aggressive web compression.",
      "Transparency Handling: PNG transparency is automatically filled with a white background during JPG conversion (JPG does not support alpha channels).",
      "Instant Client-Side Processing: No upload queues — conversion happens directly in your browser using the Canvas API.",
    ],
    faqs: [
      {
        question: "Why do PNG files become smaller when converted to JPG?",
        answer: "PNG uses lossless compression, meaning every pixel is stored exactly. JPG uses lossy compression that mathematically approximates pixel groups, which achieves much smaller file sizes at the cost of a small, usually invisible reduction in detail. For most photos and screenshots without text or logos, a JPG at quality 85 is visually indistinguishable from the original PNG but can be 70–80% smaller.",
      },
      {
        question: "What happens to transparent areas in my PNG?",
        answer: "The JPG format does not support transparency (alpha channels). Parvion automatically composites your transparent PNG onto a solid white background before encoding as JPG, so the result is always a valid, well-formed JPEG file. If you need to preserve transparency, consider exporting as WebP or PNG instead.",
      },
      {
        question: "Is there a file size or resolution limit?",
        answer: "There are no arbitrary limits imposed by our platform. Your browser's available memory is the only practical constraint. Modern browsers can comfortably handle images up to 50–100 megapixels.",
      },
    ],
    privacyNotes:
      "PNG-to-JPG conversion is performed entirely within your browser's Canvas API sandbox. Your image data is never sent to any server, ensuring complete privacy.",
  },

  "jpg-to-png": {
    title: "JPG to PNG Converter",
    steps: [
      "Upload your JPG or JPEG file(s) by clicking the upload zone or dragging them in.",
      "PNG is pre-selected as the target output format.",
      "Optionally adjust vector scaling if you're converting an SVG source.",
      "Click 'Export' to download lossless PNG files.",
    ],
    features: [
      "Lossless PNG Output: The resulting PNG is stored without further quality loss — no re-compression artefacts.",
      "Alpha Channel Preservation: Any semi-transparent regions in the source (if applicable) are preserved in the PNG output.",
      "Batch Processing: Upload multiple JPG files and download them all as PNGs in one ZIP archive.",
      "Metadata Stripping: Exif data is not carried forward into the PNG export, which can slightly reduce file size.",
    ],
    faqs: [
      {
        question: "Does converting JPG to PNG improve my image quality?",
        answer: "No — converting from a lossy format like JPG to a lossless format like PNG does not recover quality that was lost during the original JPG compression. What it does do is prevent any further quality degradation if you plan to edit and re-save the image multiple times, since PNG re-saves never degrade quality.",
      },
      {
        question: "When should I use PNG instead of JPG?",
        answer: "PNG is the right choice when you need sharp edges and text (screenshots, logos, diagrams), when you need a transparent background, or when you're working on an image you'll edit and re-export many times. JPG is better for photographs where the smaller file size outweighs the slight quality loss.",
      },
    ],
    privacyNotes:
      "All conversions are executed locally in your browser using the HTML5 Canvas API. No image data leaves your device at any point.",
  },

  "webp-converter": {
    title: "WebP Image Converter",
    steps: [
      "Upload any JPG, PNG, GIF, or AVIF image(s) into the converter.",
      "Select 'WebP' as the target format from the format selector.",
      "Adjust the quality slider (for lossy WebP) or enable lossless mode.",
      "Click 'Export' and download your optimized WebP files.",
    ],
    features: [
      "Lossy & Lossless WebP: Switch between lossy WebP (smaller files) and lossless WebP (pixel-perfect quality).",
      "Superior Compression: WebP files are typically 25–35% smaller than equivalent JPG/PNG files at the same visual quality.",
      "Wide Format Input: Accepts JPG, PNG, GIF, and AVIF sources for conversion into WebP.",
      "Batch Export: Convert an entire image library to WebP in a single session and download as a ZIP.",
    ],
    faqs: [
      {
        question: "What is WebP and why should I use it for my website?",
        answer: "WebP is a modern image format developed by Google that provides superior compression compared to both JPEG and PNG. Using WebP on your website reduces page weight, which improves loading speed, reduces bandwidth costs, and positively impacts your Google PageSpeed Insights score. All major modern browsers — Chrome, Firefox, Safari, and Edge — now support WebP natively.",
      },
      {
        question: "Will my WebP images look different from the originals?",
        answer: "At quality settings of 80 and above, lossy WebP images are visually indistinguishable from their JPEG originals for nearly all photographic content. For icons, logos, and text, you can switch to lossless WebP to preserve every pixel exactly.",
      },
      {
        question: "Can I convert animated GIFs to WebP?",
        answer: "Yes. When you upload a GIF file, the converter will produce an animated WebP, which is the modern equivalent. Animated WebP files are significantly smaller than animated GIFs and support a full 24-bit color palette.",
      },
    ],
    privacyNotes:
      "WebP encoding is performed using your browser's native Canvas API. All operations are local and offline-capable — no server contact is made.",
  },

  "svg-to-png": {
    title: "SVG to PNG Converter",
    steps: [
      "Upload your SVG file(s) into the converter.",
      "Select 'PNG' as the output format.",
      "Set the scale multiplier (e.g., 2× for Retina-quality, 4× for print) to control output resolution.",
      "Click 'Export' to download high-resolution PNG versions of your vector graphics.",
    ],
    features: [
      "Resolution Scaling: Rasterize SVGs at 1×, 2×, 4×, or custom scale factors for crisp Retina and print outputs.",
      "Transparency Preserved: The SVG's transparent background is carried through to the PNG output's alpha channel.",
      "Lossless PNG Export: The rasterized bitmap is stored as a lossless PNG to preserve all the fine detail of the original vector.",
      "Batch SVG Rasterizing: Convert multiple SVG icons or illustrations to PNG simultaneously.",
    ],
    faqs: [
      {
        question: "At what resolution should I export my SVG as a PNG?",
        answer: "For standard web use, exporting at 1× is sufficient. For Retina / HiDPI displays (most modern phones and laptops), export at 2×. For print production at 300 DPI, export at 3× or 4× the intended display size. For example, if an icon will appear at 64×64px on screen, export at 4× to get a 256×256px PNG suitable for print.",
      },
      {
        question: "Do SVG animations or scripts get preserved in PNG export?",
        answer: "No — PNG is a static raster format. When converting SVG to PNG, only the static visual state of the SVG is captured. CSS animations, JavaScript interactions, and `<animate>` elements are not rendered into the PNG.",
      },
    ],
    privacyNotes:
      "SVG rasterization is done entirely in-browser by drawing the SVG to an HTML Canvas element. Your files never leave your device.",
  },

  "gif-to-mp4": {
    title: "GIF to MP4 Converter",
    steps: [
      "Upload your animated GIF file into the converter.",
      "The tool automatically detects all frames and frame timing from the GIF header.",
      "Click 'Convert' to transcode the animation into an MP4 video file using FFmpeg (WebAssembly).",
      "Download the resulting MP4 file, which is ready to use anywhere video is accepted.",
    ],
    features: [
      "FFmpeg-Powered (WebAssembly): Industry-standard FFmpeg video encoding runs locally inside your browser via WebAssembly — no server required.",
      "Dramatically Smaller Files: MP4 video can be 60–90% smaller than the equivalent animated GIF at similar visual quality.",
      "Frame-Perfect Conversion: All GIF frames and their exact display timings are preserved in the MP4 output.",
      "Universal Compatibility: The output MP4 uses the H.264 codec, supported by virtually all devices and platforms.",
    ],
    faqs: [
      {
        question: "Why is MP4 so much smaller than GIF?",
        answer: "GIF is an ancient format (1987) that uses a limited 256-color palette and a simple LZW compression that doesn't account for inter-frame similarity. MP4 with H.264 compression uses sophisticated motion compensation and prediction algorithms that only store what changes between frames, resulting in files that are typically 60–90% smaller with far better color quality.",
      },
      {
        question: "Why does the conversion take a moment?",
        answer: "The first time you use this tool, your browser downloads the FFmpeg WebAssembly module (~8–12MB) and compiles it. Subsequent uses are instant because the browser caches the compiled WASM binary. The transcoding itself is a CPU-intensive task that runs locally on your device.",
      },
      {
        question: "Will the MP4 loop like my GIF does?",
        answer: "The output MP4 file itself does not carry a loop instruction — looping behaviour is controlled by the player or the embed method. In HTML, add `loop` to your `<video>` tag: `<video autoplay loop muted playsinline src='animation.mp4'>`. On social platforms, looping is handled automatically by the platform's player.",
      },
    ],
    privacyNotes:
      "GIF-to-MP4 transcoding runs entirely using FFmpeg compiled to WebAssembly inside your browser sandbox. No frame data is uploaded to any server.",
  },

  "heic-to-jpg": {
    title: "HEIC to JPG Converter",
    steps: [
      "Upload your HEIC or HEIF photos (typically from an iPhone or modern iPad).",
      "Select JPG or PNG as the output format.",
      "Adjust the JPG quality slider if desired.",
      "Download your converted, universally compatible image files.",
    ],
    features: [
      "iPhone / Apple Photo Compatibility: Opens HEIC and HEIF files directly — the native format used by iPhones since iOS 11.",
      "High Fidelity Conversion: HEIC's superior compression is decoded at full quality before re-encoding as JPG.",
      "Batch iPhone Photo Processing: Convert your entire camera roll at once without using iCloud or a desktop app.",
      "No Software Installation: Works entirely in your web browser — no additional codecs, apps, or drivers needed.",
    ],
    faqs: [
      {
        question: "What is HEIC and why can't I open it on my PC or Android?",
        answer: "HEIC (High Efficiency Image Container) is Apple's implementation of the HEIF standard, which uses the H.265 / HEVC codec to store images at roughly half the file size of JPEG at equivalent quality. Windows and most Android apps don't include the HEVC decoder by default (Microsoft sells it separately as a paid codec pack), making HEIC files incompatible with standard viewers. Converting to JPG gives you universal compatibility.",
      },
      {
        question: "Does converting HEIC to JPG reduce quality?",
        answer: "A small quality reduction is inevitable when re-encoding as JPG, since JPEG uses lossy compression. However, at quality 85 and above the difference is imperceptible to the human eye for normal photographic content. The original HEIC file is not modified, so you can always re-convert at a higher quality setting if needed.",
      },
    ],
    privacyNotes:
      "HEIC decoding uses a JavaScript/WebAssembly HEIC library that runs entirely in your browser. Your iPhone photos are never uploaded or transmitted anywhere.",
  },

  // ─────────────────────────────────────────────
  // COMPRESS CATEGORY — Individual slug entries
  // ─────────────────────────────────────────────

  "compress-images": {
    title: "Image Compressor",
    steps: [
      "Drop your image files (JPG, PNG, WebP) into the compression dropzone.",
      "Select 'Auto' compression mode for the best automatic quality-to-size ratio.",
      "Review the real-time savings preview showing original vs. compressed file size.",
      "Download individual compressed images or export all as a ZIP archive.",
    ],
    features: [
      "Smart Auto-Compression: Automatically finds the optimal compression level that keeps the image visually sharp while maximizing size reduction.",
      "Real-Time Savings Preview: See exactly how many KB or MB you'll save before downloading.",
      "Batch Compression: Compress dozens of images simultaneously in a single browser session.",
      "Multi-Format Support: Handles JPG, PNG, and WebP input formats with format-appropriate compression algorithms.",
    ],
    faqs: [
      {
        question: "How much can I expect to reduce my image file sizes?",
        answer: "Results vary depending on the source image, but typical savings for web photos are 40–75%. A 3MB smartphone photo can often be reduced to under 500KB at visually lossless quality. Screenshots and illustrations with flat colors tend to compress even more aggressively. PNG files with many unique colors may compress less.",
      },
      {
        question: "Will my images look noticeably worse after compression?",
        answer: "In auto mode, the compressor uses a perceptual quality analysis to ensure the compression ratio stays below the threshold where the human eye can detect degradation. For the vast majority of photographic images, the compressed output is visually identical to the original.",
      },
      {
        question: "Is there a limit to how many images I can compress?",
        answer: "No platform-imposed limits exist. Since compression runs locally in your browser, the limit is determined by your device's available memory. Most modern computers can comfortably process batches of 50–100 high-resolution images.",
      },
    ],
    privacyNotes:
      "All compression calculations happen inside your browser using the Canvas API. Your images are never uploaded to our servers — they stay entirely on your device.",
  },

  "reduce-file-size": {
    title: "Reduce Image File Size",
    steps: [
      "Upload your image file(s) that need to meet a specific size limit.",
      "Select 'Target File Size' compression mode.",
      "Enter your target maximum file size in kilobytes (e.g., 200 KB, 500 KB, 1 MB).",
      "The tool iteratively compresses the image until it meets your exact size limit, then lets you download.",
    ],
    features: [
      "Precision Target-KB Mode: Specify any target file size and the encoder automatically adjusts compression to meet it.",
      "Iterative Bisection Algorithm: The compressor tries multiple quality levels in a binary search pattern to hit the target size efficiently.",
      "Aspect Ratio Preserved: The image dimensions are not changed unless you specifically request it — only compression quality is adjusted.",
      "Real-Time Size Feedback: Watch the output file size converge to your target as the algorithm runs.",
    ],
    faqs: [
      {
        question: "Why would I need to compress an image to a specific file size?",
        answer: "Many online portals impose strict maximum file size limits — government websites, university application portals, job application systems, and email providers often require photos or documents to be under 200KB or 1MB. Manually guessing quality settings is frustrating; the target-size mode removes that guesswork completely.",
      },
      {
        question: "What is the smallest file size I can target?",
        answer: "There is a practical minimum determined by image dimensions and format — you cannot compress a 4000×3000 pixel photo to 1KB without extreme visible degradation. For very aggressive targets, the tool will produce the smallest possible file at any given dimension. If quality is critical at very small sizes, consider also reducing the image dimensions.",
      },
    ],
    privacyNotes:
      "The target-size compression algorithm runs entirely within your browser's JavaScript sandbox. No image data is transmitted to external servers.",
  },

  "lossless": {
    title: "Lossless Image Compression",
    steps: [
      "Upload your PNG or JPG image files into the compressor.",
      "Select 'Lossless' compression mode.",
      "The tool strips non-visual metadata (EXIF data, color profiles, comments) and applies lossless encoding optimization.",
      "Download your optimized images — visually identical to the originals but smaller on disk.",
    ],
    features: [
      "Zero Pixel Change: Lossless compression removes only redundant metadata and re-packs pixel data more efficiently — every pixel remains mathematically identical to the source.",
      "EXIF Metadata Stripping: Removes embedded GPS coordinates, camera model, shooting date, and other private metadata from JPEG files.",
      "PNG Optimisation: Re-encodes PNGs with optimized filter strategies that can shrink file size without changing a single pixel.",
      "Safe for Production Assets: Ideal for compressing website assets, UI images, and design exports where quality must be pixel-perfect.",
    ],
    faqs: [
      {
        question: "What is the difference between lossless and lossy compression?",
        answer: "Lossless compression reduces file size without discarding any image data — the decompressed file is bit-for-bit identical to the original. Lossy compression achieves much greater size reductions by permanently removing fine detail that is difficult for the human eye to perceive. For photographs, lossy compression at moderate quality is usually fine. For logos, text, icons, and medical or legal images, lossless is the correct choice.",
      },
      {
        question: "How much can lossless compression reduce file sizes?",
        answer: "Savings are typically smaller than lossy compression — usually 5–30% for PNG and JPG files. The exact amount depends on how much redundant metadata the source file contains and how sub-optimally the original encoder packed the data. Files saved from design tools like Photoshop often have significant metadata that can be safely removed.",
      },
      {
        question: "Is it safe to use losslessly compressed images as my master/archive files?",
        answer: "Yes — because lossless compression produces a pixel-identical output, you can use the compressed files as your master copies without any concern about cumulative quality loss over multiple re-saves.",
      },
    ],
    privacyNotes:
      "Lossless compression and metadata stripping are performed locally in your browser. EXIF data (including any GPS location) is removed from your files and never read, stored, or transmitted by Parvion.",
  },

  // ─────────────────────────────────────────────
  // TOOLS CATEGORY — Individual slug entries
  // ─────────────────────────────────────────────

  "image-editor": {
    title: "All-in-One Image Editor",
    steps: [
      "Upload your photo into the interactive workspace.",
      "Select your edit tool from the sidebar: Crop, Resize, Rotate, Flip, Size Checker, or Watermark.",
      "Perform precise changes — input crop ratios, select target scales, rotate, or overlay text/logo watermarks.",
      "Use Undo / Redo to step through your adjustments.",
      "Click 'Export Image' to download the processed file.",
    ],
    features: [
      "Aspect Ratio Cropping: Crop using standard social media sizes (16:9, 4:3, 9:16, 1:1) or fully custom dimensions.",
      "Dynamic Resizing: Resize in pixels, percentages, inches, or centimetres with configurable DPI.",
      "Dual Watermarking: Protect images with custom styled text overlays or transparent logo watermarks.",
      "Canvas Flip & Rotate: Mirror files horizontally or vertically, or rotate in precise degree increments.",
      "History Timeline: Undo and redo adjustments cleanly with full state history tracking.",
    ],
    faqs: [
      {
        question: "What is DPI and why is it important when resizing?",
        answer: "DPI (Dots Per Inch) determines the physical print density of a digital image. When you resize using physical units (inches or centimetres), specifying a DPI tells the editor how many pixels to pack into each inch. 72 DPI is standard for screen display; 300 DPI is the standard for high-quality print. Setting 300 DPI alongside physical dimensions ensures your exported file prints crisply at the intended size.",
      },
      {
        question: "Can I use the editor on my phone or tablet?",
        answer: "Yes. The editor is fully responsive and works in any modern mobile browser on iOS or Android. Touch interactions for dragging crop handles and manipulating the canvas are supported. For precise adjustments on small screens, the numerical input fields provide an alternative to direct touch manipulation.",
      },
    ],
    privacyNotes:
      "All editing operations (cropping, resizing, watermarking, rotating) are rendered locally using HTML5 Canvas buffers. Your photos remain entirely private and never leave your device.",
  },

  "crop-images": {
    title: "Image Cropper",
    steps: [
      "Upload your image into the cropper workspace.",
      "Drag the crop handles to define your desired crop area, or enter pixel coordinates directly.",
      "Select a preset aspect ratio (1:1, 4:3, 16:9, 9:16, 3:2) for social media-ready crops.",
      "Click 'Apply Crop', then 'Export Image' to download your cropped result.",
    ],
    features: [
      "Free-Form & Ratio-Locked Cropping: Drag handles freely or lock to a preset ratio for perfectly proportioned crops.",
      "Pixel-Precise Control: Enter exact X, Y, width, and height values for precise cropping to any specification.",
      "Social Media Presets: One-click aspect ratios for Instagram (1:1, 4:5), Twitter (16:9), and YouTube thumbnails (16:9).",
      "Non-Destructive Workflow: The original uploaded image is kept in memory — reset and re-crop as many times as you need.",
    ],
    faqs: [
      {
        question: "Does cropping reduce my image's resolution?",
        answer: "Cropping reduces the image's dimensions (and therefore its total pixel count), but it does not reduce the pixels-per-inch quality of the remaining image area. The cropped output preserves the original image quality within the selected region — only the discarded portions are removed.",
      },
      {
        question: "Can I crop multiple images to the same dimensions?",
        answer: "For identical crops, upload each image, apply the same crop using the pixel coordinate inputs (set the same width and height each time), and export. For advanced batch cropping workflows, use the editor to set your crop parameters precisely using the numerical input fields.",
      },
    ],
    privacyNotes:
      "Image cropping is performed entirely in your browser using the Canvas API. No pixel data is sent to any server — your photos are processed locally and privately.",
  },

  "resize-images": {
    title: "Image Resizer",
    steps: [
      "Upload your image into the resizer workspace.",
      "Choose your resize unit: pixels, percentage, inches, or centimetres.",
      "Enter your target width (height auto-scales proportionally) or unlock the aspect ratio to set both dimensions.",
      "Set a DPI value if resizing for print output.",
      "Click 'Apply Resize', then 'Export Image' to download.",
    ],
    features: [
      "Multi-Unit Resize: Input target dimensions in pixels, %, inches, or cm to suit any workflow — digital or print.",
      "Proportional Scaling: Lock aspect ratio to prevent distortion — change width and height auto-adjusts.",
      "DPI Configuration: Embed the correct DPI metadata for print workflows (72 DPI for web, 300 DPI for print).",
      "Upscaling & Downscaling: Resize images both smaller and larger; upscaling uses bicubic interpolation for smooth results.",
    ],
    faqs: [
      {
        question: "What is the best way to resize an image without it looking blurry?",
        answer: "For downscaling (making smaller), use a high-quality interpolation mode and reduce in steps if going below 50% of original size. For upscaling (making larger), no algorithm can truly 'invent' detail that wasn't there — so results get progressively softer above 200% of original size. For large upscales, AI upscalers are a better tool. For most web and print workflows, simply resizing with proportional scaling produces clean results.",
      },
      {
        question: "What is the correct DPI setting for printing?",
        answer: "300 DPI is the industry standard for professional photo prints and commercial printing. 150–200 DPI is acceptable for large-format prints viewed at a distance (banners, posters). 72 DPI is the standard for screen/web content. Setting the wrong DPI doesn't change pixels — it only changes how large the image prints at 'natural' size.",
      },
    ],
    privacyNotes:
      "All resizing operations are computed locally in your browser using Canvas API resampling. Your image data never leaves your device.",
  },

  "aspect-ratio": {
    title: "Change Image Aspect Ratio",
    steps: [
      "Upload your image into the editor workspace.",
      "Select the 'Crop' tool from the sidebar.",
      "Choose your target aspect ratio from the preset list (1:1, 4:3, 16:9, 9:16, 3:4, etc.).",
      "Drag to position the crop frame, then apply and export.",
    ],
    features: [
      "Social Media Ratios: Pre-built presets for Instagram (1:1, 4:5), YouTube (16:9), TikTok/Reels (9:16), and more.",
      "Custom Ratio Input: Type any aspect ratio (e.g. 5:3, 21:9 cinematic) for specialist use cases.",
      "Live Preview: See exactly what will be included in the final crop before committing.",
      "No Background Padding: Unlike some tools, this resizes by cropping — not by adding coloured borders — so the output is always the exact target ratio.",
    ],
    faqs: [
      {
        question: "Why do social media platforms require specific aspect ratios?",
        answer: "Different platforms have different viewport designs and feed layouts. Instagram square posts display at 1:1, LinkedIn banner images require 4:1, and YouTube thumbnails must be 16:9. Uploading an image in the wrong ratio causes the platform to automatically crop it, often cutting off important subjects. Using the correct aspect ratio ensures your image appears exactly as intended.",
      },
      {
        question: "What is the difference between changing aspect ratio by cropping vs. by squishing?",
        answer: "Cropping removes parts of the image to achieve the new ratio — the remaining pixels are undistorted. Squishing (non-uniform scaling) stretches or compresses the entire image to fit the new ratio, distorting all subjects. Parvion's aspect ratio tool uses cropping, which always produces natural-looking results.",
      },
    ],
    privacyNotes:
      "Aspect ratio adjustment is handled entirely in your browser via Canvas cropping. Your images are never uploaded or stored anywhere.",
  },

  "watermark": {
    title: "Add Watermark to Image",
    steps: [
      "Upload the image you want to watermark.",
      "Choose 'Text Watermark' (type your text, choose font, size, color, and opacity) or 'Logo Watermark' (upload your logo PNG).",
      "Select the watermark position using the grid preset (corners, center) or enable tiled pattern mode.",
      "Adjust opacity so the watermark is visible but not distracting.",
      "Click 'Export Image' to download the watermarked result.",
    ],
    features: [
      "Text & Logo Watermarks: Overlay custom styled text or upload a transparent-background PNG logo.",
      "Position Grid: Precisely place watermarks in any corner, at the center, or tile them across the full image.",
      "Opacity Control: Set watermark transparency from 10–100% for subtle to strong protection.",
      "Font & Color Options: Customize text font, size, color, and rotation angle for your text watermarks.",
    ],
    faqs: [
      {
        question: "What is the best way to watermark photos for social media sharing?",
        answer: "For social media, a text watermark in a corner (bottom-right is conventional) at 40–60% opacity works well — it's visible enough to deter theft without obscuring the subject. Use white text with a subtle dark shadow for readability on both light and dark backgrounds. Avoid center placement for social media as it interferes too much with the subject.",
      },
      {
        question: "Can someone remove my watermark?",
        answer: "A watermark significantly raises the effort required to misuse your image, acting as a strong deterrent. Simple crop-based watermarks in corners can be cropped away, which is why tiled watermarks (repeating across the entire image) are more robust — removing them would require AI inpainting tools and still leaves artefacts. For maximum protection, the watermark should cover key compositional elements of the image.",
      },
    ],
    privacyNotes:
      "Watermark compositing is rendered entirely on your local Canvas. Your original photos and logo files are never sent to any server.",
  },

  "rotate-images": {
    title: "Rotate Image Online",
    steps: [
      "Upload your image into the editor workspace.",
      "Select the 'Rotate' tool from the sidebar.",
      "Enter any rotation angle in degrees, or use the quick 90°, 180°, 270° buttons.",
      "Preview the rotated result, then click 'Export Image' to download.",
    ],
    features: [
      "Arbitrary Angle Rotation: Rotate by any degree value — not limited to 90° increments.",
      "90° Quick-Rotate Buttons: Instantly rotate left or right by 90° for correcting portrait/landscape orientation.",
      "Canvas Auto-Resize: When rotating by non-right-angle amounts, the canvas expands to contain the full rotated image, preventing clipping.",
      "Background Fill Color: Set the background fill color for corners created by non-90° rotations.",
    ],
    faqs: [
      {
        question: "My photo was taken sideways on my phone — how do I fix it?",
        answer: "Smartphones record which way they were held in a piece of image metadata called EXIF orientation. Some apps read this and display the photo correctly, others don't. Use the 90° quick-rotate button to physically rotate the image pixels and export, so the orientation is baked in and correct on any device or platform regardless of EXIF support.",
      },
      {
        question: "What happens to the corners when I rotate by a non-right angle?",
        answer: "When rotating by an arbitrary angle (e.g. 15°), the original rectangular image's corners no longer align with the canvas edges, leaving triangular empty areas. Parvion fills these areas with a configurable background color (default: white). Alternatively, after rotating, use the crop tool to remove those corner areas if needed.",
      },
    ],
    privacyNotes:
      "Image rotation is computed entirely in your browser using Canvas transformation matrices. No image data leaves your device.",
  },

  "flip-images": {
    title: "Flip Image Online",
    steps: [
      "Upload your image into the editor workspace.",
      "Select the 'Flip' tool from the sidebar.",
      "Click 'Flip Horizontal' to create a mirror image, or 'Flip Vertical' to flip upside down.",
      "Click 'Export Image' to download the flipped result.",
    ],
    features: [
      "Horizontal Flip (Mirror): Creates a perfect left-right mirror image in one click.",
      "Vertical Flip (Upside Down): Inverts the image top-to-bottom.",
      "Non-Destructive Preview: See the flipped result instantly before committing to an export.",
      "Lossless Operation: Flipping is a pixel-rearrangement operation — no re-encoding occurs, so there is zero quality loss.",
    ],
    faqs: [
      {
        question: "When would I need to flip an image horizontally?",
        answer: "Common use cases include: correcting selfie camera mirroring (front cameras often produce a mirrored image), creating symmetrical compositions and reflected logos, flipping reference photos for drawing practice, preparing paired before/after images, and meeting platform requirements for specific image orientations.",
      },
      {
        question: "Does flipping an image degrade its quality?",
        answer: "No. Flipping is a lossless geometric operation — it simply reads pixels from one end and writes them to the other. There is no re-compression step involved, so the output is pixel-for-pixel identical to the input except for orientation.",
      },
    ],
    privacyNotes:
      "Image flipping is performed instantly in your browser using Canvas pixel manipulation. Your images are fully private and never leave your device.",
  },

  "size-checker": {
    title: "Image Size Checker",
    steps: [
      "Upload any image file into the size checker.",
      "The tool instantly displays: file size (KB/MB), pixel dimensions (width × height), aspect ratio, DPI, and image format.",
      "Use this information to decide whether you need to resize or compress the image for your use case.",
      "No download is needed — this tool is read-only.",
    ],
    features: [
      "Instant Metadata Readout: Displays file size, pixel width & height, aspect ratio, DPI, and file format in seconds.",
      "No Registration or Upload: Files are read directly in your browser — nothing is transmitted.",
      "Multi-File Support: Check the specs of multiple images at once.",
      "Compression Recommendations: After reading, quickly jump to the Compressor or Resizer tools with a single click.",
    ],
    faqs: [
      {
        question: "What is the difference between file size and image dimensions?",
        answer: "File size is the amount of disk space the image file occupies (measured in KB or MB) — this is determined by both the pixel dimensions AND the compression applied. Pixel dimensions are the actual width and height of the image in pixels, regardless of compression. A 4000×3000 pixel image (12 megapixels) could be 12MB as a PNG or only 2MB as a compressed JPG — same dimensions, very different file sizes.",
      },
      {
        question: "What DPI should my image be?",
        answer: "For website and screen use: 72–96 DPI is standard. For general purpose print (home printers, office): 150–200 DPI is adequate. For professional photo printing and commercial print: 300 DPI minimum is required. Keep in mind that DPI only matters when printing — it has no effect on how an image looks on screen.",
      },
    ],
    privacyNotes:
      "The size checker reads image metadata and dimensions using the browser's built-in File API. No image data leaves your device — this tool works entirely offline.",
  },

  "add-text": {
    title: "Add Text to Image",
    steps: [
      "Upload your image into the editor workspace.",
      "Select the 'Watermark' tool from the sidebar and switch to Text mode.",
      "Type your caption, label, or annotation text.",
      "Customize the font, size, color, opacity, and position.",
      "Click 'Export Image' to download the image with your text baked in.",
    ],
    features: [
      "Multiple Font Styles: Choose from a selection of fonts including serif, sans-serif, and display styles.",
      "Full Color & Opacity Control: Set any text color and transparency level.",
      "Flexible Positioning: Place text in any corner or center position, or enable a tiled repeat pattern.",
      "Text Rotation: Rotate your text overlay to any angle for diagonal captions or watermarks.",
    ],
    faqs: [
      {
        question: "Can I add multiple lines or multiple text overlays?",
        answer: "You can write multi-line text using line breaks in the text input field. For multiple separate text elements at different positions, export the image after each text addition and re-import it to add the next overlay — this gives you full control over layering and positioning.",
      },
      {
        question: "What is the best text color for readability on any background?",
        answer: "White text with a dark semi-transparent shadow or outline is the most universally readable across both dark and light image backgrounds. Pure white on a light background and pure black on a dark background both suffer from poor contrast. Using a slightly semi-transparent text color (80–90% opacity) also helps it blend naturally with the underlying image.",
      },
    ],
    privacyNotes:
      "Text compositing is rendered locally using HTML5 Canvas 2D drawing APIs. Your image and text content are never sent to any server.",
  },

  // ─────────────────────────────────────────────
  // EXISTING entries (kept intact)
  // ─────────────────────────────────────────────

  "background-remover": {
    title: "AI Background Remover",
    steps: [
      "Upload your photo (JPG, PNG, WebP, or AVIF) into the workbench.",
      "Click the 'Remove Background' button to run the AI neural network model locally.",
      "Once completed, customize your image background using the side panel (choose Transparent, Solid Colors, radial Presets, or Blur Portrait settings).",
      "Reposition, scale, rotate, mirror, or add a drop-shadow outline to your subject.",
      "Click 'Export Image' to download the transparent/customized PNG directly to your device.",
    ],
    features: [
      "100% Client-Side AI: The segmentation network runs locally inside your browser—your photos never touch any server.",
      "Custom Backgrounds: Replace transparent backdrops with solid colors, design presets, or your own custom uploaded backgrounds.",
      "Portrait Mode Blur: Blur the original background easily to create a professional portrait depth-of-field effect.",
      "Full Layout Studio: Position, scale, flip, rotate, and add outer glow/shadow borders to your subjects.",
      "History Stack: Fully equipped with Undo/Redo commands to revert or replicate adjustments easily.",
    ],
    faqs: [
      {
        question: "Is my photo secure when removing the background?",
        answer: "Yes, 100%. The AI model compiles into WebAssembly and runs locally inside your browser's context. Your files are processed entirely on your device and are never uploaded to any remote servers, ensuring maximum privacy.",
      },
      {
        question: "Why does it take a few seconds on the first run?",
        answer: "The first time you execute the tool, your browser downloads the optimized AI segmentation model (~70MB) from the secure network cache. Subsequent operations will run instantly since the model is cached locally on your device.",
      },
      {
        question: "What image formats are supported?",
        answer: "We support all common image file types, including JPG, JPEG, PNG, WebP, SVG, and AVIF. AVIF files are automatically converted pre-processing to ensure compatibility with the AI segmentation model.",
      },
    ],
    privacyNotes:
      "Processed entirely locally within your browser sandbox. Zero logs, zero data transfers, absolute security.",
  },

  "image-border": {
    title: "Image Border & Frame Studio",
    steps: [
      "Select or drag your image onto the upload canvas zone.",
      "Choose your layout style: 'Expand Canvas' to add borders on the outside, or 'Inset Overlay' to render them inside the original dimensions.",
      "Adjust the outer border thickness, pick custom border colors, and select corner rounded radius values.",
      "Click the Frames tab to apply polaroid frames (and write custom handwritten captions!), wooden bezels, or vintage film roll styles.",
      "Export and download your finalized bordered image as a high-quality PNG.",
    ],
    features: [
      "Expandable & Inset Modes: Position borders surrounding the image or as inset design lines.",
      "Polaroid Captions: Renders a classic polaroid camera format with handwritten caption texts, fonts, and colors.",
      "Canvas Colors & Gradients: Decorate empty backgrounds with solid colors or customized rotating linear gradients.",
      "Artistic Frame Bezels: Apply wooden frames, borders, and vertical sprocket film strips.",
      "Undo & Redo History: Full timeline history tracking lets you revert edits in real-time.",
    ],
    faqs: [
      {
        question: "Will adding a border reduce my image's quality?",
        answer: "No. The borders are rendered using vectors and direct canvas pixel mapping, maintaining the original pixel quality during exports.",
      },
      {
        question: "How does the Polaroid text rendering work?",
        answer: "When choosing Polaroid mode, the canvas dimensions are expanded to create the iconic Polaroid margin layout, drawing your custom caption centered on the bottom white margin using beautiful handwriting fonts.",
      },
    ],
    privacyNotes:
      "Your images are processed 100% locally in your browser session. No files are uploaded to any server, ensuring total privacy.",
  },

  "image-filters": {
    title: "Image Filters & Adjustments Studio",
    steps: [
      "Select or drag your photo onto the upload box.",
      "Browse through the Presets Gallery to apply curated visual styles (Chrome, Mono, Vintage, Noir, Negative, etc.) with a single click.",
      "Switch to the Adjustments tab to manually fine-tune parameters like Brightness, Contrast, Saturation, Hue Shift, and Blur.",
      "Toggle the 'Compare Split' button to display a slider allowing you to drag and compare the original vs. filtered image.",
      "Click 'Export Image' to download the filtered result as a PNG.",
    ],
    features: [
      "One-Click Presets: A gallery of color presets ranging from cinematic black and white to retro and color inversion.",
      "Manual Fine-Tuning: Adjustable sliders for absolute pixel grading control.",
      "Comparative Split Slider: Drag a visual dividing line to compare 'Before' vs 'After' edits at 60 FPS.",
      "Non-Destructive Editing: The layout uses standard non-destructive canvas filters, keeping original sources in memory.",
      "Undo/Redo Tracking: Standard history controls to step through adjustments easily.",
    ],
    faqs: [
      {
        question: "How does the Compare Split view work?",
        answer: "The split view overlaps the original and filtered images. As you drag the central slider, it dynamically changes the clip width of the top layer, letting you see the direct filter contrast change on the exact same pixels.",
      },
      {
        question: "Can I combine presets with manual adjustments?",
        answer: "Adjusting manual sliders will transition your active preset configuration to custom. You can start with a preset to get a baseline filter, and then switch to adjustments to fine-tune it!",
      },
    ],
    privacyNotes:
      "All visual calculations and photo filters run 100% inside your browser session. Photos never touch remote servers.",
  },

  "image-to-pdf": {
    title: "Convert Images to PDF",
    steps: [
      "Upload or drop one or multiple images onto the workspace.",
      "Manage pages by reordering them or removing unneeded pages.",
      "Select a page and go to the Layout tab to customize its size, margins, and image alignment, or copy it to all pages.",
      "Set document metadata such as Title and Author in the Metadata tab.",
      "Click 'Export PDF' to download the compiled PDF document directly to your device.",
    ],
    features: [
      "Multi-Page Compilation: Combine multiple images of various formats into a single, cohesive PDF document.",
      "Per-Page Customization: Configure different page sizes (A4, Letter, Legal, Fit), margins, and alignments for each individual page.",
      "Interactive Page Ordering: Reorder pages easily with dedicated Up/Down buttons or delete pages in one click.",
      "Embedded Metadata: Personalize your PDF file by injecting custom document title and author names into the file metadata.",
      "100% Offline Generation: PDF building is performed entirely inside your browser's sandboxed environment, keeping your files safe.",
    ],
    faqs: [
      {
        question: "Is there a limit to how many images I can merge into a single PDF?",
        answer: "There are no arbitrary software limits. Since the PDF is generated completely in your browser using your local device memory, you can easily compile dozens of images into a single PDF.",
      },
      {
        question: "Can I use images of different sizes in the same PDF?",
        answer: "Yes, you can. You can configure each page individually—for example, setting some to match the original image size ('Fit') and others to A4 or Letter, or use the 'Apply to All' button to standardize them.",
      },
      {
        question: "Does this tool upload my documents to any server?",
        answer: "No. All conversion operations and PDF rendering happen locally on your computer. Your files never leave your device, ensuring maximum privacy and security.",
      },
    ],
    privacyNotes:
      "Your files are processed 100% locally in your browser. No data is sent to our servers.",
  },

  // Fallback entries for uiType keys (used when a feature has no dedicated slug entry)
  "converter": {
    title: "High Performance Image Converter",
    steps: [
      "Select or drop one or multiple images onto the upload panel.",
      "Choose your desired export format (PNG, JPG, WebP, GIF, or SVG).",
      "Configure format-specific options like image quality or vector scaling.",
      "Click 'Export' or download converted files individually or as a combined ZIP archive.",
    ],
    features: [
      "Batch Conversion: Convert dozens of files simultaneously inside the browser context.",
      "Format Versatility: Supports conversions between JPG, PNG, WebP, GIF, and vector SVGs.",
      "Quality Controls: Adjust file compression ratios to balance image quality with output file size.",
      "Fast Offline Processing: Converting images takes milliseconds as it processes locally without network upload wait times.",
    ],
    faqs: [
      {
        question: "Does converting images compromise my visual quality?",
        answer: "You can fully control the quality. Converting to lossless formats like PNG preserves pixel detail, while converting to WebP/JPG lets you adjust quality sliders to achieve the perfect balance between compression and fidelity.",
      },
      {
        question: "Is there a limit to the number of files I can convert?",
        answer: "There are no hard platform limits since the conversion executes locally using your device resources. You can process batches of files at once.",
      },
    ],
    privacyNotes:
      "Images are converted in-browser using standard canvas serialization. No network bandwidth is used, and no images are stored.",
  },

  "compressor": {
    title: "Smart Image Compressor",
    steps: [
      "Drop your heavy image files into the compressor dropzone.",
      "Select your compression mode: Auto (Smart Compression), Target File Size (e.g., compress to under 200KB), or Lossless.",
      "Verify the savings shown in the comparison view.",
      "Download the optimized, lightweight images.",
    ],
    features: [
      "Smart Auto-Compression: Automatically calculates the optimal quality reduction index to shrink sizes without visible quality loss.",
      "Target KB Size Mode: Specify your target file size limit (e.g. 50KB or 100KB), and the encoder adjusts compression dynamically.",
      "Lossless Optimization: Strips metadata, comments, and redundant headers from PNGs/JPGs without modifying pixels.",
      "Instant Save Comparison: Shows original size vs. compressed size and the percentage of saved storage in real-time.",
    ],
    faqs: [
      {
        question: "How does target file size compression work?",
        answer: "Our algorithm iteratively calculates the compression parameters and canvas scales until the target KB file size matches. This is perfect for meeting strict portal upload limits.",
      },
      {
        question: "Will my images look blurry after compression?",
        answer: "No. The auto-compressor uses structural similarity (SSIM) checks to ensure that the compression remains visually imperceptible to the human eye, maintaining crisp details.",
      },
    ],
    privacyNotes:
      "Processed securely on-device. Your metadata is stripped locally and images never leave your local browser session.",
  },

  "editor": {
    title: "All-in-One Photo Editor Studio",
    steps: [
      "Upload your photo into the interactive workspace.",
      "Select your edit tool from the sidebar (Crop, Resize, Rotate, Flip, Size Checker, or Watermark).",
      "Perform precise changes (input crop ratios, select target scales, rotate, or overlay text/logo watermarks).",
      "Undo or redo any edits as you adjust your composition.",
      "Click 'Export Image' to download the processed file.",
    ],
    features: [
      "Aspect Ratios: Crop using standard social media sizes (16:9, 4:3, 9:16, 1:1) or custom dimensions.",
      "Dynamic Resizing: Resize in pixels, percentages, inches, or centimeters with DPI options.",
      "Dual Watermarking: Protect your images with custom styled text overlays or transparent logos.",
      "Canvas Flip & Rotate: Mirror files horizontally/vertically or rotate in precise degree increments.",
      "History Timeline: Undo and redo adjustments cleanly with the state history timeline.",
    ],
    faqs: [
      {
        question: "What is DPI, and why is it used during resizing?",
        answer: "DPI (Dots Per Inch) determines printing density. Setting a target DPI alongside inches/centimeters allows you to output files sized specifically for physical print or high-resolution displays.",
      },
      {
        question: "Can I place watermarks anywhere on the image?",
        answer: "Yes. You can select custom grid presets (Top Left, Center, Bottom Right, etc.) or enable a tiled pattern that repeats the watermark across the entire image for max protection.",
      },
    ],
    privacyNotes:
      "All cropping, resizing, and watermark compositing are rendered locally on your GPU using canvas buffers. Your photos remain fully private.",
  },

  // ─────────────────────────────────────────────
  // uiType ALIAS entries
  // These map the uiType field values to the correct content
  // for tools whose slug key is already defined above.
  // ─────────────────────────────────────────────

  // background-remover has uiType "remove-bg" → alias to slug entry
  "remove-bg": {
    title: "AI Background Remover",
    steps: [
      "Upload your photo (JPG, PNG, WebP, or AVIF) into the workbench.",
      "Click the 'Remove Background' button to run the AI neural network model locally.",
      "Customize your image background using the side panel (Transparent, Solid Colors, Presets, or Blur).",
      "Reposition, scale, rotate, or add a drop-shadow to your subject.",
      "Click 'Export Image' to download the result directly to your device.",
    ],
    features: [
      "100% Client-Side AI: The segmentation network runs locally in your browser — no server contact.",
      "Custom Backgrounds: Replace transparent backdrops with solid colors, design presets, or custom uploads.",
      "Portrait Mode Blur: Blur the original background to create a depth-of-field effect.",
      "Full Layout Studio: Position, scale, flip, rotate, and add shadow borders to your subjects.",
      "History Stack: Fully equipped with Undo/Redo commands.",
    ],
    faqs: [
      {
        question: "Is my photo secure when removing the background?",
        answer: "Yes, 100%. The AI model runs locally inside your browser's context. Your files are never uploaded to any remote servers.",
      },
    ],
    privacyNotes: "Processed entirely locally within your browser sandbox. Zero logs, zero data transfers, absolute security.",
  },

  // image-border has uiType "border" → alias
  "border": {
    title: "Image Border & Frame Studio",
    steps: [
      "Select or drag your image onto the upload canvas zone.",
      "Choose 'Expand Canvas' (adds borders outside) or 'Inset Overlay' (renders inside original dimensions).",
      "Adjust border thickness, colors, and corner radius.",
      "Click the Frames tab to apply polaroid, wooden, or vintage film strip frames.",
      "Export and download your finalized bordered image as a PNG.",
    ],
    features: [
      "Expandable & Inset Modes: Position borders surrounding or inset within the image.",
      "Polaroid Captions: Renders classic polaroid layouts with handwritten caption support.",
      "Canvas Colors & Gradients: Solid colors or linear gradient backgrounds.",
      "Artistic Frame Bezels: Wooden frames and vertical sprocket film strips.",
    ],
    faqs: [
      {
        question: "Will adding a border reduce image quality?",
        answer: "No. Borders are rendered using vectors and canvas pixel mapping, maintaining original pixel quality during exports.",
      },
    ],
    privacyNotes: "Your images are processed 100% locally. No files are uploaded to any server.",
  },

  // image-filters has uiType "filters" → alias
  "filters": {
    title: "Image Filters & Adjustments",
    steps: [
      "Upload your photo into the workspace.",
      "Browse the Presets Gallery to apply one-click visual styles.",
      "Switch to the Adjustments tab to fine-tune Brightness, Contrast, Saturation, Hue, and Blur.",
      "Toggle Compare Split to view before vs. after side by side.",
      "Click 'Export Image' to download the filtered PNG.",
    ],
    features: [
      "One-Click Presets: Chrome, Mono, Vintage, Noir, Negative, and more.",
      "Manual Adjustment Sliders: Full pixel grading control.",
      "Compare Split Slider: Drag to compare original vs. filtered at 60 FPS.",
      "Non-Destructive Editing: Original source is always kept in memory.",
    ],
    faqs: [
      {
        question: "Can I combine presets with manual adjustments?",
        answer: "Yes. Start with a preset for a baseline look, then switch to the Adjustments tab to fine-tune to your taste.",
      },
    ],
    privacyNotes: "All filter operations run 100% inside your browser session. Photos never touch remote servers.",
  },
};
