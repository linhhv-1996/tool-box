<script lang="ts">
  // @ts-nocheck
  import * as pdfjs from 'pdfjs-dist';
  import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
  import JSZip from 'jszip';
  import { Download, Check, Loader2, RotateCcw } from 'lucide-svelte';
  
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte'; //
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

  // State mới cho SuccessState
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
    const pdf = newFiles.find((f) => f.type === "application/pdf");
    if (!pdf) return;
    
    reset(); // Xóa dữ liệu cũ khi chọn file mới
    file = pdf;
    
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    totalPages = pdfDoc.numPages;
  }

  async function convertAction() {
    if (!file) return;
    isProcessing = true;
    images = [];
    zipUrl = null;
    zipSize = 0;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const zip = new JSZip();

      for (let i = 1; i <= totalPages; i++) {
        progress = Math.round((i / totalPages) * 100);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        
        const dataUrl = canvas.toDataURL(`image/${format}`, 0.9);
        images.push({ 
          url: dataUrl, 
          page: i 
        });

        // Thêm vào ZIP ngay trong quá trình convert
        const base64Data = dataUrl.split(',')[1];
        zip.file(`page-${i}.${format}`, base64Data, {base64: true});
      }

      // Tạo file ZIP kết quả
      const content = await zip.generateAsync({type: "blob"});
      zipSize = content.size;
      resultFileName = `${file.name.replace('.pdf', '')}_images.zip`;
      zipUrl = URL.createObjectURL(content);

    } catch (e) {
      console.error(e);
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    file = null;
    images = [];
    zipUrl = null;
    zipSize = 0;
    progress = 0;
    totalPages = 0;
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
          <button onclick={reset} class="text-[10px] font-mono uppercase hover:text-black cursor-pointer underline underline-offset-4 decoration-slate-200">Remove</button>
        </div>

        <div class="py-3 flex justify-between items-center gap-4 font-mono border-b border-slate-50 mb-10">
            <div class="flex items-center gap-3 min-w-0 flex-1">
                <span class="text-[12px] text-[#1a1a1a] truncate font-bold shrink grow-0" title={file.name}>
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

        {#if zipUrl && !isProcessing}
        <SuccessState 
          type="preview" 
          title="Conversion Successful" 
          subTitle="{images.length} pages are ready as high-quality images." 
          file={{ 
            name: resultFileName, 
            size: zipSize, 
            url: zipUrl 
          }}
          previews={images.map(img => ({ url: img.url, label: `Page ${img.page}` }))}
          mainActionLabel="Download ZIP"
          onReset={reset}
        />
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
    .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>
