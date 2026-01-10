<script lang="ts">
  // @ts-nocheck
  import qpdfWasmUrl from '@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url';
  import { Loader2, Lock, Unlock, AlertCircle, FileText } from 'lucide-svelte';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  import Content from '$lib/content/unlock-pdf.md';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // --- LOGIC WASM ---
  let createModule = $state<any>(null);
  onMount(async () => {
    if (browser) {
      const module = await import('@neslinesli93/qpdf-wasm');
      createModule = module.default || module;
    }
  });

  const toolInfo = allTools.find(t => t.id === 'unlock-pdf')!;
  const related = allTools.filter(t => t.id !== 'unlock-pdf').slice(0, 5);

  let file = $state<File | null>(null);
  let password = $state("");
  let isProcessing = $state(false);
  let error = $state("");
  let unlockedUrl = $state<string | null>(null);
  let unlockedSize = $state(0);
  let resultFileName = $state("");

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function handleFiles(newFiles: File[]) {
    error = "";
    unlockedUrl = null;
    if (newFiles.length > 0) {
      file = newFiles[0];
    }
  }

  async function unlockAction() {
    if (!file || !createModule) return;
    isProcessing = true;
    error = "";
    unlockedUrl = null;

    let qpdf;
    try {
      qpdf = await createModule({ locateFile: () => qpdfWasmUrl });
      const inputBuffer = await file.arrayBuffer();
      qpdf.FS.writeFile('input.pdf', new Uint8Array(inputBuffer));

      try {
        // Sử dụng qpdf để decrypt với mật khẩu
        qpdf.callMain(['--password=' + password, '--decrypt', 'input.pdf', 'output.pdf']);
      } catch (e: any) {
        // qpdf ném lỗi exit status 0 là bình thường, nếu khác 0 mới là lỗi thực sự
        if (e.name !== 'ExitStatus' || e.status !== 0) {
          throw new Error("Incorrect password or unsupported PDF format.");
        }
      }

      const outputData = qpdf.FS.readFile('output.pdf');
      const blob = new Blob([outputData], { type: 'application/pdf' });
      unlockedSize = blob.size;
      resultFileName = `unlocked_${file.name}`;
      
      if (unlockedUrl) URL.revokeObjectURL(unlockedUrl);
      unlockedUrl = URL.createObjectURL(blob);

      qpdf.FS.unlink('input.pdf');
      qpdf.FS.unlink('output.pdf');
    } catch (e) {
      error = "Incorrect password. Please try again.";
      console.error(e);
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    file = null;
    password = "";
    unlockedUrl = null;
    unlockedSize = 0;
    error = "";
  }
</script>

<svelte:head>
  <title>{toolInfo.name} - Remove PDF Password & Restrictions Online Free</title>
  
  <meta name="description" content="Unlock your PDF files and remove passwords or printing/editing restrictions directly in your browser. 100% private, client-side decryption ensures your documents and passwords never leave your device." />
  <meta name="keywords" content="unlock pdf, remove pdf password, pdf restriction remover, online pdf unlocker, secure pdf decryption, unlock pdf without upload, browser-based pdf unlocker, remove pdf print protection" />
  <link rel="canonical" href="https://justlocaltools.com/unlock-pdf" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/unlock-pdf" />
  <meta property="og:title" content="{toolInfo.name} - Instant & Private PDF Decryption" />
  <meta property="og:description" content="Gaining full access to your PDF files privately. Remove open passwords and usage restrictions locally on your device without any server-side processing." />

  {@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "${toolInfo.name}",
      "operatingSystem": "Any",
      "applicationCategory": "BusinessApplication",
      "description": "A secure browser-based tool to remove passwords and security restrictions from PDF documents locally.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  </script>`}
</svelte:head>


<div class="max-w-[980px] mx-auto px-4 py-6 md:py-10">
  <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

  <div class="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8">
    <main class="min-w-0">
      <div class="bg-white border border-slate-200 rounded-sm shadow-sm p-5 md:p-8">
        
        <Dropzone 
          accept=".pdf"
          multiple={false}
          hasFiles={!!file}
          onfiles={handleFiles}
          onClear={reset}
          label="Select Encrypted PDF File"
        />

        {#if file }
          <div class="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div class="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-sm mb-6">
              <div class="w-10 h-10 bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                <FileText size={18} />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[12px] font-bold text-black truncate leading-tight">{file.name}</p>
                <p class="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{formatBytes(file.size)}</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="bg-slate-50/50 border border-slate-100 p-5 rounded-sm">
                <label for="pw" class="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-2 ml-1 tracking-widest">
                  PDF Password:
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-black transition-colors">
                    <Lock size={14} />
                  </div>
                  <input 
                    type="password" 
                    id="pw"
                    bind:value={password}
                    placeholder="Enter password to unlock..."
                    class="w-full h-12 pl-10 px-4 bg-white border border-slate-200 rounded-sm font-mono text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                onclick={unlockAction}
                disabled={isProcessing || !password}
                class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-200 transition-all flex items-center justify-center shadow-lg"
              >
                {#if isProcessing}
                  <Loader2 class="animate-spin mr-2" size={16} /> Unlocking...
                {:else}
                  <Unlock size={14} class="mr-2" /> Unlock PDF Now
                {/if}
              </button>
            </div>
          </div>
        {/if}

        {#if unlockedUrl && !isProcessing}
          <div class="mt-6 animate-in fade-in zoom-in-95 duration-500">
            <SuccessState 
              title="Unlocked Successfully"
              file={{ name: resultFileName, size: unlockedSize, url: unlockedUrl }}
              onReset={reset}
            />
            
            
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
                <span class="text-xs font-bold block group-hover:text-black text-slate-700 transition-colors underline-offset-2 group-hover:underline">{r.name}</span>
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
</style>
