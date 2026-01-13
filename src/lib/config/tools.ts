// src/lib/config/tools.ts

export interface MultiLang {
  en: string;
  ja: string;
  ko: string;
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
    title: { en: "PDF Utilities", ja: "PDFユーティリティ", ko: "PDF 유틸리티" },
    tools: [
      {
        id: "image-to-pdf",
        name: {
          en: "Image to PDF",
          ja: "画像からPDF変換",
          ko: "이미지를 PDF로 변환"
        },
        h1: {
          en: "Convert Images to PDF Online",
          ja: "画像をPDFに一括変換",
          ko: "이미지를 온라인에서 PDF로 변환"
        },
        desc: {
          en: "Convert JPG, PNG, and WebP images into a professional PDF document online for free.",
          ja: "JPG、PNG、WebP画像を無料で高品質なPDFドキュメントに変換します。",
          ko: "JPG, PNG, WebP 이미지를 무료로 고품질 PDF 문서로 변환하세요."
        },
        seo: {
          title: {
            en: "Convert Image to PDF Free - 100% Local",
            ja: "画像をPDFに変換 (無料) | 100% クライアントサイド処理",
            ko: "이미지 PDF 변환 무료 | 100% 로컬 처리"
          },
          description: {
            en: "Securely convert JPG, PNG, WebP to PDF directly in your browser. No server uploads, total privacy.",
            ja: "JPG/PNG/WebP画像をブラウザで直接PDFに変換。サーバー送信不要でプライバシー保護も万全です。",
            ko: "JPG, PNG, WebP 이미지를 브라우저에서 바로 PDF로 변환하세요. 서버 업로드 없이 완벽한 개인정보 보호."
          },
          keywords: {
            en: "image to pdf, jpg to pdf, png to pdf, no upload pdf",
            ja: "画像 PDF 変換, JPG PDF 変換, 登録不要 PDF, 安全 PDF 作成",
            ko: "이미지 PDF 변환, JPG PDF 변환, PNG PDF 변환, 무료 PDF 변환, 업로드 없음 PDF"
          },
          ogTitle: {
            en: "Fast & Secure Image to PDF Converter",
            ja: "【無料】画像をその場でPDFに変換 - サーバー送信なし",
            ko: "빠르고 안전한 이미지 PDF 변환기 (무료 · 서버 전송 없음)"
          }
        },
        href: "/image-to-pdf",
      },
      {
        id: "combine-pdf",
        name: {
          en: "Merge PDF Files Online",
          ja: "PDF結合",
          ko: "PDF 합치기"
        },
        h1: {
          en: "Merge Multiple PDF Files Online",
          ja: "PDFファイルを1つに結合",
          ko: "여러 개의 PDF 파일을 하나로 병합"
        },
        desc: {
          en: "Combine multiple PDF documents into one single file. 100% private, no server upload.",
          ja: "複数のPDFファイルを1つに結合します。100%プライベートで、サーバーへのアップロードは一切ありません。",
          ko: "여러 개의 PDF 문서를 하나의 파일로 병합하세요. 서버 업로드 없이 100% 안전하게 처리됩니다."
        },
        seo: {
          title: {
            en: "Merge PDF Files Free - Private & Fast",
            ja: "PDF結合 (無料) | 複数のPDFを1つに統合",
            ko: "PDF 병합 무료 | 빠르고 안전한 PDF 합치기"
          },
          description: {
            en: "Combine multiple PDF documents into one. 100% private processing in your browser. No server uploads.",
            ja: "複数のPDFを1つに結合。ブラウザ完結型なので、大切な書類が外部に漏れる心配はありません。",
            ko: "여러 개의 PDF 파일을 하나로 합치세요. 브라우저에서 바로 처리되어 서버 전송 없이 개인정보를 보호합니다."
          },
          keywords: {
            en: "merge pdf, combine pdf, pdf joiner",
            ja: "PDF 結合, PDF 統合, PDF まとめる, 無料 PDF 結合",
            ko: "PDF 병합, PDF 합치기, PDF 결합, 무료 PDF 병합, PDF 하나로"
          },
          ogTitle: {
            en: "Merge PDFs Locally - 100% Private & Secure",
            ja: "PDF結合ツール - 安全なローカル処理",
            ko: "PDF 병합 도구 | 100% 로컬 처리 · 안전함"
          }
        },
        href: "/combine-pdf",
      },
      {
        id: "split-pdf",
        name: {
          en: "Split PDF Online",
          ja: "PDF分割",
          ko: "PDF 분할"
        },
        h1: {
          en: "Split PDF Online Locally",
          ja: "PDFファイルを分割・ページ抽出",
          ko: "PDF 파일 분할 및 페이지 추출"
        },
        desc: {
          en: "Extract specific pages or split your PDF into multiple documents instantly.",
          ja: "特定のページを抽出したり、PDFを即座に複数のドキュメントに分割したりできます。",
          ko: "필요한 페이지만 추출하거나 PDF 파일을 여러 문서로 즉시 분할할 수 있습니다."
        },
        seo: {
          title: {
            en: "Split PDF Online Free - Extract PDF Pages",
            ja: "PDF分割 (無料) | ページ抽出・分割がブラウザで完結",
            ko: "PDF 분할 무료 | PDF 페이지 추출·분리"
          },
          description: {
            en: "Split PDF files or extract specific pages instantly. Secure local processing without uploads.",
            ja: "PDFを即座に分割。サーバーに送らず手元のブラウザで処理するため、セキュリティも万全です。",
            ko: "PDF 파일을 분할하거나 특정 페이지만 추출하세요. 서버 업로드 없이 브라우저에서 안전하게 처리됩니다."
          },
          keywords: {
            en: "split pdf, extract pdf pages, pdf separator",
            ja: "PDF 分割, PDF ページ抽出, PDF 切り出し, 無料 PDF 分割",
            ko: "PDF 분할, PDF 페이지 추출, PDF 분리, 무료 PDF 분할, PDF 자르기"
          },
          ogTitle: {
            en: "Secure PDF Splitter - No Data Leaves Your Device",
            ja: "PDF分割ツール - サーバー送信なしで安全にページ抽出",
            ko: "PDF 분할 도구 | 서버 전송 없이 안전하게"
          }
        },
        href: "/split-pdf",
      },
      {
        id: "unlock-pdf",
        name: {
          en: "Unlock PDF Password",
          ja: "PDFパスワード解除",
          ko: "PDF 비밀번호 해제"
        },
        h1: {
          en: "Unlock PDF Password Locally",
          ja: "PDFのパスワード保護を解除",
          ko: "PDF 비밀번호 및 보안 제한 해제"
        },
        desc: {
          en: "Remove passwords and restrictions from secured PDF files locally in your browser.",
          ja: "保護されたPDFファイルのパスワードや制限を、ブラウザ上でローカルに解除します。",
          ko: "브라우저에서 바로 PDF 비밀번호와 보안 제한을 안전하게 제거하세요."
        },
        seo: {
          title: {
            en: "Unlock PDF Online - Remove PDF Password & Restrictions",
            ja: "PDFパスワード解除 (無料) | 制限をブラウザ上で安全に除去",
            ko: "PDF 비밀번호 해제 무료 | PDF 잠금·제한 제거"
          },
          description: {
            en: "Remove passwords from PDF files locally. No data leaves your computer. Secure and fast PDF unlocking.",
            ja: "PDFのパスワードをローカルで解除。サーバー送信なしで機密保持も安心。素早く制限を取り除けます。",
            ko: "PDF 파일의 비밀번호를 로컬에서 해제하세요. 서버 전송 없이 빠르고 안전하게 PDF 잠금을 제거합니다."
          },
          keywords: {
            en: "unlock pdf, remove pdf password, pdf password remover",
            ja: "PDF パスワード解除, PDF 制限解除, PDF ロック解除",
            ko: "PDF 비밀번호 해제, PDF 잠금 해제, PDF 제한 제거, 무료 PDF 잠금 해제"
          },
          ogTitle: {
            en: "Safe PDF Unlocker - No Server Processing",
            ja: "【安全】PDFパスワード解除ツール - サーバー送信不要",
            ko: "안전한 PDF 비밀번호 해제 | 서버 전송 없음"
          }
        },
        href: "/unlock-pdf",
      },
      {
        id: "protect-pdf",
        name: {
          en: "Protect PDF with Password",
          ja: "PDFパスワード保護",
          ko: "PDF 비밀번호 설정"
        },
        h1: {
          en: "Protect PDF with Password Online",
          ja: "PDFファイルをパスワードで暗号化",
          ko: "PDF 파일에 비밀번호를 설정하여 보호"
        },
        desc: {
          en: "Encrypt your PDF documents with a strong password. Everything stays on your computer.",
          ja: "強力なパスワードでPDFを暗号化します。すべての処理はコンピュータ内で行われ、安全です。",
          ko: "강력한 비밀번호로 PDF 문서를 암호화하세요. 모든 작업은 내 컴퓨터에서 안전하게 처리됩니다."
        },
        seo: {
          title: {
            en: "Protect PDF Online - Encrypt PDF Locally",
            ja: "PDFパスワード保護 (無料) | 強力な暗号化をブラウザで",
            ko: "PDF 비밀번호 설정 무료 | PDF 암호화"
          },
          description: {
            en: "Add a password to your PDF files securely. 100% local encryption in your browser for total privacy.",
            ja: "PDFにパスワードを設定して安全に保護。ブラウザ内での100%ローカル暗号化により、プライバシーを死守します。",
            ko: "PDF 파일에 비밀번호를 추가하여 안전하게 보호하세요. 브라우저에서 100% 로컬 암호화로 개인정보를 완벽히 지킵니다."
          },
          keywords: {
            en: "protect pdf, encrypt pdf, pdf password, secure pdf",
            ja: "PDF パスワード保護, PDF 暗号化, PDF セキュリティ",
            ko: "PDF 비밀번호 설정, PDF 암호화, PDF 보안, 무료 PDF 암호화"
          },
          ogTitle: {
            en: "Secure PDF Protection - Everything Stays Local",
            ja: "PDFパスワード設定 - サーバー送信なしで安全に暗号化",
            ko: "PDF 암호화 도구 | 서버 전송 없이 안전하게"
          }
        },
        href: "/protect-pdf",
      },
      {
        id: "pdf-to-image",
        name: {
          en: "PDF to Image Converter",
          ja: "PDFから画像変換",
          ko: "PDF 이미지 변환"
        },
        h1: {
          en: "Convert PDF Pages to Images Online",
          ja: "PDFをJPG/PNG画像に変換",
          ko: "PDF 페이지를 이미지로 변환"
        },
        desc: {
          en: "Convert PDF pages into high-quality JPG or PNG images without any file size limits.",
          ja: "PDFページをファイルサイズ制限なしで高品質なJPGまたはPNG画像に変換します。",
          ko: "PDF 페이지를 파일 크기 제한 없이 고품질 JPG 또는 PNG 이미지로 변환하세요."
        },
        seo: {
          title: {
            en: "PDF to Image Converter Free - 100% Local",
            ja: "PDF画像変換 (無料) | PDFをJPG/PNGに高画質変換",
            ko: "PDF 이미지 변환 무료 | PDF를 JPG·PNG로 변환"
          },
          description: {
            en: "Convert PDF pages to high-quality JPG or PNG images locally. Secure processing with no file size limits.",
            ja: "PDFの各ページをJPGやPNG画像に変換。サーバーに送らずローカルで処理するため、大容量ファイルも安心。",
            ko: "PDF 각 페이지를 JPG 또는 PNG 이미지로 변환하세요. 서버 업로드 없이 로컬에서 안전하게 처리되며 파일 크기 제한이 없습니다."
          },
          keywords: {
            en: "pdf to image, pdf to jpg, pdf to png, extract images from pdf",
            ja: "PDF 画像 変換, PDF JPG 変換, PDF PNG 変換",
            ko: "PDF 이미지 변환, PDF JPG 변환, PDF PNG 변환, PDF 이미지 추출"
          },
          ogTitle: {
            en: "High-Quality PDF to Image Converter",
            ja: "【無料】PDFを画像へ変換 - 高画質・安全",
            ko: "고화질 PDF 이미지 변환 | 무료 · 안전"
          }
        },
        href: "/pdf-to-image",
      },
      {
        id: "compress-pdf",
        name: {
          en: "Compress PDF",
          ja: "PDF圧縮",
          ko: "PDF 압축"
        },
        h1: {
          en: "Compress PDF Files Locally",
          ja: "PDFファイルを圧縮・軽量化",
          ko: "PDF 파일을 압축하여 용량 줄이기"
        },
        desc: {
          en: "Reduce the file size of your PDF documents while maintaining quality. 100% private and local.",
          ja: "品質を維持しながらPDFのサイズを削減します。100%プライベートかつローカルな処理。",
          ko: "품질을 유지하면서 PDF 파일 용량을 줄이세요. 100% 로컬 처리로 안전하게 압축됩니다."
        },
        seo: {
          title: {
            en: "Compress PDF Online Free - Safe & Local",
            ja: "PDF圧縮 (無料) | ブラウザで安全にファイルサイズ削減",
            ko: "PDF 압축 무료 | 파일 용량 줄이기"
          },
          description: {
            en: "Shrink PDF file size offline in your browser. Maintain high quality without uploading to any server.",
            ja: "PDFファイルをブラウザ上で軽量化。サーバーにアップロードしないため、機密書類も安全に圧縮できます。",
            ko: "PDF 파일 용량을 브라우저에서 바로 줄이세요. 서버 업로드 없이 고품질을 유지하며 안전하게 압축합니다."
          },
          keywords: {
            en: "compress pdf, reduce pdf size, local pdf compressor",
            ja: "PDF 圧縮, PDF 軽量化, PDF サイズ削減, オフライン PDF 圧縮",
            ko: "PDF 압축, PDF 용량 줄이기, PDF 크기 줄이기, 무료 PDF 압축"
          },
          ogTitle: {
            en: "Secure PDF Compression - No Data Leaves Your PC",
            ja: "PDF圧縮ツール - サーバー送信なしで安全",
            ko: "안전한 PDF 압축 | 서버 전송 없음"
          }
        },
        href: "/compress-pdf",
      },
    ],
  },
  {
    id: "02",
    title: { en: "Photo & Media", ja: "写真・メディア", ko: "사진 및 미디어" },
    tools: [
      {
        id: "shrink-images",
        name: {
          en: "Compress Images Online",
          ja: "画像圧縮",
          ko: "이미지 압축"
        },
        h1: {
          en: "Compress Images with Zero Quality Loss",
          ja: "画質を落とさず画像を圧縮",
          ko: "화질 손실 없이 이미지 압축"
        },
        desc: {
          en: "Reduce image file size while preserving high visual quality. Secure and private compression.",
          ja: "画質を維持したまま画像サイズを削減します。安全でプライベートな圧縮ツール。",
          ko: "높은 화질을 유지하면서 이미지 파일 용량을 줄이세요. 안전하고 개인 정보 보호가 보장됩니다."
        },
        seo: {
          title: {
            en: "Compress Images Online - Reduce Image Size Free",
            ja: "画像圧縮 (無料) | JPG/PNG/WebPをブラウザで軽量化",
            ko: "이미지 압축 무료 | 이미지 용량 줄이기"
          },
          description: {
            en: "Compress JPG, PNG, WebP images locally. Preserve quality while reducing file size for web use.",
            ja: "JPG/PNG/WebP画像をローカルで圧縮。画質を保ちつつ、Webサイト用にファイルサイズを最適化します。",
            ko: "JPG, PNG, WebP 이미지를 로컬에서 압축하세요. 화질은 유지하면서 웹용 이미지 용량을 최적화합니다."
          },
          keywords: {
            en: "compress image, reduce image size, online photo optimizer",
            ja: "画像 圧縮, 画像 サイズ 削減, 写真 軽量化",
            ko: "이미지 압축, 이미지 용량 줄이기, 사진 압축, 무료 이미지 압축"
          },
          ogTitle: {
            en: "Private Image Compressor - 100% Local",
            ja: "【安全】画像圧縮ツール - サーバー送信不要",
            ko: "안전한 이미지 압축 | 서버 전송 없음"
          }
        },
        href: "/shrink-images",
      },
      {
        id: "compress-video",
        name: {
          en: "Compress Video Online",
          ja: "動画圧縮",
          ko: "동영상 압축"
        },

        h1: {
          en: "Compress Video Online — Fast & Private",
          ja: "高速・安全に動画を圧縮",
          ko: "빠르고 안전하게 동영상 압축"
        },

        desc: {
          en: "Reduce video file size instantly using our high-performance in-browser compression engine. No uploads. 100% private.",
          ja: "独自開発の高速圧縮エンジンで、動画サイズを即座に削減。アップロード不要・100%プライバシー保護。",
          ko: "고성능 브라우저 기반 압축 엔진으로 동영상 파일 용량을 즉시 줄이세요. 업로드 없이 100% 개인정보를 보호합니다."
        },

        seo: {
          title: {
            en: "Compress Video Online Free — Fast, Private, No Upload",
            ja: "動画圧縮 無料｜高速・安全・アップロード不要",
            ko: "동영상 압축 무료 | 빠르고 안전 · 업로드 없음"
          },

          description: {
            en: "Compress MP4, WebM videos directly in your browser with our custom high-speed engine. Files never leave your device.",
            ja: "独自開発の高速エンジンでMP4・WebM動画をブラウザ内圧縮。ファイルは端末外に送信されません。",
            ko: "MP4, WebM 동영상을 브라우저에서 바로 압축하세요. 파일은 기기 밖으로 전송되지 않아 안전합니다."
          },

          keywords: {
            en: "compress video online, mp4 compressor, private video compression, browser video resizer, fast video compressor",
            ja: "動画 圧縮, MP4 圧縮, 動画 サイズ 削減, 高速 動画 圧縮, ブラウザ 動画 圧縮",
            ko: "동영상 압축, MP4 압축, 동영상 용량 줄이기, 무료 동영상 압축, 업로드 없는 동영상 압축"
          },

          ogTitle: {
            en: "Fast & Private Video Compression — No Upload Required",
            ja: "高速・安全な動画圧縮｜アップロード不要",
            ko: "빠르고 안전한 동영상 압축 | 업로드 필요 없음"
          }
        },

        href: "/compress-video",
      },
      {
        id: "heic-to-jpg",
        name: {
          en: "HEIC to JPG/PNG Converter",
          ja: "HEICからJPG/PNG変換",
          ko: "HEIC JPG/PNG 변환"
        },
        h1: {
          en: "Convert HEIC to JPG or PNG Online",
          ja: "iPhoneのHEIC画像をJPG/PNGに変換",
          ko: "HEIC 사진을 JPG 또는 PNG로 변환"
        },
        desc: {
          en: "Convert iPhone HEIC photos to standard JPG or PNG format. Batch processing supported.",
          ja: "iPhoneのHEIC写真を標準的なJPG hoặc PNGに変換します。一括処理に対応。",
          ko: "iPhone HEIC 사진을 표준 JPG 또는 PNG 형식으로 변환하세요. 여러 파일을 한 번에 처리할 수 있습니다."
        },
        seo: {
          title: {
            en: "HEIC to JPG Converter Free - Fast & Local",
            ja: "HEIC JPG 変換 (無料) | iPhoneの写真を一括変換",
            ko: "HEIC JPG 변환 무료 | iPhone 사진 변환"
          },
          description: {
            en: "Convert iPhone HEIC images to JPG or PNG locally. Free batch processing without server uploads.",
            ja: "iPhoneのHEIC画像をローカルでJPG/PNGに変換。サーバーにアップロードせず、一括で高速処理が可能です。",
            ko: "iPhone HEIC 이미지를 로컬에서 JPG 또는 PNG로 변환하세요. 서버 업로드 없이 무료로 일괄 변환할 수 있습니다."
          },
          keywords: {
            en: "heic to jpg, heic to png, convert heic, iphone photo converter",
            ja: "HEIC JPG 変換, HEIC 変換, iPhone 写真 変換",
            ko: "HEIC JPG 변환, HEIC PNG 변환, HEIC 변환, iPhone 사진 변환"
          },
          ogTitle: {
            en: "Fast HEIC to JPG Conversion - 100% Private",
            ja: "HEICからJPGへ変換 - サーバー送信なしで一括処理",
            ko: "빠른 HEIC JPG 변환 | 서버 전송 없음"
          }
        },
        href: "/heic-to-jpg",
      },
      {
        id: "remove-background",
        name: {
          en: "AI Background Remover",
          ja: "AI背景削除",
          ko: "AI 배경 제거"
        },
        h1: {
          en: "AI Background Remover Online",
          ja: "AIで画像の背景を自動削除",
          ko: "AI로 이미지 배경 자동 제거"
        },
        desc: {
          en: "Automatically remove image backgrounds in-browser using AI. No data leaves your device.",
          ja: "AIを使用してブラウザ上で画像の背景を自動的に削除します。データはデバイス外に送信されません。",
          ko: "AI를 사용해 브라우저에서 이미지 배경을 자동으로 제거하세요. 데이터는 기기 밖으로 전송되지 않습니다."
        },
        seo: {
          title: {
            en: "Free AI Background Remover - 100% Private",
            ja: "背景削除 (無料) | AIで画像の背景を透過・自動消去",
            ko: "AI 배경 제거 무료 | 이미지 배경 자동 삭제"
          },
          description: {
            en: "Remove image backgrounds automatically in your browser. No data leaves your device. Fast and secure.",
            ja: "AIが画像の背景を自動で削除。データはデバイス内で処理されるため、プライバシーも安心です。",
            ko: "AI가 이미지 배경을 자동으로 제거합니다. 서버 업로드 없이 브라우저에서 빠르고 안전하게 처리됩니다."
          },
          keywords: {
            en: "remove background, bg remover, ai background removal, transparent png",
            ja: "背景削除, 背景透過, AI 背景消去, 画像 背景 削除",
            ko: "배경 제거, 배경 투명화, AI 배경 제거, 이미지 배경 삭제"
          },
          ogTitle: {
            en: "Secure AI Background Remover - No Uploads",
            ja: "【AI】背景削除ツール - サーバー送信なしで透過画像作成",
            ko: "AI 배경 제거 도구 | 서버 전송 없음"
          }
        },
        href: "/remove-background",
      },
      {
        id: "social-media-resizer",
        name: {
          en: "Social Media Image Resizer",
          ja: "SNS画像リサイズ",
          ko: "SNS 이미지 리사이즈"
        },
        h1: {
          en: "Resize Images for Social Media",
          ja: "SNS向け画像サイズ最適化",
          ko: "SNS용 이미지 사이즈 조정"
        },
        desc: {
          en: "Resize images for Instagram, YouTube, TikTok, and more using local browser power.",
          ja: "Instagram、YouTube、TikTokなど向けに、ブラウザ上で画像サイズを最適化します。",
          ko: "Instagram, YouTube, TikTok 등 SNS에 맞게 이미지를 브라우저에서 바로 조정하세요."
        },
        seo: {
          title: {
            en: "Social Media Image Resizer - Instant & Local",
            ja: "SNS画像リサイズ (無料) | Instagram/YouTubeサイズ変換",
            ko: "SNS 이미지 리사이즈 무료 | 인스타·유튜브 사이즈 변환"
          },
          description: {
            en: "Crop and resize images for social media instantly. Support for Instagram, YouTube, and more. 100% private.",
            ja: "InstagramやYouTubeなど、各SNSに最適な画像サイズへ一括変換。ブラウザ内処理でプライバシーも安心。",
            ko: "SNS에 맞게 이미지를 즉시 자르고 리사이즈하세요. 서버 업로드 없이 100% 안전하게 처리됩니다."
          },
          keywords: {
            en: "image resizer, social media resize, instagram size, youtube thumbnail resizer",
            ja: "画像 リサイズ, SNS サイズ 変更, インスタ サイズ 調整",
            ko: "이미지 리사이즈, SNS 이미지 크기 변경, 인스타그램 사이즈, 유튜브 썸네일 크기"
          },
          ogTitle: {
            en: "Quick Social Media Resizer - No Data Upload",
            ja: "SNS用画像リサイズツール - サーバー送信なしで最適化",
            ko: "SNS 이미지 리사이즈 도구 | 서버 전송 없음"
          }
        },
        href: "/social-media-resizer",
      },
      {
        id: "video-to-gif",
        name: {
          en: "Video to GIF Converter",
          ja: "動画からGIF変換",
          ko: "동영상 GIF 변환"
        },
        h1: {
          en: "Convert Video to Animated GIF Online",
          ja: "動画をGIFアニメーションに変換",
          ko: "동영상을 GIF 애니메이션으로 변환"
        },
        desc: {
          en: "Turn your short video clips into animated GIFs quickly and privately.",
          ja: "短い動画クリップを、素早くプライベートにアニメーションGIFへ変換します。",
          ko: "짧은 동영상 클립을 빠르고 안전하게 GIF 애니메이션으로 변환하세요."
        },
        seo: {
          title: {
            en: "Video to GIF Converter Free - High Quality",
            ja: "動画 GIF 変換 (無料) | 動画からアニメーションGIF作成",
            ko: "동영상 GIF 변환 무료 | 고화질 GIF 만들기"
          },
          description: {
            en: "Convert MP4 and other videos to high-quality GIFs locally in your browser. Total privacy, no uploads.",
            ja: "動画を高品質なGIFアニメに変換。サーバーにアップロードせず、ブラウザ内で完結するため安全・高速です。",
            ko: "MP4 등 동영상을 브라우저에서 고화질 GIF로 변환하세요. 서버 업로드 없이 안전합니다."
          },
          keywords: {
            en: "video to gif, mp4 to gif, animated gif creator, local gif converter",
            ja: "動画 GIF 変換, MP4 GIF 変換, GIF作成",
            ko: "동영상 GIF 변환, MP4 GIF 변환, GIF 만들기, GIF 변환"
          },
          ogTitle: {
            en: "Fast Video to GIF Conversion - 100% Local",
            ja: "動画からGIF作成 - サーバー送信なしでプライバシー保護",
            ko: "빠른 동영상 GIF 변환 | 100% 로컬 처리"
          }
        },
        href: "/video-to-gif",
      },









    ],
  },
  {
    id: "03",
    title: { en: "Productivity", ja: "生産性向上ツール", ko: "생산성 도구" },
    tools: [
      {
        id: "bulk-rename",
        name: {
          en: "Bulk File Renamer",
          ja: "一括ファイル名変更",
          ko: "파일 이름 일괄 변경"
        },
        h1: {
          en: "Bulk File Renamer Online",
          ja: "ファイル名の一括変更",
          ko: "파일 이름 일괄 변경"
        },
        desc: {
          en: "Rename multiple files at once with custom rules: prefix, suffix, numbering, and find-replace. 100% local.",
          ja: "接頭辞、接尾辞、連番、置換など、カスタムルールで複数のファイル名を一括変更します。100%ローカル。",
          ko: "접두사, 접미사, 번호 매기기, 찾기·바꾸기 규칙으로 여러 파일 이름을 한 번에 변경하세요. 100% 로컬 처리."
        },
        seo: {
          title: {
            en: "Bulk File Renamer Online - Free & Local",
            ja: "一括リネーム (無料) | ファイル名をブラウザで一括変更",
            ko: "파일 이름 일괄 변경 무료 | 한 번에 리네임"
          },
          description: {
            en: "Rename hundreds of files instantly with prefix, suffix, and numbering. 100% local processing.",
            ja: "接頭辞、連番、置換などでファイル名を一括変更。サーバーにファイルを送らず安全にリネームできます。",
            ko: "수백 개의 파일 이름을 접두사, 번호 매기기 규칙으로 즉시 변경하세요. 서버 업로드 없이 안전합니다."
          },
          keywords: {
            en: "bulk rename, batch rename files, rename online, file renamer",
            ja: "一括リネーム, ファイル名変更, まとめて名前変更, 無料 リネーム",
            ko: "파일 이름 일괄 변경, 파일명 변경, 파일 리네임, 일괄 리네임"
          },
          ogTitle: {
            en: "Fast & Private Bulk File Renamer",
            ja: "【安全】ファイル名一括変更ツール - ローカル完結",
            ko: "빠르고 안전한 파일 이름 일괄 변경"
          }
        },
        href: "/bulk-rename",
      },
      {
        id: "copy-text-from-image",
        name: {
          en: "OCR Image to Text",
          ja: "OCR：画像から文字抽出",
          ko: "OCR 이미지 텍스트 추출"
        },
        h1: {
          en: "Extract Text from Images (OCR)",
          ja: "画像から文字を抽出 (OCR)",
          ko: "이미지에서 텍스트 추출 (OCR)"
        },
        desc: {
          en: "Extract text from photos and scanned documents using local OCR technology.",
          ja: "ローカルOCR技術を使用して、写真やスキャン文書から文字を抽出します。",
          ko: "로컬 OCR 기술을 사용해 사진과 스캔 문서에서 텍스트를 추출하세요."
        },
        seo: {
          title: {
            en: "Free Online OCR - Image to Text Converter",
            ja: "画像文字認識・OCR (無料) | 画像からテキストを抽出",
            ko: "OCR 이미지 텍스트 변환 무료"
          },
          description: {
            en: "Extract text from images and scanned documents locally. Secure OCR without server processing.",
            ja: "画像やスキャン文書から文字を自動抽出. サーバーを介さないため機密性の高い文書も安心です。",
            ko: "이미지와 스캔 문서에서 텍스트를 로컬로 추출합니다. 서버 전송 없이 안전합니다."
          },
          keywords: {
            en: "ocr online, image to text, extract text, local ocr",
            ja: "OCR 変換, 画像 文字抽出, 画像をテキストに変換, 無料 OCR",
            ko: "OCR 변환, 이미지 텍스트 추출, 사진 글자 추출, 무료 OCR"
          },
          ogTitle: {
            en: "Secure Local OCR - Extract Text Privately",
            ja: "【OCR】画像文字抽出ツール - サーバー送信不要",
            ko: "안전한 OCR 텍스트 추출 | 서버 전송 없음"
          }
        },
        href: "/copy-text-from-image",
      },
      {
        id: "excel-to-pdf",
        name: {
          en: "Excel to PDF Converter",
          ja: "ExcelからPDF変換",
          ko: "엑셀 PDF 변환"
        },
        h1: {
          en: "Convert Excel to PDF Online",
          ja: "ExcelをPDFに変換",
          ko: "엑셀 파일을 PDF로 변환"
        },
        desc: {
          en: "Transform your Excel spreadsheets into printable PDF files instantly.",
          ja: "Excelスプレッドシートを、すぐに印刷可能なPDFファイルへ変換します。",
          ko: "엑셀 스프레드시트를 인쇄 가능한 PDF 파일로 즉시 변환하세요."
        },
        seo: {
          title: {
            en: "Excel to PDF Converter Free - Safe & Local",
            ja: "Excel PDF 変換 (無料) | スプレッドシートをPDFへ",
            ko: "엑셀 PDF 변환 무료 | 안전한 변환"
          },
          description: {
            en: "Convert .xlsx and .xls files to PDF securely in your browser. No server uploads, your data stays private.",
            ja: "Excelファイルをブラウザ上で安全にPDFへ変換。サーバーにデータを送らないため、ビジネス文書も安心。",
            ko: "XLSX, XLS 파일을 브라우저에서 안전하게 PDF로 변환하세요. 서버 업로드 없이 개인정보를 보호합니다."
          },
          keywords: {
            en: "excel to pdf, xlsx to pdf, convert spreadsheet to pdf",
            ja: "Excel PDF 変換, エクセル PDF 変換, 無料 Excel PDF",
            ko: "엑셀 PDF 변환, Excel PDF 변환, 무료 엑셀 PDF"
          },
          ogTitle: {
            en: "Secure Excel to PDF Conversion - 100% Local",
            ja: "【安全】ExcelからPDFへ変換 - サーバー送信不要",
            ko: "안전한 엑셀 PDF 변환 | 로컬 처리"
          }
        },
        href: "/excel-to-pdf",
      },
      {
        id: "spreadsheet-to-json",
        name: {
          en: "Spreadsheet to JSON",
          ja: "スプレッドシートからJSON変換",
          ko: "스프레드시트 JSON 변환"
        },
        h1: {
          en: "Convert Excel/CSV to JSON Online",
          ja: "Excel/CSVをJSONに変換",
          ko: "Excel 및 CSV를 JSON으로 변환"
        },
        desc: {
          en: "Convert Excel or CSV data into JSON format for developers and data analysis.",
          ja: "ExcelやCSVデータを、開発やデータ分析向けのJSON形式に変換します。",
          ko: "개발 및 데이터 분석을 위해 Excel 또는 CSV 데이터를 JSON 형식으로 변환하세요."
        },
        seo: {
          title: {
            en: "Spreadsheet to JSON Converter - Free & Local",
            ja: "Excel CSV JSON 変換 (無料) | 開発者向けツール",
            ko: "Excel CSV JSON 변환 무료 | 개발자 도구"
          },
          description: {
            en: "Convert Excel or CSV files to JSON format instantly. 100% local processing in your browser, perfect for developers.",
            ja: "ExcelやCSVをJSONに変換。ブラウザ内でのローカル処理により、大切なデータが外部に漏れることはありません。",
            ko: "Excel 또는 CSV 파일을 브라우저에서 바로 JSON으로 변환하세요. 100% 로컬 처리로 안전합니다."
          },
          keywords: {
            en: "excel to json, csv to json, spreadsheet converter, json tool",
            ja: "Excel JSON 変換, CSV JSON 変換, データ 変換 ツール",
            ko: "엑셀 JSON 변환, CSV JSON 변환, 데이터 변환 도구, JSON 변환"
          },
          ogTitle: {
            en: "Fast Spreadsheet to JSON Converter - Private",
            ja: "Excel/CSVからJSONへ変換 - サーバー送信なしで安全",
            ko: "빠른 스프레드시트 JSON 변환 | 서버 전송 없음"
          }
        },
        href: "/spreadsheet-to-json",
      },
    ],
  },
];

export const allTools: Tool[] = categories.flatMap((category) => category.tools);
