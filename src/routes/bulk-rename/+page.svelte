<script lang="ts">
  import JSZip from 'jszip';
  import { Loader2, X, ArrowRight, Trash2, CaseSensitive, Hash, Type, ArrowLeftRight } from 'lucide-svelte';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  // @ts-ignore
  import Content from '$lib/content/bulk-rename.md';

  const toolInfo = allTools.find((t) => t.id === 'bulk-rename')!;
  const related = allTools.filter((t) => t.id !== 'bulk-rename').slice(0, 6);

  // Types for Rules
  type RuleType = 'find-replace' | 'prefix-suffix' | 'numbering' | 'case';
  interface Rule {
    id: string;
    type: RuleType;
    data: any;
  }

  // State
  let files = $state<File[]>([]);
  let isProcessing = $state(false);
  let zipUrl = $state<string | null>(null);
  let zipSize = $state(0);
  let resultFileName = $state("");
  
  // Rules State
  let rules = $state<Rule[]>([]);

  function addRule(type: RuleType) {
    const id = Math.random().toString(36).substring(2, 9);
    let data = {};
    if (type === 'find-replace') data = { find: '', replace: '' };
    if (type === 'prefix-suffix') data = { prefix: '', suffix: '' };
    if (type === 'numbering') data = { start: 1, padding: 2 };
    if (type === 'case') data = { mode: 'lower' };
    
    rules.push({ id, type, data });
  }

  function removeRule(id: string) {
    rules = rules.filter(r => r.id !== id);
  }

  // Logic Preview - Áp dụng tất cả rules theo thứ tự
  let previewFiles = $derived(
    files.map((file, index) => {
      const ext = file.name.includes('.') ? file.name.split('.').pop() : '';
      let name = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

      for (const rule of rules) {
        const { type, data } = rule;
        if (type === 'find-replace' && data.find) {
          name = name.split(data.find).join(data.replace);
        } else if (type === 'prefix-suffix') {
          name = `${data.prefix || ''}${name}${data.suffix || ''}`;
        } else if (type === 'numbering') {
          const num = (data.start + index).toString().padStart(data.padding, '0');
          name = `${name}_${num}`;
        } else if (type === 'case') {
          if (data.mode === 'lower') name = name.toLowerCase();
          else if (data.mode === 'upper') name = name.toUpperCase();
          else if (data.mode === 'title') name = name.replace(/\b\w/g, c => c.toUpperCase());
        }
      }

      return {
        original: file.name,
        new: ext ? `${name}.${ext}` : name
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
    if (rules.length === 0) addRule('prefix-suffix'); // Mặc định thêm 1 rule cho dễ hiểu
    zipUrl = null;
  }

  async function processAction() {
    if (files.length === 0) return;
    isProcessing = true;
    try {
      const zip = new JSZip();
      previewFiles.forEach((item, i) => {
        zip.file(item.new, files[i]);
      });
      const zipContent = await zip.generateAsync({ type: "blob" });
      zipSize = zipContent.size;
      resultFileName = `renamed_${Date.now()}.zip`;
      zipUrl = URL.createObjectURL(zipContent);
    } catch (e) {
      console.error("Renaming failed", e);
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    files = [];
    rules = [];
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
            
            <div class="mb-6">
              <span class="block font-mono text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest">Add Renaming Rule</span>
              <div class="flex flex-wrap gap-2">
                <button onclick={() => addRule('find-replace')} class="flex items-center gap-2 px-3 py-2 border border-slate-200 text-[10px] font-mono uppercase hover:border-black transition-all bg-white">
                  <ArrowLeftRight size={12} /> Find & Replace
                </button>
                <button onclick={() => addRule('prefix-suffix')} class="flex items-center gap-2 px-3 py-2 border border-slate-200 text-[10px] font-mono uppercase hover:border-black transition-all bg-white">
                  <Type size={12} /> Prefix / Suffix
                </button>
                <button onclick={() => addRule('numbering')} class="flex items-center gap-2 px-3 py-2 border border-slate-200 text-[10px] font-mono uppercase hover:border-black transition-all bg-white">
                  <Hash size={12} /> Numbering
                </button>
                <button onclick={() => addRule('case')} class="flex items-center gap-2 px-3 py-2 border border-slate-200 text-[10px] font-mono uppercase hover:border-black transition-all bg-white">
                  <CaseSensitive size={12} /> Change Case
                </button>
              </div>
            </div>

            <div class="space-y-3 mb-10">
              {#each rules as rule (rule.id)}
                <div class="group relative bg-slate-50 border border-slate-100 p-4 rounded-sm animate-in slide-in-from-left-2 duration-200">
                  <button 
                    onclick={() => removeRule(rule.id)}
                    class="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div class="flex flex-col gap-3">
                    <span class="text-[9px] font-bold font-mono uppercase text-slate-400 tracking-tighter">
                      Rule: {rule.type.replace('-', ' ')}
                    </span>

                    {#if rule.type === 'find-replace'}
                      <div class="grid grid-cols-2 gap-3">
                        <input type="text" bind:value={rule.data.find} placeholder="Find..." class="w-full border border-slate-200 p-2 text-xs font-mono focus:border-black outline-none bg-white"/>
                        <input type="text" bind:value={rule.data.replace} placeholder="Replace..." class="w-full border border-slate-200 p-2 text-xs font-mono focus:border-black outline-none bg-white"/>
                      </div>
                    {:else if rule.type === 'prefix-suffix'}
                      <div class="grid grid-cols-2 gap-3">
                        <input type="text" bind:value={rule.data.prefix} placeholder="Prefix..." class="w-full border border-slate-200 p-2 text-xs font-mono focus:border-black outline-none bg-white"/>
                        <input type="text" bind:value={rule.data.suffix} placeholder="Suffix..." class="w-full border border-slate-200 p-2 text-xs font-mono focus:border-black outline-none bg-white"/>
                      </div>
                    {:else if rule.type === 'numbering'}
                      <div class="flex gap-3">
                        <div class="flex-1">
                          <span class="text-[8px] uppercase text-slate-400 block mb-1">Start At</span>
                          <input type="number" bind:value={rule.data.start} class="w-full border border-slate-200 p-2 text-xs font-mono focus:border-black outline-none bg-white"/>
                        </div>
                        <div class="flex-1">
                          <span class="text-[8px] uppercase text-slate-400 block mb-1">Padding</span>
                          <select bind:value={rule.data.padding} class="w-full border border-slate-200 p-2 text-xs font-mono focus:border-black outline-none bg-white h-[34px]">
                            <option value={1}>1</option>
                            <option value={2}>01</option>
                            <option value={3}>001</option>
                          </select>
                        </div>
                      </div>
                    {:else if rule.type === 'case'}
                      <div class="flex gap-2">
                        {#each ['lower', 'upper', 'title'] as m}
                          <button 
                            onclick={() => rule.data.mode = m}
                            class="flex-1 py-1.5 border text-[10px] font-mono uppercase transition-all {rule.data.mode === m ? 'bg-black text-white border-black' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}"
                          >
                            {m}
                          </button>
                        {/each}
                      </div>
                    {/if}
                  </div>
                </div>
              {/each}
              
              {#if rules.length === 0}
                <div class="border-2 border-dashed border-slate-100 py-8 text-center rounded-sm">
                  <p class="text-[10px] font-mono text-slate-300 uppercase tracking-widest">No rules added yet</p>
                </div>
              {/if}
            </div>

            <div class="flex justify-between items-end border-b border-slate-100 pb-2 mb-4 mt-12">
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
                  <button onclick={() => {files = files.filter((_, idx) => idx !== i)}} class="text-slate-300 hover:text-black p-1 transition-colors">
                    <X size={14} />
                  </button>
                </li>
              {/each}
            </ul>

            <button 
              onclick={processAction}
              disabled={isProcessing || files.length === 0}
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
                  subTitle="Your {files.length} files are ready." 
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
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
