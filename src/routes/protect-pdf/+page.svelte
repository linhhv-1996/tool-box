<script lang="ts">
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  // @ts-ignore
  import Content from '$lib/content/protect-pdf.md';
    import ProtectPDF from '$lib/components/tools/ProtectPDF.svelte';
    import RelatedTools from '$lib/components/RelatedTools.svelte';

  const toolInfo = allTools.find((t) => t.id === 'protect-pdf')!;
  const related = allTools.filter((t) => t.id !== 'protect-pdf').sort(() => Math.random() - 0.5).slice(0, 5);

</script>

<svelte:head>
  <title>{toolInfo.name.en} - Password Protect PDF Online (100% Private)</title>
  
  <meta name="description" content="Secure your PDF files with strong 256-bit AES encryption directly in your browser. No server uploads, no file tracking—your documents and passwords never leave your device." />
  <meta name="keywords" content="protect pdf with password, encrypt pdf online, secure pdf documents, 256-bit aes pdf encryption, lock pdf without upload, client-side pdf security, private pdf protection" />
  <link rel="canonical" href="https://justlocaltools.com/protect-pdf" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/protect-pdf" />
  <meta property="og:title" content="{toolInfo.name.en} - Secure AES-256 Encryption" />
  <meta property="og:description" content="Add a secure password to your PDF files privately on your device. Fast, free, and industry-standard encryption without any server interaction." />

  {@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "${toolInfo.name.en}",
      "operatingSystem": "Any",
      "applicationCategory": "SecurityApplication",
      "description": "A browser-based security tool to encrypt and password-protect PDF documents locally using 256-bit AES encryption.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      } file size limits"
      ]
    }
  </script>`}
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-6 md:py-10">
  <ToolLayout title={toolInfo.name.en} description={toolInfo.desc.en} />

  <div class="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8">
    
    <main class="min-w-0">
      <ProtectPDF lang="en"/>


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
  :global(.prose h2) { margin-top: 1.5rem !important; }
</style>
