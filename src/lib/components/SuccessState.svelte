<script lang="ts">
  import { Download, Check, FileText, Copy, RotateCcw, ImageIcon, FileCode } from 'lucide-svelte';
  import { scale, fade } from 'svelte/transition';

  interface Props {
    type?: 'file' | 'text' | 'preview';
    title?: string;
    subTitle?: string;
    file?: {
      name: string;
      size?: number;
      url: string;
    };
    // Thêm mảng previews để hỗ trợ scroll ngang nhiều ảnh
    previews?: { url: string; label?: string }[];
    text?: string;
    mainActionLabel?: string;
    onReset?: () => void;
  }

  let { 
    type = 'file', 
    title = "Success!", 
    subTitle = "Your file has been processed securely in your browser.", 
    file, 
    previews = [],
    text,
    mainActionLabel,
    onReset 
  }: Props = $props();
  let copied = $state(false);

  function formatBytes(bytes: number = 0) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async function handleCopy() {
    if (text) {
      await navigator.clipboard.writeText(text);
      copied = true;
      setTimeout(() => copied = false, 2000);
    }
  }
</script>

<div 
  in:scale={{duration: 300, start: 0.95}}
  class="mt-8 p-6 md:p-10 border border-slate-200 bg-slate-50/50 rounded-sm flex flex-col items-center text-center w-full"
>
  <div class="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center mb-5 shadow-xl">
    <Check size={28} strokeWidth={3} />
  </div>
  
  <h4 class="text-xl font-bold text-black mb-1 font-mono uppercase tracking-tight">{title}</h4>
  <p class="text-[11px] text-slate-500 font-mono mb-8 uppercase tracking-[0.1em] leading-relaxed">
    {subTitle}
  </p>

  <div class="w-full mb-8" in:fade>
    {#if type === 'file' && file}
      <div class="bg-white border border-slate-200 p-4 flex items-center gap-4 text-left shadow-sm w-full">
        <div class="w-12 h-12 bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-500">
            {#if file.name.endsWith('.pdf')} <FileText size={24} /> 
            {:else if file.name.endsWith('.zip')} <FileCode size={24} />
            {:else} <ImageIcon size={24} /> {/if}
        </div>
        <div class="flex-1 overflow-hidden">
            <p class="text-[12px] font-bold text-black truncate mb-1">{file.name}</p>
            <p class="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">
                {formatBytes(file.size)} • Ready to download
            </p>
        </div>
      </div>

    {:else if type === 'text' && text}
      <div class="relative group w-full">
        <div class="bg-slate-900 text-slate-200 p-5 rounded-sm text-left font-mono text-sm overflow-x-auto max-h-[200px] whitespace-pre-wrap ring-1 ring-white/10">
          {text}
        </div>
        <div class="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
      </div>

    {:else if type === 'preview'}
      <div class="w-full overflow-x-auto pb-4 custom-scrollbar">
        <div class="flex gap-4 min-w-max px-1">
          {#if previews.length > 0}
            {#each previews as p}
              <div class="border border-slate-200 p-1.5 bg-white shadow-sm flex-shrink-0">
                <img src={p.url} alt="Preview" class="h-[100px] md:h-[100px] w-auto object-contain" />
                {#if p.label}
                  <div class="mt-1 text-[9px] font-mono text-slate-400 uppercase text-center">{p.label}</div>
                {/if}
              </div>
            {/each}
          {:else if file}
            <div class="border border-slate-200 p-1.5 bg-white shadow-sm mx-auto">
              <img src={file.url} alt="Result Preview" class="h-[250px] md:h-[350px] w-auto object-contain" />
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
  
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
    {#if type === 'text'}
      <button 
        onclick={handleCopy}
        class="inline-flex items-center justify-center gap-3 bg-black text-white px-6 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-95 w-full"
      >
        <Copy size={16} /> {copied ? 'Copied!' : 'Copy to Clipboard'}
      </button>
    {:else if file}
      <a 
        href={file.url} 
        download={file.name}
        class="inline-flex items-center justify-center gap-3 bg-black text-white px-6 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-md active:scale-95 w-full"
      >
        <Download size={16} /> {mainActionLabel || 'Download File'}
      </a>
    {/if}

    {#if onReset}
      <button 
        onclick={onReset}
        class="inline-flex items-center justify-center gap-3 border border-slate-200 bg-white text-slate-600 px-6 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-black transition-all active:scale-95 w-full"
      >
        <RotateCcw size={16} /> Process Another
      </button>
    {/if}
  </div>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar { height: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
