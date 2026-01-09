<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { Loader2, Settings2, FileVideo, Zap, AlertCircle, ShieldCheck } from 'lucide-svelte';
  import { FFmpeg } from '@ffmpeg/ffmpeg';
  import { fetchFile, toBlobURL } from '@ffmpeg/util';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  import Content from '$lib/content/video-compress.md';

  // --- STATE (Svelte 5) ---
  let ffmpeg: FFmpeg | null = $state(null);
  let isLoaded = $state(false);
  let isProcessing = $state(false);
  let progress = $state(0);
  let error = $state("");
  
  let file = $state<File | null>(null);
  let resultUrl = $state<string | null>(null);
  let resultSize = $state(0);
  let resultFileName = $state("");

  const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB limit for browser stability
  const toolInfo = allTools.find((t) => t.id === 'compress-video')!;
  const related = allTools.filter((t) => t.id !== 'compress-video' && t.id !== 'video-to-gif').slice(0, 6);

  onMount(async () => {
    if (browser) {
      await loadFFmpeg();
    }
  });

  async function loadFFmpeg() {
    try {
      ffmpeg = new FFmpeg();
      const baseURL = '/ffmpeg';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
      });
      isLoaded = true;
    } catch (e: any) {
      error = "High-speed engine failed to load. Ensure COOP/COEP headers are active.";
    }
  }

  function handleFiles(files: File[]) {
    const selected = files[0];
    if (selected.size > MAX_FILE_SIZE) {
      error = "File too large. Maximum size is 100MB for browser processing.";
      file = null;
      return;
    }
    file = selected;
    resultUrl = null;
    error = "";
  }

  async function startCompression() {
    if (!file || !ffmpeg || !isLoaded) return;
    isProcessing = true;
    error = "";
    progress = 0;

    ffmpeg.on('progress', ({ progress: p }) => {
      progress = Math.round(p * 100);
    });

    try {
      const inputName = 'input.mp4';
      const outputName = 'output.mp4';
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // SMART LOGIC: 
      // 1. scale='min(1280,iw)':-2 -> Downscales to 720p ONLY if input is larger. 
      // 2. -crf 28 -> Balanced quality vs size.
      // 3. -preset veryfast -> Fast encoding for better UX/Ad retention.
      await ffmpeg.exec([
        '-i', inputName,
        '-vf', "scale='min(1280,iw)':-2", 
        '-vcodec', 'libx264',
        '-crf', '28', 
        '-preset', 'veryfast',
        '-acodec', 'aac', 
        '-b:a', '128k',
        '-movflags', 'faststart',
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data as any], { type: 'video/mp4' });
      resultUrl = URL.createObjectURL(blob);
      resultSize = blob.size;
      resultFileName = `compressed_${file.name.split('.')[0]}.mp4`;
    } catch (e: any) {
      error = "Compression error: " + e.message;
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    file = null;
    resultUrl = null;
    progress = 0;
  }
</script>

<svelte:head>
  <title>{toolInfo.name} - Fast Online Video Compressor</title>
</svelte:head>

<div class="max-w-[980px] mx-auto px-0 py-12">
  <div class="flex flex-col lg:flex-row lg:justify-between">
    <div class="w-full lg:w-[640px] shrink-0">
      <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

      <div class="mt-10 bg-white border border-slate-200 p-6 md:p-10 rounded-sm shadow-sm">
        {#if !isLoaded}
          <div class="flex flex-col items-center py-12">
            <Loader2 class="animate-spin text-slate-300 mb-4" size={32} />
            <p class="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Multi-thread Engine...</p>
          </div>
        {:else}
          <Dropzone onfiles={handleFiles} multiple={false} accept="video/*" />

          {#if file}
            <div class="mt-10 animate-in fade-in slide-in-from-bottom-2">
              <div class="flex justify-between items-end border-b border-slate-100 pb-2 mb-4">
                <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">Input File</span>
                <button onclick={reset} class="text-[10px] font-mono uppercase underline hover:text-red-500">Remove</button>
              </div>

              <div class="py-3 flex justify-between items-center font-mono mb-8">
                <span class="text-[12px] font-bold truncate pr-4">{file.name}</span>
                <span class="text-[9px] text-slate-400 uppercase bg-slate-50 px-1.5 py-0.5 rounded-sm border border-slate-100 italic shrink-0">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>

              <div class="mb-8 p-5 bg-slate-50 border border-slate-100 rounded-sm space-y-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Settings2 size={14} class="text-slate-400" />
                    <span class="font-mono text-[10px] font-bold uppercase text-slate-500 tracking-widest">Optimization Strategy</span>
                  </div>
                  <div class="flex items-center gap-1 text-[9px] font-bold text-green-600 uppercase">
                    <Zap size={10} fill="currentColor" /> Multi-thread On
                  </div>
                </div>
                
                <div class="grid grid-cols-1 gap-4">
                  <div class="flex items-start gap-3 bg-white p-3 border border-slate-200 rounded-sm">
                    <ShieldCheck size={14} class="text-blue-500 mt-0.5" />
                    <div class="flex flex-col">
                      <span class="text-[10px] font-bold uppercase tracking-tight">Smart Resize Enabled</span>
                      <p class="text-[9px] text-slate-400 leading-relaxed font-mono italic">Input > 720p will be capped. Smaller videos remain unchanged to prevent quality loss.</p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onclick={startCompression}
                disabled={isProcessing}
                class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-300 transition-all flex items-center justify-center shadow-lg"
              >
                {#if isProcessing}
                  <Loader2 class="animate-spin mr-2" size={16} /> 
                  Compressing {progress}%
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
                    subTitle="Your video has been optimized locally for web use."
                    file={{ name: resultFileName, size: resultSize, url: resultUrl }}
                    onReset={reset}
                  />
                </div>
              {/if}
            </div>
          {/if}
        {/if}
      </div>

      <article class="prose prose-slate max-w-none mt-16 border-t border-slate-100 pt-12">
        <Content />
      </article>
    </div>

    <aside class="w-full lg:w-[310px] shrink-0 mt-16 lg:mt-0 lg:pl-10">
      <div class="sticky top-8">
        <h3 class="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6 pb-2 border-b border-slate-100">Related Tools</h3>
        <div class="flex flex-col gap-y-6 mb-12">
          {#each related as r}
            <a href={r.href} class="group block">
              <span class="font-bold block group-hover:underline text-[#1a1a1a] transition-all underline-offset-2 leading-tight">{r.name}</span>
              <span class="text-[10px] text-slate-400 font-mono uppercase mt-1 block line-clamp-2 leading-relaxed">{r.desc}</span>
            </a>
          {/each}
        </div>

        <div class="bg-slate-50 border border-slate-100 aspect-[300/600] flex flex-col items-center justify-center p-6 text-center">
          <span class="text-[9px] font-mono text-slate-300 uppercase tracking-[0.3em] mb-4">Advertisement</span>
          <div class="w-full h-full bg-slate-100/50 rounded-sm border border-dashed border-slate-200 flex items-center justify-center text-slate-300 text-[10px] italic px-4">
            Monetize your tool traffic here.
          </div>
        </div>
      </div>
    </aside>
  </div>
</div>
