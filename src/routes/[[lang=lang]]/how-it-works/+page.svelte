<script lang="ts">
  import { 
    ShieldCheck, Cpu, CloudOff, Activity, Zap, Lock, Globe, 
    Database, ArrowRightLeft, Terminal, ServerOff, FileCode, CheckCircle2 
  } from 'lucide-svelte';
  import { page } from '$app/state';
  import { DEFAULT_LANG, SUPPORTED_LANGS } from "$lib/config/constant";
  import type { Language } from '$lib/translate/ui';

  // 1. Xác định ngôn ngữ hiện tại
  let lang = $derived(
    (SUPPORTED_LANGS.includes(page.params.lang ?? '') 
      ? page.params.lang 
      : DEFAULT_LANG) as Language
  );

  // 2. Nội dung chi tiết (Dày đặc & Chuyên sâu)
  const content: Record<Language, any> = {
    en: {
      title: "How it works | Technical Architecture | JustLocalTools",
      description: "A deep dive into our zero-server, 100% client-side processing architecture using WebAssembly and modern browser APIs.",
      system_arch: "System Architecture",
      version: "v2.1.0-stable",
      heading: "Zero-Server Processing",
      subheading: "Privacy by design, not just by promise. Your data stays in your RAM.",
      
      // 6 Bước chi tiết
      steps: [
        { id: "01", title: "Local Entry", desc: "Files are accessed via Blob/File API. No packets leave your NIC.", icon: Terminal },
        { id: "02", title: "Sandbox Allocation", desc: "Dedicated memory buffer (ArrayBuffer) is allocated in a local sandbox.", icon: Database },
        { id: "03", title: "WASM Initialization", desc: "C++/Rust binaries are compiled to WebAssembly for native performance.", icon: Cpu },
        { id: "04", title: "Binary Execution", desc: "Algorithms process data directly in a non-blocking Web Worker thread.", icon: Activity },
        { id: "05", title: "In-Memory Output", desc: "Resulting files are generated as temporary virtual URLs (Blob URLs).", icon: FileCode },
        { id: "06", title: "Garbage Collection", desc: "Memory is wiped immediately after the session or browser close.", icon: ServerOff }
      ],

      comparison: {
        title: "Architecture Comparison",
        headers: ["Feature", "Legacy Cloud Tools", "JustLocalTools"],
        rows: [
          ["Data Transfer", "Upload/Download required", "0KB Transferred"],
          ["Privacy", "Subject to server logs", "Physically impossible to leak"],
          ["Speed", "Limited by ISP bandwidth", "Limited by Device CPU/RAM"],
          ["Security", "Third-party dependency", "Total Ownership"]
        ]
      },

      tech_article: {
        title: "The Technical Deep Dive",
        p1: "Unlike traditional 'Cloud' tools that act as a middleman for your files, JustLocalTools operates as a Static Binaries Provider. When you visit our site, your browser downloads the 'engine' (JavaScript & WebAssembly) once. From that point on, the tool functions like a desktop application inside your browser tab.",
        p2: "We utilize High-Resolution Timers and SIMD (Single Instruction, Multiple Data) instructions through WebAssembly to ensure that heavy tasks—like merging 500MB PDFs or batch processing thousands of images—don't freeze your interface. All processing happens in an isolated Web Worker, keeping the main UI thread buttery smooth.",
        mission_label: "Core Philosophy",
        mission: "Data is a liability. By never touching your files, we eliminate the risk of data breaches at the source. Professional grade tools, zero server footprint."
      }
    },
    ja: {
      title: "仕組み | 技術アーキテクチャ | JustLocalTools",
      description: "WebAssemblyとモダンなブラウザAPIを使用した、サーバーレス・100%クライアントサイド処理の技術的な深掘り。",
      system_arch: "システムアーキテクチャ",
      version: "v2.1.0-stable",
      heading: "ゼロサーバー処理",
      subheading: "約束ではなく、設計によるプライバシー。データは常にあなたのRAM内に留まります。",
      
      steps: [
        { id: "01", title: "ローカル・エントリ", desc: "ファイルはBlob/File API経由でアクセスされます。外部送信は一切ありません。", icon: Terminal },
        { id: "02", title: "サンドボックス割り当て", desc: "専用のメモリバッファ(ArrayBuffer)がローカル内で割り当てられます。", icon: Database },
        { id: "03", title: "WASM 初期化", desc: "ネイティブ性能を実現するため、C++/RustをWebAssemblyにコンパイルして実行します。", icon: Cpu },
        { id: "04", title: "バイナリ実行", desc: "Web Workerスレッド内でアルゴリズムが直接データを処理します。", icon: Activity },
        { id: "05", title: "メモリ内出力", desc: "結果は一時的な仮想URL(Blob URL)として生成されます。", icon: FileCode },
        { id: "06", title: "ガベージコレクション", desc: "セッション終了時またはブラウザ閉鎖時にメモリは即座に消去されます。", icon: ServerOff }
      ],

      comparison: {
        title: "アーキテクチャ比較",
        headers: ["機能", "従来のクラウドツール", "JustLocalTools"],
        rows: [
          ["データ転送", "アップロード/DLが必要", "転送量 0KB"],
          ["プライバシー", "サーバーログの対象", "物理的に漏洩不可能"],
          ["速度", "回線速度に依存", "デバイスのCPU/RAMに依存"],
          ["セキュリティ", "サードパーティへの依存", "完全な自己所有"]
        ]
      },

      tech_article: {
        title: "技術的な詳細解説",
        p1: "ファイルを仲介する従来の「クラウド」ツールとは異なり、JustLocalToolsは静的バイナリプロバイダーとして機能します。サイトにアクセスすると、ブラウザは「エンジン」（JS & WASM）を一度だけダウンロードし、それ以降はデスクトップアプリのように動作します。",
        p2: "SIMD（単一命令複数データ）命令を利用することで、500MBのPDF結合や大量の画像処理などの重いタスクも、インターフェースをフリーズさせずに実行可能です。すべての処理は隔離されたWeb Workerで行われ、UIスレッドを常に快適に保ちます。",
        mission_label: "核心的な哲学",
        mission: "データは「責任」です。ファイルに一切触れないことで、データ漏洩のリスクを根本から排除します。プロフェッショナル級のツールを、サーバー負荷ゼロで提供します。"
      }
    },
    ko: {
      title: "작동 원리 | 기술 아키텍처 | JustLocalTools",
      description: "WebAssembly 및 최신 브라우저 API를 사용하는 서버리스, 100% 클라이언트 사이드 처리 아키텍처에 대한 심층 분석.",
      system_arch: "시스템 아키텍처",
      version: "v2.1.0-stable",
      heading: "제로 서버 프로세싱",
      subheading: "약속이 아닌 설계를 통한 개인정보 보호. 데이터는 항상 귀하의 RAM에 머뭅니다.",
      
      steps: [
        { id: "01", title: "로컬 엔트리", desc: "Blob/File API를 통해 파일에 접근합니다. 외부로 패킷이 유출되지 않습니다.", icon: Terminal },
        { id: "02", title: "샌드박스 할당", desc: "전용 메모리 버퍼(ArrayBuffer)가 로컬 샌드박스 내에 할당됩니다.", icon: Database },
        { id: "03", title: "WASM 초기화", desc: "네이티브 성능을 위해 C++/Rust 바이너리를 WebAssembly로 컴파일합니다.", icon: Cpu },
        { id: "04", title: "바이너리 실행", desc: "Web Worker 스레드에서 알고리즘이 데이터를 직접 처리합니다.", icon: Activity },
        { id: "05", title: "인메모리 출력", desc: "결과 파일은 임시 가상 URL(Blob URL)로 생성됩니다.", icon: FileCode },
        { id: "06", title: "메모리 정리", desc: "세션 종료 또는 브라우저 종료 시 메모리는 즉시 삭제됩니다.", icon: ServerOff }
      ],

      comparison: {
        title: "아키텍처 비교",
        headers: ["기능", "기존 클라우드 도구", "JustLocalTools"],
        rows: [
          ["데이터 전송", "업로드/다운로드 필수", "0KB 전송"],
          ["개인정보", "서버 로그에 기록됨", "물리적으로 유출 불가능"],
          ["속도", "회선 속도에 의존", "기기 CPU/RAM에 의존"],
          ["보안", "제3자 의존성", "완전한 소유권"]
        ]
      },

      tech_article: {
        title: "기술 심층 분석",
        p1: "파일을 중개하는 기존 '클라우드' 도구와 달리, JustLocalTools는 정적 바이너리 제공자로 작동합니다. 사이트를 방문하면 브라우저가 '엔진'(JS 및 WASM)을 한 번 다운로드한 후, 브라우저 탭 내부에서 데스크톱 앱처럼 작동합니다.",
        p2: "WebAssembly를 통한 SIMD(단일 명령 다중 데이터) 명령을 활용하여 500MB PDF 병합이나 수천 장의 이미지 일괄 처리와 같은 무거운 작업도 인터페이스 프리징 없이 수행합니다. 모든 처리는 격리된 Web Worker에서 이루어져 UI 스레드를 부드럽게 유지합니다.",
        mission_label: "핵심 철학",
        mission: "데이터는 기업의 자산이 아닌 책임입니다. 파일에 전혀 손을 대지 않음으로써 소스 단계에서 데이터 유출 위험을 차단합니다. 서버 흔적 없는 전문가용 도구입니다."
      }
    }
  };

  let t = $derived(content[lang] || content[DEFAULT_LANG]);
