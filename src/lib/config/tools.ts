// src/lib/config/tools.ts

export interface MultiLang {
  en: string;
  ja: string;
}


export interface Tool {
  id: string;
  name: MultiLang;
  desc: MultiLang;
  href: string;
}

export interface Category {
  id: string;
  title: MultiLang;
  tools: Tool[];
}

export const categories: Category[] = [
  {
    id: "01",
    title: {en:"PDF Utilities", ja:"PDFユーティリティ"},
    tools: [
      {
        id: "image-to-pdf",
        name: {
          en: "Image to PDF",
          ja: "画像からPDF変換",
        },
        desc: {
          en: "Convert JPG, PNG, and WebP images into a professional PDF document online for free.",
          ja: "JPG、PNG、WebP画像を無料で高品質なPDFドキュメントに変換します。",
        },
        href: "/image-to-pdf"
      },
      {
        id: "combine-pdf",
        name: {
          en: "Merge PDF Files Online",
          ja: "PDF結合",
        },
        desc: {
          en: "Combine multiple PDF documents into one single file. 100% private, no server upload.",
          ja: "複数のPDFファイルを1つに結合します。100%プライベートで、サーバーへのアップロードは一切ありません。"
        }, href: "/combine-pdf"
      },

      { id: "split-pdf", name: { en: "Split PDF Online", ja: "PDF分割" }, desc: { en: "Extract specific pages or split your PDF into multiple documents instantly.", ja: "特定のページを抽出したり、PDFを即座に複数のドキュメントに分割したりできます。" }, href: "/split-pdf" },
      { id: "unlock-pdf", name: { en: "Unlock PDF Password", ja: "PDFパスワード解除" }, desc: { en: "Remove passwords and restrictions from secured PDF files locally in your browser.", ja: "保護されたPDFファイルのパスワードや制限を、ブラウザ上でローカルに解除します。" }, href: "/unlock-pdf" },
      { id: "protect-pdf", name: { en: "Protect PDF with Password", ja: "PDFパスワード保護" }, desc: { en: "Encrypt your PDF documents with a strong password. Everything stays on your computer.", ja: "強力なパスワードでPDFを暗号化します。すべての処理はコンピュータ内で行われ、安全です。" }, href: "/protect-pdf" },
      { id: "pdf-to-image", name: { en: "PDF to Image Converter", ja: "PDFから画像変換" }, desc: { en: "Convert PDF pages into high-quality JPG or PNG images without any file size limits.", ja: "PDFページをファイルサイズ制限なしで高品質なJPGまたはPNG画像に変換します。" }, href: "/pdf-to-image" },
      {
        id: "compress-pdf",
        name: { en: "Compress PDF", ja: "PDF圧縮" },
        desc: { en: "Reduce the file size of your PDF documents while maintaining quality. 100% private and local.", ja: "品質を維持しながらPDFのサイズを削減します。100%プライベートかつローカルな処理。" },
        href: "/compress-pdf"
      },
    ]
  },
  {
    id: "02",
    title: {en: "Photo & Media", ja:"写真・メディア"},
    tools: [
      { id: "shrink-images", name: { en: "Compress Images Online", ja: "画像圧縮" }, desc: { en: "Reduce image file size while preserving high visual quality. Secure and private compression.", ja: "画質を維持したまま画像サイズを削減します。安全でプライベートな圧縮ツール。" }, href: "/shrink-images" },
      { id: "compress-video", name: { en: "Compress Video Online", ja: "動画圧縮" }, desc: { en: "Reduce video file size using FFmpeg WASM. 100% private, multi-threaded processing.", ja: "FFmpeg WASMを使用して動画サイズを削減します。マルチスレッド処理による100%機密保持。" }, href: "/compress-video" },
      { id: "heic-to-jpg", name: { en: "HEIC to JPG/PNG Converter", ja: "HEICからJPG/PNG変換" }, desc: { en: "Convert iPhone HEIC photos to standard JPG or PNG format. Batch processing supported.", ja: "iPhoneのHEIC写真を標準的なJPGまたはPNGに変換します。一括処理に対応。" }, href: "/heic-to-jpg" },
      { id: "remove-background", name: { en: "AI Background Remover", ja: "" }, desc: { en: "Automatically remove image backgrounds in-browser using AI. No data leaves your device.", ja: "" }, href: "/remove-background" },
      { id: "social-media-resizer", name: { en: "Social Media Image Resizer", ja: "" }, desc: { en: "Resize images for Instagram, YouTube, TikTok, and more using local browser power.", ja: "" }, href: "/social-media-resizer" },
      { id: "video-to-gif", name: { en: "Video to GIF Converter", ja: "" }, desc: { en: "Turn your short video clips into animated GIFs quickly and privately.", ja: "" }, href: "/video-to-gif" }
    ]
  },
  {
    id: "03",
    title: {en:"Productivity",ja:"生産性向上ツール"},
    tools: [
      {
        id: "bulk-rename",
        name: { en: "Bulk File Renamer", ja: "一括ファイル名変更" },
        desc: { 
          en: "Rename multiple files at once with custom rules: prefix, suffix, numbering, and find-replace. 100% local.", 
          ja: "接頭辞、接尾辞、連番、置換など、カスタムルールで複数のファイル名を一括変更します。100%ローカル。" },
        href: "/bulk-rename"
      },
      { id: 'copy-text-from-image', name: { en: "OCR: Copy Text from Image", ja: "" }, desc: { en: "Extract text from photos and scanned documents using local OCR technology.", ja: "" }, href: "/copy-text-from-image" },
      { id: 'excel-to-pdf', name: { en: "Excel to PDF Converter", ja: "" }, desc: { en: "Transform your Excel spreadsheets into printable PDF files instantly.", ja: "" }, href: "/excel-to-pdf" },
      { id: 'spreadsheet-to-json', name: { en: "Spreadsheet to JSON", ja: "" }, desc: { en: "Convert Excel or CSV data into JSON format for developers and data analysis.", ja: "" }, href: "/spreadsheet-to-json" }
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

