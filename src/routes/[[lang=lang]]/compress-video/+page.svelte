<script lang="ts">
  import { allTools } from "$lib/config/tools";
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import RelatedTools from "$lib/components/RelatedTools.svelte";
    import CompressVideo from "$lib/components/tools/CompressVideo.svelte";
    import { page } from "$app/stores";
        import { ui, type Language } from "$lib/translate/ui.js";
    import SEO from "$lib/components/SEO.svelte";

  const toolInfo = allTools.find((t) => t.id === "compress-video")!;
  const related = allTools.filter((t) => t.id !== "compress-video").sort(() => Math.random() - 0.5).slice(0, 5);

  let lang = $derived($page.params.lang === 'ja' ? 'ja' : 'en');

  let { data } = $props();

</script>

<SEO 
  lang={lang} 
  toolId="compress-video"
/>

<div class="max-w-[980px] mx-auto px-4 py-6 md:py-10 text-left">
  <ToolLayout backText={ui.home.back_to_home[lang as Language]} title={toolInfo.name[lang as Language]} description={toolInfo.desc[lang as Language]} />

  <div class="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8">
    <main class="min-w-0">
      <CompressVideo lang={lang as Language} />
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
