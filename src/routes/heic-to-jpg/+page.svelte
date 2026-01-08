<script lang="ts">
  // @ts-nocheck
  import heic2any from 'heic2any';
  import JSZip from 'jszip';
  import { Loader2, X } from 'lucide-svelte';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  // @ts-ignore
  import Content from '$lib/content/heic-to-jpg.md';

  const toolInfo = allTools.find((t) => t.id === 'heic-to-jpg')!;
  const related = allTools.filter((t) => t.id !== 'heic-to-jpg').slice(0, 6);

  let files = $state<File[]>([]);
  let isProcessing = $state(false);
  let convertedImages = $state<{ url: string; name: string }[]>([]);
  let format = $state("jpeg"); // Mặc định là jpeg (JPG)
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
    const valid = newFiles.filter(f => f.name.toLowerCase().endsWith('.heic') || f.name.toLowerCase().endsWith('.heif'));
    files = [...files, ...valid];
    zipUrl = null;
  }

  async function convertAction() {
    if (files.length === 0) return;
    isProcessing = true;
    convertedImages = [];
    zipUrl = null;

    try {
      const zip = new JSZip();
      const targetType = format === 'png' ? 'image/png' : 'image/jpeg';
      const extension = format === 'png' ? '.png' : '.jpg';
      
      for (const file of files) {
        const blob = await heic2any({
          blob: file,
          toType: targetType,
          quality: 0.9
        });

        const resultBlob = Array.isArray(blob) ? blob[0] : blob;
        const url = URL.createObjectURL(resultBlob);
        const newName = file.name.replace(/\.(heic|heif)$/i, extension);
        
        convertedImages.push({ url, name: newName });
        zip.file(newName, resultBlob);
      }

      const zipContent = await zip.generateAsync({ type: "blob" });
      zipSize = zipContent.size;
      resultFileName = `converted_${Date.now()}.zip`;
      zipUrl = URL.createObjectURL(zipContent);

    } catch (e) {
      console.error("Conversion failed", e);
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    files = [];
    convertedImages.forEach(img => URL.revokeObjectURL(img.url));
    convertedImages = [];
    zipUrl = null;
    zipSize = 0;
  }

  function removeFile(index: number) {
    files = files.filter((_, i) => i !== index);
    zipUrl = null;
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
        <Dropzone onfiles={handleFiles} accept=".heic,.heif" />

        {#if files.length > 0}
          <div class="mt-10 animate-in fade-in slide-in-from-bottom-2">
            <div class="flex justify-between items-end border-b border-slate-100 pb-2 mb-4">
              <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                Selected HEIC Files ({files.length})
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

            <div class="mb-8">
              <label class="block font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-3">Output Format</label>
              <div class="flex gap-2">
                {#each ['jpeg', 'png'] as f}
                  <button 
                    onclick={() => format = f} 
                    class="flex-1 py-3 border font-mono text-[11px] uppercase transition-all {format === f ? 'border-black bg-black text-white' : 'border-slate-200 text-slate-400 hover:border-slate-400'}"
                  >
                    {f === 'jpeg' ? 'JPG' : 'PNG'}
                  </button>
                {/each}
              </div>
            </div>

            <button 
              onclick={convertAction}
              disabled={isProcessing}
              class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] 
                     hover:bg-slate-800 disabled:bg-slate-300 transition-all flex items-center justify-center shadow-lg"
            >
              {#if isProcessing}
                <Loader2 class="animate-spin mr-2" size={16} /> Converting...
              {:else}
                Convert to {format.toUpperCase()}
              {/if}
            </button>

            {#if zipUrl && !isProcessing}
              <SuccessState 
                type="preview"
                title="Conversion Ready" 
                subTitle="Successfully converted {files.length} HEIC files to {format.toUpperCase()}." 
                file={{ name: resultFileName, size: zipSize, url: zipUrl }}
                previews={convertedImages.map(img => ({ url: img.url, label: img.name }))}
                onReset={reset}
                mainActionLabel="Download ZIP"
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
