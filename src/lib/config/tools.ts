// src/lib/config/tools.ts
export interface Tool {
  id: string;
  name: string;
  desc: string;
  href: string;
}

export interface Category {
  id: string;
  title: string;
  tools: Tool[];
}

export const categories: Category[] = [
  {
    id: "01",
    title: "PDF Utilities",
    tools: [
        { 
          id: "image-to-pdf", 
          name: "Image to PDF", 
          desc: "Convert JPG, PNG, and WebP images into a professional PDF document online for free.", 
          href: "/image-to-pdf" 
        },
        { id: "combine-pdf", name: "Merge PDF Files Online", desc: "Combine multiple PDF documents into one single file. 100% private, no server upload.", href: "/combine-pdf" },
        { id: "split-pdf", name: "Split PDF Online", desc: "Extract specific pages or split your PDF into multiple documents instantly.", href: "/split-pdf" },
        { id: "unlock-pdf", name: "Unlock PDF Password", desc: "Remove passwords and restrictions from secured PDF files locally in your browser.", href: "/unlock-pdf" },
        { id: "protect-pdf", name: "Protect PDF with Password", desc: "Encrypt your PDF documents with a strong password. Everything stays on your computer.", href: "/protect-pdf" },
        { id: "pdf-to-image", name: "PDF to Image Converter", desc: "Convert PDF pages into high-quality JPG or PNG images without any file size limits.", href: "/pdf-to-image" },
        { 
          id: "compress-pdf", 
          name: "Compress PDF", 
          desc: "Reduce the file size of your PDF documents while maintaining quality. 100% private and local.", 
          href: "/compress-pdf" 
        },
    ]
  },
  {
    id: "02",
    title: "Photo & Media",
    tools: [
        { id: "compress-video", name: "Compress Video Online", desc: "Reduce video file size using FFmpeg WASM. 100% private, multi-threaded processing.", href: "/compress-video" },
        { id: "remove-background", name: "AI Background Remover", desc: "Automatically remove image backgrounds in-browser using AI. No data leaves your device.", href: "/remove-background" },
        { id: "heic-to-jpg", name: "HEIC to JPG/PNG Converter", desc: "Convert iPhone HEIC photos to standard JPG or PNG format. Batch processing supported.", href: "/heic-to-jpg" },
        { id: "shrink-images", name: "Compress Images Online", desc: "Reduce image file size while preserving high visual quality. Secure and private compression.", href: "/shrink-images" },
        { id: "social-media-resizer", name: "Social Media Image Resizer", desc: "Resize images for Instagram, YouTube, TikTok, and more using local browser power.", href: "/social-media-resizer" },
        { id: "video-to-gif", name: "Video to GIF Converter", desc: "Turn your short video clips into animated GIFs quickly and privately.", href: "/video-to-gif" }
    ]
  },
  {
    id: "03",
    title: "Productivity",
    tools: [
        { 
          id: "bulk-rename", 
          name: "Bulk File Renamer", 
          desc: "Rename multiple files at once with custom rules: prefix, suffix, numbering, and find-replace. 100% local.", 
          href: "/bulk-rename" 
        },
        { id: 'copy-text-from-image', name: "OCR: Copy Text from Image", desc: "Extract text from photos and scanned documents using local OCR technology.", href: "/copy-text-from-image" },
        { id: 'excel-to-pdf', name: "Excel to PDF Converter", desc: "Transform your Excel spreadsheets into printable PDF files instantly.", href: "/excel-to-pdf" },
        { id: 'spreadsheet-to-json', name: "Spreadsheet to JSON", desc: "Convert Excel or CSV data into JSON format for developers and data analysis.", href: "/spreadsheet-to-json" }
    ]
  },
  // {
  //   id: "04",
  //   title: "Security & Others",
  //   tools: [
  //       { id: "secure-password-generator", name: "Secure Password Generator", desc: "Generate strong passwords using your device only.", href: "/secure-password-generator" },
  //       { id: "private-qr-generator", name: "Private QR Generator", desc: "Create QR codes without tracking or data sharing.", href: "/private-qr-generator" }
  //   ]
  // }
];

export const allTools: Tool[] = categories.flatMap(c => c.tools);

