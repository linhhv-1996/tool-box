<script lang="ts">
  // @ts-nocheck
  import { Loader2, Image as ImageIcon, Trash2, FileImage, AlertCircle, Settings2 } from 'lucide-svelte';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  import Content from '$lib/content/heic-to-jpg.md';
  import { browser } from '$app/environment';
  import JSZip from 'jszip';

  const toolInfo = allTools.find((t) => t.id === 'heic-to-jpg')!;
  const related = allTools.filter((t) => t.id !== 'heic-to-jpg' && t.id !== 'image-to-pdf').slice(0, 5);

  // --- STATE ---
  let files = $state<File[]>([]);
  let isProcessing = $state(false);
  let progress = $state({ current: 0, total: 0 });
  let error = $state("");
  let resultUrl = $state<string | null>(null);
  let resultFileName = $state("");
  let resultSize = $state(0);
  
  // Thêm lựa chọn định dạng, mặc định là jpeg (JPG)
  let outputFormat = $state("jpeg");

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function handleFiles(newFiles: File[]) {
    error = "";
    resultUrl = null;
    const validFiles = newFiles.filter(f => 
      f.name.toLowerCase().endsWith('.heic') || f.name.toLowerCase().endsWith('.heif')
    );
    
    if (validFiles.length === 0) {
      error = "Please select valid HEIC/HEIF files.";
      return;
    }
    files = [...files, ...validFiles];
  }

  async function convertAction() {
    if (files.length === 0 || !browser) return;
    isProcessing = true;
    error = "";
    progress = { current: 0, total: files.length };
    
    try {
      const heic2any = (await import('heic2any')).default;
      const zip = new JSZip();
      const ext = outputFormat === 'jpeg' ? 'jpg' : 'png';

      for (const file of files) {
        progress.current++;
        // Chuyển đổi HEIC sang định dạng đã chọn
        const convertedBlob = await heic2any({
          blob: file,
          toType: `image/${outputFormat}`,
          quality: 0.9
        });

        if (files.length === 1) {
          resultSize = convertedBlob.size;
          resultFileName = `${file.name.split('.')[0]}.${ext}`;
          if (resultUrl) URL.revokeObjectURL(resultUrl);
          resultUrl = URL.createObjectURL(convertedBlob);
        } else {
          zip.file(`${file.name.split('.')[0]}.${ext}`, convertedBlob);
        }
      }

      if (files.length > 1) {
        const zipContent = await zip.generateAsync({ type: "blob" });
        resultSize = zipContent.size;
        resultFileName = `converted_images_${Date.now()}.zip`;
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        resultUrl = URL.createObjectURL(zipContent);
      }
    } catch (e) {
      console.error(e);
      error = "Conversion failed. Some HEIC files might be corrupted.";
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    files = [];
    resultUrl = null;
    resultSize = 0;
    error = "";
    progress = { current: 0, total: 0 };
  }

  function removeFile(index: number) {
    files = files.filter((_, i) => i !== index);
    resultUrl = null;
    if (files.length === 0) reset();
  }
</script>

<svelte:head>
  <title>{toolInfo.name} | Convert HEIC to JPG/PNG Online & Offline</title>
  
  <meta name="description" content="Convert iPhone HEIC photos to JPG or PNG directly in your browser. 100% private, client-side processing - your images never leave your device." />
  <meta name="keywords" content="heic to jpg, convert heic to png, apple photo converter, iphone images to jpeg, browser-based heic converter, bulk heic conversion" />
  <link rel="canonical" href="https://justlocaltools.com/heic-to-jpg" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/heic-to-jpg" />
  <meta property="og:title" content="{toolInfo.name} - Private & Fast Conversion" />
  <meta property="og:description" content="Securely convert your HEIC photos to JPG or PNG format without uploading to any server." />

  {@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "${toolInfo.name}",
      "operatingSystem": "Any",
      "applicationCategory": "MultimediaApplication",
      "description": "A browser-based tool to convert HEIC images to JPG or PNG format locally.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  </script>`}
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-6 md:py-10 text-left">
  <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

  <div class="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8">
    <main class="min-w-0">
      <div class="bg-white border border-slate-200 rounded-sm shadow-sm p-5 md:p-8">
        
        <Dropzone 
          onfiles={handleFiles} 
          hasFiles={files.length > 0} 
          onClear={reset} 
          accept=".heic,.heif"
          multiple={true}
          label="Select HEIC/HEIF files"
        />

        {#if files.length > 0}
          <div class="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div class="mb-6 border border-slate-100 rounded-sm overflow-hidden bg-slate-50/50">
              <div class="px-4 py-2 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                <span class="text-[10px] font-mono font-bold text-slate-500 uppercase">Queue ({files.length})</span>
              </div>
              <ul class="divide-y divide-slate-100 max-h-[200px] overflow-y-auto custom-scrollbar">
                {#each files as f, i}
                  <li class="px-4 py-2.5 flex items-center justify-between gap-3 bg-white group hover:bg-slate-50 transition-colors">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                      <FileImage size={14} class="text-slate-300 shrink-0" />
                      <span class="text-[12px] font-medium text-black truncate block leading-tight" title={f.name}>
                        {f.name}
                      </span>
                    </div>
                    <div class="flex items-center gap-3 shrink-0 ml-2">
                      <span class="text-[9px] font-mono text-slate-400 uppercase whitespace-nowrap bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                        {formatBytes(f.size)}
                      </span>
                      <button onclick={() => removeFile(i)} 
                        class="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-100 transition-all rounded-sm shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                {/each}
              </ul>
            </div>

            <div class="bg-slate-50/50 p-5 border border-slate-100 rounded-sm mb-6">
              <label class="block font-mono text-[10px] font-bold uppercase text-slate-500 mb-3 tracking-widest">Output Format</label>
              <div class="flex gap-2">
                {#each ['jpeg', 'png'] as f}
                  <button 
                    onclick={() => outputFormat = f} 
                    class="flex-1 py-2 border font-mono text-[10px] uppercase transition-all {outputFormat === f ? 'border-black bg-black text-white' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-400 rounded-sm'}"
                  >
                    {f === 'jpeg' ? 'JPG' : 'PNG'}
                  </button>
                {/each}
              </div>
            </div>

            <button 
              onclick={convertAction}
              disabled={isProcessing}
              class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:bg-slate-200 transition-all flex items-center justify-center shadow-lg"
            >
              {#if isProcessing}
                <Loader2 class="animate-spin mr-2" size={16} /> 
                Converting {progress.current}/{progress.total}...
              {:else}
                <ImageIcon size={14} class="mr-2" /> Convert to {outputFormat === 'jpeg' ? 'JPG' : 'PNG'}
              {/if}
            </button>

            {#if resultUrl && !isProcessing}
              <div class="mt-6 animate-in fade-in zoom-in-95 duration-500">
                <SuccessState 
                  title="Conversion Complete" 
                  file={{ 
                    name: resultFileName, 
                    size: resultSize, 
                    url: resultUrl 
                  }}
                  onReset={reset}
                />
                
                <!-- <div class="mt-6 p-5 bg-slate-50 border border-slate-100 rounded-sm text-center">
                    <p class="text-[9px] font-mono text-slate-400 uppercase mb-3 tracking-widest">Sponsored Content</p>
                    <div class="h-16 flex items-center justify-center text-blue-600 font-bold text-sm cursor-pointer hover:underline decoration-blue-200">
                        [ Demo: Professional Image Optimizer - Try for free ]
                    </div>
                </div> -->

              </div>
            {/if}
          </div>
        {/if}

        {#if error}
          <div class="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-mono font-bold uppercase flex items-center gap-2">
            <AlertCircle size={14} /> {error}
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
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>
