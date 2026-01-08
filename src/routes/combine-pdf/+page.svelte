<script lang="ts">
  // @ts-nocheck
  import { PDFDocument } from 'pdf-lib';
  import { Loader2 } from 'lucide-svelte';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
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
    if (files.length < 2) { 
      error = "Select at least 2 files.";
      return; 
    }
    isProcessing = true;
    error = "";
    mergedUrl = null;
    mergedSize = 0;

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
      error = "Merge failed. Check your files.";
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
</script>

<svelte:head>
  <title>{toolInfo.name} | JUSTLOCALTOOLS_</title>
</svelte:head>

<div class="max-w-[980px] mx-auto px-0 py-12">
  <div class="flex flex-col lg:flex-row lg:justify-between">
    
    <div class="w-full lg:w-[640px] shrink-0">
      <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

      <div class="mt-10 bg-white border border-slate-200 p-6 md:p-10 rounded-sm shadow-sm">
        <Dropzone onfiles={handleFiles} />

        {#if files.length > 0}
          <div class="mt-10 animate-in fade-in slide-in-from-bottom-2">
            <div class="flex justify-between items-end border-b border-slate-100 pb-2 mb-4">
              <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                Selected Files ({files.length})
              </span>
              <button onclick={reset} class="text-[10px] font-mono uppercase underline underline-offset-4 decoration-slate-200 hover:text-red-500 transition-colors">
                Clear All
              </button>
            </div>

            <ul class="divide-y divide-slate-50 mb-10 max-h-100 overflow-y-auto pr-2 custom-scrollbar font-mono">
              {#each files as file, i}
                <li class="py-3 flex justify-between items-center gap-4 group">
                  <div class="flex items-center gap-3 min-w-0 flex-1 pr-2">
                    <span class="text-[10px] text-slate-300 shrink-0">
                      {(i+1).toString().padStart(2,'0')}
                    </span>
                    <span class="text-[12px] text-[#1a1a1a] truncate shrink grow tracking-tighter">
                      {file.name}
                    </span>
                    <span class="text-[9px] text-slate-400 uppercase shrink-0 bg-slate-50 px-1.5 py-0.5 rounded-sm border border-slate-100">
                      {formatBytes(file.size)}
                    </span>
                  </div>
                  
                  <button 
                    onclick={() => {files = files.filter((_, idx) => idx !== i); mergedUrl = null;}} 
                    class="text-slate-300 hover:text-black p-1 cursor-pointer transition-colors shrink-0"
                  >
                    ✕
                  </button>
                </li>
              {/each}
            </ul>

            <button 
              onclick={mergeAction}
              disabled={isProcessing}
              class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] 
                     hover:bg-slate-800 disabled:bg-slate-300 transition-all flex items-center justify-center shadow-lg"
            >
              {#if isProcessing}
                <Loader2 class="animate-spin mr-2" size={16} /> Processing...
              {:else}
                Combine PDF Files
              {/if}
            </button>
            
            {#if error}
              <p class="mt-4 text-[10px] font-mono text-red-500 uppercase text-center font-bold tracking-widest">{error}</p>
            {/if}

            {#if mergedUrl && !isProcessing && mergedSize > 0}
              <SuccessState 
                type="file"
                title="Merge Success" 
                subTitle="Your PDF files have been combined locally in your browser." 
                file={{ 
                  name: resultFileName, 
                  size: mergedSize, 
                  url: mergedUrl 
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

<style>
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e8f0; }
</style>
