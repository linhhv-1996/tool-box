<script lang="ts">
  // @ts-nocheck
  import JSZip from 'jszip';
  import { Loader2, FileText, Image as ImageIcon, Settings2 } from 'lucide-svelte';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  import Content from '$lib/content/pdf-to-image.md';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // --- LOGIC GỐC (GIỮ NGUYÊN) ---
  let pdfjs: any = $state(null);
  onMount(async () => {
    if (browser) {
      pdfjs = await import('pdfjs-dist');
      const worker = await import('pdfjs-dist/build/pdf.worker.mjs?url');
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    }
  });

  const toolInfo = allTools.find((t) => t.id === 'pdf-to-image')!;
  const related = allTools.filter((t) => t.id !== 'pdf-to-image').slice(0, 5);

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
  <title>{toolInfo.name} - High-Quality PDF to JPG/PNG Online & Offline</title>
  
  <meta name="description" content="Convert PDF pages into high-quality JPG or PNG images directly in your browser. 100% private with client-side rendering—no file uploads, no limits, and no waiting." />
  <meta name="keywords" content="pdf to image, convert pdf to jpg, pdf to png converter, high resolution pdf to image, browser-based pdf renderer, secure pdf conversion, extract images from pdf" />
  <link rel="canonical" href="https://justlocaltools.com/pdf-to-image" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/pdf-to-image" />
  <meta property="og:title" content="{toolInfo.name} - 100% Secure & High Resolution" />
  <meta property="og:description" content="Extract sharp images from your PDF pages privately. Choose between JPG or PNG with adjustable resolution (up to 3x scale) without uploading any data." />

  {@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "${toolInfo.name}",
      "operatingSystem": "Any",
      "applicationCategory": "MultimediaApplication",
      "description": "A secure browser-based tool to render and convert PDF pages into high-resolution JPG or PNG images locally.",
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
          label="Select PDF File to Convert"
        />

        {#if file}
          <div class="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div class="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-sm mb-6">
              <div class="flex items-center gap-3 min-w-0">
                <FileText size={18} class="text-slate-400" />
                <div class="flex flex-col min-w-0">
                  <span class="text-[12px] font-bold text-black truncate leading-tight">{file.name}</span>
                  <span class="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                    {formatBytes(file.size)} • {totalPages} Pages
                  </span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div class="bg-slate-50/50 p-4 border border-slate-100 rounded-sm">
                <label class="block font-mono text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest">Format</label>
                <div class="flex gap-2">
                  {#each ['png', 'jpeg'] as f}
                    <button 
                      onclick={() => format = f} 
                      class="flex-1 py-2 border font-mono text-[10px] uppercase transition-all {format === f ? 'border-black bg-black text-white' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-400'}"
                    >
                      {f === 'jpeg' ? 'JPG' : 'PNG'}
                    </button>
                  {/each}
                </div>
              </div>
              <div class="bg-slate-50/50 p-4 border border-slate-100 rounded-sm">
                <label class="block font-mono text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest">Quality (DPI)</label>
                <div class="flex gap-2">
                  {#each [1, 2, 3] as s}
                    <button 
                      onclick={() => scale = s} 
                      class="flex-1 py-2 border font-mono text-[10px] transition-all {scale === s ? 'border-black bg-black text-white' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-400'}"
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
              class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:bg-slate-200 transition-all flex items-center justify-center shadow-lg"
            >
              {#if isProcessing} 
                <Loader2 class="animate-spin mr-2" size={16} /> Rendering {progress}%... 
              {:else} 
                <ImageIcon size={16} class="mr-2" /> 
                {images.length > 0 ? 'Convert Again' : 'Convert PDF to Images'} 
              {/if}
            </button>
          </div>
        {/if}

        {#if zipUrl && !isProcessing}
          <div class="mt-6 animate-in fade-in zoom-in-95 duration-500">
            <SuccessState 
              title="Conversion Done" 
              file={{ name: resultFileName, size: zipSize, url: zipUrl }}
              onReset={reset}
            />
            
            
          </div>
        {/if}
      </div>

      <article class="prose max-w-none pt-10 border-t border-slate-100 text-left">
        <Content />
      </article>
    </main>

    <aside>
      <div class="sticky top-6 space-y-8">

        <div class="bg-white border border-slate-100 p-5 rounded-sm shadow-sm">
          <h3 class="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-50 text-left">Related Tools</h3>
          <div class="space-y-4 text-left">
            {#each related as r}
              <a href={r.href} class="group block">
                <span class="text-xs font-bold block group-hover:text-black text-slate-700 transition-colors underline-offset-2 group-hover:underline leading-tight">{r.name}</span>
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
  :global(.prose h2) { margin-top: 1.5rem !important; }
</style>
