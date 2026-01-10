<script lang="ts">
  // @ts-nocheck
  import { PDFDocument } from 'pdf-lib';
  import JSZip from 'jszip';
  import { Loader2, FileText, Trash2, Scissors, AlertCircle } from 'lucide-svelte';
  
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  // @ts-ignore
  import Content from '$lib/content/split-pdf.md';

  // --- LOGIC GỐC ĐƯỢC GIỮ NGUYÊN ---
  const toolInfo = allTools.find((t) => t.id === 'split-pdf')!;
  const related = allTools.filter((t) => t.id !== 'split-pdf').slice(0, 5);

  let file = $state<File | null>(null);
  let pageCount = $state(0);
  let rangeInput = $state("");
  let isProcessing = $state(false);
  let error = $state("");
  let zipUrl = $state<string | null>(null);
  let zipSize = $state(0);
  let resultFileName = $state("");

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  async function handleFiles(newFiles: File[]) {
    error = "";
    zipUrl = null;
    const pdf = newFiles.find((f) => f.type === "application/pdf");
    
    if (!pdf) {
      error = "Please select a valid PDF file.";
      return;
    }

    try {
      file = pdf;
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      pageCount = pdfDoc.getPageCount();
      rangeInput = `1-${pageCount}`;
    } catch (e) {
      error = "Could not read PDF information.";
      file = null;
    }
  }

  function parseRanges(input: string, maxPages: number) {
    const parts = input.split(',').map(p => p.trim()).filter(p => p);
    const ranges = [];
    for (const part of parts) {
      if (part.includes('-')) {
        const [s, e] = part.split('-').map(n => parseInt(n));
        if (isNaN(s) || isNaN(e) || s < 1 || e > maxPages || s > e) {
          throw new Error(`Invalid range: ${part}`);
        }
        ranges.push({ start: s, end: e });
      } else {
        const n = parseInt(part);
        if (isNaN(n) || n < 1 || n > maxPages) {
          throw new Error(`Invalid page number: ${part}`);
        }
        ranges.push({ start: n, end: n });
      }
    }
    return ranges;
  }

  async function splitAction() {
    if (!file) return;
    isProcessing = true;
    error = "";
    zipUrl = null;

    try {
      const ranges = parseRanges(rangeInput, pageCount);
      const sourceBytes = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(sourceBytes);
      const zip = new JSZip();

      for (const range of ranges) {
        const newPdf = await PDFDocument.create();
        const pageIndices = [];
        for (let p = range.start; p <= range.end; p++) {
          pageIndices.push(p - 1);
        }

        const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
        copiedPages.forEach(page => newPdf.addPage(page));
        const pdfBytes = await newPdf.save();
        const name = range.start === range.end 
          ? `page_${range.start}.pdf` 
          : `pages_${range.start}_to_${range.end}.pdf`;
        
        zip.file(name, pdfBytes);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      zipSize = zipBlob.size;
      resultFileName = `split_${Date.now()}.zip`;
      if (zipUrl) URL.revokeObjectURL(zipUrl);
      zipUrl = URL.createObjectURL(zipBlob);
    } catch (e: any) {
      error = e.message || "Split failed. Check your range syntax.";
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    file = null;
    zipUrl = null;
    zipSize = 0;
    rangeInput = "";
    error = "";
  }
</script>

<svelte:head>
  <title>{toolInfo.name} - Extract PDF Pages Privately & Free Online</title>
  
  <meta name="description" content="Extract specific pages or split your PDF into multiple separate documents instantly. A 100% private, browser-based tool that ensures your sensitive files never leave your device." />
  <meta name="keywords" content="split pdf, extract pdf pages, online pdf splitter, secure pdf extraction, split pdf without upload, browser-based pdf splitter, pdf page extractor, separate pdf pages" />
  <link rel="canonical" href="https://justlocaltools.com/split-pdf" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/split-pdf" />
  <meta property="og:title" content="{toolInfo.name} - Secure & Flexible Page Extraction" />
  <meta property="og:description" content="Split your PDF files into individual pages or specific ranges privately. Fast, free, and no file uploads required for maximum document security." />

  {@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "${toolInfo.name}",
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
  <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

  <div class="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8">
    
    <main class="min-w-0">
      <div class="bg-white border border-slate-200 rounded-sm shadow-sm p-5 md:p-8">
        
        <Dropzone 
          accept=".pdf"
          multiple={false}
          hasFiles={!!file}
          onfiles={handleFiles}
          onClear={reset}
          label="Select PDF File to Split"
        />

        {#if file}
          <div class="mt-6 animate-in fade-in duration-300">
            <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-sm mb-6">
                <div class="flex items-center gap-3 min-w-0">
                    <FileText size={18} class="text-slate-400 shrink-0" />
                    <div class="flex flex-col min-w-0">
                        <span class="text-[12px] font-bold text-black truncate">{file.name}</span>
                        <div class="flex gap-2">
                            <span class="text-[9px] font-mono text-slate-400 uppercase">{pageCount} Pages</span>
                            <span class="text-[9px] font-mono text-slate-400 uppercase">{formatBytes(file.size)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-6">
                <label for="ranges" class="block font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-1">
                  <Scissors size={12}/> Define Ranges (e.g. 1-3, 5, 8-10)
                </label>
                <input 
                    id="ranges"
                    type="text" 
                    bind:value={rangeInput}
                    placeholder="e.g. 1-2, 4, 6-10"
                    class="w-full h-12 px-4 bg-white border border-slate-200 font-mono text-sm focus:border-black outline-none transition-all rounded-sm"
                />
                <p class="mt-2 text-[10px] text-slate-400 font-mono">
                    Output will be bundled into a ZIP archive.
                </p>
            </div>

            <button 
              onclick={splitAction}
              disabled={isProcessing || !rangeInput}
              class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-200 transition-all flex items-center justify-center shadow-md"
            >
              {#if isProcessing}
                <Loader2 class="animate-spin mr-2" size={16} /> Processing...
              {:else}
                Split & Export ZIP
              {/if}
            </button>
          </div>
        {/if}

        {#if zipUrl && !isProcessing}
          <div class="mt-6">
            <SuccessState 
              title="Split Complete"
              file={{ name: resultFileName, size: zipSize, url: zipUrl }}
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
  /* Thu hẹp khoảng cách typography cho SEO Content */
  :global(.prose h2) { margin-top: 1.5rem !important; }
</style>
