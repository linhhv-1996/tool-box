<script lang="ts">
  import { Scale, ShieldAlert, FileText, Ban, HelpCircle, HardDrive } from 'lucide-svelte';
  import { page } from '$app/stores';

  // 1. Xác định ngôn ngữ hiện tại
  let lang = $derived(($page.params.lang === 'ja' ? 'ja' : 'en') as 'en' | 'ja');

  // 2. Nội dung đa ngôn ngữ (Inline Content)
  const content = {
    en: {
      title: "Terms of Service | LOCALTOOLS_",
      description: "Terms of Service and Usage Agreement for LOCALTOOLS_.",
      doc_info: "Legal_Doc / Terms_v1.0",
      heading: "Terms of Service",
      last_revised: "Last Revised: January 2026",
      agreement_title: "User Agreement",
      agreement_list: [
        "Free for Commercial Use",
        "No Malware Processing",
        "No Data Warranty",
        "Browser-Only Execution"
      ],
      sections: [
        {
          id: "1. Agreement to Terms",
          icon: FileText,
          p1: "By accessing or using <strong>LOCALTOOLS_</strong>, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using or accessing this site. All tools are provided through your browser \"as-is\" without any account registration requirements."
        },
        {
          id: "2. Use License & Scope",
          icon: HardDrive,
          p1: "Permission is granted to use the tools on LOCALTOOLS_ for both personal and commercial purposes. This is the grant of a usage license, not a transfer of title, and under this license you may not:",
          bullets: [
            "Attempt to decompile or reverse engineer any software contained on the website;",
            "Use the services for any illegal activities or to process malware-infected files;",
            "Remove any copyright or other proprietary notations from the materials;",
            "Automate access to the site via bots or scrapers that may degrade service performance."
          ]
        },
        {
          id: "3. Disclaimer of Warranties",
          icon: ShieldAlert,
          p1: "The materials and tools on LOCALTOOLS_ are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation:",
          bullets: [
            "<strong>Data Integrity:</strong> We are not responsible for any data loss resulting from browser crashes, memory overflows, or file processing errors.",
            "<strong>Availability:</strong> We do not guarantee that the tools will be uninterrupted, timely, or error-free.",
            "<strong>Local Performance:</strong> Execution speed and success depend entirely on your device's hardware capability (CPU/RAM)."
          ]
        },
        {
          id: "4. Limitations of Liability",
          icon: Ban,
          p1: "In no event shall LOCALTOOLS_ or its developers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the tools, even if notified orally or in writing of the possibility of such damage."
        },
        {
          id: "5. External Links & Ads",
          icon: HelpCircle,
          p1: "LOCALTOOLS_ may contain links to third-party websites or services (such as advertisers). We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us."
        }
      ],
      governing_law: {
        title: "6. Governing Law",
        text: "These terms and conditions are governed by and construed in accordance with international web standards and the laws of your local jurisdiction. Any disputes shall be subject to the exclusive jurisdiction of the courts in your location."
      },
      contact: "Contact: linhhv.196@gmail.com"
    },
    ja: {
      title: "利用規約 | LOCALTOOLS_",
      description: "LOCALTOOLS_の利用規約および使用許諾契約。",
      doc_info: "法的文書 / 利用規約 v1.0",
      heading: "利用規約",
      last_revised: "最終改訂日: 2026年1月",
      agreement_title: "ユーザー合意事項",
      agreement_list: [
        "商用利用無料",
        "マルウェア処理の禁止",
        "データ保証なし",
        "ブラウザ内実行のみ"
      ],
      sections: [
        {
          id: "1. 規約への同意",
          icon: FileText,
          p1: "<strong>LOCALTOOLS_</strong>にアクセスまたは使用することで、本利用規約に拘束されることに同意したものとみなされます。本規約のいずれかの部分に同意しない場合は、本サイトの使用またはアクセスを禁止します。すべてのツールは、アカウント登録不要で、ブラウザを通じて「現状有姿」で提供されます。"
        },
        {
          id: "2. 使用許諾および範囲",
          icon: HardDrive,
          p1: "LOCALTOOLS_のツールを個人的および商用目的の両方で使用する許可が与えられます。これは使用許諾の付与であり、所有権の移転ではありません。この許諾の下で、以下のことを行うことはできません：",
          bullets: [
            "本ウェブサイトに含まれるソフトウェアのデコンパイルまたはリバースエンジニアリングの試み",
            "違法活動やマルウェアに感染したファイルの処理のためのサービス利用",
            "材料から著作権またはその他の所有権の表記を削除すること",
            "サービスのパフォーマンスを低下させる可能性のあるボットやスクレイパーによるサイトへの自動アクセス"
          ]
        },
        {
          id: "3. 免責事項",
          icon: ShieldAlert,
          p1: "LOCALTOOLS_の資料およびツールは「現状有姿」で提供されます。当社は、明示的か黙示的かを問わず、いかなる保証も行わず、以下の事項を含むがこれらに限定されない他のすべての保証を否認および否定します：",
          bullets: [
            "<strong>データの完全性:</strong> ブラウザのクラッシュ、メモリオーバーフロー、またはファイル処理エラーに起因するデータの損失について、当社は一切の責任を負いません。",
            "<strong>可用性:</strong> ツールが中断されないこと、タイムリーであること、またはエラーがないことを保証しません。",
            "<strong>ローカルパフォーマンス:</strong> 実行速度と成功は、完全にお客様のデバイスのハードウェア能力（CPU/RAM）に依存します。"
          ]
        },
        {
          id: "4. 責任の制限",
          icon: Ban,
          p1: "いかなる場合においても、LOCALTOOLS_またはその開発者は、ツールの使用または使用不能から生じるいかなる損害（データまたは利益の損失、あるいは事業の中断による損害を含むがこれに限定されない）に対して、たとえそのような損害の可能性について口頭または書面で通知されていたとしても、一切の責任を負わないものとします。"
        },
        {
          id: "5. 外部リンクおよび広告",
          icon: HelpCircle,
          p1: "LOCALTOOLS_には、第三者のウェブサイトまたはサービス（広告主など）へのリンクが含まれている場合があります。当社は、本ウェブサイトにリンクされているすべてのサイトを確認しておらず、そのようなリンク先のサイトの内容について責任を負いません。リンクの掲載は、当社による推奨を意味するものではありません。"
        }
      ],
      governing_law: {
        title: "6. 準拠法",
        text: "本規約は、国際的なウェブ標準およびお客様の地域の法律に従って管理および解釈されます。あらゆる紛争は、お客様の所在地の裁判所の専属管轄権に服するものとします。"
      },
      contact: "お問い合わせ: linhhv.196@gmail.com"
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
       <Scale size={12} class="text-amber-600" />
       <span class="font-mono text-[10px] uppercase tracking-widest text-slate-400">{t.doc_info}</span>
    </div>
    <h1 class="text-xl font-bold tracking-tighter font-mono uppercase text-[#1a1a1a]">
      {t.heading}
    </h1>
    <p class="text-[10px] font-mono text-slate-400 mt-2 uppercase">{t.last_revised}</p>
    <hr class="mt-3 border-slate-100">
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
    <div class="md:col-span-3">
      <div class="sticky top-8 space-y-4">
        <div class="p-4 border border-slate-100 bg-slate-50/50 rounded-sm">
          <h4 class="font-mono text-[10px] font-bold uppercase mb-3 text-slate-900">{t.agreement_title}</h4>
          <ul class="space-y-2 text-[10px] text-slate-500 font-mono uppercase leading-tight">
            {#each t.agreement_list as item, i}
              <li class="flex items-start gap-2">
                <span class="text-slate-400">{String(i + 1).padStart(2, '0')}</span> {item}
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
          </section>
        {/each}

        <section class="p-6 bg-slate-50 border border-slate-100 font-mono">
          <h3 class="!m-0 uppercase text-[12px] tracking-wider mb-4">{t.governing_law.title}</h3>
          <p class="m-0 text-[12px] text-slate-500 leading-relaxed">
            {t.governing_law.text}
          </p>
          <div class="mt-6 pt-6 border-t border-slate-200">
             <p class="m-0 text-[11px] text-slate-400 uppercase tracking-tighter">
               {t.contact}
             </p>
          </div>
        </section>

      </article>
    </div>
  </div>
</div>
