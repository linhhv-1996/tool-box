<script lang="ts">
  // @ts-nocheck
  import qpdfWasmUrl from '@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url';
  import { Loader2 } from 'lucide-svelte';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  import Content from '$lib/content/compress-pdf.md';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import JSZip from 'jszip';

  let createModule = $state<any>(null);

  onMount(async () => {
    if (browser) {
      const module = await import('@neslinesli93/qpdf-wasm');
      createModule = module.default || module;
    }
  });

  const toolInfo = allTools.find((t) => t.id === 'compress-pdf')!;
  const related = allTools.filter((t) => t.id !== 'compress-pdf' && t.id !== 'combine-pdf').slice(0, 6);

  // Chuyển sang mảng files để hỗ trợ bulk
  let files = $state<File[]>([]); 
  let isProcessing = $state(false);
  let progress = $state({ current: 0, total: 0 }); // Theo dõi tiến trình để tránh lag UI
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
    // Lọc tất cả các file PDF được chọn
    const pdfs = newFiles.filter((f) => f.type === "application/pdf");
    if (pdfs.length === 0) {
      error = "Please select valid PDF files.";
      return;
    }
    files = pdfs;
  }

  async function compressAction() {
    if (files.length === 0 || !createModule) return;
    isProcessing = true;
    error = "";
    progress = { current: 0, total: files.length };

    const zip = new JSZip();
    let qpdf;

    try {
      // Khởi tạo module một lần duy nhất
      qpdf = await createModule({ locateFile: () => qpdfWasmUrl });

      for (const file of files) {
        progress.current++;
        const inputBuffer = await file.arrayBuffer();
        const inputName = 'input.pdf';
        const outputName = 'output.pdf';

        qpdf.FS.writeFile(inputName, new Uint8Array(inputBuffer));

        try {
          qpdf.callMain([
            inputName, 
            '--compress-streams=y', 
            '--object-streams=generate',  
            outputName
          ]);
        } catch (e: any) {
          if (e.name !== 'ExitStatus' || e.status !== 0) throw e;
        }

        const outputData = qpdf.FS.readFile(outputName);
        
        if (files.length === 1) {
          // Nếu chỉ có 1 file, xử lý như cũ
          const blob = new Blob([outputData], { type: 'application/pdf' });
          resultSize = blob.size;
          resultFileName = `${file.name.replace('.pdf', '')}_compressed.pdf`;
          resultUrl = URL.createObjectURL(blob);
        } else {
          zip.file(`${file.name.replace('.pdf', '')}_compressed.pdf`, outputData);
        }

        // Dọn dẹp bộ nhớ ảo sau mỗi file để tránh lag
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
      console.error(e);
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

<div class="max-w-[980px] mx-auto px-0 py-12">
  <div class="flex flex-col lg:flex-row lg:justify-between">
    <div class="w-full lg:w-[640px] shrink-0">
      <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

      <div class="mt-10 bg-white border border-slate-200 p-6 md:p-10 rounded-sm shadow-sm">
        <Dropzone onfiles={handleFiles} multiple={true} accept=".pdf" />

        {#if files.length > 0}
          <div class="mt-10 animate-in fade-in slide-in-from-bottom-2">
            <div class="flex justify-between items-end border-b border-slate-100 pb-2 mb-4">
              <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                Target Documents ({files.length})
              </span>
              <button onclick={reset} class="text-[10px] font-mono uppercase underline underline-offset-4 decoration-slate-200 hover:text-red-500 transition-colors">
                Remove All
              </button>
            </div>

            <div class="max-h-48 overflow-y-auto mb-10 border-b border-slate-50">
              {#each files as f}
                <div class="py-3 flex justify-between items-center gap-4 font-mono">
                    <div class="flex items-center gap-3 min-w-0 flex-1">
                        <span class="text-[12px] text-[#1a1a1a] truncate font-bold shrink grow-0">{f.name}</span>
                        <span class="text-[9px] text-slate-400 uppercase bg-slate-50 px-1.5 py-0.5 rounded-sm border border-slate-100 whitespace-nowrap">
                          {formatBytes(f.size)}
                        </span>
                    </div>
                </div>
              {/each}
            </div>

            <button 
              onclick={compressAction}
              disabled={isProcessing || !createModule}
              class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-300 transition-all flex items-center justify-center shadow-lg"
            >
              {#if isProcessing}
                <Loader2 class="animate-spin mr-2" size={16} /> 
                Compressing {progress.current}/{progress.total}...
              {:else}
                Compress {files.length} PDF{files.length > 1 ? 's' : ''}
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
                  subTitle={files.length > 1 ? `Successfully compressed ${files.length} files into a ZIP.` : "Your PDF has been compressed successfully."} 
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
