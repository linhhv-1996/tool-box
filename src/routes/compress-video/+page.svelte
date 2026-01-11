<script lang="ts">
  import { allTools } from "$lib/config/tools";
  import ToolLayout from "$lib/components/ToolLayout.svelte";
  import Content from "$lib/content/video-compress.md";
  import RelatedTools from "$lib/components/RelatedTools.svelte";
    import CompressVideo from "$lib/components/tools/CompressVideo.svelte";

  const toolInfo = allTools.find((t) => t.id === "compress-video")!;
  const related = allTools.filter((t) => t.id !== "compress-video").sort(() => Math.random() - 0.5).slice(0, 5);
</script>

<svelte:head>
  <title>{toolInfo.name.en} - Batch Video Compressor (Privacy-First)</title>
  <meta
    name="description"
    content="Compress multiple videos locally in your browser. Download individually or as a ZIP. 100% private, no server uploads."
  />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/compress-video" />
  <meta
    property="og:title"
    content="{toolInfo.name.en} - Secure Browser-Based Video Compression"
  />
  <meta
    property="og:description"
    content="Compress your videos locally without uploading to any server. Fast, free, and private."
  />

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Batch Video Compressor",
      "url": "https://justlocaltools.com/compress-video",
      "description": "Batch compress video files locally using FFmpeg WASM.",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Any"
    }
  </script>
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-6 md:py-10 text-left">
  <ToolLayout title={toolInfo.name.en} description={toolInfo.desc.en} />

  <div class="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8">
    <main class="min-w-0">
      <CompressVideo lang="en" />
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
