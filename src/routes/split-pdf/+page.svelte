<script lang="ts">
  import { allTools } from "$lib/config/tools";
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  // @ts-ignore
  import Content from "$lib/content/split-pdf.md";
  import SplitPDF from "$lib/components/tools/SplitPDF.svelte";
  import RelatedTools from "$lib/components/RelatedTools.svelte";

  // --- LOGIC GỐC ĐƯỢC GIỮ NGUYÊN ---
  const toolInfo = allTools.find((t) => t.id === "split-pdf")!;
  const related = allTools.filter((t) => t.id !== "split-pdf").sort(() => Math.random() - 0.5).slice(0, 5);
</script>

<svelte:head>
  <title>{toolInfo.name.en} - Extract PDF Pages Privately & Free Online</title>

  <meta
    name="description"
    content="Extract specific pages or split your PDF into multiple separate documents instantly. A 100% private, browser-based tool that ensures your sensitive files never leave your device."
  />
  <meta
    name="keywords"
    content="split pdf, extract pdf pages, online pdf splitter, secure pdf extraction, split pdf without upload, browser-based pdf splitter, pdf page extractor, separate pdf pages"
  />
  <link rel="canonical" href="https://justlocaltools.com/split-pdf" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/split-pdf" />
  <meta
    property="og:title"
    content="{toolInfo.name.en} - Secure & Flexible Page Extraction"
  />
  <meta
    property="og:description"
    content="Split your PDF files into individual pages or specific ranges privately. Fast, free, and no file uploads required for maximum document security."
  />

  {@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "${toolInfo.name.en}",
      "operatingSystem": "Any",
      "applicationCategory": "BusinessApplication",
      "description": "A secure browser-based tool to split, extract, and reorganize PDF pages locally without uploading files to a server.",
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
      <SplitPDF lang="en" />

      <article class="prose max-w-none pt-10 border-t border-slate-100">
        <Content />
      </article>
    </main>

    <aside>
      <RelatedTools {related} lang="en" />
    </aside>
  </div>
</div>

<style>
  /* Thu hẹp khoảng cách typography cho SEO Content */
  :global(.prose h2) {
    margin-top: 1.5rem !important;
  }
</style>
