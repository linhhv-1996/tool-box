<script lang="ts">
  import Image2PDF from "$lib/components/tools/Image2PDF.svelte";
  import ContentEn from "$lib/content/image-to-pdf.md";
  import { allTools } from "$lib/config/tools";
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import RelatedTools from "$lib/components/RelatedTools.svelte";
  const toolInfo = allTools.find((t) => t.id === "image-to-pdf")!;
  const related = allTools.filter((t) => t.id !== "image-to-pdf").sort(() => Math.random() - 0.5).slice(0, 5);
</script>

<svelte:head>
  <title>{toolInfo.name.en} - Convert Images to PDF Online & Offline Free</title>

  <meta
    name="description"
    content="Convert JPG, PNG, WebP, and BMP images to PDF directly in your browser. Securely combine and reorder multiple images into a single PDF without uploading to any server."
  />
  <meta
    name="keywords"
    content="image to pdf, convert jpg to pdf, png to pdf converter, webp to pdf, combine images to pdf, browser-based pdf creator, no upload pdf converter, secure image to pdf"
  />
  <link rel="canonical" href="https://justlocaltools.com/image-to-pdf" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/image-to-pdf" />
  <meta
    property="og:title"
    content="{toolInfo.name.en} - 100% Private & No Uploads"
  />
  <meta
    property="og:description"
    content="Turn your photos, scans, and documents into high-quality PDFs instantly. Your images stay on your device for total privacy."
  />

  {@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "${toolInfo.name.en}",
      "operatingSystem": "Any",
      "applicationCategory": "MultimediaApplication",
      "description": "A secure browser-based tool to combine and convert multiple images into a single PDF document locally.",
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

  <div class="flex flex-col lg:flex-row gap-8">
    <main class="flex-1 min-w-0">
      <Image2PDF lang="en" />

      <article class="prose max-w-none pt-10 border-t border-slate-100">
        <ContentEn />
      </article>
    </main>

    <aside class="w-full lg:w-[300px] shrink-0">
      <RelatedTools {related} lang="en" />
    </aside>
  </div>
</div>

<style>
  /* Loại bỏ các khoảng trống thừa của typography để Ads gần content hơn */
  :global(.prose h2) {
    margin-top: 1.5rem !important;
  }
</style>
