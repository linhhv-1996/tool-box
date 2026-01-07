<script lang="ts">
  // @ts-nocheck
  import { PDFDocument } from 'pdf-lib';
  import JSZip from 'jszip';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
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
      if (zipUrl) URL.revokeObjectURL(zipUrl);
      zipUrl = URL.createObjectURL(zipBlob);
      zipSize = zipBlob.size;
      resultFileName = `split_${Date.now()}.zip`;
    } catch (e: any) {
      error = e.message || "Split failed. Check your range syntax.";
    } finally {
      isProcessing = false;
    }
  }
</script>

<svelte:head>
  <title>{toolInfo.name} | JUSTLOCALTOOLS_</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-12">
  <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

  <div class="mt-10 bg-white border border-slate-200 p-6 md:p-10 rounded-sm shadow-sm">
    <Dropzone onfiles={handleFiles} multiple={false} />

    {#if file}
      <div class="mt-10 animate-in fade-in slide-in-from-bottom-2">
        <div class="flex justify-between items-end border-b border-slate-100 pb-2 mb-4">
          <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">Selected File</span>
          <button onclick={() => {file = null; zipUrl = null;}} class="text-[10px] font-mono uppercase hover:text-black cursor-pointer underline underline-offset-4 decoration-slate-200">Clear</button>
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
                 hover:bg-slate-800 active:bg-slate-900 cursor-pointer
                 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {#if isProcessing}
            <span class="animate-pulse">Processing...</span>
          {:else}
            Split & Export ZIP
          {/if}
        </button>
        
        {#if error}
           <p class="mt-4 text-[10px] font-mono text-red-500 uppercase text-center font-bold tracking-widest">{error}</p>
        {/if}

        {#if zipUrl && !isProcessing}
          <div class="mt-12 p-8 border border-slate-100 bg-slate-50/30 rounded-sm flex flex-col items-center animate-in fade-in slide-in-from-bottom-2">
            <div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center mb-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h4 class="text-md font-bold text-black mb-1">Success</h4>
            <div class="flex items-center gap-3 mb-6">
               <p class="text-[12px] text-slate-500 font-mono truncate max-w-[250px]">{resultFileName}</p>
               <span class="font-mono text-[11px] font-bold text-black bg-white border border-slate-200 px-2 py-0.5 rounded-sm">{formatBytes(zipSize)}</span>
            </div>
            
            <a 
              href={zipUrl} 
              download={resultFileName}
              class="inline-flex items-center gap-3 bg-[#22c55e] text-white px-12 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] 
                     hover:bg-[#16a34a] cursor-pointer transition-all shadow-md active:scale-[0.98]"
            >
              Download ZIP
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            </a>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <article class="prose mt-24 border-t border-slate-100 pt-16 mx-auto">
    <Content />
  </article>

  <div class="mt-24 border-t border-slate-100 pt-16 pb-20">
    <h3 class="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-10 pb-2 border-b border-slate-50">
      Related Tools
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
      {#each related as r}
        <div class="font-sans">
          <a href={r.href} class="group block">
            <span class="font-bold block group-hover:underline text-[#1a1a1a] transition-all underline-offset-2 tracking-tight">{r.name}</span>
            <span class="text-[11px] text-slate-400 font-mono uppercase tracking-tight mt-0.5 block">{r.desc}</span>
          </a>
        </div>
      {/each}
    </div>
  </div>
</div>
