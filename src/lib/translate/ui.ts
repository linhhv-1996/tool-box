export type Language = 'en' | 'ja';

export const ui = {
  common: {
    add_more: {
      en: "Add More",
      ja: "追加"
    },

  },
  header: {
  text_1: {
    en: "100% Private",
    ja: "100% Private"
  },
  how_it_work: {
  en: "How it works",
  ja: "How it works"
},

},
  related_tools: {
    en: "Related Tools",
    ja: "関連ツール"
  },
  home: {
    title: {
      en: "JustLocalTools | Private Browser Tools Directory",
      ja: "JustLocalTools | ブラウザ完結型ツールディレクトリ"
    },
    h1: {
      en: "Private & Fast Browser Tools.",
      ja: "プライバシー保護＆高速ブラウザツール"
    },
    span: {
      en: "100% Client-Side.",
      ja: "100% クライアントサイド処理"
    },
    p: {
      en: "Stop uploading your private files to random servers. Everything stays on your computer with our local-first utilities.",
      ja: "ファイルをサーバーに送る必要は一切ありません。当サイトのツールはあなたのデバイス上でのみ動作するため, プライバシーを完全に守りながら高速に処理を行えます。"
    },
    no_tool_found: {
      en: "NO_TOOLS_FOUND",
      ja: "ツールが見つかりません"
    },
    search: {
      en: "Search for a tool...",
      ja: "ツールを検索..."
    },
    back_to_home: {
      en: "← [ Back to Toolbox ]",
      ja: "← ツールボックスに戻る"
    },
  },
  img2pdf: {
    title: {
      en: "Convert Images to PDF Online & Offline Free",
      ja: "無料】画像をPDFに一括変換 - オンライン＆オフライン対応",
    },
    description: {
      en: "Convert JPG, PNG, WebP, and BMP images to PDF directly in your browser. Securely combine and reorder multiple images into a single PDF without uploading to any server.",
      ja: "ブラウザでJPG/PNG/WebP/BMPをPDFに直接変換。サーバーにアップロードせず安全に結合・並べ替え。完全無料＆100%クライアントサイド処理でプライバシーも安心。オフライン対応のPDFツール。"
    },
    keywords: {
      en: "image to pdf, convert jpg to pdf, png to pdf converter, webp to pdf, combine images to pdf, browser-based pdf creator, no upload pdf converter, secure image to pdf",
      ja: "画像 PDF 変換, 画像をPDFに変換, JPG PDF 変換, PNG PDF 変換, WebP PDF 変換, 画像 結合 PDF, 複数の画像をPDFにまとめる, ブラウザ PDF 作成, アップロード不要 PDF 変換, 安全 画像 PDF 変換, 無料 PDF 変換 ツール, 会員登録不要 PDF 変換"
    },
    og_description: {
      en: "Turn your photos, scans, and documents into high-quality PDFs instantly. Your images stay on your device for total privacy.",
      ja: "写真や書類を即座に高品質なPDFへ変換。画像はサーバーにアップロードせず、デバイス内で処理するためプライバシーも安心です。完全無料で100%クライアントサイド処理の安全なPDF作成ツール。"
    },
    error_message: {
      en: "Error converting images. Please try again.",
      ja: "画像の変換に失敗しました。再度お試しください。",
    },
    layout: {
      en: "Layout",
      ja: "表示レイアウト",
    },
    converting: {
      en: "Converting...",
      ja: "変換中…"
    },
    convert_to_PDF: {
      en: "Convert to PDF",
      ja: "PDFに変換",
    },
    select_images: {
      en: "Select Images",
      ja: "画像を選択"
    },
  },
  dropzone: {
    change_file: {
      en: "Change File",
      ja: "ファイルを変更",
    },
    clear: {
      en: "Clear",
      ja: "クリア",
    },
    add_more: {
      en: "Add More",
      ja: "さらに追加"
    },
    label: {
      en: "Click to select or Drag files here",
      ja: "クリックまたはドラッグしてファイルを追加",
    }
  },
  success: {
    download: {
      en: "Download",
      ja: "ダウンロード"
    },
    saved: {
      en: "Saved",
      ja: "削減量",
    }
  },
  combine_pdf: {
    merge: {
      en: "Merge PDF Documents",
      ja: "PDFを結合",
    },
    processing: {
      en: "Processing...",
      ja: "処理中…",
    },
    title: {
      en: "Combine PDF Files Online & Locally Free",
      ja: "PDFを無料で結合｜オンライン＆ローカル対応"
    },
    description: {
      en: "Combine multiple PDF files into a single document directly in your browser. 100% private with client-side merging—no server uploads, no file size limits, and no privacy risks.",
      ja: "複数のPDFファイルをブラウザ上で1つに結合。100%ローカル処理で、アップロード不要・サイズ制限なし・プライバシーも安全。"
    },
    keywords: {
      en: "merge pdf online, combine pdf without upload, secure pdf merger, client-side pdf joiner, lossless pdf merge, free pdf binder, join pdf files privately",
      ja: "pdf 結合 無料, pdf 結合 オンライン, pdf アップロード不要, 安全 pdf 結合, ローカル pdf 結合, pdf マージ, pdf ファイル 結合"
    },
    og_title: {
      en: "Private & Lossless PDF Merging",
      ja: "安全・高品質なPDF結合"
    },
    og_description: {
      en: "Merge your sensitive PDF documents securely on your device. High-performance browser-based processing ensures your data never leaves your computer.",
      ja: "重要なPDFをデバイス上で安全に結合。高速なブラウザ処理により、データが外部に送信されることはありません。"
    },
    select_file: {
      en: "Select PDF Files to Combine",
      ja: "結合するPDFファイルを選択",
    },
    err_file_length: {
      en: "Select at least 2 PDF files to combine.",
      ja: "結合するには、PDFファイルを2つ以上選択してください。",
    },
    err_failed: {
      en: "Merge failed. Check if your PDF files are corrupted.",
      ja: "結合に失敗しました。PDFファイルが破損していないか確認してください。"
    }
  },
  split_pdf: {
    title: {
      en: "Extract PDF Pages Privately & Free Online",
      ja: "PDFページを安全・無料でオンライン抽出"
    },
    description: {
      en: "Extract specific pages or split your PDF into multiple separate documents instantly. A 100% private, browser-based tool that ensures your sensitive files never leave your device.",
      ja: "PDFから特定のページを抽出したり、複数のファイルに分割したりできます。完全にブラウザ上で動作し、ファイルをアップロードせずに安全・高速に処理できるプライバシー重視のPDF分割ツールです。"
    },
    keywords: {
      en: "split pdf, extract pdf pages, online pdf splitter, secure pdf extraction, split pdf without upload, browser-based pdf splitter, pdf page extractor, separate pdf pages.",
      ja: "PDF分割, PDFページ抽出, オンラインPDF分割, 安全なPDF抽出, アップロード不要PDF分割, ブラウザPDF分割ツール, PDFページ切り出し, PDFページ分離"
    },
    og_title: {
      en: "Secure & Flexible Page Extraction",
      ja: "安全で柔軟なPDFページ抽出"
    },
    og_description: {
      en: "Split your PDF files into individual pages or specific ranges privately. Fast, free, and no file uploads required for maximum document security.",
      ja: "PDFを1ページずつ、または指定した範囲で安全に分割できます。高速・無料・アップロード不要で、機密文書も安心して利用できます。"
    },
    err_no_pdf: {
      en: "Please select a valid PDF file.",
      ja: "有効なPDFファイルを選択してください。"
    },
    err_2: {
      en: "Could not read PDF information.",
      ja: "PDFの情報を読み取れませんでした。"
    },
    err_3: {
      en: "Split failed. Check your range syntax.",
      ja: "分割に失敗しました。ページ範囲の指定を確認してください。"
    },
    lbl: {
      en: "Select PDF File to Split",
      ja: "分割するPDFファイルを選択"
    },
    range: {
      en: "Define Ranges (e.g. 1-3, 5, 8-10)",
      ja: "ページ範囲を指定（例：1-3、5、8-10）"
    },
    note: {
      en: "Output will be bundled into a ZIP archive.",
      ja: "出力ファイルはZIP形式でまとめてダウンロードされます。"
    },
    split: {
      en: "Split & Export ZIP",
      ja: "分割してZIPで書き出し"
    },
  },
  unlock_pdf: {
    title: {
      en: "Remove PDF Password & Restrictions Online Free",
      ja: "PDFのパスワード・制限を無料で解除"
    },
    description: {
      en: "Unlock your PDF files and remove passwords or printing/editing restrictions directly in your browser. 100% private, client-side decryption ensures your documents and passwords never leave your device.",
      ja: "PDFのパスワードや印刷・編集制限をブラウザ上で解除できます。すべての処理は端末内で行われ、ファイルやパスワードが外部に送信されることはありません。"
    },
    keywords: {
      en: "unlock pdf, remove pdf password, pdf restriction remover, online pdf unlocker, secure pdf decryption, unlock pdf without upload, browser-based pdf unlocker, remove pdf print protection",
      ja: "PDFロック解除, PDFパスワード解除, PDF制限解除, オンラインPDF解除, 安全なPDF復号, アップロード不要PDF解除, ブラウザPDFロック解除, PDF印刷制限解除"
    },
    og_title: {
      en: "Instant & Private PDF Decryption",
      ja: "即時・安全なPDF復号"
    },
    og_description: {
      en: "Gaining full access to your PDF files privately. Remove open passwords and usage restrictions locally on your device without any server-side processing.",
      ja: "PDFを完全にローカル環境で復号し、パスワードや利用制限を安全に解除できます。サーバー処理は一切不要です。"
    },
    err_1: {
      en: "Incorrect password or unsupported PDF format.",
      ja: "パスワードが正しくないか、対応していないPDF形式です。"
    },
    err_2: {
      en: "Incorrect password. Please try again.",
      ja: "パスワードが正しくありません。もう一度お試しください。"
    },
    select_file: {
      en: "Select Encrypted PDF File",
      ja: "暗号化されたPDFファイルを選択"
    },
    pdf_pass: {
      en: "PDF Password:",
      ja: "PDFパスワード："
    },
    enter_pass: {
      en: "Enter password to unlock...",
      ja: "解除するためのパスワードを入力…"
    },
    unlocking: {
      en: "Unlocking...",
      ja: "解除中..."
    },
    unlock_now: {
      en: "Unlock PDF Now",
      ja: "PDFを今すぐ解除"
    }
  },
  protect_pdf: {
    err_1: {
      en: "Please select a valid PDF file.",
      ja: "有効なPDFファイルを選択してください。"
    },
    err_2: {
      en: "Encryption failed. Ensure the PDF is not already encrypted.",
      ja: "暗号化に失敗しました。PDFがすでに暗号化されていないか確認してください。"
    },
    select_file: {
      en: "Select PDF File to Protect",
      ja: "保護するPDFファイルを選択"
    },
    doc_pass: {
      en: "Document Password:",
      ja: "ドキュメントパスワード："
    },
    strong_pass: {
      en: "Set a strong password...",
      ja: "強力なパスワードを設定..."
    },
    encrypting: {
      en: "Encrypting...",
      ja: "暗号化中..."
    },
    protect_now: {
      en: "Protect PDF Now",
      ja: "PDFを今すぐ保護"
    },
    success: {
      en: "Protection Success",
      ja: "保護が完了しました"
    },
    title: {
      en: "Password Protect PDF Online (100% Private)",
      ja: "PDFにパスワードを設定（完全プライベート）"
    },
    description: {
      en: "Secure your PDF files with strong 256-bit AES encryption directly in your browser. No server uploads, no file tracking—your documents and passwords never leave your device.",
      ja: "ブラウザ上でPDFに256ビットAES暗号化を適用し、安全にパスワード保護できます。ファイルのアップロードや追跡は一切なく、ドキュメントとパスワードは端末外に送信されません。"
    },
    keywords: {
      en: "protect pdf with password, encrypt pdf online, secure pdf documents, 256-bit aes pdf encryption, lock pdf without upload, client-side pdf security, private pdf protection",
      ja: "PDFパスワード保護, PDF暗号化, オンラインPDF暗号化, PDFセキュリティ, AES-256 PDF暗号化, アップロード不要PDF保護, クライアントサイドPDF保護"
    },
    og_title: {
      en: "Secure AES-256 Encryption",
      ja: "安全なAES-256暗号化"
    },
    og_description: {
      en: "Add a secure password to your PDF files privately on your device. Fast, free, and industry-standard encryption without any server interaction.",
      ja: "端末上でPDFに安全なパスワードを追加できます。高速・無料・業界標準の暗号化方式で、サーバーとの通信は不要です。"
    }
  },
  pdf_to_image: {
    title: {
      en: "High-Quality PDF to JPG/PNG Online & Offline",
      ja: "高画質PDFをJPG/PNGに変換（オンライン・オフライン対応）"
    },
    description: {
      en: "Convert PDF pages into high-quality JPG or PNG images directly in your browser. 100% private with client-side rendering—no file uploads, no limits, and no waiting.",
      ja: "PDFページを高画質なJPGまたはPNG画像にブラウザ上で変換できます。すべて端末内で処理され、アップロード不要・制限なし・待ち時間なしで安全に利用できます。"
    },
    keywords: {
      en: "pdf to image, convert pdf to jpg, pdf to png converter, high resolution pdf to image, browser-based pdf renderer, secure pdf conversion, extract images from pdf",
      ja: "PDF画像変換, PDFをJPGに変換, PDFをPNGに変換, 高解像度PDF変換, ブラウザPDFレンダリング, 安全なPDF変換, PDF画像抽出"
    },
    og_title: {
      en: "100% Secure & High Resolution",
      ja: "100%安全・高解像度"
    },
    og_description: {
      en: "Extract sharp images from your PDF pages privately. Choose between JPG or PNG with adjustable resolution (up to 3x scale) without uploading any data.",
      ja: "PDFページから鮮明な画像を安全に抽出できます。JPGまたはPNG形式を選択でき、最大3倍まで解像度調整が可能。データのアップロードは不要です。"
    },
    select_file: {
      en: "Select PDF File to Convert",
      ja: "変換するPDFファイルを選択"
    },
    format: {
      en: "Format",
      ja: "形式"
    },
    quality: {
      en: "Quality (DPI)",
      ja: "画質（DPI）"
    },
    rendering: {
      en: "Rendering",
      ja: "変換中"
    },
    convert_again: {
      en: "Convert Again",
      ja: "もう一度変換"
    },
    convert_to_img: {
      en: "Convert PDF to Images",
      ja: "PDFを画像に変換"
    }
  },
  compress_pdf: {
    title: {
      en: "Compress PDF Online (100% Private)",
      ja: "PDFをオンラインで圧縮（100%プライベート）"
    },
    description: {
      en: "Reduce PDF file size locally in your browser without uploading to any server. Fast, secure, and 100% private PDF compression tool.",
      ja: "PDFファイルをサーバーにアップロードせず、ブラウザ上で直接圧縮できます。高速・安全・完全プライベートなPDF圧縮ツールです。"
    },
    og_title: {
      en: "Reduce PDF File Size Online",
      ja: "PDFファイルサイズをオンラインで縮小"
    },
    og_description: {
      en: "Compress PDF files locally in your browser. No server uploads, 100% private and secure.",
      ja: "PDFファイルをブラウザ内でローカル圧縮。サーバーへのアップロード不要で、100%安全・プライベートです。"
    },
    err_1: {
      en: "Please select valid PDF files.",
      ja: "有効なPDFファイルを選択してください。"
    },
    err_2: {
      en: "Compression failed for one or more files.",
      ja: "一部のファイルで圧縮に失敗しました。"
    },
    select_file: {
      en: "Select PDF files to compress",
      ja: "圧縮するPDFファイルを選択"
    },
    compressing: {
      en: "Compressing",
      ja: "圧縮中"
    },
    compress_pdf_file: {
      en: "Compress PDF Documents",
      ja: "PDFを圧縮"
    }
  },
  shrink_images: {
    title: {
      en: "Compress Images Online | No Quality Loss | JustLocalTools",
      ja: "画像をオンラインで圧縮｜高画質のまま｜JustLocalTools"
    },
    description: {
      en: "Reduce image file size up to 90% without losing quality. Supports JPG, PNG, and WebP. 100% private, browser-based compression - your images never leave your computer.",
      ja: "画質をほとんど劣化させずに画像サイズを最大90%削減できます。JPG・PNG・WebPに対応。すべてブラウザ内で処理され、画像が外部に送信されることはありません。"
    },
    keywords: {
      en: "compress images, image optimizer, shrink jpg, reduce png size, webp compressor, browser-based image compression, no upload image compressor",
      ja: "画像圧縮, 画像最適化, JPG圧縮, PNGサイズ削減, WebP圧縮, ブラウザ画像圧縮, アップロード不要画像圧縮"
    },
    og_title: {
      en: "Compress Images Online - Fast & Private",
      ja: "画像を高速・安全に圧縮"
    },
    og_description: {
      en: "High-quality image compression directly in your browser. No server uploads, 100% secure and free.",
      ja: "ブラウザ上で高品質な画像圧縮を実現。サーバーへのアップロード不要で、無料・100%安全に利用できます。"
    },
    err_1: {
      en: "Please select valid images (JPG, PNG, WebP).",
      ja: "有効な画像ファイル（JPG・PNG・WebP）を選択してください。"
    },
    err_2: {
      en: "Optimization failed. Try reducing quality.",
      ja: "最適化に失敗しました。画質を下げて再度お試しください。"
    },
    drop_lable: {
      en: "Click to select or Drag files here",
      ja: "クリックして選択、またはここにドラッグ"
    },
    quality: {
      en: "Quality",
      ja: "画質"
    },
    optimizing: {
      en: "Optimizing",
      ja: "最適化中"
    },
    compress_img: {
      en: "Compress Images",
      ja: "画像を圧縮"
    },
    compress_detail: {
      en: "Compression Details",
      ja: "圧縮の詳細"
    }
  },
  video_compress: {
    title: {
      en: "Batch Video Compressor (Privacy-First)",
      ja: "動画を一括圧縮（プライバシー重視）"
    },
    description: {
      en: "Compress multiple videos locally in your browser. Download individually or as a ZIP. 100% private, no server uploads.",
      ja: "複数の動画をブラウザ上でローカル圧縮できます。個別またはZIP形式でダウンロード可能。サーバーへのアップロードは不要で、完全にプライベートです。"
    },
    og_title: {
      en: "Secure Browser-Based Video Compression",
      ja: "安全なブラウザ型動画圧縮"
    },
    og_description: {
      en: "Compress your videos locally without uploading to any server. Fast, free, and private.",
      ja: "動画をサーバーにアップロードせず、端末上で直接圧縮できます。高速・無料・プライベートな動画圧縮ツールです。"
    },
    err_1: {
      en: "High-speed engine failed to load.",
      ja: "高速エンジンの読み込みに失敗しました。"
    },
    err_2: {
      en: "too large (Max 200MB).",
      ja: "ファイルサイズが大きすぎます（最大200MB）。"
    },
    err_3: {
      en: "Total size exceeds 500MB limit.",
      ja: "合計サイズが500MBの上限を超えています。"
    },
    err_4: {
      en: "An error occurred during compression.",
      ja: "圧縮中にエラーが発生しました。"
    },
    init_wasm: {
      en: "Initializing High-Speed Engine...",
      ja: "高速エンジンを初期化中..."
    },
    drop_lbl: {
      en: "Select Video Files to Compress",
      ja: "圧縮する動画ファイルを選択"
    },
    compress_lvl: {
      en: "Compression Level",
      ja: "圧縮レベル"
    },
    lvl_720p: {
      en: "Small (720p)",
      ja: "小（720p）"
    },
    lvl_balance: {
      en: "Balanced",
      ja: "バランス"
    },
    lvl_high: {
      en: "High",
      ja: "高画質"
    },
    note: {
      en: "CPU Intensive. Keep tab active.",
      ja: "CPU負荷が高くなります。タブを閉じずにそのままお待ちください。"
    },
    processing: {
      en: "Processing...",
      ja: "処理中..."
    },
    process_new: {
      en: "Process New Batch",
      ja: "新しいバッチを処理"
    },
    start: {
      en: "Start Compression",
      ja: "圧縮を開始"
    },
    compress_detail: {
      en: "Compression Details",
      ja: "圧縮の詳細"
    },
    small_file: {
      en: "Small File",
      ja: "小さいファイル",
    },
    high_quality: {
      en: "High Quality",
      ja: "高品質",
    },
    quality_lvl: {
      en: "Quality Level",
      ja: "品質レベル",
    },
    strong_compress: {
      en: "Strong Compress",
      ja: "強力圧縮",
    },

  },
  heic: {
    title: {
      en: "Convert HEIC to JPG/PNG Online & Offline",
      ja: "HEICをJPG/PNGに変換（オンライン・オフライン対応）"
    },
    description: {
      en: "Convert iPhone HEIC photos to JPG or PNG directly in your browser. 100% private, client-side processing - your images never leave your device.",
      ja: "iPhoneで撮影したHEIC写真を、ブラウザ上で直接JPGまたはPNGに変換できます。すべて端末内で処理され、画像が外部に送信されることはありません。"
    },
    keywords: {
      en: "heic to jpg, convert heic to png, apple photo converter, iphone images to jpeg, browser-based heic converter, bulk heic conversion",
      ja: "HEIC JPG 変換, HEIC PNG 変換, Apple写真変換, iPhone画像JPEG変換, ブラウザHEIC変換, HEIC一括変換"
    },
    og_title: {
      en: "Private & Fast Conversion",
      ja: "高速・プライベート変換"
    },
    og_description: {
      en: "Securely convert your HEIC photos to JPG or PNG format without uploading to any server.",
      ja: "HEIC写真をサーバーにアップロードせず、安全にJPGまたはPNG形式へ変換できます。"
    },
    err_1: {
      en: "Please select valid HEIC/HEIF files.",
      ja: "有効なHEIC/HEIFファイルを選択してください。"
    },
    err_2: {
      en: "Conversion failed. Some HEIC files might be corrupted.",
      ja: "変換に失敗しました。一部のHEICファイルが破損している可能性があります。"
    },
    select_file: {
      en: "Select HEIC/HEIF files",
      ja: "HEIC/HEIFファイルを選択"
    },
    output: {
      en: "Output Format",
      ja: "出力形式"
    },
    converting: {
      en: "Converting",
      ja: "変換中"
    },
    convert_to: {
      en: "Convert to",
      ja: "変換する形式"
    }
  },
  bulk_rename: {
  title: {
    en: "Privacy-First Bulk File Renamer",
    ja: "プライバシー重視の一括ファイル名変更"
  },
  description: {
    en: "Rename multiple files instantly in your browser. Powerful pattern matching without server uploads. 100% private and secure.",
    ja: "複数のファイル名をブラウザ上で即座に一括変更できます。サーバーへのアップロード不要で、高度なルール設定にも対応した安全・プライベートなツールです。"
  },
  err_1: {
    en: "Renaming failed. Please check your files.",
    ja: "名前の変更に失敗しました。ファイルをご確認ください。"
  },
  select_file: {
    en: "Select Files to Rename",
    ja: "名前を変更するファイルを選択"
  },
  rule: {
    en: "Renaming Rules",
    ja: "名前変更ルール"
  },
  find_replace: {
    en: "Find & Replace",
    ja: "検索と置換"
  },
  prefix_suffix: {
    en: "Prefix/Suffix",
    ja: "接頭辞／接尾辞"
  },
  numbering: {
    en: "Numbering",
    ja: "連番"
  },
  change_case: {
    en: "Change Case",
    ja: "大文字・小文字の変換"
  },
  rule_txt: {
    en: "Rule",
    ja: "ルール"
  },
  find: {
    en: "Find...",
    ja: "検索..."
  },
  replace: {
    en: "Replace...",
    ja: "置換..."
  },
  prefix: {
    en: "Prefix...",
    ja: "接頭辞..."
  },
  suffix: {
    en: "Suffix...",
    ja: "接尾辞..."
  },
  start_at: {
    en: "Start At",
    ja: "開始番号"
  },
  padding: {
    en: "Padding",
    ja: "桁数"
  },
  preview: {
    en: "Preview Changes",
    ja: "変更内容をプレビュー"
  },
  packaging: {
    en: "Packaging...",
    ja: "パッケージ中..."
  },
  apply_download: {
    en: "Apply & Download ZIP",
    ja: "適用してZIPをダウンロード"
  }
}







};
