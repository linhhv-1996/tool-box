<script lang="ts">
  // @ts-nocheck
  // import * as pdfjs from 'pdfjs-dist';
  // import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

  import JSZip from 'jszip';
  import { Loader2 } from 'lucide-svelte';
  
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  // @ts-ignore
  import Content from '$lib/content/pdf-to-image.md';

  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let pdfjs: any = $state(null);

  onMount(async () => {
    if (browser) {
      // Load thư viện động chỉ ở phía client
      pdfjs = await import('pdfjs-dist');
      const worker = await import('pdfjs-dist/build/pdf.worker.mjs?url');
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    }
  });

  // pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  const toolInfo = allTools.find((t) => t.id === 'pdf-to-image')!;
  const related = allTools.filter((t) => t.id !== 'pdf-to-image').slice(0, 6);

  let file = $state<File | null>(null);
  let isProcessing = $state(false);
  let progress = $state(0);
  let totalPages = $state(0);
  let images = $state<{url: string, page: number}[]>([]);
  let format = $state("png");
  let scale = $state(2);
  
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
    
    reset();
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
        images.push({ url: dataUrl, page: i });
        const base64Data = dataUrl.split(',')[1];
        zip.file(`page-${i}.${format}`, base64Data, {base64: true});
      }

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
  <title>Free PDF to Image Converter - High Quality JPG & PNG</title>
  <meta name="description" content="Convert PDF pages into high-quality JPG or PNG images instantly. No file size limits, no server uploads. Your privacy is our priority." />
  <meta property="og:title" content="PDF to Image Converter - JustLocalTools" />
  <meta property="og:description" content="Convert PDF pages to images privately. Choose between JPG or PNG output directly on your device." />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF to Image Converter",
    "url": "https://justlocaltools.com/pdf-to-image",
    "description": "Convert PDF pages into JPG or PNG images locally in your browser.",
    "applicationCategory": "MultimediaApplication",
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
                Selected Document
              </span>
              <button onclick={reset} class="text-[10px] font-mono uppercase underline underline-offset-4 decoration-slate-200 hover:text-red-500 transition-colors">
                Remove
              </button>
            </div>

            <div class="py-3 flex justify-between items-center gap-4 font-mono border-b border-slate-50 mb-10">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                    <span class="text-[12px] text-[#1a1a1a] truncate font-bold shrink grow-0" title={file.name}>
                        {file.name}
                    </span>
                    <span class="text-[9px] text-slate-400 uppercase bg-slate-50 px-1.5 py-0.5 rounded-sm border border-slate-100 whitespace-nowrap">
                        {formatBytes(file.size)}
                    </span>
                    <span class="text-[9px] text-black font-bold uppercase bg-slate-100 px-1.5 py-0.5 rounded-sm border border-slate-200 whitespace-nowrap">
                        {totalPages} Pages
                    </span>
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
              class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] 
                     hover:bg-slate-800 disabled:bg-slate-300 transition-all flex items-center justify-center shadow-lg"
            >
              {#if isProcessing} 
                <Loader2 class="animate-spin mr-2" size={16} /> Rendering {progress}%... 
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
