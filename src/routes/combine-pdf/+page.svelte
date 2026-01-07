<script lang="ts">
    // @ts-nocheck
  import { PDFDocument } from 'pdf-lib';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  // @ts-ignore
  import Content from '$lib/content/combine-pdf.md';

  const toolInfo = allTools.find(t => t.id === 'combine-pdf')!;
  const related = allTools.filter(t => t.id !== 'combine-pdf').slice(0, 6);

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
    if (files.length < 2) { error = "Select at least 2 files."; return; }
    isProcessing = true;
    error = "";
    
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(p => mergedPdf.addPage(p));
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      if (mergedUrl) URL.revokeObjectURL(mergedUrl);
      mergedUrl = URL.createObjectURL(blob);
      mergedSize = blob.size;
      resultFileName = `combined_${Date.now()}.pdf`;
      
    } catch (e) {
      error = "Merge failed. Check your files.";
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
    <Dropzone onfiles={handleFiles} />

    {#if files.length > 0}
      <div class="mt-10">
        <div class="flex justify-between items-end border-b border-slate-100 pb-2 mb-4">
          <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">Selected Files ({files.length})</span>
          <button onclick={() => {files = []; mergedUrl = null;}} class="text-[10px] font-mono uppercase hover:text-black cursor-pointer underline underline-offset-4 decoration-slate-200">Clear All</button>
        </div>

        <ul class="divide-y divide-slate-50 mb-10 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
          {#each files as file, i}
            <li class="py-3 flex justify-between items-center gap-4 group">
              <div class="flex items-center gap-3 min-w-0 flex-1 pr-2">
                <span class="font-mono text-[10px] text-slate-300 shrink-0">{(i+1).toString().padStart(2,'0')}</span>
                <span class="text-sm font-medium text-[#1a1a1a] truncate shrink grow">
                  {file.name}
                </span>
                <span class="font-mono text-[9px] text-slate-400 uppercase italic shrink-0 bg-slate-50 px-1.5 py-0.5 rounded-sm">
                  {formatBytes(file.size)}
                </span>
              </div>
              <button onclick={() => {files = files.filter((_, idx) => idx !== i); mergedUrl = null;}} class="text-slate-300 hover:text-red-500 p-1 cursor-pointer transition-colors shrink-0">✕</button>
            </li>
          {/each}
        </ul>

        <button 
          onclick={mergeAction}
          disabled={isProcessing}
          class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] 
                 hover:bg-slate-800 active:bg-slate-900 cursor-pointer
                 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {#if isProcessing}
            <span class="animate-pulse">Processing...</span>
          {:else}
            Combine PDF Files
          {/if}
        </button>
        
        {#if error}
           <p class="mt-4 text-[10px] font-mono text-red-500 uppercase text-center font-bold tracking-widest">{error}</p>
        {/if}

        {#if mergedUrl && !isProcessing}
          <div class="mt-12 p-8 border border-slate-100 bg-slate-50/30 rounded-sm flex flex-col items-center animate-in fade-in slide-in-from-bottom-2">
            <div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center mb-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h4 class="text-md font-bold text-black mb-1">Success</h4>
            <div class="flex items-center gap-3 mb-6">
               <p class="text-[12px] text-slate-500 font-mono truncate max-w-62.5">{resultFileName}</p>
               <span class="font-mono text-[11px] font-bold text-black bg-white border border-slate-200 px-2 py-0.5 rounded-sm">{formatBytes(mergedSize)}</span>
            </div>
            
            <a 
              href={mergedUrl} 
              download={resultFileName}
              class="inline-flex items-center gap-3 bg-[#22c55e] text-white px-12 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] 
                     hover:bg-[#16a34a] cursor-pointer transition-all shadow-md active:scale-[0.98]"
            >
              Download PDF
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

<style>
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e8f0; }
</style>
