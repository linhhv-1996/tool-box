<script lang="ts">
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
    import UnlockPDF from '$lib/components/tools/UnlockPDF.svelte';
    import RelatedTools from '$lib/components/RelatedTools.svelte';
    import { page } from '$app/stores';
        import { ui, type Language } from '$lib/translate/ui.js';
    import SEO from '$lib/components/SEO.svelte';

  const toolInfo = allTools.find(t => t.id === 'unlock-pdf')!;
  const related = allTools.filter(t => t.id !== 'unlock-pdf').sort(() => Math.random() - 0.5).slice(0, 5);

  let lang = $derived($page.params.lang === 'ja' ? 'ja' : 'en');

  let { data } = $props();

</script>

<SEO 
  lang={lang} 
  toolId="unlock-pdf"
/>

<div class="max-w-[980px] mx-auto px-4 py-6 md:py-10">
  <ToolLayout backText={ui.home.back_to_home[lang as Language]} title={toolInfo.name[lang as Language]} description={toolInfo.desc[lang as Language]} />

  <div class="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8">
    <main class="min-w-0">
     <UnlockPDF lang={lang as Language} />

      <article class="prose max-w-none pt-10 border-t border-slate-100 text-left">
        {#if data.Content}
        <data.Content />
        {/if}
      </article>
    </main>

    <aside>
      <RelatedTools related={related} lang={lang as Language} />
    </aside>
  </div>
</div>

<style>
  :global(.prose h2) { margin-top: 1.5rem !important; }
</style>
