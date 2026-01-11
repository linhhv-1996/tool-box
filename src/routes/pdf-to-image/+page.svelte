<script lang="ts">
  import { allTools } from "$lib/config/tools";
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import Content from "$lib/content/pdf-to-image.md";
  import PDF2Image from "$lib/components/tools/PDF2Image.svelte";
  import RelatedTools from "$lib/components/RelatedTools.svelte";
  const toolInfo = allTools.find((t) => t.id === "pdf-to-image")!;
  const related = allTools.filter((t) => t.id !== "pdf-to-image").sort(() => Math.random() - 0.5).slice(0, 5);
</script>

<svelte:head>
  <title>{toolInfo.name.en} - High-Quality PDF to JPG/PNG Online & Offline</title>

  <meta
    name="description"
    content="Convert PDF pages into high-quality JPG or PNG images directly in your browser. 100% private with client-side rendering—no file uploads, no limits, and no waiting."
  />
  <meta
    name="keywords"
    content="pdf to image, convert pdf to jpg, pdf to png converter, high resolution pdf to image, browser-based pdf renderer, secure pdf conversion, extract images from pdf"
  />
  <link rel="canonical" href="https://justlocaltools.com/pdf-to-image" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/pdf-to-image" />
  <meta
    property="og:title"
    content="{toolInfo.name.en} - 100% Secure & High Resolution"
  />
  <meta
    property="og:description"
    content="Extract sharp images from your PDF pages privately. Choose between JPG or PNG with adjustable resolution (up to 3x scale) without uploading any data."
  />

  {@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "${toolInfo.name.en}",
      "operatingSystem": "Any",
      "applicationCategory": "MultimediaApplication",
      "description": "A secure browser-based tool to render and convert PDF pages into high-resolution JPG or PNG images locally.",
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
      <PDF2Image lang="en" />

      <article
        class="prose max-w-none pt-10 border-t border-slate-100 text-left"
      >
        <Content />
      </article>
    </main>

    <aside>
      <RelatedTools {related} lang="en" />
    </aside>
  </div>
</div>

<style>
  :global(.prose h2) {
    margin-top: 1.5rem !important;
  }
</style>
