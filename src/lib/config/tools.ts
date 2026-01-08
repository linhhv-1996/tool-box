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
  desc: "Convert and reorder images into a single PDF document.", 
  href: "/image-to-pdf" 
},
        { id: "combine-pdf", name: "Combine PDF Files", desc: "Merge multiple PDF documents into one.", href: "/combine-pdf" },
        { id: "split-pdf", name: "Split PDF", desc: "Extract or split pages from a PDF file.", href: "/split-pdf" },
        { id: "unlock-pdf", name: "Unlock PDF", desc: "Remove password protection from PDFs locally.", href: "/unlock-pdf" },
        { id: "protect-pdf", name: "Protect PDF", desc: "Add a password to secure your documents.", href: "/protect-pdf" },
        { id: "pdf-to-image", name: "PDF to Image", desc: "Convert PDF pages into JPG or PNG images.", href: "/pdf-to-image" }
    ]
  },
  {
    id: "02",
    title: "Photo & Media",
    tools: [
        { id: "remove-background", name: "Remove Background", desc: "Automatically remove image backgrounds in-browser.", href: "/remove-background" },
        { id: "heic-to-jpg", name: "iPhone Photo Converter", desc: "Convert HEIC photos to standard JPG or PNG format.", href: "/heic-to-jpg" },
        { id: "shrink-images", name: "Shrink Image Size", desc: "Compress images while preserving visual quality.", href: "/shrink-images" },
        { id: "social-media-resizer", name: "Social Media Resizer", desc: "Resize images for Instagram, YouTube, and TikTok.", href: "/social-media-resizer" },
        { id: "video-to-gif", name: "Video to GIF", desc: "Turn short video clips into animated GIFs.", href: "/video-to-gif" }
    ]
  },
  {
    id: "03",
    title: "Productivity",
    tools: [
        { id: 'copy-text-from-image', name: "Copy Text from Image", desc: "Extract text from photos and scanned documents.", href: "/copy-text-from-image" },
        { id: 'excel-to-pdf', name: "Excel to PDF", desc: "Convert Excel spreadsheets into printable PDFs.", href: "/excel-to-pdf" },
        { id: 'spreadsheet-to-json', name: "Spreadsheet to JSON", desc: "Transform spreadsheet data into JSON format.", href: "/spreadsheet-to-json" }
    ]
  },
  {
    id: "04",
    title: "Security & Others",
    tools: [
        { id: "secure-password-generator", name: "Secure Password Generator", desc: "Generate strong passwords using your device only.", href: "/secure-password-generator" },
        { id: "private-qr-generator", name: "Private QR Generator", desc: "Create QR codes without tracking or data sharing.", href: "/private-qr-generator" }
    ]
  }
];

export const allTools: Tool[] = categories.flatMap(c => c.tools);

