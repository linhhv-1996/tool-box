<script lang="ts">
  import { allTools } from "$lib/config/tools";
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import Content from "$lib/content/compress-pdf.md";
  import CompressPDF from "$lib/components/tools/CompressPDF.svelte";
  import RelatedTools from "$lib/components/RelatedTools.svelte";

  const toolInfo = allTools.find((t) => t.id === "compress-pdf")!;
  const related = allTools
    .filter((t) => t.id !== "compress-pdf" && t.id !== "combine-pdf")
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);
</script>

<svelte:head>
  <title>{toolInfo.name.en} - Compress PDF Online (100% Private)</title>
  <meta
    name="description"
    content="Reduce PDF file size locally in your browser without uploading to any server. Fast, secure, and 100% private PDF compression tool."
  />
  <link rel="canonical" href="https://justlocaltools.com/compress-pdf" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/compress-pdf" />
  <meta
    property="og:title"
    content="{toolInfo.name.en} - Reduce PDF File Size Online"
  />
  <meta
    property="og:description"
    content="Compress PDF files locally in your browser. No server uploads, 100% private and secure."
  />

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Compress PDF",
      "url": "https://justlocaltools.com/compress-pdf",
      "description": "Reduce PDF file size locally in your browser. No server uploads, 100% private.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  </script>
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-6 md:py-10">
  <ToolLayout title={toolInfo.name.en} description={toolInfo.desc.en} />

  <div class="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8">
    <main class="min-w-0">
      <CompressPDF lang="en" />

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
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
</style>