</script>

<svelte:head>
  <title>{t.title}</title>
  <meta name="description" content={t.description} />
</svelte:head>

<main class="max-w-[980px] mx-auto px-6 py-24">
  <section class="mb-24">
    <div class="flex items-center gap-4 mb-6">
      <div class="h-[1px] flex-1 bg-slate-200"></div>
      <div class="flex items-center gap-2 font-mono text-[10px] text-indigo-500 font-bold uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
        <Activity size={10} /> {t.system_arch} // {t.version}
      </div>
      <div class="h-[1px] flex-1 bg-slate-200"></div>
    </div>
    
    <div class="text-center max-w-3xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-black font-mono uppercase tracking-tighter text-slate-900 mb-6">
        {t.heading}
      </h1>
      <p class="text-slate-500 text-xl font-medium leading-relaxed">
        {t.subheading}
      </p>
    </div>
  </section>

  <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden mb-32 shadow-2xl shadow-slate-200/50">
    {#each t.steps as step}
      <div class="bg-white p-10 hover:bg-slate-50 transition-all group">
        <div class="flex items-start justify-between mb-10">
          <div class="p-3 bg-slate-900 text-white rounded-lg group-hover:scale-110 transition-transform">
            <step.icon size={20} strokeWidth={1.5} />
          </div>
          <span class="font-mono text-xs font-bold text-slate-300">[{step.id}]</span>
        </div>
        <h3 class="font-mono font-black uppercase text-sm tracking-widest mb-4 text-slate-900">
          {step.title}
        </h3>
        <p class="text-slate-500 text-[14px] leading-relaxed">
          {step.desc}
        </p>
      </div>
    {/each}
  </section>

  <section class="mb-32">
    <div class="text-center mb-12">
      <h2 class="font-mono font-bold uppercase text-xs tracking-[0.3em] text-slate-400 mb-2">/ Logic Comparison</h2>
      <h3 class="text-2xl font-bold">{t.comparison.title}</h3>
    </div>
    <div class="overflow-x-auto border border-slate-200 rounded-xl">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200">
            {#each t.comparison.headers as header}
              <th class="p-6 font-mono text-[11px] uppercase tracking-wider text-slate-500">{header}</th>
            {/each}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          {#each t.comparison.rows as row}
            <tr class="hover:bg-slate-50/50 transition-colors">
              <td class="p-6 font-bold text-sm text-slate-700">{row[0]}</td>
              <td class="p-6 text-sm text-slate-400 italic">{row[1]}</td>
              <td class="p-6 text-sm text-indigo-600 font-bold">
                <div class="flex items-center gap-2">
                  <CheckCircle2 size={14} /> {row[2]}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section class="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
    <div class="lg:col-span-4 lg:sticky lg:top-12">
      <div class="space-y-6">
        <div class="inline-block p-1 px-3 bg-indigo-600 text-white font-mono text-[10px] uppercase font-bold">Documentation</div>
        <h2 class="text-3xl font-black font-mono uppercase leading-none text-slate-900">
          {t.tech_article.title}
        </h2>
        <div class="h-1 w-20 bg-indigo-600"></div>
      </div>
    </div>

    <div class="lg:col-span-8">
      <div class="prose prose-slate max-w-none prose-p:text-lg prose-p:leading-8 prose-p:text-slate-600">
        <p>{t.tech_article.p1}</p>
        
        <div class="my-12 p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
           <div class="flex flex-col md:flex-row items-center justify-between gap-8 font-mono text-[11px] text-indigo-300">
              <div class="flex flex-col items-center gap-3">
                <div class="w-16 h-16 border border-dashed border-indigo-500/50 rounded-full flex items-center justify-center text-white">FILE</div>
                <span>USER DEVICE</span>
              </div>
              <ArrowRightLeft class="hidden md:block text-slate-700" />
              <div class="flex flex-col items-center gap-3">
                <div class="w-16 h-16 bg-indigo-500/20 border border-indigo-500 rounded-xl flex items-center justify-center text-white animate-pulse">WASM</div>
                <span>BROWSER RAM</span>
              </div>
              <ArrowRightLeft class="hidden md:block text-slate-700" />
              <div class="flex flex-col items-center gap-3">
                <div class="w-16 h-16 bg-green-500/20 border border-green-500 rounded-xl flex items-center justify-center text-white font-bold">OUTPUT</div>
                <span>LOCAL STORAGE</span>
              </div>
           </div>
        </div>

        <p>{t.tech_article.p2}</p>
        
        <div class="mt-20 p-12 bg-indigo-50 rounded-3xl border border-indigo-100 relative group">
          <div class="font-mono text-[10px] uppercase font-bold text-indigo-400 mb-4 tracking-widest">{t.tech_article.mission_label}</div>
          <p class="text-2xl font-serif italic text-slate-900 leading-relaxed m-0 relative z-10">
            "{t.tech_article.mission}"
          </p>
          <div class="absolute -bottom-6 -right-6 text-indigo-200 group-hover:scale-110 transition-transform">
             <ShieldCheck size={120} strokeWidth={1} />
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  /* Đảm bảo font chữ luôn nhất quán */
  :global(body) {
    background-color: #ffffff;
  }
</style>
