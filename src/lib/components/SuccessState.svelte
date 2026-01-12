<script lang="ts">
  import { ui, type Language } from "$lib/translate/ui";
  import { Download, Check, RotateCcw } from "lucide-svelte";
  import { slide } from "svelte/transition";

  interface Props {
    lang: String;
    title?: string;
    file?: { name: string; size: number; url: string; savings?: string };
    onReset?: () => void;
  }

  let { lang = "en", title = "Done!", file, onReset }: Props = $props();

  function formatBytes(bytes: number = 0) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Logic tách tên và định dạng để xử lý truncate middle
  const fileName = $derived(file?.name || title);
  const extension = $derived(
    fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".")) : "",
  );
  const baseName = $derived(
    fileName.includes(".")
      ? fileName.slice(0, fileName.lastIndexOf("."))
      : fileName,
  );
</script>

<div
  in:slide
  class="mt-4 p-5 bg-emerald-50 border border-emerald-100 rounded-sm"
>
  <div class="flex flex-col md:flex-row items-center justify-between gap-4">
    <div class="flex items-center gap-4 w-full min-w-0">
      <div
        class="w-10 h-10 bg-emerald-500 text-white rounded-sm flex items-center justify-center shrink-0 shadow-sm"
      >
        <Check size={20} strokeWidth={3} />
      </div>
      <div class="flex-1 min-w-0 text-left">
        <h4
          class="text-[12px] font-bold text-emerald-900 font-mono uppercase flex min-w-0"
        >
          <span class="truncate">{baseName}</span>
          <span class="shrink-0">{extension}</span>
        </h4>

        <div class="flex items-center gap-2 mt-0.5">
          <span
            class="text-[10px] font-mono text-emerald-600 uppercase font-bold"
            >{formatBytes(file?.size)}</span
          >
          {#if file?.savings}
            <span
              class="px-1.5 py-0.5 bg-emerald-200 text-emerald-800 text-[9px] font-bold rounded-sm uppercase tracking-tighter"
            >
              {ui.success.saved[lang as Language]}
              {file.savings}
            </span>
          {/if}
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 w-full md:w-auto">
      <a
        href={file?.url}
        download={file?.name}
        class="flex-1 md:flex-none h-11 bg-black text-white px-4 md:px-6 flex items-center justify-center gap-2 font-mono text-[11px] font-bold uppercase {lang ===
        'ja'
          ? 'tracking-normal'
          : 'tracking-widest'} whitespace-nowrap hover:bg-slate-800 transition-all shadow-lg active:scale-95"
      >
        <Download size={16} class="shrink-0" />
        <span class="truncate">{ui.success.download[lang as Language]}</span>
      </a>
      <button
        onclick={onReset}
        class="w-11 h-11 shrink-0 flex items-center justify-center border border-emerald-200 bg-white text-emerald-600 hover:bg-emerald-100 transition-all rounded-sm shadow-sm"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  </div>
</div>

<style>
  /* Đảm bảo span truncate hoạt động trong flex */
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
