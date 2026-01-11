<script lang="ts">
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Content from '$lib/content/combine-pdf.md';
    import RelatedTools from '$lib/components/RelatedTools.svelte';
    import CombinePDF from '$lib/components/tools/CombinePDF.svelte';

  // --- LOGIC GỐC ĐƯỢC GIỮ NGUYÊN ---
  const toolInfo = allTools.find(t => t.id === 'combine-pdf')!;
  const related = allTools.filter(t => t.id !== 'combine-pdf').sort(() => Math.random() - 0.5).slice(0, 5);

</script>

<svelte:head>
  <title>{toolInfo.name.en} - Combine PDF Files Online & Locally Free</title>
  
  <meta name="description" content="Combine multiple PDF files into a single document directly in your browser. 100% private with client-side merging—no server uploads, no file size limits, and no privacy risks." />
  <meta name="keywords" content="merge pdf online, combine pdf without upload, secure pdf merger, client-side pdf joiner, lossless pdf merge, free pdf binder, join pdf files privately" />
  <link rel="canonical" href="https://justlocaltools.com/combine-pdf" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/combine-pdf" />
  <meta property="og:title" content="{toolInfo.name.en} - Private & Lossless PDF Merging" />
  <meta property="og:description" content="Merge your sensitive PDF documents securely on your device. High-performance browser-based processing ensures your data never leaves your computer." />

  {@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "${toolInfo.name.en}",
      "operatingSystem": "Any",
      "applicationCategory": "BusinessApplication",
      "description": "A secure browser-based tool to combine multiple PDF documents into one single file locally without server uploads.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  </script>`}
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-6 md:py-10">
  <ToolLayout title={toolInfo.name["en"]} description={toolInfo.desc["en"]} />

  <div class="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8">
    
    <main class="min-w-0">
      
      <CombinePDF lang="en"/>

      <article class="prose max-w-none pt-10 border-t border-slate-100">
        <Content />
      </article>
    </main>

    <aside>
      <RelatedTools related={related} lang="en" />
    </aside>

  </div>
</div>

<style>
  /* Tinh chỉnh typography để thu nhỏ khoảng cách */
  :global(.prose h2) { margin-top: 1.5rem !important; }
  
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>

