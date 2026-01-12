<script lang="ts">
  import { ShieldCheck, Cpu, CloudOff, Activity } from 'lucide-svelte';
  import { page } from '$app/stores';

  // 1. Xác định ngôn ngữ hiện tại từ URL params (mặc định là 'en')
  let lang = $derived(($page.params.lang === 'ja' ? 'ja' : 'en') as 'en' | 'ja');

  // 2. Nội dung đa ngôn ngữ định nghĩa tại chỗ (Inline Content)
  const content = {
    en: {
      title: "How it works | LOCALTOOLS_",
      description: "Learn how our 100% client-side processing keeps your files safe.",
      system_arch: "System Architecture",
      heading: "How it works",
      steps: [
        {
          id: "STEP_01",
          title: "Zero Uploads",
          desc: "Your files never touch our servers because there are no servers. Everything stays in the browser.",
          icon: CloudOff
        },
        {
          id: "STEP_02",
          title: "Local Processing",
          desc: "We use WebAssembly and JavaScript engines to process data directly on your device's CPU.",
          icon: Cpu
        },
        {
          id: "STEP_03",
          title: "Total Privacy",
          desc: "Processing happens in a local sandbox, ensuring no third-party can access your information.",
          icon: ShieldCheck
        }
      ],
      tech_details: {
        title: "The Technical Details",
        subtitle: "A deep dive into how we handle binary data without a backend.",
        p1: "When you select a file, the browser creates a temporary memory buffer (Blob or ArrayBuffer) in your device's RAM. Our algorithms operate on this memory buffer to generate the output.",
        p2: "This approach is not only safer but often faster, as it eliminates the time spent on uploading large files and waiting for server queues.",
        mission: "Our mission is to provide professional-grade utilities that treat user data as a liability, not an asset."
      }
    },
    ja: {
      title: "仕組み | LOCALTOOLS_",
      description: "100%クライアントサイド処理でファイルが安全に保たれる仕組みについて学びましょう。",
      system_arch: "システムアーキテクチャ",
      heading: "動作の仕組み",
      steps: [
        {
          id: "STEP_01",
          title: "アップロードなし",
          desc: "ファイルがサーバーに送信されることはありません。すべてはブラウザ内で完結します。",
          icon: CloudOff
        },
        {
          id: "STEP_02",
          title: "ローカル処理",
          desc: "WebAssemblyとJavaScriptエンジンを使用して、デバイスのCPU上で直接データを処理します。",
          icon: Cpu
        },
        {
          id: "STEP_03",
          title: "完全なプライバシー",
          desc: "処理はローカルのサンドボックス内で行われるため、第三者が情報にアクセスすることはできません。",
          icon: ShieldCheck
        }
      ],
      tech_details: {
        title: "技術的な詳細",
        subtitle: "バックエンドなしでバイナリデータを処理する方法についての深掘り。",
        p1: "ファイルを選択すると、ブラウザはデバイスのRAM内に一時的なメモリバッファを作成します。当社のアルゴリズムはこのバッファ上で動作し、出力を生成します。",
        p2: "このアプローチは安全なだけでなく、大きなファイルのアップロードやサーバーの待ち時間が不要になるため、多くの場合より高速です。",
        mission: "私たちの使命は、ユーザーデータを「資産」ではなく「責任」として扱うプロフェッショナルなツールを提供することです。"
      }
    }
  };

  // 3. Sử dụng $derived để tự động cập nhật nội dung khi đổi ngôn ngữ
  let t = $derived(content[lang]);
</script>

<svelte:head>
  <title>{t.title}</title>
  <meta name="description" content={t.description} />
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-16">
  <div class="mb-16">
    <div class="flex items-center gap-2 mb-2">
       <Activity size={12} class="text-green-500" />
       <span class="font-mono text-[10px] uppercase tracking-widest text-slate-400">
         {t.system_arch} / 01
       </span>
    </div>
    <h1 class="text-xl font-bold tracking-tighter font-mono uppercase text-[#1a1a1a]">
      {t.heading}
    </h1>
    <hr class="mt-3 border-slate-100">
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 border border-slate-100 rounded-sm mb-20 divide-y md:divide-y-0 md:divide-x divide-slate-100">
    {#each t.steps as step, i}
      <div class="p-8 space-y-4 {i === 1 ? 'bg-slate-50/30' : ''}">
        <div class="flex items-center justify-between">
          <div class="w-8 h-8 bg-white flex items-center justify-center border border-slate-100 rounded-sm">
            <step.icon size={14} strokeWidth={1.5} />
          </div>
          <span class="font-mono text-[10px] text-slate-300">{step.id}</span>
        </div>
        <div>
          <h3 class="font-mono font-bold uppercase text-[11px] tracking-tight mb-2">
            {step.title}
          </h3>
          <p class="text-slate-500 text-[13px] leading-relaxed">
            {step.desc}
          </p>
        </div>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-12 pt-12 border-t border-dashed border-slate-200">
    <div class="md:col-span-4">
      <h2 class="font-mono font-bold uppercase text-xs tracking-widest text-slate-900">
        {t.tech_details.title}
      </h2>
      <p class="mt-4 text-slate-400 text-[12px] leading-5">
        {t.tech_details.subtitle}
      </p>
    </div>

    <div class="md:col-span-8">
      <article class="prose max-w-none">
        <p>{t.tech_details.p1}</p>
        <p>{t.tech_details.p2}</p>
        
        <div class="mt-12 p-6 border-l-2 border-slate-900 bg-slate-50">
          <p class="italic m-0 text-slate-900">
            "{t.tech_details.mission}"
          </p>
        </div>
      </article>
    </div>
  </div>
</div>
