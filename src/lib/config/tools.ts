// src/lib/config/tools.ts

export interface MultiLang {
  en: string;
  ja: string;
}

export interface SEOData {
  title: MultiLang;
  description: MultiLang;
  keywords: MultiLang;
  ogTitle: MultiLang;
}

export interface Tool {
  id: string;
  name: MultiLang;
  h1: MultiLang;
  desc: MultiLang;
  seo: SEOData;
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
    title: { en: "PDF Utilities", ja: "PDFユーティリティ" },
    tools: [
      {
        id: "image-to-pdf",
        name: { 
          en: "Image to PDF", 
          ja: "画像からPDF変換" },
        h1: { 
          en: "Convert Images to PDF Online", 
          ja: "画像をPDFに一括変換" },
        desc: { 
          en: "Convert JPG, PNG, and WebP images into a professional PDF document online for free.", 
          ja: "JPG、PNG、WebP画像を無料で高品質なPDFドキュメントに変換します。" },
        seo: {
          title: { 
            en: "Convert Image to PDF Free - 100% Local", 
            ja: "画像をPDFに変換 (無料) | 100% クライアントサイド処理" },
          description: { 
            en: "Securely convert JPG, PNG, WebP to PDF directly in your browser. No server uploads, total privacy.", 
            ja: "JPG/PNG/WebP画像をブラウザで直接PDFに変換。サーバー送信不要でプライバシー保護も万全です。" },
          keywords: { 
            en: "image to pdf, jpg to pdf, png to pdf, no upload pdf", 
            ja: "画像 PDF 変換, JPG PDF 変換, 登録不要 PDF, 安全 PDF 作成" },
          ogTitle: { 
            en: "Fast & Secure Image to PDF Converter", 
            ja: "【無料】画像をその場でPDFに変換 - サーバー送信なし" }
        },
        href: "/image-to-pdf",
      },
      {
        id: "combine-pdf",
        name: { 
          en: "Merge PDF Files Online", 
          ja: "PDF結合" },
        h1: { 
          en: "Merge Multiple PDF Files Online", 
          ja: "PDFファイルを1つに結合" },
        desc: { 
          en: "Combine multiple PDF documents into one single file. 100% private, no server upload.", 
          ja: "複数のPDFファイルを1つに結合します。100%プライベートで、サーバーへのアップロードは一切ありません。" },
        seo: {
          title: { 
            en: "Merge PDF Files Free - Private & Fast", 
            ja: "PDF結合 (無料) | 複数のPDFを1つに統合" },
          description: { 
            en: "Combine multiple PDF documents into one. 100% private processing in your browser. No server uploads.", 
            ja: "複数のPDFを1つに結合。ブラウザ完結型なので、大切な書類が外部に漏れる心配はありません。" },
          keywords: { 
            en: "merge pdf, combine pdf, pdf joiner", 
            ja: "PDF 結合, PDF 統合, PDF まとめる, 無料 PDF 結合" },
          ogTitle: { 
            en: "Merge PDFs Locally - 100% Private & Secure", 
            ja: "PDF結合ツール - 安全なローカル処理" }
        },
        href: "/combine-pdf",
      },
      {
        id: "split-pdf",
        name: { 
          en: "Split PDF Online", 
          ja: "PDF分割" },
        h1: { 
          en: "Split PDF Online Locally", 
          ja: "PDFファイルを分割・ページ抽出" },
        desc: { 
          en: "Extract specific pages or split your PDF into multiple documents instantly.", 
          ja: "特定のページを抽出したり、PDFを即座に複数のドキュメントに分割したりできます。" },
        seo: {
          title: { 
            en: "Split PDF Online Free - Extract PDF Pages", 
            ja: "PDF分割 (無料) | ページ抽出・分割がブラウザで完結" },
          description: { 
            en: "Split PDF files or extract specific pages instantly. Secure local processing without uploads.", 
            ja: "PDFを即座に分割。サーバーに送らず手元のブラウザで処理するため、セキュリティも万全です。" },
          keywords: { 
            en: "split pdf, extract pdf pages, pdf separator", 
            ja: "PDF 分割, PDF ページ抽出, PDF 切り出し, 無料 PDF 分割" },
          ogTitle: { 
            en: "Secure PDF Splitter - No Data Leaves Your Device", 
            ja: "PDF分割ツール - サーバー送信なしで安全にページ抽出" }
        },
        href: "/split-pdf",
      },
      {
        id: "unlock-pdf",
        name: { 
          en: "Unlock PDF Password", 
          ja: "PDFパスワード解除" },
        h1: { 
          en: "Unlock PDF Password Locally", 
          ja: "PDFのパスワード保護を解除" },
        desc: { 
          en: "Remove passwords and restrictions from secured PDF files locally in your browser.", 
          ja: "保護されたPDFファイルのパスワードや制限を、ブラウザ上でローカルに解除します。" },
        seo: {
          title: { 
            en: "Unlock PDF Online - Remove PDF Password & Restrictions", 
            ja: "PDFパスワード解除 (無料) | 制限をブラウザ上で安全に除去" },
          description: { 
            en: "Remove passwords from PDF files locally. No data leaves your computer. Secure and fast PDF unlocking.", 
            ja: "PDFのパスワードをローカルで解除。サーバー送信なしで機密保持も安心。素早く制限を取り除けます。" },
          keywords: { 
            en: "unlock pdf, remove pdf password, pdf password remover", 
            ja: "PDF パスワード解除, PDF 制限解除, PDF ロック解除" },
          ogTitle: { 
            en: "Safe PDF Unlocker - No Server Processing", 
            ja: "【安全】PDFパスワード解除ツール - サーバー送信不要" }
        },
        href: "/unlock-pdf",
      },
      {
        id: "protect-pdf",
        name: { 
          en: "Protect PDF with Password", 
          ja: "PDFパスワード保護" },
        h1: { 
          en: "Protect PDF with Password Online", 
          ja: "PDFファイルをパスワードで暗号化" },
        desc: { 
          en: "Encrypt your PDF documents with a strong password. Everything stays on your computer.", 
          ja: "強力なパスワードでPDFを暗号化します。すべての処理はコンピュータ内で行われ、安全です。", },
        seo: {
          title: { 
            en: "Protect PDF Online - Encrypt PDF Locally", 
            ja: "PDFパスワード保護 (無料) | 強力な暗号化をブラウザで" },
          description: { 
            en: "Add a password to your PDF files securely. 100% local encryption in your browser for total privacy.", 
            ja: "PDFにパスワードを設定して安全に保護。ブラウザ内での100%ローカル暗号化により、プライバシーを死守します。" },
          keywords: { 
            en: "protect pdf, encrypt pdf, pdf password, secure pdf", 
            ja: "PDF パスワード保護, PDF 暗号化, PDF セキュリティ" },
          ogTitle: { 
            en: "Secure PDF Protection - Everything Stays Local", 
            ja: "PDFパスワード設定 - サーバー送信なしで安全に暗号化" }
        },
        href: "/protect-pdf",
      },
      {
        id: "pdf-to-image",
        name: { 
          en: "PDF to Image Converter", 
          ja: "PDFから画像変換" },
        h1: { 
          en: "Convert PDF Pages to Images Online", 
          ja: "PDFをJPG/PNG画像に変換" },
        desc: { 
          en: "Convert PDF pages into high-quality JPG or PNG images without any file size limits.", 
          ja: "PDFページをファイルサイズ制限なしで高品質なJPGまたはPNG画像に変換します。" },
        seo: {
          title: { 
            en: "PDF to Image Converter Free - 100% Local", 
            ja: "PDF画像変換 (無料) | PDFをJPG/PNGに高画質変換" },
          description: { 
            en: "Convert PDF pages to high-quality JPG or PNG images locally. Secure processing with no file size limits.", 
            ja: "PDFの各ページをJPGやPNG画像に変換。サーバーに送らずローカルで処理するため、大容量ファイルも安心。" },
          keywords: { 
            en: "pdf to image, pdf to jpg, pdf to png, extract images from pdf", 
            ja: "PDF 画像 変換, PDF JPG 変換, PDF PNG 変換" },
          ogTitle: { 
            en: "High-Quality PDF to Image Converter", 
            ja: "【無料】PDFを画像へ変換 - 高画質・安全" }
        },
        href: "/pdf-to-image",
      },
      {
        id: "compress-pdf",
        name: { 
          en: "Compress PDF", 
          ja: "PDF圧縮" },
        h1: { 
          en: "Compress PDF Files Locally", 
          ja: "PDFファイルを圧縮・軽量化" },
        desc: { 
          en: "Reduce the file size of your PDF documents while maintaining quality. 100% private and local.", 
          ja: "品質を維持しながらPDFのサイズを削減します。100%プライベートかつローカルな処理。" },
        seo: {
          title: { 
            en: "Compress PDF Online Free - Safe & Local", 
            ja: "PDF圧縮 (無料) | ブラウザで安全にファイルサイズ削減" },
          description: { 
            en: "Shrink PDF file size offline in your browser. Maintain high quality without uploading to any server.", 
            ja: "PDFファイルをブラウザ上で軽量化。サーバーにアップロードしないため、機密書類も安全に圧縮できます。" },
          keywords: { 
            en: "compress pdf, reduce pdf size, local pdf compressor", 
            ja: "PDF 圧縮, PDF 軽量化, PDF サイズ削減, オフライン PDF 圧縮" },
          ogTitle: { 
            en: "Secure PDF Compression - No Data Leaves Your PC", 
            ja: "PDF圧縮ツール - サーバー送信なしで安全" }
        },
        href: "/compress-pdf",
      },
    ],
  },
  {
    id: "02",
    title: { en: "Photo & Media", ja: "写真・メディア" },
    tools: [
      {
        id: "shrink-images",
        name: { 
          en: "Compress Images Online", 
          ja: "画像圧縮" },
        h1: { 
          en: "Compress Images with Zero Quality Loss", 
          ja: "画質を落とさず画像を圧縮" },
        desc: { 
          en: "Reduce image file size while preserving high visual quality. Secure and private compression.", 
          ja: "画質を維持したまま画像サイズを削減します。安全でプライベートな圧縮ツール。" },
        seo: {
          title: { 
            en: "Compress Images Online - Reduce Image Size Free", 
            ja: "画像圧縮 (無料) | JPG/PNG/WebPをブラウザで軽量化" },
          description: { 
            en: "Compress JPG, PNG, WebP images locally. Preserve quality while reducing file size for web use.", 
            ja: "JPG/PNG/WebP画像をローカルで圧縮。画質を保ちつつ、Webサイト用にファイルサイズを最適化します。" },
          keywords: { 
            en: "compress image, reduce image size, online photo optimizer", 
            ja: "画像 圧縮, 画像 サイズ 削減, 写真 軽量化" },
          ogTitle: { 
            en: "Private Image Compressor - 100% Local", 
            ja: "【安全】画像圧縮ツール - サーバー送信不要" }
        },
        href: "/shrink-images",
      },
      {
  id: "compress-video",
  name: { 
    en: "Compress Video Online", 
    ja: "動画圧縮" 
  },

  h1: { 
    en: "Compress Video Online — Fast & Private", 
    ja: "高速・安全に動画を圧縮" 
  },

  desc: { 
    en: "Reduce video file size instantly using our high-performance in-browser compression engine. No uploads. 100% private.", 
    ja: "独自開発の高速圧縮エンジンで、動画サイズを即座に削減。アップロード不要・100%プライバシー保護。" 
  },

  seo: {
    title: { 
      en: "Compress Video Online Free — Fast, Private, No Upload", 
      ja: "動画圧縮 無料｜高速・安全・アップロード不要" 
    },

    description: { 
      en: "Compress MP4, WebM videos directly in your browser with our custom high-speed engine. Files never leave your device.", 
      ja: "独自開発の高速エンジンでMP4・WebM動画をブラウザ内圧縮。ファイルは端末外に送信されません。" 
    },

    keywords: { 
      en: "compress video online, mp4 compressor, private video compression, browser video resizer, fast video compressor", 
      ja: "動画 圧縮, MP4 圧縮, 動画 サイズ 削減, 高速 動画 圧縮, ブラウザ 動画 圧縮" 
    },

    ogTitle: { 
      en: "Fast & Private Video Compression — No Upload Required", 
      ja: "高速・安全な動画圧縮｜アップロード不要" 
    }
  },

  href: "/compress-video",
},

      {
        id: "heic-to-jpg",
        name: { 
          en: "HEIC to JPG/PNG Converter", 
          ja: "HEICからJPG/PNG変換" },
        h1: { 
          en: "Convert HEIC to JPG or PNG Online", 
          ja: "iPhoneのHEIC画像をJPG/PNGに変換" },
        desc: { 
          en: "Convert iPhone HEIC photos to standard JPG or PNG format. Batch processing supported.", 
          ja: "iPhoneのHEIC写真を標準的なJPG hoặc PNGに変換します。一括処理に対応。" },
        seo: {
          title: { 
            en: "HEIC to JPG Converter Free - Fast & Local", 
            ja: "HEIC JPG 変換 (無料) | iPhoneの写真を一括変換" },
          description: { 
            en: "Convert iPhone HEIC images to JPG or PNG locally. Free batch processing without server uploads.", 
            ja: "iPhoneのHEIC画像をローカルでJPG/PNGに変換。サーバーにアップロードせず、一括で高速処理が可能です。" },
          keywords: { 
            en: "heic to jpg, heic to png, convert heic, iphone photo converter", 
            ja: "HEIC JPG 変換, HEIC 変換, iPhone 写真 変換" },
          ogTitle: { 
            en: "Fast HEIC to JPG Conversion - 100% Private", 
            ja: "HEICからJPGへ変換 - サーバー送信なしで一括処理" }
        },
        href: "/heic-to-jpg",
      },
      {
        id: "remove-background",
        name: { en: "AI Background Remover", ja: "AI背景削除" },
        h1: { en: "AI Background Remover Online", ja: "AIで画像の背景を自動削除" },
        desc: { en: "Automatically remove image backgrounds in-browser using AI. No data leaves your device.", ja: "AIを使用してブラウザ上で画像の背景を自動的に削除します。データはデバイス外に送信されません。" },
        seo: {
          title: { en: "Free AI Background Remover - 100% Private", ja: "背景削除 (無料) | AIで画像の背景を透過・自動消去" },
          description: { en: "Remove image backgrounds automatically in your browser. No data leaves your device. Fast and secure.", ja: "AIが画像の背景を自動で削除。データはデバイス内で処理されるため、プライバシーも安心です。" },
          keywords: { en: "remove background, bg remover, ai background removal, transparent png", ja: "背景削除, 背景透過, AI 背景消去, 画像 背景 削除" },
          ogTitle: { en: "Secure AI Background Remover - No Uploads", ja: "【AI】背景削除ツール - サーバー送信なしで透過画像作成" }
        },
        href: "/remove-background",
      },
      {
        id: "social-media-resizer",
        name: { en: "Social Media Image Resizer", ja: "SNS画像リサイズ" },
        h1: { en: "Resize Images for Social Media", ja: "SNS向け画像サイズ最適化" },
        desc: { en: "Resize images for Instagram, YouTube, TikTok, and more using local browser power.", ja: "Instagram、YouTube、TikTokなど向けに、ブラウザ上で画像サイズを最適化します。" },
        seo: {
          title: { en: "Social Media Image Resizer - Instant & Local", ja: "SNS画像リサイズ (無料) | Instagram/YouTubeサイズ変換" },
          description: { en: "Crop and resize images for social media instantly. Support for Instagram, YouTube, and more. 100% private.", ja: "InstagramやYouTubeなど、各SNSに最適な画像サイズへ一括変換。ブラウザ内処理でプライバシーも安心。" },
          keywords: { en: "image resizer, social media resize, instagram size, youtube thumbnail resizer", ja: "画像 リサイズ, SNS サイズ 変更, インスタ サイズ 調整" },
          ogTitle: { en: "Quick Social Media Resizer - No Data Upload", ja: "SNS用画像リサイズツール - サーバー送信なしで最適化" }
        },
        href: "/social-media-resizer",
      },
      {
        id: "video-to-gif",
        name: { en: "Video to GIF Converter", ja: "動画からGIF変換" },
        h1: { en: "Convert Video to Animated GIF Online", ja: "動画をGIFアニメーションに変換" },
        desc: { en: "Turn your short video clips into animated GIFs quickly and privately.", ja: "短い動画クリップを、素早くプライベートにアニメーションGIFへ変換します。" },
        seo: {
          title: { en: "Video to GIF Converter Free - High Quality", ja: "動画 GIF 変換 (無料) | 動画からアニメーションGIF作成" },
          description: { en: "Convert MP4 and other videos to high-quality GIFs locally in your browser. Total privacy, no uploads.", ja: "動画を高品質なGIFアニメに変換。サーバーにアップロードせず、ブラウザ内で完結するため安全・高速です。" },
          keywords: { en: "video to gif, mp4 to gif, animated gif creator, local gif converter", ja: "動画 GIF 変換, MP4 GIF 変換, GIF作成" },
          ogTitle: { en: "Fast Video to GIF Conversion - 100% Local", ja: "動画からGIF作成 - サーバー送信なしでプライバシー保護" }
        },
        href: "/video-to-gif",
      },
    ],
  },
  {
    id: "03",
    title: { en: "Productivity", ja: "生産性向上ツール" },
    tools: [
      {
        id: "bulk-rename",
        name: { 
          en: "Bulk File Renamer", 
          ja: "一括ファイル名変更" },
        h1: { 
          en: "Bulk File Renamer Online", 
          ja: "ファイル名の一括変更" },
        desc: { 
          en: "Rename multiple files at once with custom rules: prefix, suffix, numbering, and find-replace. 100% local.", 
          ja: "接頭辞、接尾辞、連番、置換など、カスタムルールで複数のファイル名を一括変更します。100%ローカル。" },
        seo: {
          title: { 
            en: "Bulk File Renamer Online - Free & Local", 
            ja: "一括リネーム (無料) | ファイル名をブラウザで一括変更" },
          description: { 
            en: "Rename hundreds of files instantly with prefix, suffix, and numbering. 100% local processing.", 
            ja: "接頭辞、連番、置換などでファイル名を一括変更。サーバーにファイルを送らず安全にリネームできます。" },
          keywords: { 
            en: "bulk rename, batch rename files, rename online, file renamer", 
            ja: "一括リネーム, ファイル名変更, まとめて名前変更, 無料 リネーム" },
          ogTitle: { 
            en: "Fast & Private Bulk File Renamer", 
            ja: "【安全】ファイル名一括変更ツール - ローカル完結" }
        },
        href: "/bulk-rename",
      },
      {
        id: "copy-text-from-image",
        name: { en: "OCR Image to Text", ja: "OCR：画像から文字抽出" },
        h1: { en: "Extract Text from Images (OCR)", ja: "画像から文字を抽出 (OCR)" },
        desc: { en: "Extract text from photos and scanned documents using local OCR technology.", ja: "ローカルOCR技術を使用して、写真やスキャン文書から文字を抽出します。" },
        seo: {
          title: { en: "Free Online OCR - Image to Text Converter", ja: "画像文字認識・OCR (無料) | 画像からテキストを抽出" },
          description: { en: "Extract text from images and scanned documents locally. Secure OCR without server processing.", ja: "画像やスキャン文書から文字を自動抽出. サーバーを介さないため機密性の高い文書も安心です。" },
          keywords: { en: "ocr online, image to text, extract text, local ocr", ja: "OCR 変換, 画像 文字抽出, 画像をテキストに変換, 無料 OCR" },
          ogTitle: { en: "Secure Local OCR - Extract Text Privately", ja: "【OCR】画像文字抽出ツール - サーバー送信不要" }
        },
        href: "/copy-text-from-image",
      },
      {
        id: "excel-to-pdf",
        name: { en: "Excel to PDF Converter", ja: "ExcelからPDF変換" },
        h1: { en: "Convert Excel to PDF Online", ja: "ExcelをPDFに変換" },
        desc: { en: "Transform your Excel spreadsheets into printable PDF files instantly.", ja: "Excelスプレッドシートを、すぐに印刷可能なPDFファイルへ変換します。" },
        seo: {
          title: { en: "Excel to PDF Converter Free - Safe & Local", ja: "Excel PDF 変換 (無料) | スプレッドシートをPDFへ" },
          description: { en: "Convert .xlsx and .xls files to PDF securely in your browser. No server uploads, your data stays private.", ja: "Excelファイルをブラウザ上で安全にPDFへ変換。サーバーにデータを送らないため、ビジネス文書も安心。" },
          keywords: { en: "excel to pdf, xlsx to pdf, convert spreadsheet to pdf", ja: "Excel PDF 変換, エクセル PDF 変換, 無料 Excel PDF" },
          ogTitle: { en: "Secure Excel to PDF Conversion - 100% Local", ja: "【安全】ExcelからPDFへ変換 - サーバー送信不要" }
        },
        href: "/excel-to-pdf",
      },
      {
        id: "spreadsheet-to-json",
        name: { en: "Spreadsheet to JSON", ja: "スプレッドシートからJSON変換" },
        h1: { en: "Convert Excel/CSV to JSON Online", ja: "Excel/CSVをJSONに変換" },
        desc: { en: "Convert Excel or CSV data into JSON format for developers and data analysis.", ja: "ExcelやCSVデータを、開発やデータ分析向けのJSON形式に変換します。" },
        seo: {
          title: { en: "Spreadsheet to JSON Converter - Free & Local", ja: "Excel CSV JSON 変換 (無料) | 開発者向けツール" },
          description: { en: "Convert Excel or CSV files to JSON format instantly. 100% local processing in your browser, perfect for developers.", ja: "ExcelやCSVをJSONに変換。ブラウザ内でのローカル処理により、大切なデータが外部に漏れることはありません。" },
          keywords: { en: "excel to json, csv to json, spreadsheet converter, json tool", ja: "Excel JSON 変換, CSV JSON 変換, データ 変換 ツール" },
          ogTitle: { en: "Fast Spreadsheet to JSON Converter - Private", ja: "Excel/CSVからJSONへ変換 - サーバー送信なしで安全" }
        },
        href: "/spreadsheet-to-json",
      },
    ],
  },
];

export const allTools: Tool[] = categories.flatMap((category) => category.tools);

