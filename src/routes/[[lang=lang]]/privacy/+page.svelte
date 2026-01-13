<script lang="ts">
  import { page } from "$app/state";
  import { DEFAULT_LANG, SUPPORTED_LANGS } from "$lib/config/constant";

  // 1. Xác định ngôn ngữ hiện tại
  let lang = $derived(
    SUPPORTED_LANGS.includes(page.params.lang ?? "")
      ? page.params.lang
      : DEFAULT_LANG,
  );

  // 2. Menu Index (Tự động đổi theo ngôn ngữ)
  const menuData = {
    en: [
      { id: "consent", t: "1. Consent" },
      { id: "collection", t: "2. Information Collection" },
      { id: "usage", t: "3. Usage of Data" },
      { id: "log-files", t: "4. Log Files" },
      { id: "adsense", t: "5. Advertising Partners" },
      { id: "dart-cookie", t: "6. DART Cookie" },
      { id: "gdpr", t: "7. GDPR Rights" },
      { id: "children", t: "8. Children's Info" },
    ],
    ja: [
      { id: "consent", t: "1. 同意事項" },
      { id: "collection", t: "2. 収集する情報" },
      { id: "usage", t: "3. 情報の使用目的" },
      { id: "log-files", t: "4. ログファイル" },
      { id: "adsense", t: "5. 広告パートナー" },
      { id: "dart-cookie", t: "6. DARTクッキー" },
      { id: "gdpr", t: "7. GDPRの権利" },
      { id: "children", t: "8. お子様の保護" },
    ],
    ko: [
      { id: "consent", t: "1. 동의" },
      { id: "collection", t: "2. 정보 수집" },
      { id: "usage", t: "3. 정보 이용" },
      { id: "log-files", t: "4. 로그 파일" },
      { id: "adsense", t: "5. 광고 파트너" },
      { id: "dart-cookie", t: "6. DART 쿠키" },
      { id: "gdpr", t: "7. GDPR 권리" },
      { id: "children", t: "8. 아동 정보 보호" },
    ],
  };

  const metaData = {
    title: {
      en: "Privacy Policy | JustLocalTools",
      ja: "プライバシーポリシー | JustLocalTools",
      ko: "개인정보처리방침 | JustLocalTools",
    },
    index: {
      en: "Policy Index",
      ja: "ポリシー目次",
      ko: "정책 목차",
    },
    h1: {
      en: "Privacy Policy",
      ja: "プライバシーポリシー",
      ko: "개인정보처리방침",
    },
    date: {
      en: "Effective Date",
      ja: "施行日",
      ko: "시행일",
    },
  };

  let activeMenu = $derived(menuData[lang] || menuData[DEFAULT_LANG]);
  let htmlContent = $state("");

  // 3. Load Markdown động theo ngôn ngữ
  $effect(() => {
    const fetchMd = async () => {
      try {
        // Load nội dung từ file md trong thư mục lib
        const content = await import(`$lib/content/privacy/${lang}.md?raw`);
        htmlContent = content.default;
      } catch (e) {
        const fallback = await import(`$lib/content/privacy/en.md?raw`);
        htmlContent = fallback.default;
      }
    };
    fetchMd();
  });
</script>

<svelte:head>
  <title>{metaData.title[lang]}</title>
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-20">
  <div class="flex flex-col lg:flex-row gap-16">
    <aside class="lg:w-1/4">
      <div class="sticky top-10">
        <h2
          class="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8"
        >
          {metaData.index[lang]}
        </h2>
        <nav>
          <ul class="space-y-4 border-l border-slate-100 pl-4">
            {#each activeMenu as item}
              <li>
                <a
                  href="#{item.id}"
                  class="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors block"
                >
                  {item.t}
                </a>
              </li>
            {/each}
          </ul>
        </nav>
      </div>
    </aside>

    <main class="lg:w-3/4">
      <header class="mb-12">
        <h1 class="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          {metaData.h1[lang]}
        </h1>
        <p class="text-sm font-mono text-slate-400">
          {metaData.date[lang]}: January 13, 2026
        </p>
      </header>

      <div
        class="prose prose-slate max-w-none
        prose-h2:scroll-mt-10 prose-h2:text-xl prose-h2:font-bold prose-h2:border-b prose-h2:pb-2 prose-h2:pt-8
        prose-p:text-slate-600 prose-p:leading-8
        prose-ul:my-6 prose-li:text-slate-600"
      >
        {@html htmlContent}
      </div>
    </main>
  </div>
</div>

<style>
  /* Giao diện nghiêm túc, không màu mè */
  :global(html) {
    scroll-behavior: smooth;
    background-color: #fff;
  }
</style>
