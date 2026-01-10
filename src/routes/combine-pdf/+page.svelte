<script lang="ts">
  // @ts-nocheck
  import { PDFDocument } from 'pdf-lib';
  import { Loader2, FileText, Trash2, Settings2, AlertCircle } from 'lucide-svelte';
  
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  import Content from '$lib/content/combine-pdf.md';

  // --- LOGIC GỐC ĐƯỢC GIỮ NGUYÊN ---
  const toolInfo = allTools.find(t => t.id === 'combine-pdf')!;
  const related = allTools.filter(t => t.id !== 'combine-pdf').slice(0, 5);

  let files = $state<File[]>([]);
  let isProcessing = $state(false);
  let error = $state("");
  let mergedUrl = $state<string | null>(null);
  let mergedSize = $state(0); 
  let resultFileName = $state("");

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function handleFiles(newFiles: File[]) {
    error = "";
    mergedUrl = null;
    const pdfs = newFiles.filter(f => f.type === "application/pdf");
    files = [...files, ...pdfs];
  }

  async function mergeAction() {
    if (files.length < 2) { 
      error = "Select at least 2 PDF files to combine.";
      return; 
    }
    isProcessing = true;
    error = "";
    mergedUrl = null;
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(p => mergedPdf.addPage(p));
      }
      const pdfBytes = await mergedPdf.save();
      mergedSize = pdfBytes.length;
      resultFileName = `combined_${Date.now()}.pdf`;
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      if (mergedUrl) URL.revokeObjectURL(mergedUrl);
      mergedUrl = URL.createObjectURL(blob);
    } catch (e) {
      error = "Merge failed. Check if your PDF files are corrupted.";
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    files = [];
    mergedUrl = null;
    mergedSize = 0;
    error = "";
  }

  function removeFile(index: number) {
    files = files.filter((_, i) => i !== index);
    mergedUrl = null;
  }
</script>

<svelte:head>
  <title>{toolInfo.name} - Combine PDF Files Online & Locally Free</title>
  
  <meta name="description" content="Combine multiple PDF files into a single document directly in your browser. 100% private with client-side merging—no server uploads, no file size limits, and no privacy risks." />
  <meta name="keywords" content="merge pdf online, combine pdf without upload, secure pdf merger, client-side pdf joiner, lossless pdf merge, free pdf binder, join pdf files privately" />
  <link rel="canonical" href="https://justlocaltools.com/combine-pdf" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/combine-pdf" />
  <meta property="og:title" content="{toolInfo.name} - Private & Lossless PDF Merging" />
  <meta property="og:description" content="Merge your sensitive PDF documents securely on your device. High-performance browser-based processing ensures your data never leaves your computer." />

  {@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "${toolInfo.name}",
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
  <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

  <div class="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8">
    
    <main class="min-w-0">
      <div class="bg-white border border-slate-200 rounded-sm shadow-sm p-5 md:p-8">
        
        <Dropzone 
          accept=".pdf"
          multiple={true}
          hasFiles={files.length > 0}
          onfiles={handleFiles}
          onClear={reset}
          label="Select PDF Files to Combine"
        />

        {#if files.length > 0}
          <div class="mt-6 animate-in fade-in duration-300">
            <div class="mb-6 border border-slate-100 rounded-sm overflow-hidden bg-slate-50/50">
              <div class="px-4 py-2 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                <span class="text-[10px] font-mono font-bold text-slate-500 uppercase">Queue ({files.length} files)</span>
              </div>
              <ul class="divide-y divide-slate-100 max-h-[300px] overflow-y-auto custom-scrollbar">
                {#each files as file, i}
                <li class="px-4 py-2.5 flex items-center justify-between gap-3 bg-white group hover:bg-slate-50 transition-colors">
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <FileText size={14} class="text-slate-300 shrink-0" />
                    <span 
                      class="text-[12px] font-medium text-black truncate block leading-tight" 
                      title={file.name}
                    >
                      {file.name}
                    </span>
                  </div>

                  <div class="flex items-center gap-3 shrink-0 ml-2">
                    <span class="text-[9px] font-mono text-slate-400 uppercase whitespace-nowrap bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                      {formatBytes(file.size)}
                    </span>
                    <button 
                      onclick={() => removeFile(i)}
                      class="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-100 transition-all rounded-sm shrink-0"
                      title="Remove file"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              {/each}
              </ul>
            </div>

            <button 
              onclick={mergeAction}
              disabled={isProcessing}
              class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-200 transition-all flex items-center justify-center shadow-md shadow-black/5"
            >
              {#if isProcessing}
                <Loader2 class="animate-spin mr-2" size={16} /> Processing...
              {:else}
                Merge PDF Documents
              {/if}
            </button>
          </div>
        {/if}

        {#if mergedUrl && !isProcessing}
          <div class="mt-6 animate-in fade-in zoom-in-95 duration-500">
            <SuccessState 
              title="Merge Complete"
              file={{ name: resultFileName, size: mergedSize, url: mergedUrl }}
              onReset={reset}
            />
          </div>
        {/if}

        {#if error}
          <div class="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-mono font-bold uppercase flex items-center gap-2">
            <AlertCircle size={14} /> {error}
          </div>
        {/if}
      </div>

      <article class="prose max-w-none pt-10 border-t border-slate-100">
        <Content />
      </article>
    </main>

    <aside>
      <div class="sticky top-6 space-y-8">

        <div class="bg-white border border-slate-100 p-5 rounded-sm shadow-sm">
          <h3 class="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-50">Related Tools</h3>
          <div class="space-y-4">
            {#each related as r}
              <a href={r.href} class="group block">
                <span class="text-xs font-bold block group-hover:text-black text-slate-700 transition-colors underline-offset-2 group-hover:underline">{r.name}</span>
                <span class="text-[10px] text-slate-400 font-mono uppercase block mt-1 line-clamp-1">{r.desc}</span>
              </a>
            {/each}
          </div>
        </div>
      </div>
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

