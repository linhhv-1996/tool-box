<script lang="ts">
  import { allTools } from "$lib/config/tools";
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import RelatedTools from "$lib/components/RelatedTools.svelte";
  import HEICConvert from "$lib/components/tools/HEICConvert.svelte";
  import { page } from "$app/state";
  import { ui, type Language } from "$lib/translate/ui.js";
  import SEO from "$lib/components/SEO.svelte";
  import { SUPPORTED_LANGS, DEFAULT_LANG } from "$lib/config/constant.js";

  let lang = $derived(
    SUPPORTED_LANGS.includes(page.params.lang ?? "")
      ? page.params.lang
      : DEFAULT_LANG,
  );

  let { data } = $props();

  const toolInfo = allTools.find((t) => t.id === "heic-to-jpg")!;
  const related = allTools
    .filter((t) => t.id !== "heic-to-jpg")
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);
</script>

<SEO {lang} toolId="heic-to-jpg" />

<div class="max-w-[980px] mx-auto px-4 py-6 md:py-10 text-left">
  <ToolLayout
    backText={ui.home.back_to_home[lang as Language]}
    title={toolInfo.name[lang as Language]}
    description={toolInfo.desc[lang as Language]}
  />

  <div class="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8">
    <main class="min-w-0">
      <HEICConvert lang={lang as Language} />

      <article class="prose max-w-none pt-10 border-t border-slate-100">
        {#if data.Content}
          <data.Content />
        {/if}
      </article>
    </main>

    <aside class="w-full lg:w-[300px] shrink-0">
      <RelatedTools {related} lang={lang as Language} />
    </aside>
  </div>
</div>

<style>
  :global(.prose h2) {
    margin-top: 1.5rem !important;
  }
</style>
