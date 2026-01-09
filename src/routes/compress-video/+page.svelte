<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { Loader2, Settings2, ShieldCheck, Zap } from 'lucide-svelte';
  import { FFmpeg } from '@ffmpeg/ffmpeg';
  import { fetchFile, toBlobURL } from '@ffmpeg/util';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  // @ts-ignore
  import Content from '$lib/content/video-compress.md';

  // --- STATE (Svelte 5) ---
  let ffmpeg: FFmpeg | null = $state(null);
  let isLoaded = $state(false);
  let isProcessing = $state(false);
  let progress = $state(0);
  let error = $state("");
  
  let file = $state<File | null>(null);
  let quality = $state("balanced"); // options: small, balanced, high
  let resultUrl = $state<string | null>(null);
  let resultSize = $state(0);
  let resultFileName = $state("");

  const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
  const toolInfo = allTools.find((t) => t.id === 'compress-video')!;
  const related = allTools.filter((t) => t.id !== 'compress-video' && t.id !== 'video-to-gif').slice(0, 6);

  onMount(async () => {
    if (browser) {
      await loadFFmpeg();
    }
  });

  onDestroy(() => {
    if (ffmpeg) {
      try {
        ffmpeg.terminate(); // Giải phóng bộ nhớ khi chuyển trang hoặc F5
      } catch (e) {
        console.error("FFmpeg termination error:", e);
      }
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

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]; // Đồng bộ format với tool PDF
  }

  function handleFiles(files: File[]) {
    const selected = files[0];
    if (selected.size > MAX_FILE_SIZE) {
      error = "File too large. Maximum size is 200MB for stable browser processing.";
      file = null;
      return;
    }
    file = selected;
    resultUrl = null;
    error = "";
    progress = 0;
  }

  async function startCompression() {
    if (!file || !ffmpeg || !isLoaded) return;
    isProcessing = true;
    error = "";
    progress = 0;

    const inputName = 'input.mp4';
    const outputName = 'output.mp4';

    ffmpeg.on('progress', ({ progress: p }) => {
      progress = Math.round(p * 100);
    });

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // Cấu hình dựa trên lựa chọn của người dùng
      let crf = "26";
      let vf = "scale='min(1280,iw)':-2"; // Balanced: Max 720p

      if (quality === "small") {
        crf = "32"; // Nén mạnh hơn
        vf = "scale='min(854,iw)':-2"; // Thu nhỏ về 480p
      } else if (quality === "high") {
        crf = "20"; // Chất lượng cao, file nặng hơn
        vf = ""; // Giữ nguyên độ phân giải gốc
      }

      const execArgs = ['-i', inputName];
      if (vf) execArgs.push('-vf', vf);
      
      execArgs.push(
        '-vcodec', 'libx264',
        '-crf', crf, 
        '-preset', 'veryfast',
        '-acodec', 'aac', 
        '-b:a', '128k',
        '-movflags', 'faststart',
        outputName
      );

      await ffmpeg.exec(execArgs);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data as any], { type: 'video/mp4' });
      resultUrl = URL.createObjectURL(blob);
      resultSize = blob.size;
      resultFileName = `compressed_${file.name.split('.')[0]}.mp4`;

      // Dọn dẹp hệ thống file ảo để tránh tràn bộ nhớ trình duyệt
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

    } catch (e: any) {
      error = "Compression error: " + (e.message || "The process was interrupted.");
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    file = null;
    resultUrl = null;
    progress = 0;
    error = "";
  }
</script>

<svelte:head>
  <title>{toolInfo.name} - Fast & Private Online Video Compressor</title>
  <meta name="description" content="Reduce video file size locally in your browser. No server uploads, 100% private and secure. Supports MP4, MOV, and WebM using FFmpeg technology." />
  <meta property="og:title" content="{toolInfo.name} - JustLocalTools" />
  <meta property="og:description" content="Compress videos without compromising privacy. All processing happens on your device." />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Video Compressor",
    "url": "https://justlocaltools.com/compress-video",
    "description": "Compress video files locally in your browser using FFmpeg WASM.",
    "applicationCategory": "MultimediaApplication",
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
                <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">Selected Video</span>
                <button onclick={reset} class="text-[10px] font-mono uppercase underline underline-offset-4 decoration-slate-200 hover:text-red-500 transition-colors">Remove</button>
              </div>

              <div class="py-3 flex justify-between items-center gap-4 font-mono border-b border-slate-50 mb-10">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <span class="text-[12px] text-[#1a1a1a] truncate font-bold shrink grow-0" title={file.name}>{file.name}</span>
                  <span class="text-[9px] text-slate-400 uppercase bg-slate-50 px-1.5 py-0.5 rounded-sm border border-slate-100 whitespace-nowrap">
                    {formatBytes(file.size)}
                  </span>
                </div>
              </div>

              <div class="mb-10">
                <label class="block font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-3">Compression Level</label>
                <div class="flex gap-2">
                  {#each [
                    { id: 'small', label: 'Small File', desc: '480p - High compression' },
                    { id: 'balanced', label: 'Balanced', desc: '720p - Standard' },
                    { id: 'high', label: 'High Quality', desc: 'Original Res - Low compression' }
                  ] as q}
                    <button 
                      onclick={() => quality = q.id} 
                      class="flex-1 py-3 border font-mono text-[11px] uppercase transition-all {quality === q.id ?
                      'border-black bg-black text-white' : 'border-slate-200 text-slate-400 hover:border-slate-400'}"
                    >
                      {q.label}
                    </button>
                  {/each}
                </div>
              </div>

              <!-- <div class="mb-8 p-5 bg-slate-50 border border-slate-100 rounded-sm space-y-6">
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
                      <span class="text-[10px] font-bold uppercase tracking-tight">Privacy Guaranteed</span>
                      <p class="text-[9px] text-slate-400 leading-relaxed font-mono italic">
                        Processing occurs 100% on your device. No video data ever reaches our servers.
                      </p>
                    </div>
                  </div>
                </div>
              </div> -->

              <button 
                onclick={startCompression}
                disabled={isProcessing}
                class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-300 transition-all flex items-center justify-center shadow-lg"
              >
                {#if isProcessing}
                  <Loader2 class="animate-spin mr-2" size={16} /> 
                  Compressing {progress}%
                {:else}
                  {resultUrl ? 'Convert Again' : 'Start Compression'}
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
                    subTitle="Your video has been successfully optimized for web use."
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

    <aside class="w-full lg:w-[310px] shrink-0 mt-16 lg:mt-0">
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
      </div>
    </aside>
  </div>
</div>
