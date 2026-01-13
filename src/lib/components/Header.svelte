<script lang="ts">
  import { page } from "$app/state";
  import { DEFAULT_LANG, SUPPORTED_LANGS } from "$lib/config/constant";
  import { siteLanguages, ui, type Language } from "$lib/translate/ui";
  import { ChevronDown, Languages } from "lucide-svelte";

  // Quản lý trạng thái dropdown
  let isOpen = $state(false);

  // 1. Xác định ngôn ngữ hiện tại
  let currentLang = $derived(
    (SUPPORTED_LANGS.includes(page.params.lang ?? "")
      ? page.params.lang
      : DEFAULT_LANG) as Language,
  );

  // 2. Tạo Regex động từ danh sách SUPPORTED_LANGS
  const langPattern = SUPPORTED_LANGS.filter((l) => l !== DEFAULT_LANG).join("|");
  const langRegex = new RegExp(`^/(${langPattern})(?=/|$)`);

  // 3. Làm sạch Path
  let cleanPath = $derived(page.url.pathname.replace(langRegex, "") || "/");

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function closeDropdown() {
    isOpen = false;
  }

  // Helper để tạo link đúng theo ngôn ngữ
  const langPrefix = $derived(currentLang === DEFAULT_LANG ? '' : `/${currentLang}`);
</script>

{#if isOpen}
  <button
    onclick={closeDropdown}
    class="fixed inset-0 z-40 cursor-default focus:outline-none"
    tabindex="-1"
  ></button>
{/if}

<header
  class="max-w-[980px] mx-auto px-4 md:px-0 py-5 flex flex-row justify-between items-center border-b border-slate-100/60 w-full"
>
  <div class="flex items-center gap-2 md:gap-3">
    <a
      href="{langPrefix}/"
      class="text-base md:text-lg font-bold tracking-tight font-mono hover:opacity-70 transition-opacity flex items-center shrink-0"
    >
      LOCALTOOLS<span class="blink ml-0.5 text-emerald-500">_</span>
    </a>
  </div>

  <nav class="flex items-center space-x-3 md:space-x-6">
    <a
      href="{langPrefix}/how-it-works"
      class="text-[10px] md:text-[11px] font-mono uppercase font-bold text-slate-400 hover:text-[#1a1a1a] transition-all relative group shrink-0"
    >
      {ui.header.how_it_work[currentLang]}
      <span class="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#1a1a1a] transition-all group-hover:w-full"></span>
    </a>

    <a
      href="{langPrefix}/blog"
      class="text-[10px] md:text-[11px] font-mono uppercase font-bold text-slate-400 hover:text-[#1a1a1a] transition-all relative group shrink-0"
    >
      {ui.header.blog?.[currentLang] || 'Blog'}
      <span class="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#1a1a1a] transition-all group-hover:w-full"></span>
    </a>

    <div class="relative inline-block text-left ml-1 md:ml-2 border-l border-slate-100 pl-3 md:pl-5">
      <button
        onclick={toggleDropdown}
        class="flex items-center gap-1 text-[10px] md:text-[11px] font-mono font-bold uppercase py-1 px-2 rounded-sm hover:bg-slate-50 transition-colors"
      >
        <Languages size={14} class="text-slate-400" />
        <span class="hidden sm:inline">{currentLang}</span>
        <span class="sm:hidden">{currentLang.toUpperCase()}</span>
        <ChevronDown
          size={12}
          class="text-slate-300 transition-transform {isOpen ? 'rotate-180' : ''}"
        />
      </button>

      {#if isOpen}
        <div class="absolute right-0 mt-2 w-32 origin-top-right rounded-sm border border-slate-100 bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div class="py-1">
            {#each siteLanguages as lang}
              <a
                href={lang.code === DEFAULT_LANG
                  ? cleanPath
                  : `/${lang.code}${cleanPath === "/" ? "" : cleanPath}`}
                onclick={closeDropdown}
                class="block px-4 py-2 text-[11px] font-mono uppercase transition-colors {currentLang === lang.code
                  ? 'bg-slate-50 text-emerald-600 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-black'}"
              >
                {lang.label}
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </nav>
</header>
