<script lang="ts">
  import { Shield, EyeOff, BarChart3, Mail, Lock, Globe } from 'lucide-svelte';
  import { page } from '$app/stores';

  // 1. Xác định ngôn ngữ hiện tại
  let lang = $derived(($page.params.lang === 'ja' ? 'ja' : 'en') as 'en' | 'ja');

  // 2. Nội dung đa ngôn ngữ (Inline Content)
  const content = {
    en: {
      title: "Privacy Policy | LOCALTOOLS_",
      description: "Privacy Policy and Data Protection for LOCALTOOLS_ - 100% Client-side processing.",
      doc_info: "Legal_Doc / Privacy_v1.0",
      heading: "Privacy Policy",
      effective_date: "Effective Date: January 2026",
      summary_title: "Protocol Summary",
      summary_list: ["No File Uploads", "RAM-Only Processing", "AdSense Compliant", "No Data Retention"],
      sections: [
        {
          id: "1. Zero Data Collection Policy",
          icon: Shield,
          p1: "At <strong>LOCALTOOLS_</strong>, privacy is not a feature; it is the core architecture. We operate on a strict <strong>Zero-Knowledge</strong> basis regarding your files:",
          bullets: [
            "<strong>Local Runtime:</strong> All processing (PDF merging, image conversion, etc.) occurs exclusively within your browser's execution context.",
            "<strong>Zero Ingestion:</strong> We do not transmit, upload, or store your files on any remote server. There is no backend database for user content.",
            "<strong>Volatile Memory:</strong> Data processed is stored in temporary RAM buffers and is permanently purged once the browser tab is closed."
          ]
        },
        {
          id: "2. Advertising & Cookies",
          icon: Globe,
          p1: "To keep our tools free, we partner with third-party advertising networks (specifically Google AdSense). These partners may use cookies to serve personalized ads based on your browsing behavior:",
          bullets: [
            "<strong>Google AdSense:</strong> Google uses cookies (such as the DART cookie) to serve ads to users based on their visit to this and other sites on the Internet.",
            "<strong>Opt-out:</strong> You may opt out of personalized advertising by visiting Google Ads Settings.",
            "<strong>Analytics:</strong> We use Google Analytics to monitor traffic patterns and site performance. This data is aggregated and contains no personally identifiable information."
          ]
        },
        {
          id: "3. Log Files",
          icon: BarChart3,
          p1: "LOCALTOOLS_ follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected includes IP addresses, browser type, Internet Service Provider (ISP), date/time stamp, and referring/exit pages.",
          p2: "The purpose of the information is for analyzing trends, administering the site, and tracking users' movement on the website, and is not linked to any information that is personally identifiable."
        },
        {
          id: "4. Children's Information",
          icon: EyeOff,
          p1: "Another part of our priority is adding protection for children while using the internet. We do not knowingly collect any Personal Identifiable Information from children under the age of 13.",
          p2: "If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information."
        }
      ],
      contact_title: "5. Contact",
      contact_text: "For any inquiries regarding this policy, please reach out via:"
    },
    ja: {
      title: "プライバシーポリシー | LOCALTOOLS_",
      description: "LOCALTOOLS_のプライバシーポリシーとデータ保護 - 100%クライアントサイド処理。",
      doc_info: "法的文書 / プライバシー v1.0",
      heading: "プライバシーポリシー",
      effective_date: "発効日: 2026年1月",
      summary_title: "プロトコル概要",
      summary_list: ["ファイルアップロードなし", "RAMのみで処理", "AdSense準拠", "データ保持なし"],
      sections: [
        {
          id: "1. データ収集ゼロポリシー",
          icon: Shield,
          p1: "<strong>LOCALTOOLS_</strong>にとって、プライバシーは単なる機能ではなく、中核となるアーキテクチャです。お客様のファイルに関しては、厳格な<strong>ゼロ知識証明</strong>（Zero-Knowledge）ベースで運営されています。",
          bullets: [
            "<strong>ローカル実行:</strong> すべての処理（PDF結合、画像変換など）は、お客様のブラウザの実行コンテキスト内のみで行われます。",
            "<strong>データ取り込みゼロ:</strong> ファイルをリモートサーバーに送信、アップロード、または保存することはありません。ユーザーコンテンツ用のバックエンドデータベースは存在しません。",
            "<strong>揮発性メモリ:</strong> 処理されたデータは一時的なRAMバッファに保存され、ブラウザのタブを閉じると永久に消去されます。"
          ]
        },
        {
          id: "2. 広告とCookie",
          icon: Globe,
          p1: "ツールを無料で提供し続けるため、第三者の広告ネットワーク（具体的にはGoogle AdSense）と提携しています。これらのパートナーは、お客様の閲覧行動に基づいたパーソナライズ広告を表示するためにCookieを使用する場合があります。",
          bullets: [
            "<strong>Google AdSense:</strong> Googleは、当サイトや他のサイトへのアクセスに基づいて、ユーザーに広告を表示するためにCookie（DART Cookieなど）を使用します。",
            "<strong>オプトアウト:</strong> Google広告設定にアクセスして、パーソナライズ広告を無効にすることができます。",
            "<strong>アナリティクス:</strong> トラフィックパターンやサイトのパフォーマンスを監視するためにGoogle Analyticsを使用しています。このデータは集計されたものであり、個人を特定する情報は含まれていません。"
          ]
        },
        {
          id: "3. ログファイル",
          icon: BarChart3,
          p1: "LOCALTOOLS_は、ログファイルを使用する標準的な手順に従います。これらのファイルは、訪問者がウェブサイトを訪れた際の情報を記録します。収集される情報には、IPアドレス、ブラウザの種類、インターネットサービスプロバイダー（ISP）、日付/時刻スタンプ、参照/終了ページが含まれます。",
          p2: "これらの情報の目的は、トレンドの分析、サイトの管理、ウェブサイト上でのユーザーの動きの追跡であり、個人を特定できる情報にはリンクされていません。"
        },
        {
          id: "4. お子様の情報保護",
          icon: EyeOff,
          p1: "インターネット利用時のお子様の保護を優先事項としています。私たちは13歳未満のお子様から個人を特定できる情報を意図的に収集することはありません。",
          p2: "もしお子様が当サイトでこのような情報を提供したと思われる場合は、すぐに私たちに連絡することをお勧めします。速やかにその情報を削除するよう最善を尽くします。"
        }
      ],
      contact_title: "5. お問い合わせ",
      contact_text: "本ポリシーに関するお問い合わせは、以下までご連絡ください。"
    }
  };

  let t = $derived(content[lang]);
