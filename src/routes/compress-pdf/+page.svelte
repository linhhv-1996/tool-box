<script lang="ts">
  // @ts-nocheck
  import qpdfWasmUrl from '@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url';
  import { Loader2, FileText, Zap, AlertCircle, Trash2 } from 'lucide-svelte';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  import Content from '$lib/content/compress-pdf.md';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import JSZip from 'jszip';

  // --- LOGIC XỬ LÝ NÉN ---
  let createModule = $state<any>(null);
  onMount(async () => {
    if (browser) {
      const module = await import('@neslinesli93/qpdf-wasm');
      createModule = module.default || module;
    }
  });

  const toolInfo = allTools.find((t) => t.id === 'compress-pdf')!;
  const related = allTools.filter((t) => t.id !== 'compress-pdf' && t.id !== 'combine-pdf').slice(0, 5);

  let files = $state<File[]>([]); 
  let isProcessing = $state(false);
  let progress = $state({ current: 0, total: 0 });
  let error = $state("");
  let resultUrl = $state<string | null>(null);
  let resultFileName = $state("");
  let resultSize = $state(0);
  let totalOriginalSize = $state(0);

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
    const pdfs = newFiles.filter((f) => f.type === "application/pdf");
    if (pdfs.length === 0) {
      error = "Please select valid PDF files.";
      return;
    }
    files = [...files, ...pdfs];
    totalOriginalSize = files.reduce((acc, f) => acc + f.size, 0);
  }

  async function compressAction() {
    if (files.length === 0 || !createModule) return;
    isProcessing = true;
    error = "";
    progress = { current: 0, total: files.length };
    const zip = new JSZip();

    try {
      const qpdf = await createModule({ locateFile: () => qpdfWasmUrl });
      for (const file of files) {
        progress.current++;
        const inputBuffer = await file.arrayBuffer();
        const inputName = 'input.pdf';
        const outputName = 'output.pdf';

        qpdf.FS.writeFile(inputName, new Uint8Array(inputBuffer));
        try {
          qpdf.callMain([inputName, '--compress-streams=y', '--object-streams=generate', outputName]);
        } catch (e: any) {
          if (e.name !== 'ExitStatus' || e.status !== 0) throw e;
        }

        const outputData = qpdf.FS.readFile(outputName);
        if (files.length === 1) {
          const blob = new Blob([outputData], { type: 'application/pdf' });
          resultSize = blob.size;
          resultFileName = `${file.name.replace('.pdf', '')}_compressed.pdf`;
          resultUrl = URL.createObjectURL(blob);
        } else {
          zip.file(`${file.name.replace('.pdf', '')}_compressed.pdf`, outputData);
        }
        qpdf.FS.unlink(inputName);
        qpdf.FS.unlink(outputName);
      }

      if (files.length > 1) {
        const content = await zip.generateAsync({ type: "blob" });
        resultSize = content.size;
        resultFileName = `compressed_pdfs_${Date.now()}.zip`;
        resultUrl = URL.createObjectURL(content);
      }
    } catch (e: any) {
      error = "Compression failed for one or more files.";
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    files = [];
    resultUrl = null;
    resultSize = 0;
    error = "";
    totalOriginalSize = 0;
  }

  function removeFile(index: number) {
    files = files.filter((_, i) => i !== index);
    totalOriginalSize = files.reduce((acc, f) => acc + f.size, 0);
    resultUrl = null;
  }
</script>

<svelte:head>
  <title>{toolInfo.name} - Compress PDF Online (100% Private)</title>
  <meta name="description" content="Reduce PDF file size locally in your browser without uploading to any server. Fast, secure, and 100% private PDF compression tool." />
  <link rel="canonical" href="https://justlocaltools.com/compress-pdf" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/compress-pdf" />
  <meta property="og:title" content="{toolInfo.name} - Reduce PDF File Size Online" />
  <meta property="og:description" content="Compress PDF files locally in your browser. No server uploads, 100% private and secure." />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Compress PDF",
    "url": "https://justlocaltools.com/compress-pdf",
    "description": "Reduce PDF file size locally in your browser. No server uploads, 100% private.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "permissions": "None (Processed locally)"
  }
  </script>
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-6 md:py-10">
  <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

  <div class="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8">
    <main class="min-w-0">
      <div class="bg-white border border-slate-200 rounded-sm shadow-sm p-5 md:p-8">
        
        <Dropzone 
          onfiles={handleFiles} 
          hasFiles={files.length > 0} 
          onClear={reset} 
          accept=".pdf"
          multiple={true}
          label="Select PDF files to compress"
        />

        {#if files.length > 0}
          <div class="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div class="mb-6 border border-slate-100 rounded-sm overflow-hidden bg-slate-50/50">
              <div class="px-4 py-2 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                <span class="text-[10px] font-mono font-bold text-slate-500 uppercase">Queue ({files.length})</span>
              </div>
              <ul class="divide-y divide-slate-100 max-h-[200px] overflow-y-auto custom-scrollbar">
                {#each files as f, i}
                <li class="px-4 py-2.5 flex items-center justify-between gap-4 bg-white">
                <div class="flex items-center gap-3 flex-1 min-w-0"> 
                  <FileText size={14} class="text-slate-300 shrink-0" />
                  <span class="text-[12px] font-medium text-black truncate block leading-tight">
                    {f.name}
                  </span>
                </div>

                <div class="flex items-center gap-3 shrink-0 ml-2">
                  <span class="text-[10px] font-mono text-slate-400 uppercase whitespace-nowrap bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                    {formatBytes(f.size)}
                  </span>
                  <button 
                    onclick={() => removeFile(i)} 
                    class="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-100 transition-all rounded-sm shrink-0"
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
                {/each}
              </ul>
            </div>

            <button 
              onclick={compressAction}
              disabled={isProcessing || !createModule}
              class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:bg-slate-200 transition-all flex items-center justify-center shadow-lg"
            >
              {#if isProcessing}
                <Loader2 class="animate-spin mr-2" size={16} /> 
                Compressing {progress.current}/{progress.total}...
              {:else}
                <Zap size={14} class="mr-2" /> Compress PDF Documents
              {/if}
            </button>

            {#if resultUrl && !isProcessing}
              <div class="mt-6 animate-in fade-in zoom-in-95 duration-500">
                <SuccessState 
                  title="Compression Complete" 
                  file={{ 
                    name: resultFileName, 
                    size: resultSize, 
                    url: resultUrl,
                    savings: Math.max(0, Math.round((1 - resultSize / totalOriginalSize) * 100)) + '%'
                  }}
                  onReset={reset}
                />
                
                
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
