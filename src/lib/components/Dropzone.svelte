<script lang="ts">
    import type { Language } from '$lib/translate/ui';
    import { ui } from '$lib/translate/ui';

  // @ts-nocheck
  import { Plus, Trash2, UploadCloud, FileUp } from 'lucide-svelte';
  
  // Props linh hoạt
  let { 
    lang = "en",
    onfiles,            // Callback khi chọn file
    onClear,            // Callback khi xóa sạch
    accept = "*",       // Loại file chấp nhận (mặc định là tất cả)
    multiple = true,    // Cho phép chọn nhiều file hay không
    hasFiles = false,   // Trạng thái đã có file chưa để thu gọn UI
    label = "Click to select or Drag files here", // Label lúc chưa có file
    compactLabel = "Add More" // Label nút thêm file lúc đã có file
  } = $props();

  function handleChange(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onfiles(files);
      // Reset value để có thể chọn lại chính file đó nếu cần
      e.target.value = '';
    }
  }

  // svelte-ignore state_referenced_locally
    compactLabel = ui.dropzone.add_more[lang as Language];
  
</script>

{#if !hasFiles}
  <div class="border-2 border-dashed border-slate-200 rounded-sm p-12 text-center bg-slate-50/50 hover:border-black hover:bg-white transition-all group relative">
    <input 
      type="file" {multiple} {accept} 
      id="file-input" class="absolute inset-0 opacity-0 cursor-pointer" 
      onchange={handleChange} 
    />
    <div class="flex flex-col items-center gap-3 pointer-events-none">
      <UploadCloud size={24} class="text-slate-300 group-hover:text-black transition-colors" />
      <span class="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-black transition-colors">
        [ {label} ]
      </span>
    </div>
  </div>
{:else}
  <div class="flex items-center justify-between p-2 bg-slate-900 rounded-sm mb-4 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
    <div class="flex items-center gap-2">
      <input 
        type="file" {multiple} {accept} 
        id="file-input-mini" class="hidden" 
        onchange={handleChange} 
      />
      
      <label 
        for="file-input-mini" 
        class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-sm cursor-pointer transition-all border border-white/5 shadow-inner"
      >
        {#if multiple}
          <Plus size={14} />
          <span class="font-mono text-[10px] font-bold uppercase tracking-wider">{compactLabel}</span>
        {:else}
          <FileUp size={14} />
          <span class="font-mono text-[10px] font-bold uppercase tracking-wider">{ui.dropzone.change_file[lang]}</span>
        {/if}
      </label>
    </div>

    {#if onClear}
      <button 
        onclick={onClear} 
        class="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-sm transition-all"
      >
        <Trash2 size={14} />
        <span class="font-mono text-[10px] font-bold uppercase tracking-wider">{ui.dropzone.clear[lang]}</span>
      </button>
    {/if}
  </div>
{/if}
