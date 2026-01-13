<script lang="ts">
  import { page } from "$app/state";
  import { categories, allTools } from "$lib/config/tools";
  import { Search, ArrowRight } from "lucide-svelte";
  import { fade } from "svelte/transition";
  import { ui, type Language } from "$lib/translate/ui";
  import SEO from "$lib/components/SEO.svelte";
  import { DEFAULT_LANG, SUPPORTED_LANGS } from "$lib/config/constant";

  let lang = $derived(
    SUPPORTED_LANGS.includes(page.params.lang ?? "")
      ? page.params.lang
      : DEFAULT_LANG,
  );

  // Nếu là 'en' thì để trống, nếu là 'ko' hoặc 'ja' thì trả về '/ko' hoặc '/ja'
  let langPreUrl = $derived(lang === "en" ? "" : `/${lang}`);

  let searchQuery = $state("");
  let isFocused = $state(false);

  let filteredResults = $derived(
    searchQuery.trim() === ""
      ? []
      : allTools.filter(
          (t) =>
            t.name[lang as Language]
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            t.desc[lang as Language]
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
        ),
  );

  function handleBlur() {
    setTimeout(() => {
      isFocused = false;
    }, 200);
  }
</script>

<SEO {lang} />

<div class="max-w-[980px] mx-auto px-4 md:px-0 py-10">
  <section class="text-left mb-16">
    <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-[#1a1a1a]">
      {ui.home.h1[lang as Language]}
      <br />
      <span
        class="bg-black text-white px-2 inline-block mt-1 font-mono text-2xl tracking-tighter"
        >{ui.home.span[lang as Language]}</span
      >
    </h1>
    <p class="mt-4 text-slate-500 text-sm max-w-xl">
      {ui.home.p[lang as Language]}
    </p>

    <div class="mt-10 max-w-md relative">
      <div class="relative group">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-black transition-colors"
        >
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder={ui.home.search[lang as Language]}
          bind:value={searchQuery}
          onfocus={() => (isFocused = true)}
          onblur={handleBlur}
          class="w-full h-10 pl-10 pr-4 bg-transparent border-b border-slate-400 font-mono text-[13px] focus:border-black outline-none transition-all"
        />
      </div>

      {#if isFocused && searchQuery.length > 0}
        <div
          class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl z-50 text-left"
          transition:fade={{ duration: 50 }}
        >
          {#if filteredResults.length > 0}
            <div class="max-h-[300px] overflow-y-auto custom-scrollbar">
              {#each filteredResults as tool}
                <a
                  href="{langPreUrl}{tool.href}"
                  class="block px-3 py-2 hover:bg-slate-50 border-b border-slate-50 last:border-0 group"
                >
                  <div class="flex justify-between items-center">
                    <div>
                      <span class="text-[12px] font-bold block"
                        >{tool.name[lang as Language]}</span
                      >
                      <p class="text-[10px] text-slate-400 uppercase font-mono">
                        {tool.desc[lang as Language]}
                      </p>
                    </div>
                    <ArrowRight
                      size={14}
                      class="text-slate-200 group-hover:text-black"
                    />
                  </div>
                </a>
              {/each}
            </div>
          {:else}
            <div class="p-4 text-center text-[10px] font-mono text-slate-400">
              {ui.home.no_tool_found[lang as Language]}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </section>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
    {#each categories as category}
      <div class="flex flex-col group/cat">
        <div
          class="mb-6 flex items-baseline gap-2 border-b-2 border-black pb-2"
        >
          <span
            class="font-mono text-[10px] font-bold text-white bg-black px-1.5 py-0.5"
            >{category.id}</span
          >
          <h2
            class="font-mono uppercase text-[12px] font-bold tracking-widest text-black"
          >
            {category.title[lang as Language]}
          </h2>
        </div>

        <ul class="space-y-4">
          {#each category.tools as tool}
            <li class="group/item">
              <a
                href="{langPreUrl}{tool.href}"
                class="block border-l-2 border-transparent hover:border-slate-200 pl-3 transition-all"
              >
                <span
                  class="text-[14px] font-bold text-black block leading-none group-hover/item:underline decoration-slate-300 underline-offset-2"
                >
                  {tool.name[lang as Language]}
                </span>
                <span
                  class="text-[12px] text-slate-500 leading-snug mt-1.5 block opacity-70 group-hover/item:opacity-100 transition-opacity font-mono"
                >
                  {tool.desc[lang as Language]}
                </span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 2px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #1a1a1a;
  }
</style>
