<script lang="ts">
  import { allTools } from "$lib/config/tools";
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import Content from "$lib/content/shrink-images.md";
  import CompressImage from "$lib/components/tools/CompressImage.svelte";
  import RelatedTools from "$lib/components/RelatedTools.svelte";

  const toolInfo = allTools.find((t) => t.id === "shrink-images")!;
  const related = allTools.filter((t) => t.id !== "shrink-images").sort(() => Math.random() - 0.5).slice(0, 5);
</script>

<svelte:head>
  <title>Compress Images Online | No Quality Loss | JustLocalTools</title>
  <meta
    name="description"
    content="Reduce image file size up to 90% without losing quality. Supports JPG, PNG, and WebP. 100% private, browser-based compression - your images never leave your computer."
  />
  <link rel="canonical" href="https://justlocaltools.com/shrink-images" />
  <meta
    name="keywords"
    content="compress images, image optimizer, shrink jpg, reduce png size, webp compressor, browser-based image compression, no upload image compressor"
  />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/shrink-images" />
  <meta property="og:title" content="Compress Images Online - Fast & Private" />
  <meta
    property="og:description"
    content="High-quality image compression directly in your browser. No server uploads, 100% secure and free."
  />

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Image Compressor",
      "operatingSystem": "Any",
      "applicationCategory": "MultimediaApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "Reduce image file size while maintaining high quality. Support JPG, PNG, and WebP. 100% private, browser-based compression.",
      "url": "https://justlocaltools.com/shrink-images"
    }
  </script>
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-6 md:py-10 text-left">
  <ToolLayout title={toolInfo.name.en} description={toolInfo.desc.en} />

  <div class="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8 mt-8">
    <main class="min-w-0">
      <CompressImage lang="en" />

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