</script>

<svelte:head>
  <title>{t.title}</title>
  <meta name="description" content={t.description} />
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-16">
  <div class="mb-16">
    <div class="flex items-center gap-2 mb-2">
       <Lock size={12} class="text-blue-600" />
       <span class="font-mono text-[10px] uppercase tracking-widest text-slate-400">{t.doc_info}</span>
    </div>
    <h1 class="text-xl font-bold tracking-tighter font-mono uppercase text-[#1a1a1a]">
      {t.heading}
    </h1>
    <p class="text-[10px] font-mono text-slate-400 mt-2 uppercase">{t.effective_date}</p>
    <hr class="mt-3 border-slate-100">
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
    <div class="md:col-span-3">
      <div class="sticky top-8 space-y-4">
        <div class="p-4 border border-slate-100 bg-slate-50/50 rounded-sm">
          <h4 class="font-mono text-[10px] font-bold uppercase mb-3 text-slate-900">{t.summary_title}</h4>
          <ul class="space-y-2 text-[10px] text-slate-500 font-mono uppercase leading-tight">
            {#each t.summary_list as item}
              <li class="flex items-start gap-2">
                <span class="text-green-600">»</span> {item}
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>

    <div class="md:col-span-9">
      <article class="prose max-w-none">
        
        {#each t.sections as section, i}
          <section class="mb-12 {i > 0 ? 'pt-8 border-t border-dashed border-slate-100' : ''}">
            <div class="flex items-center gap-2 mb-4">
              <section.icon size={14} class="text-slate-900" />
              <h3 class="!m-0 uppercase text-[12px] tracking-wider">{section.id}</h3>
            </div>
            <p>{@html section.p1}</p>
            
            {#if section.bullets}
              <ul>
                {#each section.bullets as bullet}
                  <li>{@html bullet}</li>
                {/each}
              </ul>
            {/if}

            {#if section.p2}
              <p>{section.p2}</p>
            {/if}
          </section>
        {/each}

        <section class="p-6 bg-slate-50 border border-slate-100">
          <div class="flex items-center gap-2 mb-4">
            <Mail size={14} class="text-slate-900" />
            <h3 class="!m-0 uppercase text-[12px] tracking-wider">{t.contact_title}</h3>
          </div>
          <p class="m-0 text-slate-500 text-[13px]">
            {t.contact_text} <br />
            <em class="text-slate-900 not-italic font-mono text-[11px] mt-2 inline-block underline">linhhv.196@gmail.com</em>
          </p>
        </section>

      </article>
    </div>
  </div>
</div>
