<script lang="ts">
  // @ts-nocheck
  import * as pdfjs from 'pdfjs-dist';
  import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
  import JSZip from 'jszip';
  import { Download, Check, Loader2 } from 'lucide-svelte';
  
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import Content from '$lib/content/pdf-to-image.md';

  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

  const toolInfo = allTools.find((t) => t.id === 'pdf-to-image')!;
  const related = allTools.filter((t) => t.id !== 'pdf-to-image').slice(0, 6);

  let file = $state<File | null>(null);
  let isProcessing = $state(false);
  let progress = $state(0);
  let totalPages = $state(0);
  let images = $state<{url: string, page: number}[]>([]);
  let format = $state("png");
  let scale = $state(2);

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  async function handleFiles(newFiles: File[]) {
    const pdf = newFiles.find((f) => f.type === "application/pdf");
    if (!pdf) return;
    
    file = pdf;
    images = [];
    progress = 0;
    
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    totalPages = pdfDoc.numPages;
  }

  async function convertAction() {
    if (!file) return;
    isProcessing = true;
    images = []; 

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

      for (let i = 1; i <= totalPages; i++) {
        progress = Math.round((i / totalPages) * 100);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        images.push({ 
          url: canvas.toDataURL(`image/${format}`, 0.9), 
          page: i 
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      isProcessing = false;
    }
  }

  async function downloadZip() {
    const zip = new JSZip();
    images.forEach((img) => {
      const base64Data = img.url.split(',')[1];
      zip.file(`page-${img.page}.${format}`, base64Data, {base64: true});
    });
    const content = await zip.generateAsync({type: "blob"});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${file.name.replace('.pdf', '')}_images.zip`;
    link.click();
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
          <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">Selected Document</span>
          <button onclick={() => {file = null; images = [];}} class="text-[10px] font-mono uppercase hover:text-black cursor-pointer underline underline-offset-4 decoration-slate-200">Remove</button>
        </div>

        <div class="py-3 flex justify-between items-center gap-4 font-mono border-b border-slate-50 mb-10">
            <div class="flex items-center gap-3 min-w-0 flex-1">
                <span class="text-[12px] text-[#1a1a1a] truncate max-w-[150px] sm:max-w-[300px] md:max-w-[450px] font-bold shrink grow-0" title={file.name}>
                    {file.name}
                </span>
                <span class="text-[9px] text-slate-400 uppercase bg-slate-50 px-1.5 py-0.5 rounded-sm border border-slate-100 whitespace-nowrap">{formatBytes(file.size)}</span>
                <span class="text-[9px] text-black font-bold uppercase bg-slate-100 px-1.5 py-0.5 rounded-sm border border-slate-200 whitespace-nowrap">{totalPages} Pages</span>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <label class="block font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-3">Format</label>
            <div class="flex gap-2">
              {#each ['png', 'jpeg'] as f}
                <button 
                  onclick={() => format = f} 
                  class="flex-1 py-3 border font-mono text-[11px] uppercase transition-all {format === f ? 'border-black bg-black text-white' : 'border-slate-200 text-slate-400 hover:border-slate-400'}"
                >
                  {f === 'jpeg' ? 'JPG' : 'PNG'}
                </button>
              {/each}
            </div>
          </div>
          <div>
            <label class="block font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-3">DPI / Quality</label>
            <div class="flex gap-2">
              {#each [1, 2, 3] as s}
                <button 
                  onclick={() => scale = s} 
                  class="flex-1 py-3 border font-mono text-[11px] transition-all {scale === s ? 'border-black bg-black text-white' : 'border-slate-200 text-slate-400 hover:border-slate-400'}"
                >
                  {s}x
                </button>
              {/each}
            </div>
          </div>
        </div>

        <button 
          onclick={convertAction} 
          disabled={isProcessing} 
          class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-400 transition-all flex items-center justify-center"
        >
          {#if isProcessing} 
            <Loader2 class="animate-spin mr-2" size={14} /> 
            Rendering {progress}%... 
          {:else} 
            {images.length > 0 ? 'Convert Again' : 'Convert PDF to Images'} 
          {/if}
        </button>

        {#if images.length > 0 && !isProcessing}
          <div class="mt-12 p-8 border border-slate-100 bg-slate-50/30 rounded-sm flex flex-col items-center animate-in fade-in slide-in-from-bottom-2">
            <div class="w-10 h-10 bg-[#22c55e] text-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Check size={20} />
            </div>
            <h4 class="text-md font-bold text-black mb-1">Conversion Successful</h4>
            <p class="text-[12px] text-slate-500 font-mono mb-6">{images.length} pages are ready</p>
            
            <button 
              onclick={downloadZip} 
              class="inline-flex items-center gap-3 bg-[#22c55e] text-white px-12 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#16a34a] cursor-pointer transition-all shadow-md active:scale-[0.98]"
            >
              <Download size={14} /> Download All (.ZIP)
            </button>
          </div>

          <div class="mt-12 border-t border-slate-100 pt-8">
            <div class="flex justify-between items-center mb-6">
                <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">Preview Pages</span>
                <span class="font-mono text-[9px] text-slate-400 uppercase">Scroll to view all</span>
            </div>
            
            <div class="max-h-95 overflow-y-auto pr-2 custom-scrollbar border border-slate-50 p-4 bg-slate-50/20">
                <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                    {#each images as img}
                    <div class="group relative aspect-3/4 bg-white border border-slate-200 overflow-hidden hover:border-black transition-all shadow-sm">
                        <img src={img.url} alt="P{img.page}" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <a href={img.url} download="p{img.page}.{format}" class="text-white hover:scale-110 transition-transform">
                                <Download size={12} />
                            </a>
                        </div>
                        <div class="absolute bottom-0 left-0 bg-white/90 text-[8px] font-mono px-1 border-t border-r border-slate-100 min-w-[18px] text-center">
                            {img.page}
                        </div>
                    </div>
                    {/each}
                </div>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <article class="prose mt-24 border-t border-slate-100 pt-16 mx-auto">
    <Content />
  </article>

  <div class="mt-24 border-t border-slate-100 pt-16 pb-20">
    <h3 class="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-10 pb-2 border-b border-slate-50">Related Tools</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
      {#each related as r}
        <a href={r.href} class="group block">
          <span class="font-bold block group-hover:underline text-[#1a1a1a] transition-all underline-offset-2">{r.name}</span>
          <span class="text-[11px] text-slate-400 font-mono uppercase mt-0.5 block">{r.desc}</span>
        </a>
      {/each}
    </div>
  </div>
</div>

<style>
    /* CSS để thanh scroll nhìn mượt hơn, đồng bộ với style mono */
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #f8fafc;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #e2e8f0;
        border-radius: 2px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
    }
</style>
