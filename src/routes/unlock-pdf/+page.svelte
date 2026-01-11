<script lang="ts">
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Content from '$lib/content/unlock-pdf.md';
    import UnlockPDF from '$lib/components/tools/UnlockPDF.svelte';
    import RelatedTools from '$lib/components/RelatedTools.svelte';

  const toolInfo = allTools.find(t => t.id === 'unlock-pdf')!;
  const related = allTools.filter(t => t.id !== 'unlock-pdf').sort(() => Math.random() - 0.5).slice(0, 5);

</script>

<svelte:head>
  <title>{toolInfo.name.en} - Remove PDF Password & Restrictions Online Free</title>
  
  <meta name="description" content="Unlock your PDF files and remove passwords or printing/editing restrictions directly in your browser. 100% private, client-side decryption ensures your documents and passwords never leave your device." />
  <meta name="keywords" content="unlock pdf, remove pdf password, pdf restriction remover, online pdf unlocker, secure pdf decryption, unlock pdf without upload, browser-based pdf unlocker, remove pdf print protection" />
  <link rel="canonical" href="https://justlocaltools.com/unlock-pdf" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/unlock-pdf" />
  <meta property="og:title" content="{toolInfo.name.en} - Instant & Private PDF Decryption" />
  <meta property="og:description" content="Gaining full access to your PDF files privately. Remove open passwords and usage restrictions locally on your device without any server-side processing." />

  {@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "${toolInfo.name.en}",
      "operatingSystem": "Any",
      "applicationCategory": "BusinessApplication",
      "description": "A secure browser-based tool to remove passwords and security restrictions from PDF documents locally.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  </script>`}
</svelte:head>


<div class="max-w-[980px] mx-auto px-4 py-6 md:py-10">
  <ToolLayout title={toolInfo.name.en} description={toolInfo.desc.en} />

  <div class="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8">
    <main class="min-w-0">
     <UnlockPDF lang="en" />

      <article class="prose max-w-none pt-10 border-t border-slate-100 text-left">
        <Content />
      </article>
    </main>

    <aside>
      <RelatedTools related={related} lang="en" />
    </aside>
  </div>
</div>

<style>
  :global(.prose h2) { margin-top: 1.5rem !important; }
</style>
