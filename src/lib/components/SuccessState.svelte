<script lang="ts">
  import { Download, Check, FileText } from 'lucide-svelte';
  import { scale } from 'svelte/transition';

  let { url, fileName, fileSize = 0, title = "Success!", subTitle = "" } = $props();

  function formatBytes(bytes: number) {
    if (!bytes || bytes === 0) return 'Calculating...';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
</script>

<div 
  in:scale={{duration: 200, start: 0.95}}
  class="mt-12 p-8 border border-slate-200 bg-slate-50/50 rounded-sm flex flex-col items-center text-center"
>
  <div class="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
    <Check size={24} strokeWidth={3} />
  </div>
  
  <h4 class="text-lg font-bold text-black mb-1 font-mono uppercase tracking-tight">{title}</h4>
  {#if subTitle}
    <p class="text-[12px] text-slate-500 font-mono mb-8 uppercase tracking-wider">{subTitle}</p>
  {/if}

  <div class="w-full max-w-sm bg-white border border-slate-200 p-4 mb-8 flex items-center gap-4 text-left">
    <div class="w-10 h-10 bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400">
        <FileText size={20} />
    </div>
    <div class="flex-1 overflow-hidden">
        <p class="text-[11px] font-bold text-black truncate leading-none mb-1">{fileName}</p>
        <p class="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">
            {formatBytes(fileSize)} • Ready to download
        </p>
    </div>
  </div>
  
  <a 
    href={url} 
    download={fileName}
    class="inline-flex items-center gap-3 bg-black text-white px-16 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-md active:scale-95"
  >
    <Download size={16} /> Download PDF
  </a>
</div>
