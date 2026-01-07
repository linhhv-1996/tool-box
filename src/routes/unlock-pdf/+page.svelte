<script lang="ts">
  // @ts-nocheck
  import createModule from '@neslinesli93/qpdf-wasm';
  import qpdfWasmUrl from '@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url';
  import { Eye, EyeOff, Unlock } from 'lucide-svelte';
  
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  // @ts-ignore
  import Content from '$lib/content/unlock-pdf.md';

  const toolInfo = allTools.find((t) => t.id === 'unlock-pdf')!;
  const related = allTools.filter((t) => t.id !== 'unlock-pdf').slice(0, 6);

  let file = $state<File | null>(null);
  let password = $state("");
  let showPassword = $state(false);
  let isProcessing = $state(false);
  let error = $state("");
  let unlockedUrl = $state<string | null>(null);
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
    unlockedUrl = null;
    const pdf = newFiles.find((f) => f.type === "application/pdf");
    if (!pdf) {
      error = "Please select a valid PDF file.";
      return;
    }
    file = pdf;
  }

  async function unlockAction() {
    if (!file || !password) return;
    isProcessing = true;
    error = "";

    try {
      const qpdf = await createModule({
        locateFile: () => qpdfWasmUrl
      });

      const inputBuffer = await file.arrayBuffer();
      qpdf.FS.writeFile('input.pdf', new Uint8Array(inputBuffer));

      // Execute decryption command
      // Format: qpdf --password=PW --decrypt input.pdf output.pdf
      qpdf.callMain(['--password=' + password, '--decrypt', 'input.pdf', 'output.pdf']);

      const outputData = qpdf.FS.readFile('output.pdf');
      const blob = new Blob([outputData], { type: 'application/pdf' });
      
      if (unlockedUrl) URL.revokeObjectURL(unlockedUrl);
      unlockedUrl = URL.createObjectURL(blob);
      fileSize = blob.size;
      resultFileName = `${file.name.replace('.pdf', '')}_unlocked.pdf`;

      qpdf.FS.unlink('input.pdf');
      qpdf.FS.unlink('output.pdf');
    } catch (e: any) {
      error = "Unlock failed. Please check if the password is correct.";
    } finally {
      isProcessing = false;
    }
  }
</script>

<svelte:head>
  <title>{toolInfo.name} | JUSTLOCALTOOLS_</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-12">
  <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

  <div class="mt-10 bg-white border border-slate-200 p-6 md:p-10 rounded-sm shadow-sm">
    <Dropzone onfiles={handleFiles} multiple={false} />

    {#if file}
      <div class="mt-10 animate-in fade-in slide-in-from-bottom-2">
        <div class="flex justify-between items-end border-b border-slate-100 pb-2 mb-4">
          <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">Locked Document</span>
          <button onclick={() => {file = null; unlockedUrl = null; password = "";}} class="text-[10px] font-mono uppercase hover:text-black cursor-pointer underline underline-offset-4 decoration-slate-200">Remove</button>
        </div>

        <div class="py-3 flex justify-between items-center gap-4 font-mono border-b border-slate-50 mb-10">
            <div class="flex items-center gap-3 min-w-0 flex-1">
                <span class="text-[12px] text-[#1a1a1a] truncate font-bold shrink grow-0">{file.name}</span>
                <span class="text-[9px] text-slate-400 uppercase bg-slate-50 px-1.5 py-0.5 rounded-sm border border-slate-100 whitespace-nowrap">{formatBytes(file.size)}</span>
            </div>
        </div>

        <div class="mb-10 flex flex-col items-center">
            <div class="w-full max-w-full">
                <label for="pw" class="block font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-3 text-center md:text-left">
                    Enter PDF Password
                </label>
                <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-black transition-colors">
                        <Unlock size={14} />
                    </div>
                    <input 
                        id="pw"
                        type={showPassword ? "text" : "password"} 
                        bind:value={password}
                        placeholder="Type password to unlock..."
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
                <p class="mt-3 text-[10px] text-slate-400 font-mono text-center md:text-left">
                    The password is required to remove security restrictions.
                </p>
            </div>
        </div>

        <button 
          onclick={unlockAction}
          disabled={isProcessing || !password}
          class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] 
                 hover:bg-slate-800 active:bg-slate-900 cursor-pointer
                 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {#if isProcessing}
            <span class="animate-pulse tracking-widest">Unlocking Locally...</span>
          {:else}
            Unlock PDF
          {/if}
        </button>
        
        {#if error}
           <p class="mt-4 text-[10px] font-mono text-red-500 uppercase text-center font-bold tracking-widest">{error}</p>
        {/if}

        {#if unlockedUrl && !isProcessing}
          <div class="mt-12 p-8 border border-slate-100 bg-slate-50/30 rounded-sm flex flex-col items-center animate-in fade-in slide-in-from-bottom-2">
            <div class="w-10 h-10 bg-[#22c55e] text-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h4 class="text-md font-bold text-black mb-1">Unlock Complete</h4>
            <div class="flex items-center gap-3 mb-6">
               <p class="text-[12px] text-slate-500 font-mono truncate max-w-[200px]">{resultFileName}</p>
               <span class="font-mono text-[11px] font-bold text-black bg-white border border-slate-200 px-2 py-0.5 rounded-sm">{formatBytes(fileSize)}</span>
            </div>
            
            <a 
              href={unlockedUrl} 
              download={resultFileName}
              class="inline-flex items-center gap-3 bg-[#22c55e] text-white px-12 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] 
                     hover:bg-[#16a34a] cursor-pointer transition-all shadow-md active:scale-[0.98]"
            >
              Download Unlocked PDF
            </a>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <article class="prose mt-24 border-t border-slate-100 pt-16 mx-auto">
    <Content />
  </article>

  <div class="mt-24 border-t border-slate-100 pt-16 pb-20">
    <h3 class="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-10 pb-2 border-b border-slate-50">
      Related Tools
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
      {#each related as r}
        <div class="font-sans">
          <a href={r.href} class="group block">
            <span class="font-bold block group-hover:underline text-[#1a1a1a] transition-all underline-offset-2 tracking-tight">{r.name}</span>
            <span class="text-[11px] text-slate-400 font-mono uppercase tracking-tight mt-0.5 block">{r.desc}</span>
          </a>
        </div>
      {/each}
    </div>
  </div>
</div>
