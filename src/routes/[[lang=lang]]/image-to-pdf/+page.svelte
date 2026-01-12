<script lang="ts">
  import Image2PDF from "$lib/components/tools/Image2PDF.svelte";
  import { allTools } from "$lib/config/tools";
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import RelatedTools from "$lib/components/RelatedTools.svelte";
    import { page } from "$app/stores";
        import { ui, type Language } from "$lib/translate/ui";
    import SEO from "$lib/components/SEO.svelte";

  const toolInfo = allTools.find((t) => t.id === "image-to-pdf")!;
  const related = allTools.filter((t) => t.id !== "image-to-pdf").sort(() => Math.random() - 0.5).slice(0, 5);

  let lang = $derived($page.params.lang === 'ja' ? 'ja' : 'en');

  let { data } = $props();

</script>

<SEO 
  lang={lang} 
  toolId="image-to-pdf"
/>

<div class="max-w-[980px] mx-auto px-4 py-6 md:py-10">
  <ToolLayout backText={ui.home.back_to_home[lang as Language]} title={toolInfo.name[lang as Language]} description={toolInfo.desc[lang as Language]} />

  <div class="flex flex-col lg:flex-row gap-8">
    <main class="flex-1 min-w-0">
      <Image2PDF lang={lang as Language} />

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
  /* Loại bỏ các khoảng trống thừa của typography để Ads gần content hơn */
  :global(.prose h2) {
    margin-top: 1.5rem !important;
  }
</style>
