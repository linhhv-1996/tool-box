<script lang="ts">
  // @ts-nocheck
  import qpdfWasmUrl from '@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url';
  import { Loader2 } from 'lucide-svelte';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  // @ts-ignore
  import Content from '$lib/content/compress-pdf.md';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let createModule = $state<any>(null);

  onMount(async () => {
    if (browser) {
      const module = await import('@neslinesli93/qpdf-wasm');
      createModule = module.default || module;
    }
  });

  const toolInfo = allTools.find((t) => t.id === 'compress-pdf')!;
  const related = allTools.filter((t) => t.id !== 'compress-pdf' && t.id !== 'combine-pdf').slice(0, 6);

  let file = $state<File | null>(null);
  let isProcessing = $state(false);
  let error = $state("");
  let resultUrl = $state<string | null>(null);
  let resultFileName = $state("");
  let resultSize = $state(0);

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
    const pdf = newFiles.find((f) => f.type === "application/pdf");
    if (!pdf) {
      error = "Please select a valid PDF file.";
      return;
    }
    file = pdf;
  }

  async function compressAction() {
    if (!file || !createModule) return;
    
    isProcessing = true;
    error = "";
    resultUrl = null;

    let qpdf;
    try {
      // Initialize module with locateFile following the protect-pdf pattern
      qpdf = await createModule({ locateFile: () => qpdfWasmUrl });
      
      const inputBuffer = await file.arrayBuffer();
      qpdf.FS.writeFile('input.pdf', new Uint8Array(inputBuffer));

      try {
        // Using callMain for execution
        // Compression flags: optimize streams and generate object streams
        qpdf.callMain([
            'input.pdf', 
            '--compress-streams=y', 
            '--object-streams=generate', 
            '--linearize', 
            'output.pdf'
        ]);
      } catch (e: any) {
        if (e.name !== 'ExitStatus' || e.status !== 0) throw e;
      }

      const outputData = qpdf.FS.readFile('output.pdf');
      const blob = new Blob([outputData], { type: 'application/pdf' });
      
      resultSize = blob.size;
      resultFileName = `${file.name.replace('.pdf', '')}_compressed.pdf`;

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      resultUrl = URL.createObjectURL(blob);

      // Cleanup virtual file system
      qpdf.FS.unlink('input.pdf');
      qpdf.FS.unlink('output.pdf');

    } catch (e: any) {
      console.error(e);
      error = "Compression failed. The file might already be optimized.";
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    file = null;
    resultUrl = null;
    resultSize = 0;
    error = "";
  }
</script>

<svelte:head>
  <title>Compress PDF Online - Local & Secure PDF Reducer</title>
  <meta name="description" content="Reduce PDF file size locally in your browser. No server uploads, 100% private and secure compression." />
</svelte:head>

<div class="max-w-[980px] mx-auto px-0 py-12">
  <div class="flex flex-col lg:flex-row lg:justify-between">
    
    <div class="w-full lg:w-[640px] shrink-0">
      <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

      <div class="mt-10 bg-white border border-slate-200 p-6 md:p-10 rounded-sm shadow-sm">
        <Dropzone onfiles={handleFiles} multiple={false} accept=".pdf" />

        {#if file}
          <div class="mt-10 animate-in fade-in slide-in-from-bottom-2">
            <div class="flex justify-between items-end border-b border-slate-100 pb-2 mb-4">
              <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                Target Document
              </span>
              <button onclick={reset} class="text-[10px] font-mono uppercase underline underline-offset-4 decoration-slate-200 hover:text-red-500 transition-colors">
                Remove
              </button>
            </div>

            <div class="py-3 flex justify-between items-center gap-4 font-mono border-b border-slate-50 mb-10">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                    <span class="text-[12px] text-[#1a1a1a] truncate font-bold shrink grow-0">{file.name}</span>
                    <span class="text-[9px] text-slate-400 uppercase bg-slate-50 px-1.5 py-0.5 rounded-sm border border-slate-100 whitespace-nowrap">
                      {formatBytes(file.size)}
                    </span>
                </div>
            </div>

            <button 
              onclick={compressAction}
              disabled={isProcessing || !createModule}
              class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-300 transition-all flex items-center justify-center shadow-lg"
            >
              {#if isProcessing}
                <Loader2 class="animate-spin mr-2" size={16} /> Compressing Locally...
              {:else}
                Compress PDF
              {/if}
            </button>
            
            {#if error}
              <p class="mt-4 text-[10px] font-mono text-red-500 uppercase text-center font-bold tracking-widest">{error}</p>
            {/if}

            {#if resultUrl && !isProcessing}
              <div class="mt-6 pt-6 border-t border-dashed border-slate-100">
                <SuccessState 
                  type="file"
                  title="Compression Complete" 
                  subTitle="Reduced from {formatBytes(file.size)} to {formatBytes(resultSize)}." 
                  file={{ 
                    name: resultFileName, 
                    size: resultSize, 
                    url: resultUrl 
                  }}
                  onReset={reset}
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
