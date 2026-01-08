<script lang="ts">

  // import createModule from '@neslinesli93/qpdf-wasm';

  import qpdfWasmUrl from '@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url';

  import { Eye, EyeOff, Lock, Loader2 } from 'lucide-svelte';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  // @ts-ignore
  import Content from '$lib/content/protect-pdf.md';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let createModule = $state<any>(null);

  onMount(async () => {
    if (browser) {
      const module = await import('@neslinesli93/qpdf-wasm');
      createModule = module.default || module;
    }
  });

  const toolInfo = allTools.find((t) => t.id === 'protect-pdf')!;
  const related = allTools.filter((t) => t.id !== 'protect-pdf').slice(0, 6);

  let file = $state<File | null>(null);
  let password = $state("");
  let showPassword = $state(false);
  let isProcessing = $state(false);
  let error = $state("");
  let protectedUrl = $state<string | null>(null);
  let resultFileName = $state("");
  let fileSize = $state(0);

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function handleFiles(newFiles: File[]) {
    error = "";
    protectedUrl = null;
    const pdf = newFiles.find((f) => f.type === "application/pdf");
    if (!pdf) {
      error = "Please select a valid PDF file.";
      return;
    }
    file = pdf;
  }

  async function protectAction() {
    if (!file || !password) return;
    isProcessing = true;
    error = "";
    protectedUrl = null;

    let qpdf;
    try {
      qpdf = await createModule({ locateFile: () => qpdfWasmUrl });
      const inputBuffer = await file.arrayBuffer();
      qpdf.FS.writeFile('input.pdf', new Uint8Array(inputBuffer));

      try {
        // Mã hóa AES-256
        qpdf.callMain(['input.pdf', '--encrypt', password, password, '256', '--', 'output.pdf']);
      } catch (e: any) {
        if (e.name !== 'ExitStatus' || e.status !== 0) throw e;
      }

      const outputData = qpdf.FS.readFile('output.pdf');
      const blob = new Blob([outputData], { type: 'application/pdf' });
      fileSize = blob.size;
      resultFileName = `${file.name.replace('.pdf', '')}_protected.pdf`;

      if (protectedUrl) URL.revokeObjectURL(protectedUrl);
      protectedUrl = URL.createObjectURL(blob);

      qpdf.FS.unlink('input.pdf');
      qpdf.FS.unlink('output.pdf');
    } catch (e: any) {
      error = "Encryption failed. Ensure the PDF is not already encrypted.";
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    file = null;
    password = "";
    protectedUrl = null;
    fileSize = 0;
    error = "";
  }
</script>

<svelte:head>
  <title>Protect PDF with Password Online - Secure Your Documents</title>
  <meta name="description" content="Encrypt your PDF documents with a strong password. Add security to your files without uploading them to any server. 100% local and private." />
  <meta property="og:title" content="Protect PDF Online - JustLocalTools" />
  <meta property="og:description" content="Add a password to secure your documents privately on your device." />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Protect PDF",
    "url": "https://justlocaltools.com/protect-pdf",
    "description": "Add a password to secure your documents locally in your browser.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  }
  </script>
</svelte:head>

<div class="max-w-[980px] mx-auto px-0 py-12">
  <div class="flex flex-col lg:flex-row lg:justify-between">
    
    <div class="w-full lg:w-[640px] shrink-0">
      <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

      <div class="mt-10 bg-white border border-slate-200 p-6 md:p-10 rounded-sm shadow-sm">
        <Dropzone onfiles={handleFiles} multiple={false} />

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

            <div class="mb-10 flex flex-col items-center">
                <div class="w-full max-w-full">
                    <label for="pw" class="block font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-3">
                        Set Document Password
                    </label>
                    <div class="relative group">
                        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-black transition-colors">
                            <Lock size={14} />
                        </div>
                        <input 
                            id="pw"
                            type={showPassword ? "text" : "password"} 
                            bind:value={password}
                            placeholder="Enter a strong password..."
                            class="w-full h-11 pl-10 pr-12 bg-white border border-slate-200 font-mono text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all rounded-sm placeholder:text-slate-300"
                        />
                        <button 
                            type="button"
                            onclick={() => showPassword = !showPassword}
                            class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-black transition-colors"
                        >
                            {#if showPassword}
                                <EyeOff size={16} />
                            {:else}
                                <Eye size={16} />
                            {/if}
                        </button>
                    </div>
                    <p class="mt-3 text-[10px] text-slate-400 font-mono">
                        This password will be required to open the PDF. Processing is done locally in your browser.
                    </p>
                </div>
            </div>

            <button 
              onclick={protectAction}
              disabled={isProcessing || !password}
              class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] 
                     hover:bg-slate-800 disabled:bg-slate-300 transition-all flex items-center justify-center shadow-lg"
            >
              {#if isProcessing}
                <Loader2 class="animate-spin mr-2" size={16} /> Encrypting Locally...
              {:else}
                Protect PDF
              {/if}
            </button>
            
            {#if error}
              <p class="mt-4 text-[10px] font-mono text-red-500 uppercase text-center font-bold tracking-widest">{error}</p>
            {/if}

            {#if protectedUrl && !isProcessing}
              <SuccessState 
                type="file"
                title="Protection Complete" 
                subTitle="Your PDF has been encrypted with 256-bit AES security." 
                file={{ 
                  name: resultFileName, 
                  size: fileSize, 
                  url: protectedUrl 
                }}
                onReset={reset}
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
