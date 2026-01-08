<script lang="ts">
  import JSZip from 'jszip';
  import { Loader2, X, ArrowRight } from 'lucide-svelte';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  // @ts-ignore
  import Content from '$lib/content/bulk-rename.md';

  const toolInfo = allTools.find((t) => t.id === 'bulk-rename')!;
  const related = allTools.filter((t) => t.id !== 'bulk-rename').slice(0, 6);

  // State
  let files = $state<File[]>([]);
  let isProcessing = $state(false);
  let zipUrl = $state<string | null>(null);
  let zipSize = $state(0);
  let resultFileName = $state("");

  // Rename Rules
  let prefix = $state("");
  let suffix = $state("");
  let findText = $state("");
  let replaceText = $state("");
  let useNumbering = $state(false);
  let startNumber = $state(1);
  let padding = $state(2); // e.g., 01, 001

  // Logic Preview - Realtime
  let previewFiles = $derived(
    files.map((file, index) => {
      const ext = file.name.includes('.') ? file.name.split('.').pop() : '';
      let nameOnly = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

      // 1. Find and Replace
      if (findText) {
        nameOnly = nameOnly.split(findText).join(replaceText);
      }

      // 2. Prefix & Suffix
      let newName = `${prefix}${nameOnly}${suffix}`;

      // 3. Numbering
      if (useNumbering) {
        const numString = (startNumber + index).toString().padStart(padding, '0');
        newName = `${newName}_${numString}`;
      }

      return {
        original: file.name,
        new: ext ? `${newName}.${ext}` : newName
      };
    })
  );

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function handleFiles(newFiles: File[]) {
    files = [...files, ...newFiles];
    zipUrl = null;
  }

  async function processAction() {
    if (files.length === 0) return;
    isProcessing = true;
    zipUrl = null;

    try {
      const zip = new JSZip();
      previewFiles.forEach((item, i) => {
        zip.file(item.new, files[i]);
      });

      const zipContent = await zip.generateAsync({ type: "blob" });
      zipSize = zipContent.size;
      resultFileName = `renamed_files_${Date.now()}.zip`;
      zipUrl = URL.createObjectURL(zipContent);
    } catch (e) {
      console.error("Renaming failed", e);
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    files = [];
    zipUrl = null;
    zipSize = 0;
    prefix = ""; suffix = ""; findText = ""; replaceText = "";
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
        <Dropzone onfiles={handleFiles} accept="*" />

        {#if files.length > 0}
          <div class="mt-10 animate-in fade-in slide-in-from-bottom-2">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-slate-50 border border-slate-100 rounded-sm">
              <div class="space-y-4">
                <div>
                  <label class="block font-mono text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Find / Replace</label>
                  <div class="flex gap-2">
                    <input type="text" bind:value={findText} placeholder="Find..." class="w-full border border-slate-200 p-3 text-xs font-mono focus:border-black outline-none bg-white"/>
                    <input type="text" bind:value={replaceText} placeholder="Replace..." class="w-full border border-slate-200 p-3 text-xs font-mono focus:border-black outline-none bg-white"/>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                   <div>
                    <label class="block font-mono text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Prefix</label>
                    <input type="text" bind:value={prefix} class="w-full border border-slate-200 p-3 text-xs font-mono focus:border-black outline-none bg-white" placeholder="Pre_"/>
                  </div>
                  <div>
                    <label class="block font-mono text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Suffix</label>
                    <input type="text" bind:value={suffix} class="w-full border border-slate-200 p-3 text-xs font-mono focus:border-black outline-none bg-white" placeholder="_v1"/>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center gap-3 mt-1">
                  <input type="checkbox" id="numbering" bind:checked={useNumbering} class="accent-black w-4 h-4 cursor-pointer" />
                  <label for="numbering" class="font-mono text-[10px] font-bold uppercase text-slate-400 cursor-pointer tracking-widest">Enable Numbering</label>
                </div>
                
                {#if useNumbering}
                <div class="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1">
                  <div>
                    <label class="block font-mono text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Start At</label>
                    <input type="number" bind:value={startNumber} class="w-full border border-slate-200 p-3 text-xs font-mono focus:border-black outline-none bg-white"/>
                  </div>
                  <div>
                    <label class="block font-mono text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Padding</label>
                    <select bind:value={padding} class="w-full border border-slate-200 p-3 text-xs font-mono focus:border-black outline-none bg-white">
                      <option value={1}>1 (1, 2...)</option>
                      <option value={2}>2 (01, 02...)</option>
                      <option value={3}>3 (001, 002...)</option>
                    </select>
                  </div>
                </div>
                {/if}
              </div>
            </div>

            <div class="flex justify-between items-end border-b border-slate-100 pb-2 mb-4">
              <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                Preview Changes ({files.length})
              </span>
              <button onclick={reset} class="text-[10px] font-mono uppercase underline underline-offset-4 decoration-slate-200 hover:text-red-500 transition-colors">
                Clear all
              </button>
            </div>

            <ul class="divide-y divide-slate-50 mb-8 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {#each previewFiles as item, i}
                <li class="py-4 flex justify-between items-center gap-4 group font-mono">
                  <div class="flex items-center gap-4 min-w-0 flex-1">
                    <span class="text-[10px] text-slate-300 shrink-0">{(i+1).toString().padStart(2,'0')}</span>
                    <div class="flex flex-col min-w-0 flex-1">
                      <span class="text-[10px] text-slate-400 truncate line-through mb-0.5">{item.original}</span>
                      <div class="flex items-center gap-2 text-black">
                        <ArrowRight size={10} class="text-slate-300 shrink-0" />
                        <span class="text-[12px] font-bold truncate tracking-tighter">{item.new}</span>
                      </div>
                    </div>
                    <span class="text-[9px] text-slate-400 uppercase shrink-0 bg-slate-50 px-1.5 py-0.5 rounded-sm border border-slate-100">{formatBytes(files[i].size)}</span>
                  </div>
                  <button onclick={() => removeFile(i)} class="text-slate-300 hover:text-black p-1 transition-colors">
                    <X size={14} />
                  </button>
                </li>
              {/each}
            </ul>

            <button 
              onclick={processAction}
              disabled={isProcessing}
              class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-300 transition-all flex items-center justify-center shadow-lg"
            >
              {#if isProcessing}
                <Loader2 class="animate-spin mr-2" size={16} /> Packaging...
              {:else}
                Apply & Download ZIP
              {/if}
            </button>

            {#if zipUrl && !isProcessing}
              <div class="mt-8">
                <SuccessState 
                  type="file"
                  title="Files Renamed" 
                  subTitle="Your {files.length} files are ready with the new names." 
                  file={{ name: resultFileName, size: zipSize, url: zipUrl }}
                  previews={[]} 
                  onReset={reset}
                  mainActionLabel="Download ZIP"
                />
              </div>
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
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
