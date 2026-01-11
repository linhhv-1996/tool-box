<script lang="ts">
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Content from '$lib/content/bulk-rename.md';
    import RelatedTools from '$lib/components/RelatedTools.svelte';
    import BulkRename from '$lib/components/tools/BulkRename.svelte';

  const toolInfo = allTools.find((t) => t.id === 'bulk-rename')!;
  const related = allTools.filter((t) => t.id !== 'bulk-rename').sort(() => Math.random() - 0.5).slice(0, 5);

</script>

<svelte:head>
  <title>{toolInfo.name.en} - Privacy-First Bulk File Renamer</title>
  <meta name="description" content="Rename multiple files instantly in your browser. Powerful pattern matching without server uploads. 100% private and secure." />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/bulk-rename" />
  <meta property="og:title" content="{toolInfo.name.en} - Privacy-First Bulk File Renamer" />
  <meta property="og:description" content="Batch rename files locally in your browser. No files are ever uploaded to any server." />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Bulk File Renamer",
    "url": "https://justlocaltools.com/bulk-rename",
    "description": "A browser-based tool to rename multiple files at once using patterns and replacement rules.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }
  </script>
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-6 md:py-10 text-left">
  <ToolLayout title={toolInfo.name.en} description={toolInfo.desc.en} />

  <div class="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8">
    <main class="min-w-0">
      
      <BulkRename lang="en" />

      <article class="prose max-w-none pt-10 border-t border-slate-100">
        <Content />
      </article>
    </main>

    <aside>
      <RelatedTools related={related} lang="en"/>
    </aside>
  </div>
</div>

<style>
  :global(.prose h2) { margin-top: 1.5rem !important; }
</style>
