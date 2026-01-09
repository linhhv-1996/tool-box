<script lang="ts">
  import JSZip from 'jszip';
  import { Loader2, X, SlidersHorizontal } from 'lucide-svelte';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  import { compressImage } from '$lib/utils/image-processor';
  // @ts-ignore
  import Content from '$lib/content/shrink-images.md';

  const toolInfo = allTools.find((t) => t.id === 'shrink-images')!;
  const related = allTools.filter((t) => t.id !== 'shrink-images').slice(0, 6);

  // State Management
  let files = $state<File[]>([]);
  let isProcessing = $state(false);
  let quality = $state(75);
  let compressedImages = $state<{ url: string; name: string; oldSize: number; newSize: number }[]>([]);
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

  function handleFiles(newFiles: File[]) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const valid = newFiles.filter(f => validTypes.includes(f.type.toLowerCase()));
    files = [...files, ...valid];
    zipUrl = null;
  }

  async function compressAction() {
    if (files.length === 0) return;
    isProcessing = true;
    compressedImages = [];
    zipUrl = null;

    try {
      const zip = new JSZip();
      
      for (const file of files) {
        const compressedBlob = await compressImage(file, quality);
        const url = URL.createObjectURL(compressedBlob);
        
        compressedImages.push({
          url,
          name: file.name,
          oldSize: file.size,
          newSize: compressedBlob.size
        });

        zip.file(file.name, compressedBlob);
      }

      const zipContent = await zip.generateAsync({ type: "blob" });
      zipSize = zipContent.size;
      resultFileName = `compressed_${Date.now()}.zip`;
      zipUrl = URL.createObjectURL(zipContent);

    } catch (e) {
      console.error("Compression failed", e);
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    files = [];
    compressedImages.forEach(img => URL.revokeObjectURL(img.url));
    compressedImages = [];
    zipUrl = null;
    zipSize = 0;
  }

  function removeFile(index: number) {
    files = files.filter((_, i) => i !== index);
    zipUrl = null;
  }

  const totalSaving = $derived(
    compressedImages.reduce((acc, img) => acc + (img.oldSize - img.newSize), 0)
  );
</script>

<svelte:head>
  <title>{toolInfo.name} | Compress Images Online without Quality Loss</title>
  <meta name="description" content="Reduce image file size while maintaining high quality. Support JPG, PNG, and WebP. 100% private, browser-based compression." />
  <link rel="canonical" href="https://justlocaltools.com/shrink-images" />
</svelte:head>

<div class="max-w-[980px] mx-auto px-0 py-12">
  <div class="flex flex-col lg:flex-row lg:justify-between">
    
    <div class="w-full lg:w-[640px] shrink-0">
      <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

      <div class="mt-10 bg-white border border-slate-200 p-6 md:p-10 rounded-sm shadow-sm">
        <Dropzone onfiles={handleFiles} accept="image/jpeg,image/png,image/webp" />

        {#if files.length > 0}
          <div class="mt-10 animate-in fade-in slide-in-from-bottom-2">
            <div class="flex justify-between items-end border-b border-slate-100 pb-2 mb-4">
              <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                Selected Images ({files.length})
              </span>
              <button onclick={reset} class="text-[10px] font-mono uppercase underline underline-offset-4 decoration-slate-200 hover:text-red-500 transition-colors">
                Clear all
              </button>
            </div>

            <ul class="divide-y divide-slate-50 mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {#each files as file, i}
                <li class="py-3 flex justify-between items-center gap-4 group font-mono">
                  <div class="flex items-center gap-3 min-w-0 flex-1 pr-2">
                    <span class="text-[10px] text-slate-300 shrink-0">{(i+1).toString().padStart(2,'0')}</span>
                    <span class="text-[12px] text-[#1a1a1a] truncate grow tracking-tighter">{file.name}</span>
                    <span class="text-[9px] text-slate-400 uppercase shrink-0 bg-slate-50 px-1.5 py-0.5 rounded-sm border border-slate-100">{formatBytes(file.size)}</span>
                  </div>
                  <button onclick={() => removeFile(i)} class="text-slate-300 hover:text-black p-1 transition-colors">
                    <X size={14} />
                  </button>
                </li>
              {/each}
            </ul>

            <div class="mb-8 p-4 bg-slate-50 border border-slate-100 rounded-sm">
                <div class="flex items-center gap-2 mb-4">
                    <SlidersHorizontal size={14} class="text-slate-400" />
                    <label for="quality" class="block font-mono text-[10px] font-bold uppercase text-slate-500 tracking-widest">
                        Compression Quality: {quality}%
                    </label>
                </div>
                <input 
                    type="range" 
                    id="quality" 
                    min="1" 
                    max="100" 
                    bind:value={quality}
                    class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <div class="flex justify-between mt-2 font-mono text-[9px] text-slate-400 uppercase">
                    <span>Small size</span>
                    <span>Best quality</span>
                </div>
            </div>

            <button 
              onclick={compressAction}
              disabled={isProcessing}
              class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] 
                     hover:bg-slate-800 disabled:bg-slate-300 transition-all flex items-center justify-center shadow-lg"
            >
              {#if isProcessing}
                <Loader2 class="animate-spin mr-2" size={16} /> Processing...
              {:else}
                Compress {files.length} {files.length > 1 ? 'Images' : 'Image'}
              {/if}
            </button>

            {#if zipUrl && !isProcessing}
              <SuccessState 
                type="preview"
                title="Compression Complete" 
                subTitle="Saved {formatBytes(totalSaving)} in total. Your images are ready." 
                file={{ name: resultFileName, size: zipSize, url: zipUrl }}
                previews={compressedImages.map(img => ({ 
                    url: img.url, 
                    label: `${formatBytes(img.newSize)} (-${Math.round((1 - img.newSize/img.oldSize)*100)}%)` 
                }))}
                onReset={reset}
                mainActionLabel="Download All (ZIP)"
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
        <h3 class="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6 pb-2 border-b border-slate-100">
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
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f8fafc;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
</style>
