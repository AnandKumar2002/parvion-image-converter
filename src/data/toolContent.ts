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
  "background-remover": {
    title: "AI Background Remover",
    steps: [
      "Upload your photo (JPG, PNG, WebP, or AVIF) into the workbench.",
      "Click the 'Remove Background' button to run the AI neural network model locally.",
      "Once completed, customize your image background using the side panel (choose Transparent, Solid Colors, radial Presets, or Blur Portrait settings).",
      "Reposition, scale, rotate, mirror, or add a drop-shadow outline to your subject.",
      "Click 'Export Image' to download the transparent/customized PNG directly to your device."
    ],
    features: [
      "100% Client-Side AI: The segmentation network runs locally inside your browser—your photos never touch any server.",
      "Custom Backgrounds: Replace transparent backdrops with solid colors, design presets, or your own custom uploaded backgrounds.",
      "Portrait Mode Blur: Blur the original background easily to create a professional portrait depth-of-field effect.",
      "Full Layout Studio: Position, scale, flip, rotate, and add outer glow/shadow borders to your subjects.",
      "History Stack: Fully equipped with Undo/Redo commands to revert or replicate adjustments easily."
    ],
    faqs: [
      {
        question: "Is my photo secure when removing the background?",
        answer: "Yes, 100%. The AI model compiles into WebAssembly and runs locally inside your browser's context. Your files are processed entirely on your device and are never uploaded to any remote servers, ensuring maximum privacy."
      },
      {
        question: "Why does it take a few seconds on the first run?",
        answer: "The first time you execute the tool, your browser downloads the optimized AI segmentation model (~70MB) from the secure network cache. Subsequent operations will run instantly since the model is cached locally on your device."
      },
      {
        question: "What image formats are supported?",
        answer: "We support all common image file types, including JPG, JPEG, PNG, WebP, SVG, and AVIF. AVIF files are automatically converted pre-processing to ensure compatibility with the AI segmentation model."
      }
    ],
    privacyNotes: "Processed entirely locally within your browser sandbox. Zero logs, zero data transfers, absolute security."
  },
  "converter": {
    title: "High Performance Image Converter",
    steps: [
      "Select or drop one or multiple images onto the upload panel.",
      "Choose your desired export format (PNG, JPG, WebP, GIF, or SVG).",
      "Configure format-specific options like image quality or vector scaling.",
      "Click 'Export' or download converted files individually or as a combined ZIP archive."
    ],
    features: [
      "Batch Conversion: Convert dozens of files simultaneously inside the browser context.",
      "Format Versatility: Supports conversions between JPG, PNG, WebP, GIF, and vector SVGs.",
      "Quality Controls: Adjust file compression ratios to balance image quality with output file size.",
      "Fast Offline Processing: Converting images takes milliseconds as it processes locally without network upload wait times."
    ],
    faqs: [
      {
        question: "Does converting images compromise my visual quality?",
        answer: "You can fully control the quality. Converting to lossless formats like PNG preserves pixel detail, while converting to WebP/JPG lets you adjust quality sliders to achieve the perfect balance between compression and fidelity."
      },
      {
        question: "Is there a limit to the number of files I can convert?",
        answer: "There are no hard platform limits since the conversion executes locally using your device resources. You can process batches of files at once."
      }
    ],
    privacyNotes: "Images are converted in-browser using standard canvas serialization. No network bandwidth is used, and no images are stored."
  },
  "compressor": {
    title: "Smart Image Compressor",
    steps: [
      "Drop your heavy image files into the compressor dropzone.",
      "Select your compression mode: Auto (Smart Compression), Target File Size (e.g., compress to under 200KB), or Lossless.",
      "Verify the savings shown in the comparison view.",
      "Download the optimized, lightweight images."
    ],
    features: [
      "Smart Auto-Compression: Automatically calculates the optimal quality reduction index to shrink sizes without visible quality loss.",
      "Target KB Size Mode: Specify your target file size limit (e.g. 50KB or 100KB), and the encoder adjusts compression dynamically.",
      "Lossless Optimization: Strips metadata, comments, and redundant headers from PNGs/JPGs without modifying pixels.",
      "Instant Save Comparison: Shows original size vs. compressed size and the percentage of saved storage in real-time."
    ],
    faqs: [
      {
        question: "How does target file size compression work?",
        answer: "Our algorithm iteratively calculates the compression parameters and canvas scales until the target KB file size matches. This is perfect for meeting strict portal upload limits."
      },
      {
        question: "Will my images look blurry after compression?",
        answer: "No. The auto-compressor uses structural similarity (SSIM) checks to ensure that the compression remains visually imperceptible to the human eye, maintaining crisp details."
      }
    ],
    privacyNotes: "Processed securely on-device. Your metadata is stripped locally and images never leave your local browser session."
  },
  "editor": {
    title: "All-in-One Photo Editor Studio",
    steps: [
      "Upload your photo into the interactive workspace.",
      "Select your edit tool from the sidebar (Crop, Resize, Rotate, Flip, Size Checker, or Watermark).",
      "Perform precise changes (input crop ratios, select target scales, rotate, or overlay text/logo watermarks).",
      "Undo or redo any edits as you adjust your composition.",
      "Click 'Export Image' to download the processed file."
    ],
    features: [
      "Aspect Ratios: Crop using standard social media sizes (16:9, 4:3, 9:16, 1:1) or custom dimensions.",
      "Dynamic Resizing: Resize in pixels, percentages, inches, or centimeters with DPI options.",
      "Dual Watermarking: Protect your images with custom styled text overlays or transparent logos.",
      "Canvas Flip & Rotate: Mirror files horizontally/vertically or rotate in precise degree increments.",
      "History Timeline: Undo and redo adjustments cleanly with the state history timeline."
    ],
    faqs: [
      {
        question: "What is DPI, and why is it used during resizing?",
        answer: "DPI (Dots Per Inch) determines printing density. Setting a target DPI alongside inches/centimeters allows you to output files sized specifically for physical print or high-resolution displays."
      },
      {
        question: "Can I place watermarks anywhere on the image?",
        answer: "Yes. You can select custom grid presets (Top Left, Center, Bottom Right, etc.) or enable a tiled pattern that repeats the watermark across the entire image for max protection."
      }
    ],
    privacyNotes: "All cropping, resizing, and watermark compositing are rendered locally on your GPU using canvas buffers. Your photos remain fully private."
  },
  "image-border": {
    title: "Image Border & Frame Studio",
    steps: [
      "Select or drag your image onto the upload canvas zone.",
      "Choose your layout style: 'Expand Canvas' to add borders on the outside, or 'Inset Overlay' to render them inside the original dimensions.",
      "Adjust the outer border thickness, pick custom border colors, and select corner rounded radius values.",
      "Click the Frames tab to apply polaroid frames (and write custom handwritten captions!), wooden bezels, or vintage film roll styles.",
      "Export and download your finalized bordered image as a high-quality PNG."
    ],
    features: [
      "Expandable & Inset Modes: Position borders surrounding the image or as inset design lines.",
      "Polaroid Captions: Renders a classic polaroid camera format with handwritten caption texts, fonts, and colors.",
      "Canvas Colors & Gradients: Decorate empty backgrounds with solid colors or customized rotating linear gradients.",
      "Artistic Frame Bezels: Apply wooden frames, borders, and vertical sprocket film strips.",
      "Undo & Redo History: Full timeline history tracking lets you revert edits in real-time."
    ],
    faqs: [
      {
        question: "Will adding a border reduce my image's quality?",
        answer: "No. The borders are rendered using vectors and direct canvas pixel mapping, maintaining the original pixel quality during exports."
      },
      {
        question: "How does the Polaroid text rendering work?",
        answer: "When choosing Polaroid mode, the canvas dimensions are expanded to create the iconic Polaroid margin layout, drawing your custom caption centered on the bottom white margin using beautiful handwriting fonts."
      }
    ],
    privacyNotes: "Your images are processed 100% locally in your browser session. No files are uploaded to any server, ensuring total privacy."
  },
  "image-filters": {
    title: "Image Filters & Adjustments Studio",
    steps: [
      "Select or drag your photo onto the upload box.",
      "Browse through the Presets Gallery to apply curated visual styles (Chrome, Mono, Vintage, Noir, Negative, etc.) with a single click.",
      "Switch to the Adjustments tab to manually fine-tune parameters like Brightness, Contrast, Saturation, Hue Shift, and Blur.",
      "Toggle the 'Compare Split' button to display a slider allowing you to drag and compare the original vs. filtered image.",
      "Click 'Export Image' to download the filtered result as a PNG."
    ],
    features: [
      "One-Click Presets: A gallery of color presets ranging from cinematic black and white to retro and color inversion.",
      "Manual Fine-Tuning: Adjustable sliders for absolute pixel grading control.",
      "Comparative Split Slider: Drag a visual dividing line to compare 'Before' vs 'After' edits at 60 FPS.",
      "Non-Destructive Editing: The layout uses standard non-destructive canvas filters, keeping original sources in memory.",
      "Undo/Redo Tracking: Standard history controls to step through adjustments easily."
    ],
    faqs: [
      {
        question: "How does the Compare Split view work?",
        answer: "The split view overlaps the original and filtered images. As you drag the central slider, it dynamically changes the clip width of the top layer, letting you see the direct filter contrast change on the exact same pixels."
      },
      {
        question: "Can I combine presets with manual adjustments?",
        answer: "Adjusting manual sliders will transition your active preset configuration to custom. You can start with a preset to get a baseline filter, and then switch to adjustments to fine-tune it!"
      }
    ],
    privacyNotes: "All visual calculations and photo filters run 100% inside your browser session. Photos never touch remote servers."
  },
  "image-to-pdf": {
    title: "Convert Images to PDF",
    steps: [
      "Upload or drop one or multiple images onto the workspace.",
      "Manage pages by reordering them or removing unneeded pages.",
      "Select a page and go to the Layout tab to customize its size, margins, and image alignment, or copy it to all pages.",
      "Set document metadata such as Title and Author in the Metadata tab.",
      "Click 'Export PDF' to download the compiled PDF document directly to your device."
    ],
    features: [
      "Multi-Page Compilation: Combine multiple images of various formats into a single, cohesive PDF document.",
      "Per-Page Customization: Configure different page sizes (A4, Letter, Legal, Fit), margins, and alignments for each individual page.",
      "Interactive Page Ordering: Reorder pages easily with dedicated Up/Down buttons or delete pages in one click.",
      "Embedded Metadata: Personalize your PDF file by injecting custom document title and author names into the file metadata.",
      "100% Offline Generation: PDF building is performed entirely inside your browser's sandboxed environment, keeping your files safe."
    ],
    faqs: [
      {
        question: "Is there a limit to how many images I can merge into a single PDF?",
        answer: "There are no arbitrary software limits. Since the PDF is generated completely in your browser using your local device memory, you can easily compile dozens of images into a single PDF."
      },
      {
        question: "Can I use images of different sizes in the same PDF?",
        answer: "Yes, you can. You can configure each page individually—for example, setting some to match the original image size ('Fit') and others to A4 or Letter, or use the 'Apply to All' button to standardize them."
      },
      {
        question: "Does this tool upload my documents to any server?",
        answer: "No. All conversion operations and PDF rendering happen locally on your computer. Your files never leave your device, ensuring maximum privacy and security."
      }
    ],
    privacyNotes: "Your files are processed 100% locally in your browser. No data is sent to our servers."
  }
};
