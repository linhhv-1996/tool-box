<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { Loader2, Settings2 } from 'lucide-svelte';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  import Content from '$lib/content/video-compress.md';

  // Svelte 5 State
  let ffmpeg = $state<any>(null);
  let isLoaded = $state(false);
  let isProcessing = $state(false);
  let progress = $state(0);
  let error = $state("");
  
  // Compression Settings
  let quality = $state(28); // CRF: lower is better quality (18-28 typical)
  let speed = $state('faster'); // ultrafast, superfast, veryfast, faster, fast, medium
  
  let file = $state<File | null>(null);
  let resultUrl = $state<string | null>(null);
  let resultFileName = $state("");
  let resultSize = $state(0);

  const toolInfo = allTools.find((t) => t.id === 'compress-video')!;
  const related = allTools.filter((t) => t.id !== 'compress-video' && t.id !== 'video-to-gif').slice(0, 6);

  onMount(async () => {
    if (browser) {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      ffmpeg = new FFmpeg();
    }
  });

  async function loadFFmpeg() {
    if (!ffmpeg || isLoaded) return;
    try {
      const { toBlobURL } = await import('@ffmpeg/util');
      const baseURL = '/ffmpeg'; 
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
      });
      isLoaded = true;
    } catch (e) {
      error = "Failed to load FFmpeg. SharedArrayBuffer support required.";
    }
  }

  async function compressAction() {
    if (!file || !ffmpeg) return;
    isProcessing = true;
    error = "";
    progress = 0;
    
    try {
      const { fetchFile } = await import('@ffmpeg/util');
      if (!isLoaded) await loadFFmpeg();

      ffmpeg.on('progress', ({ progress: p }: { progress: number }) => {
        progress = Math.round(p * 100);
      });

      const ext = file.name.split('.').pop();
      const inputName = `input.${ext}`;
      const outputName = `compressed_${Date.now()}.mp4`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // Dynamic command based on user options
      await ffmpeg.exec([
        '-i', inputName, 
        '-vcodec', 'libx264', 
        '-crf', quality.toString(), 
        '-preset', speed, 
        '-movflags', '+faststart',
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' });
      
      resultSize = blob.size;
      resultFileName = outputName;
      resultUrl = URL.createObjectURL(blob);

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (e) {
      error = "Compression failed. File might be too large for browser memory.";
    } finally {
      isProcessing = false;
    }
  }

  function handleFiles(newFiles: File[]) {
    if (newFiles.length > 0) {
      file = newFiles[0];
      resultUrl = null;
      error = "";
    }
  }

  function reset() {
    file = null;
    resultUrl = null;
    error = "";
    progress = 0;
  }
</script>

<svelte:head>
  <title>{toolInfo.name} - Private Online Video Reducer</title>
</svelte:head>

<div class="max-w-[980px] mx-auto px-0 py-12">
  <div class="flex flex-col lg:flex-row lg:justify-between">
    <div class="w-full lg:w-[640px] shrink-0">
      <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

      <div class="mt-10 bg-white border border-slate-200 p-6 md:p-10 rounded-sm shadow-sm">
        <Dropzone onfiles={handleFiles} multiple={false} accept="video/*" />

        {#if file}
          <div class="mt-10 animate-in fade-in slide-in-from-bottom-2">
            <div class="flex justify-between items-end border-b border-slate-100 pb-2 mb-4">
              <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">Selected File</span>
              <button onclick={reset} class="text-[10px] font-mono uppercase underline hover:text-red-500">Remove</button>
            </div>

            <div class="py-3 flex justify-between items-center font-mono mb-8">
              <span class="text-[12px] font-bold truncate">{file.name}</span>
              <span class="text-[9px] text-slate-400 uppercase bg-slate-50 px-1.5 py-0.5 rounded-sm border border-slate-100 italic">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>

            <div class="mb-8 p-5 bg-slate-50 border border-slate-100 rounded-sm space-y-6">
              <div class="flex items-center gap-2 mb-2">
                <Settings2 size={14} class="text-slate-400" />
                <span class="font-mono text-[10px] font-bold uppercase text-slate-500 tracking-widest">Compression Settings</span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <div class="flex justify-between font-mono text-[10px] uppercase">
                    <span>Quality (CRF)</span>
                    <span class="font-bold text-black">{quality}</span>
                  </div>
                  <input type="range" min="18" max="35" bind:value={quality} class="w-full accent-black cursor-pointer" />
                  <p class="text-[8px] text-slate-400 italic font-mono">18: High Quality / 35: High Compression</p>
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between font-mono text-[10px] uppercase">
                      <span>Speed Preset</span>
                    </div>
                    <select bind:value={speed} class="w-full h-8 bg-white border border-slate-200 font-mono text-[10px] px-2 outline-none">
                        <option value="ultrafast">Ultrafast (Fastest, Larger File)</option>
                        <option value="faster">Faster (Balanced)</option>
                        <option value="medium">Medium (Better Quality)</option>
                        <option value="veryslow">Slowest (Smallest File)</option>
                    </select>
                </div>
              </div>
            </div>

            <button 
              onclick={compressAction}
              disabled={isProcessing}
              class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-300 transition-all flex items-center justify-center shadow-lg"
            >
              {#if isProcessing}
                <Loader2 class="animate-spin mr-2" size={16} /> 
                Processing {progress}%...
              {:else}
                Start Compression
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
                  subTitle="Your video has been reduced in size locally in your browser." 
                  file={{ name: resultFileName, size: resultSize, url: resultUrl }}
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
