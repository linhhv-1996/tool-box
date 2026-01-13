export type Language = 'en' | 'ja' | 'ko';

// Danh sách ngôn ngữ hỗ trợ
export const siteLanguages = [
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
];

export const ui = {
  blog: {
    title: {
      en: "Blog | Privacy-First Insights",
      ja: "ブログ | プライバシーに関する知見",
      ko: "블로그 | 개인정보 보호 인사이트"
    },
    h1: {
      en: "Privacy & Tech Blog.",
      ja: "プライバシーと技術ブログ",
      ko: "프라이버시 & 테크 블로그"
    },
    span: {
      en: "Local-First Thinking.",
      ja: "ローカルファーストな考え方",
      ko: "로컬 우선 철학"
    },
    p: {
      en: "Articles about data privacy, browser-based tools, and why we build things locally.",
      ja: "データのプライバシー, ブラウザベースのツール, そしてなぜ私たちがローカルでの処理にこだわるのかについての記事。",
      ko: "데이터 프라이버시, 브라우저 기반 도구 및 로컬 구축 이유에 대한 기사입니다."
    },
    read_more: {
      en: "Read Article →",
      ja: "記事を読む →",
      ko: "기사 읽기 →"
    }
  },
  common: {
    add_more: {
      en: "Add More",
      ja: "追加",
      ko: "더 추가"
    },
  },
  header: {
    blog: {
      en: "Blog",
      ja: "ブログ",
      ko: "블로그"
    },
    text_1: {
      en: "100% Private",
      ja: "100% プライベート",
      ko: "100% 프라이빗"
    },
    how_it_work: {
      en: "How it works",
      ja: "仕組み",
      ko: "작동 방식"
    },
  },
  footer: {
    term: {
      en: "Terms",
      ja: "利用規約",
      ko: "이용약관"
    },
    privacy: {
      en: "Privacy",
      ja: "プライバシー",
      ko: "개인정보처리방침"
    },
  },


  related_tools: {
    en: "Related Tools",
    ja: "関連ツール",
    ko: "관련 도구",
  },
  home: {
    title: {
      en: "JustLocalTools | Private Browser Tools Directory",
      ja: "JustLocalTools | ブラウザ完結型ツールディレクトリ",
      ko: "JustLocalTools | 프라이버시 중심 브라우저 도구 모음"
    },
    h1: {
      en: "Private & Fast Browser Tools.",
      ja: "プライバシー保護＆高速ブラウザツール",
      ko: "빠르고 안전한 브라우저 도구"
    },
    span: {
      en: "100% Client-Side.",
      ja: "100% クライアントサイド処理",
      ko: "100% 클라이언트 사이드 처리"
    },
    p: {
      en: "Stop uploading your private files to random servers. Everything stays on your computer with our local-first utilities.",
      ja: "ファイルをサーバーに送る必要は一切ありません。当サイトのツールはあなたのデバイス上でのみ動作するため, プライバシーを完全に守りながら高速に処理を行えます。",
      ko: "개인 파일을 더 이상 외부 서버에 업로드하지 마세요. 모든 작업은 내 컴퓨터에서만 처리되어, 개인정보를 완벽하게 보호하면서 빠르게 사용할 수 있습니다."
    },
    no_tool_found: {
      en: "NO_TOOLS_FOUND",
      ja: "ツールが見つかりません",
      ko: "도구를 찾을 수 없습니다"
    },
    search: {
      en: "Search for a tool...",
      ja: "ツールを検索...",
      ko: "도구 검색..."
    },
    back_to_home: {
      en: "← [ Back to Toolbox ]",
      ja: "← ツールボックスに戻る",
      ko: "← 도구함으로 돌아가기"
    },
  },
  img2pdf: {
    error_message: {
      en: "Error converting images. Please try again.",
      ja: "画像の変換に失敗しました。再度お試しください。",
      ko: "이미지 변환 중 오류가 발생했습니다. 다시 시도해 주세요."
    },
    layout: {
      en: "Layout",
      ja: "表示レイアウト",
      ko: "레이아웃"
    },
    converting: {
      en: "Converting...",
      ja: "変換中…",
      ko: "변환 중..."
    },
    convert_to_PDF: {
      en: "Convert to PDF",
      ja: "PDFに変換",
      ko: "PDF로 변환"
    },
    select_images: {
      en: "Select Images",
      ja: "画像を選択",
      ko: "이미지 선택"
    },
  },
  dropzone: {
    change_file: {
      en: "Change File",
      ja: "ファイルを変更",
      ko: "파일 변경"
    },
    clear: {
      en: "Clear",
      ja: "クリア",
      ko: "초기화"
    },
    add_more: {
      en: "Add More",
      ja: "さらに追加",
      ko: "더 추가"
    },
    label: {
      en: "Click to select or Drag files here",
      ja: "クリックまたはドラッグしてファイルを追加",
      ko: "클릭하거나 파일을 여기로 드래그하세요"
    }
  },
  success: {
    download: {
      en: "Download",
      ja: "ダウンロード",
      ko: "다운로드"
    },
    saved: {
      en: "Saved",
      ja: "削減量",
      ko: "절약됨"
    }
  },
  combine_pdf: {
    merge: {
      en: "Merge PDF Documents",
      ja: "PDFを結合",
      ko: "PDF 병합"
    },
    processing: {
      en: "Processing...",
      ja: "処理中…",
      ko: "처리 중..."
    },
    select_file: {
      en: "Select PDF Files to Combine",
      ja: "結合するPDFファイルを選択",
      ko: "병합할 PDF 파일 선택"
    },
    err_file_length: {
      en: "Select at least 2 PDF files to combine.",
      ja: "結合するには、PDFファイルを2つ以上選択してください。",
      ko: "병합하려면 PDF 파일을 최소 2개 이상 선택하세요."
    },
    err_failed: {
      en: "Merge failed. Check if your PDF files are corrupted.",
      ja: "結合に失敗しました。PDFファイルが破損していないか確認してください。",
      ko: "병합에 실패했습니다. PDF 파일이 손상되지 않았는지 확인하세요."
    }
  },
  split_pdf: {
    err_no_pdf: {
      en: "Please select a valid PDF file.",
      ja: "有効なPDFファイルを選択してください。",
      ko: "유효한 PDF 파일을 선택해 주세요."
    },
    err_2: {
      en: "Could not read PDF information.",
      ja: "PDFの情報を読み取れませんでした。",
      ko: "PDF 정보를 읽을 수 없습니다."
    },
    err_3: {
      en: "Split failed. Check your range syntax.",
      ja: "分割に失敗しました。ページ範囲の指定を確認してください。",
      ko: "분할에 실패했습니다. 페이지 범위 입력을 확인하세요."
    },
    lbl: {
      en: "Select PDF File to Split",
      ja: "分割するPDFファイルを選択",
      ko: "분할할 PDF 파일 선택"
    },
    range: {
      en: "Define Ranges (e.g. 1-3, 5, 8-10)",
      ja: "ページ範囲を指定（例：1-3、5、8-10）",
      ko: "페이지 범위 입력 (예: 1-3, 5, 8-10)"
    },
    note: {
      en: "Output will be bundled into a ZIP archive.",
      ja: "出力ファイルはZIP形式でまとめてダウンロードされます。",
      ko: "결과 파일은 ZIP 형식으로 묶어 다운로드됩니다."
    },
    split: {
      en: "Split & Export ZIP",
      ja: "分割してZIPで書き出し",
      ko: "분할 후 ZIP으로 내보내기"
    },
  },
  unlock_pdf: {
    err_1: {
      en: "Incorrect password or unsupported PDF format.",
      ja: "パスワードが正しくないか、対応していないPDF形式です。",
      ko: "비밀번호가 올바르지 않거나 지원되지 않는 PDF 형식입니다."
    },
    err_2: {
      en: "Incorrect password. Please try again.",
      ja: "パスワードが正しくありません。もう一度お試しください。",
      ko: "비밀번호가 올바르지 않습니다. 다시 시도해 주세요."
    },
    select_file: {
      en: "Select Encrypted PDF File",
      ja: "暗号化されたPDFファイルを選択",
      ko: "암호화된 PDF 파일 선택"
    },
    pdf_pass: {
      en: "PDF Password:",
      ja: "PDFパスワード：",
      ko: "PDF 비밀번호:"
    },
    enter_pass: {
      en: "Enter password to unlock...",
      ja: "解除するためのパスワードを入力…",
      ko: "해제할 비밀번호 입력..."
    },
    unlocking: {
      en: "Unlocking...",
      ja: "解除中...",
      ko: "해제 중..."
    },
    unlock_now: {
      en: "Unlock PDF Now",
      ja: "PDFを今すぐ解除",
      ko: "PDF 지금 해제"
    }
  },
  protect_pdf: {
    err_1: {
      en: "Please select a valid PDF file.",
      ja: "有効なPDFファイルを選択してください。",
      ko: "유효한 PDF 파일을 선택해 주세요."
    },
    err_2: {
      en: "Encryption failed. Ensure the PDF is not already encrypted.",
      ja: "暗号化に失敗しました。PDFがすでに暗号化されていないか確認してください。",
      ko: "암호화에 실패했습니다. PDF 파일이 이미 암호화되어 있지 않은지 확인해 주세요."
    },
    select_file: {
      en: "Select PDF File to Protect",
      ja: "保護するPDFファイルを選択",
      ko: "보호할 PDF 파일 선택"
    },
    doc_pass: {
      en: "Document Password:",
      ja: "ドキュメントパスワード：",
      ko: "문서 비밀번호:"
    },
    strong_pass: {
      en: "Set a strong password...",
      ja: "強力なパスワードを設定...",
      ko: "강력한 비밀번호 설정..."
    },
    encrypting: {
      en: "Encrypting...",
      ja: "暗号化中...",
      ko: "암호화 중..."
    },
    protect_now: {
      en: "Protect PDF Now",
      ja: "PDFを今すぐ保護",
      ko: "PDF 지금 보호"
    },
    success: {
      en: "Protection Success",
      ja: "保護が完了しました",
      ko: "보호가 완료되었습니다"
    },
  },
  pdf_to_image: {
    select_file: {
      en: "Select PDF File to Convert",
      ja: "変換するPDFファイルを選択",
      ko: "변환할 PDF 파일 선택"
    },
    format: {
      en: "Format",
      ja: "形式",
      ko: "형식"
    },
    quality: {
      en: "Quality (DPI)",
      ja: "画質（DPI）",
      ko: "화질 (DPI)"
    },
    rendering: {
      en: "Rendering",
      ja: "変換中",
      ko: "변환 중"
    },
    convert_again: {
      en: "Convert Again",
      ja: "もう一度変換",
      ko: "다시 변환"
    },
    convert_to_img: {
      en: "Convert PDF to Images",
      ja: "PDFを画像に変換",
      ko: "PDF를 이미지로 변환"
    }
  },
  compress_pdf: {
    err_1: {
      en: "Please select valid PDF files.",
      ja: "有効なPDFファイルを選択してください。",
      ko: "유효한 PDF 파일을 선택해 주세요."
    },
    err_2: {
      en: "Compression failed for one or more files.",
      ja: "一部のファイルで圧縮に失敗しました。",
      ko: "하나 이상의 파일에서 압축에 실패했습니다."
    },
    select_file: {
      en: "Select PDF files to compress",
      ja: "圧縮するPDFファイルを選択",
      ko: "압축할 PDF 파일 선택"
    },
    compressing: {
      en: "Compressing",
      ja: "圧縮中",
      ko: "압축 중"
    },
    compress_pdf_file: {
      en: "Compress PDF Documents",
      ja: "PDFを圧縮",
      ko: "PDF 압축"
    }
  },
  shrink_images: {
    err_1: {
      en: "Please select valid images (JPG, PNG, WebP).",
      ja: "有効な画像ファイル（JPG・PNG・WebP）を選択してください。",
      ko: "유효한 이미지 파일(JPG, PNG, WebP)을 선택해 주세요."
    },
    err_2: {
      en: "Optimization failed. Try reducing quality.",
      ja: "最適化に失敗しました。画質を下げて再度お試しください。",
      ko: "최적화에 실패했습니다. 화질을 낮춰 다시 시도해 주세요."
    },
    drop_lable: {
      en: "Click to select or Drag files here",
      ja: "クリックして選択、またはここにドラッグ",
      ko: "클릭하거나 파일을 여기로 드래그하세요"
    },
    quality: {
      en: "Quality",
      ja: "画質",
      ko: "화질"
    },
    optimizing: {
      en: "Optimizing",
      ja: "最適化中",
      ko: "최적화 중"
    },
    compress_img: {
      en: "Compress Images",
      ja: "画像を圧縮",
      ko: "이미지 압축"
    },
    compress_detail: {
      en: "Compression Details",
      ja: "圧縮の詳細",
      ko: "압축 상세 정보"
    }
  },
  video_compress: {
    err_1: {
      en: "High-speed engine failed to load.",
      ja: "高速エンジンの読み込みに失敗しました。",
      ko: "고속 엔진을 불러오는 데 실패했습니다."
    },
    err_2: {
      en: "too large (Max 200MB).",
      ja: "ファイルサイズが大きすぎます（最大200MB）。",
      ko: "파일 크기가 너무 큽니다 (최대 200MB)."
    },
    err_3: {
      en: "Total size exceeds 500MB limit.",
      ja: "合計サイズが500MBの上限を超えています。",
      ko: "전체 파일 크기가 500MB 제한을 초과했습니다."
    },
    err_4: {
      en: "An error occurred during compression.",
      ja: "圧縮中にエラーが発生しました。",
      ko: "압축 중 오류가 발생했습니다."
    },
    init_wasm: {
      en: "Initializing High-Speed Engine...",
      ja: "高速エンジンを初期化中...",
      ko: "고속 엔진 초기화 중..."
    },
    drop_lbl: {
      en: "Select Video Files to Compress",
      ja: "圧縮する動画ファイルを選択",
      ko: "압축할 동영상 파일 선택"
    },
    compress_lvl: {
      en: "Compression Level",
      ja: "圧縮レベル",
      ko: "압축 수준"
    },
    lvl_720p: {
      en: "Small (720p)",
      ja: "小（720p）",
      ko: "작게 (720p)"
    },
    lvl_balance: {
      en: "Balanced",
      ja: "バランス",
      ko: "균형"
    },
    lvl_high: {
      en: "High",
      ja: "高画質",
      ko: "고화질"
    },
    note: {
      en: "CPU Intensive. Keep tab active.",
      ja: "CPU負荷が高くなります。タブを閉じずにそのままお待ちください。",
      ko: "CPU 사용량이 높을 수 있습니다. 탭을 닫지 말고 유지해 주세요."
    },
    processing: {
      en: "Processing...",
      ja: "処理中...",
      ko: "처리 중..."
    },
    process_new: {
      en: "Process New Batch",
      ja: "新しいバッチを処理",
      ko: "새 배치 처리"
    },
    start: {
      en: "Start Compression",
      ja: "圧縮を開始",
      ko: "압축 시작"
    },
    compress_detail: {
      en: "Compression Details",
      ja: "圧縮の詳細",
      ko: "압축 상세 정보"
    },
    small_file: {
      en: "Small File",
      ja: "小さいファイル",
      ko: "작은 파일"
    },
    high_quality: {
      en: "High Quality",
      ja: "高品質",
      ko: "고품질"
    },
    quality_lvl: {
      en: "Quality Level",
      ja: "品質レベル",
      ko: "품질 수준"
    },
    strong_compress: {
      en: "Strong Compress",
      ja: "強力圧縮",
      ko: "강력 압축"
    },
  },
  heic: {
    err_1: {
      en: "Please select valid HEIC/HEIF files.",
      ja: "有効なHEIC/HEIFファイルを選択してください。",
      ko: "유효한 HEIC/HEIF 파일을 선택해 주세요."
    },
    err_2: {
      en: "Conversion failed. Some HEIC files might be corrupted.",
      ja: "変換に失敗しました。一部のHEICファイルが破損している可能性があります。",
      ko: "변환에 실패했습니다. 일부 HEIC 파일이 손상되었을 수 있습니다."
    },
    select_file: {
      en: "Select HEIC/HEIF files",
      ja: "HEIC/HEIFファイルを選択",
      ko: "HEIC/HEIF 파일 선택"
    },
    output: {
      en: "Output Format",
      ja: "出力形式",
      ko: "출력 형식"
    },
    converting: {
      en: "Converting",
      ja: "変換中",
      ko: "변환 중"
    },
    convert_to: {
      en: "Convert to",
      ja: "変換する形式",
      ko: "변환 형식"
    }
  },
  bulk_rename: {
    err_1: {
      en: "Renaming failed. Please check your files.",
      ja: "名前の変更に失敗しました。ファイルをご確認ください。",
      ko: "이름 변경에 실패했습니다. 파일을 확인해 주세요."
    },
    select_file: {
      en: "Select Files to Rename",
      ja: "名前を変更するファイルを選択",
      ko: "이름을 변경할 파일 선택"
    },
    rule: {
      en: "Renaming Rules",
      ja: "名前変更ルール",
      ko: "이름 변경 규칙"
    },
    find_replace: {
      en: "Find & Replace",
      ja: "検索と置換",
      ko: "찾기 및 바꾸기"
    },
    prefix_suffix: {
      en: "Prefix/Suffix",
      ja: "接頭辞／接尾辞",
      ko: "접두사 / 접미사"
    },
    numbering: {
      en: "Numbering",
      ja: "連番",
      ko: "번호 매기기"
    },
    change_case: {
      en: "Change Case",
      ja: "大文字・小文字の変換",
      ko: "대소문자 변경"
    },
    rule_txt: {
      en: "Rule",
      ja: "ルール",
      ko: "규칙"
    },
    find: {
      en: "Find...",
      ja: "検索...",
      ko: "찾기..."
    },
    replace: {
      en: "Replace...",
      ja: "置換...",
      ko: "바꾸기..."
    },
    prefix: {
      en: "Prefix...",
      ja: "接頭辞...",
      ko: "접두사..."
    },
    suffix: {
      en: "Suffix...",
      ja: "接尾辞...",
      ko: "접미사..."
    },
    start_at: {
      en: "Start At",
      ja: "開始番号",
      ko: "시작 번호"
    },
    padding: {
      en: "Padding",
      ja: "桁数",
      ko: "자릿수"
    },
    preview: {
      en: "Preview Changes",
      ja: "変更内容をプレビュー",
      ko: "변경 사항 미리보기"
    },
    packaging: {
      en: "Packaging...",
      ja: "パッケージ中...",
      ko: "패키징 중..."
    },
    apply_download: {
      en: "Apply & Download ZIP",
      ja: "適用してZIPをダウンロード",
      ko: "적용 후 ZIP 다운로드"
    }
  }
};
