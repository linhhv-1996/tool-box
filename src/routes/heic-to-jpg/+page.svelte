<script lang="ts">
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Content from '$lib/content/heic-to-jpg.md';
    import RelatedTools from '$lib/components/RelatedTools.svelte';
    import HEICConvert from '$lib/components/tools/HEICConvert.svelte';

  const toolInfo = allTools.find((t) => t.id === 'heic-to-jpg')!;
  const related = allTools.filter((t) => t.id !== 'heic-to-jpg').sort(() => Math.random() - 0.5).slice(0, 5);

</script>

<svelte:head>
  <title>{toolInfo.name.en} | Convert HEIC to JPG/PNG Online & Offline</title>
  
  <meta name="description" content="Convert iPhone HEIC photos to JPG or PNG directly in your browser. 100% private, client-side processing - your images never leave your device." />
  <meta name="keywords" content="heic to jpg, convert heic to png, apple photo converter, iphone images to jpeg, browser-based heic converter, bulk heic conversion" />
  <link rel="canonical" href="https://justlocaltools.com/heic-to-jpg" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/heic-to-jpg" />
  <meta property="og:title" content="{toolInfo.name.en} - Private & Fast Conversion" />
  <meta property="og:description" content="Securely convert your HEIC photos to JPG or PNG format without uploading to any server." />

  {@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "${toolInfo.name.en}",
      "operatingSystem": "Any",
      "applicationCategory": "MultimediaApplication",
      "description": "A browser-based tool to convert HEIC images to JPG or PNG format locally.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  </script>`}
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-6 md:py-10 text-left">
  <ToolLayout title={toolInfo.name.en} description={toolInfo.desc.en} />

  <div class="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8">
    <main class="min-w-0">
      
      <HEICConvert lang="en" />

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
