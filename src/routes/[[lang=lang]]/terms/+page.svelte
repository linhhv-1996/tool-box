<script lang="ts">
  import { page } from "$app/state";
  import { DEFAULT_LANG, SUPPORTED_LANGS } from "$lib/config/constant";

  // 1. Xác định ngôn ngữ hiện tại
  let lang = $derived(
    SUPPORTED_LANGS.includes(page.params.lang ?? "")
      ? page.params.lang
      : DEFAULT_LANG,
  );

  // 2. Menu Index cho Terms
  const menuData = {
    en: [
      { id: "acceptance", t: "1. Acceptance" },
      { id: "license", t: "2. Use License" },
      { id: "disclaimer", t: "3. Disclaimer" },
      { id: "limitations", t: "4. Limitations" },
      { id: "accuracy", t: "5. Accuracy" },
      { id: "links", t: "6. Links" },
      { id: "modifications", t: "7. Modifications" },
      { id: "governing-law", t: "8. Governing Law" },
    ],
    ja: [
      { id: "acceptance", t: "1. 利用規約への同意" },
      { id: "license", t: "2. 使用許諾" },
      { id: "disclaimer", t: "3. 免責事項" },
      { id: "limitations", t: "4. 責任の制限" },
      { id: "accuracy", t: "5. 資料の正確性" },
      { id: "links", t: "6. リンク" },
      { id: "modifications", t: "7. 規約の変更" },
      { id: "governing-law", t: "8. 準拠法" },
    ],
    ko: [
      { id: "acceptance", t: "1. 약관 동의" },
      { id: "license", t: "2. 이용 라이선스" },
      { id: "disclaimer", t: "3. 면책 조항" },
      { id: "limitations", t: "4. 책임 제한" },
      { id: "accuracy", t: "5. 자료의 정확성" },
      { id: "links", t: "6. 링크" },
      { id: "modifications", t: "7. 약관 수정" },
      { id: "governing-law", t: "8. 준거법" },
    ],
  };

  const metaData = {
    title: {
      en: "Terms of Service | JustLocalTools",
      ja: "利用規約 | JustLocalTools",
      ko: "서비스 이용약관 | JustLocalTools",
    },
    index: {
      en: "Terms Index",
      ja: "利用規約目次",
      ko: "약관 목차",
    },
    h1: {
      en: "Terms of Service",
      ja: "利用規約",
      ko: "서비스 이용약관",
    },
    date: {
      en: "Last Modified",
      ja: "最終更新日",
      ko: "최종 수정일",
    },
  };

  let activeMenu = $derived(menuData[lang] || menuData[DEFAULT_LANG]);
  let htmlContent = $state("");

  // 3. Load Markdown động cho trang Terms
  $effect(() => {
    const fetchMd = async () => {
      try {
        const content = await import(`$lib/content/term/${lang}.md?raw`);
        htmlContent = content.default;
      } catch (e) {
        const fallback = await import(`$lib/content/term/en.md?raw`);
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
      <header class="mb-12 pb-8">
        <h1
          class="text-4xl font-bold text-slate-900 mb-4 tracking-tight uppercase"
        >
          {metaData.h1[lang]}
        </h1>
        <p class="text-sm font-mono text-slate-400">
          {metaData.date[lang]}: January 13, 2026
        </p>
      </header>

      <div
        class="prose prose-slate max-w-none
        prose-h2:scroll-mt-10 prose-h2:text-xl prose-h2:font-bold prose-h2:border-b prose-h2:pb-2 prose-h2:pt-8 prose-h2:uppercase prose-h2:tracking-tight
        prose-p:text-slate-600 prose-p:leading-8
        prose-ul:my-6 prose-li:text-slate-600"
      >
        {@html htmlContent}
      </div>
    </main>
  </div>
</div>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
