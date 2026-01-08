<script lang="ts">
  // @ts-nocheck
  import { PDFDocument } from 'pdf-lib';
  import JSZip from 'jszip';
  import { Loader2 } from 'lucide-svelte';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  // @ts-ignore
  import Content from '$lib/content/split-pdf.md';

  const toolInfo = allTools.find((t) => t.id === 'split-pdf')!;
  const related = allTools.filter((t) => t.id !== 'split-pdf').slice(0, 6);

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
  <title>Split PDF Online - Extract Pages Privately & Free</title>
  <meta name="description" content="Extract specific pages or split your PDF into multiple documents instantly. Completely local tool ensures your data stays on your device." />
  <meta property="og:title" content="Split PDF Online - JustLocalTools" />
  <meta property="og:description" content="Split PDF files and extract pages privately. Fast, free, and no file uploads required." />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Split PDF",
    "url": "https://justlocaltools.com/split-pdf",
    "description": "Extract or split pages from a PDF file locally in your browser.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  }
  </script>
</svelte:head>

<div class="max-w-[980px] mx-auto px-0 py-12">
  <div class="flex flex-col lg:flex-row lg:justify-between">
    
    <div class="w-full lg:w-[640px] shrink-0">
      <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

      <div class="mt-10 bg-white border border-slate-200 p-6 md:p-10 rounded-sm shadow-sm">
        <Dropzone onfiles={handleFiles} multiple={false} />

        {#if file}
          <div class="mt-10 animate-in fade-in slide-in-from-bottom-2">
            <div class="flex justify-between items-end border-b border-slate-100 pb-2 mb-4">
              <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                Selected File
              </span>
              <button onclick={reset} class="text-[10px] font-mono uppercase underline underline-offset-4 decoration-slate-200 hover:text-red-500 transition-colors">
                Clear
              </button>
            </div>

            <div class="py-3 flex justify-between items-center gap-4 font-mono border-b border-slate-50 mb-8">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                    <span class="text-[12px] text-[#1a1a1a] truncate font-bold shrink grow-0">{file.name}</span>
                    <div class="flex gap-2 shrink-0">
                      <span class="text-[9px] text-slate-400 uppercase bg-slate-50 px-1.5 py-0.5 rounded-sm border border-slate-100 whitespace-nowrap">{pageCount} Pages</span>
                      <span class="text-[9px] text-slate-400 uppercase bg-slate-50 px-1.5 py-0.5 rounded-sm border border-slate-100 whitespace-nowrap">{formatBytes(file.size)}</span>
                    </div>
                </div>
            </div>

            <div class="mb-8">
                <label for="ranges" class="block font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2">
                  Define Ranges (e.g. 1-3, 5, 8-10)
                </label>
                <div class="relative">
                    <input 
                        id="ranges"
                        type="text" 
                        bind:value={rangeInput}
                        placeholder="e.g. 1-2, 4, 6-10"
                        class="w-full h-11 px-4 bg-white border border-slate-200 font-mono text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all rounded-sm placeholder:text-slate-300"
                    />
                </div>
                <p class="mt-2 text-[10px] text-slate-400 font-mono italic">
                    Separate output PDFs will be generated for each range and bundled into a ZIP.
                </p>
            </div>

            <button 
              onclick={splitAction}
              disabled={isProcessing || !rangeInput}
              class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] 
                     hover:bg-slate-800 disabled:bg-slate-300 transition-all flex items-center justify-center shadow-lg"
            >
              {#if isProcessing}
                <Loader2 class="animate-spin mr-2" size={16} /> Processing...
              {:else}
                Split & Export ZIP
              {/if}
            </button>
            
            {#if error}
              <p class="mt-4 text-[10px] font-mono text-red-500 uppercase text-center font-bold tracking-widest">{error}</p>
            {/if}

            {#if zipUrl && !isProcessing && zipSize > 0}
              <SuccessState 
                type="file"
                title="Split Complete" 
                subTitle="Your PDF has been split into multiple files and bundled into a ZIP archive." 
                file={{ 
                  name: resultFileName, 
                  size: zipSize, 
                  url: zipUrl 
                }}
                onReset={reset}
              />
            {/if}
          </div>
        {/if}
      </div>

      <article class="prose mt-16 border-t border-slate-100 pt-12">
        <Content />
      </article>
    </div>

    <aside class="w-full lg:w-[310px] shrink-0 mt-16 lg:mt-0">
      <div class="sticky top-8">
        <h3 class="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 pb-2 border-b border-slate-100">
          Related Tools
        </h3>
        <div class="flex flex-col gap-y-6">
          {#each related as r}
            <a href={r.href} class="group block">
              <span class="font-bold block group-hover:underline text-[#1a1a1a] transition-all underline-offset-2 leading-tight">{r.name}</span>
              <span class="text-[10px] text-slate-400 font-mono uppercase mt-1 block line-clamp-2 leading-relaxed">{r.desc}</span>
            </a>
          {/each}
        </div>
      </div>
    </aside>

  </div>
</div>
