<script lang="ts">
  // @ts-nocheck
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { Loader2, Zap, FileVideo, CheckCircle2, AlertCircle, Trash2, FileCheck } from 'lucide-svelte';
  import { FFmpeg } from '@ffmpeg/ffmpeg';
  import { fetchFile, toBlobURL } from '@ffmpeg/util';
  import JSZip from 'jszip';
  
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  import Content from '$lib/content/video-compress.md';

  // --- LOGIC GỐC ---
  interface VideoFile {
    file: File;
    status: 'pending' | 'processing' | 'done' | 'error';
    progress: number;
    resultSize?: number;
    resultName?: string;
    isOptimized?: boolean;
  }

  let ffmpeg: FFmpeg | null = $state(null);
  let isLoaded = $state(false);
  let isProcessing = $state(false);
  let overallProgress = $state(0);
  let error = $state("");
  let videoQueue = $state<VideoFile[]>([]);
  let quality = $state("balanced");
  let batchZipUrl = $state<string | null>(null);
  let batchZipSize = $state(0);

  const MAX_SINGLE_FILE_SIZE = 200 * 1024 * 1024;
  const MAX_TOTAL_SIZE = 500 * 1024 * 1024;
  
  const toolInfo = allTools.find((t) => t.id === 'compress-video')!;
  const related = allTools.filter((t) => t.id !== 'compress-video').slice(0, 5);

  onMount(async () => {
    if (browser) await loadFFmpeg();
  });

  onDestroy(() => {
    if (ffmpeg) ffmpeg.terminate();
    if (batchZipUrl) URL.revokeObjectURL(batchZipUrl);
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
      error = "High-speed engine failed to load.";
    }
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function handleFiles(newFiles: File[]) {
    error = "";
    let tempQueue: VideoFile[] = [];
    let currentTotal = 0;
    for (const f of newFiles) {
      if (f.size > MAX_SINGLE_FILE_SIZE) {
        error = `File "${f.name}" too large (Max 200MB).`;
        return;
      }
      currentTotal += f.size;
      tempQueue.push({ file: f, status: 'pending', progress: 0 });
    }
    if (currentTotal > MAX_TOTAL_SIZE) {
      error = "Total size exceeds 500MB limit.";
      return;
    }
    videoQueue = [...videoQueue, ...tempQueue];
    batchZipUrl = null;
  }

  function removeFile(index: number) {
    if (isProcessing) return;
    videoQueue = videoQueue.filter((_, i) => i !== index);
    if (videoQueue.length === 0) reset();
  }

  const totalSaving = $derived(
    videoQueue.reduce((acc, item) => {
      if (item.status === 'done' && item.resultSize) {
        const saving = item.file.size - item.resultSize;
        return acc + (saving > 0 ? saving : 0);
      }
      return acc;
    }, 0)
  );

  async function startBatchCompression() {
    if (videoQueue.length === 0 || !ffmpeg || !isLoaded) return;
    isProcessing = true;
    error = "";
    batchZipUrl = null;
    const zip = new JSZip();

    try {
      for (let i = 0; i < videoQueue.length; i++) {
        const item = videoQueue[i];
        if (item.status === 'done') continue;
        
        item.status = 'processing';
        const inputName = `input_${i}.mp4`;
        const outputName = `output_${i}.mp4`;

        ffmpeg.on('progress', ({ progress: p }) => {
          item.progress = Math.round(p * 100);
          overallProgress = Math.round(((i + p) / videoQueue.length) * 100);
        });

        await ffmpeg.writeFile(inputName, await fetchFile(item.file));

        let crf = "26";
        let vf = "scale='min(1280,iw)':-2";
        if (quality === "small") { crf = "32"; vf = "scale='min(854,iw)':-2"; } 
        else if (quality === "high") { crf = "20"; vf = ""; }

        const args = ['-i', inputName];
        if (vf) args.push('-vf', vf);
        args.push('-vcodec', 'libx264', '-crf', crf, '-preset', 'veryfast', '-acodec', 'aac', '-b:a', '128k', '-movflags', 'faststart', outputName);

        await ffmpeg.exec(args);
        const data = await ffmpeg.readFile(outputName);
        
        // SMART LOGIC: Giữ file gốc nếu nén xong nặng hơn
        const isBetter = data.length < item.file.size;
        const finalData = isBetter ? data : new Uint8Array(await item.file.arrayBuffer());

        item.resultSize = finalData.length;
        item.isOptimized = !isBetter;
        item.resultName = `shrunk_${item.file.name.split('.')[0]}.mp4`;
        item.status = 'done';

        zip.file(item.resultName, finalData);
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);
      }

      const zipContent = await zip.generateAsync({ type: "blob" });
      batchZipSize = zipContent.size;
      if (batchZipUrl) URL.revokeObjectURL(batchZipUrl);
      batchZipUrl = URL.createObjectURL(zipContent);
    } catch (e: any) {
      error = "An error occurred during compression.";
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    videoQueue = [];
    batchZipUrl = null;
    error = "";
    overallProgress = 0;
  }
</script>

<svelte:head>
  <title>{toolInfo.name} - Batch Video Compressor (Privacy-First)</title>
  <meta name="description" content="Compress multiple videos locally in your browser. Download individually or as a ZIP. 100% private, no server uploads." />
  
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/compress-video" />
  <meta property="og:title" content="{toolInfo.name} - Secure Browser-Based Video Compression" />
  <meta property="og:description" content="Compress your videos locally without uploading to any server. Fast, free, and private." />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Batch Video Compressor",
    "url": "https://justlocaltools.com/compress-video",
    "description": "Batch compress video files locally using FFmpeg WASM.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any"
  }
  </script>
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-6 md:py-10 text-left">
  <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

  <div class="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-8">
    <main class="min-w-0">
      <div class="bg-white border border-slate-200 rounded-sm shadow-sm p-5 md:p-8">
        
        {#if !isLoaded}
          <div class="flex flex-col items-center py-16">
            <Loader2 class="animate-spin text-slate-900 mb-4" size={32} />
            <p class="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">Initializing High-Speed Engine...</p>
          </div>
        {:else}
          <Dropzone 
            onfiles={handleFiles} 
            hasFiles={videoQueue.length > 0} 
            onClear={reset} 
            multiple={true} 
            accept="video/*" 
            label="Select Video Files to Compress"
          />

          {#if videoQueue.length > 0}
            <div class="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              
                <div class="mb-6 border border-slate-100 rounded-sm overflow-hidden bg-slate-50/50">
                  <div class="px-4 py-2 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                    <span class="text-[10px] font-mono font-bold text-slate-500 uppercase">Queue ({videoQueue.length})</span>
                  </div>
                  <ul class="divide-y divide-slate-100 max-h-48 overflow-y-auto custom-scrollbar">
                    {#each videoQueue as item, i}
                      <li class="px-4 py-3 flex items-center justify-between gap-3 bg-white">
                        <div class="flex items-center gap-3 flex-1 min-w-0">
                          <FileVideo size={14} class={item.status === 'processing' ? "text-blue-500 animate-pulse" : "text-slate-300"} />
                          <span class="text-[12px] font-medium text-black truncate leading-tight">{item.file.name}</span>
                        </div>
                        <div class="flex items-center gap-3 shrink-0 ml-2">
                          {#if item.status === 'processing'}
                            <span class="text-[10px] font-mono font-bold text-blue-500">{item.progress}%</span>
                          {:else}
                            <span class="text-[10px] font-mono text-slate-400 uppercase">{formatBytes(item.file.size)}</span>
                            <button onclick={() => removeFile(i)} disabled={isProcessing} class="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-100 transition-all rounded-sm shrink-0">
                              <Trash2 size={14} /></button>
                          {/if}
                        </div>
                      </li>
                    {/each}
                  </ul>
                </div>

                <div class="gap-6 mb-8 items-start">
                  <div class="bg-slate-50 border border-slate-100 p-5 rounded-sm">
                    <label class="block font-mono text-[10px] font-bold uppercase text-slate-500 mb-4 tracking-widest">Compression Level</label>
                    <div class="flex gap-2">
                      {#each [{id:'small', label:'Small (720p)'}, {id:'balanced', label:'Balanced'}, {id:'high', label:'High'}] as q}
                        <button onclick={() => quality = q.id} class="flex-1 py-2.5 border font-mono text-[10px] uppercase transition-all {quality === q.id ? 'bg-black text-white border-black' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400 rounded-sm'}">{q.label}</button>
                      {/each}
                    </div>
                  </div>
                  <br>
                  <div class="p-4 bg-amber-50 border border-amber-100 rounded-sm flex gap-3 shadow-sm">
                    <AlertCircle size={14} class="text-amber-600 shrink-0" />
                    <p class="text-[9px] text-amber-700 leading-relaxed font-mono uppercase font-bold tracking-tighter">CPU Intensive. Keep tab active.</p>
                  </div>
                </div>
              

              <button onclick={startBatchCompression} disabled={isProcessing} class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:bg-slate-200 transition-all flex items-center justify-center shadow-lg">
                {#if isProcessing} <Loader2 class="animate-spin mr-2" size={16} /> Processing {overallProgress}% {:else} <Zap size={14} class="mr-2" /> {batchZipUrl ? 'Process New Batch' : 'Start Compression'} {/if}
              </button>

              {#if batchZipUrl && !isProcessing}
                <div class="mt-6 animate-in fade-in zoom-in-95 duration-500">
                  <SuccessState 
                    title="Compression Done"
                    file={{ name: `compressed_bundle.zip`, size: batchZipSize, url: batchZipUrl, savings: totalSaving > 0 ? Math.round((totalSaving / (totalSaving + batchZipSize)) * 100) + '%' : '0%' }}
                    onReset={reset}
                    mainActionLabel="Download ZIP"
                  />

                  <div class="mt-6 animate-in fade-in slide-in-from-top-2 duration-500 text-left">
                    <p class="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest px-1 mb-2">Compression Details:</p>
                    <div class="max-h-[160px] overflow-y-auto custom-scrollbar border-t border-slate-100 pr-1">
                      <div class="flex flex-col">
                        {#each videoQueue as item}
                          <div class="flex justify-between items-center py-2.5 px-1 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                            <div class="flex-1 min-w-0 pr-4">
                              <span class="text-[11px] text-slate-500 truncate block font-mono" title={item.file.name}>{item.file.name}</span>
                            </div>
                            <div class="shrink-0 flex items-center gap-2 whitespace-nowrap font-mono text-right">
                              <span class="text-[10px] text-black font-bold">{formatBytes(item.resultSize || 0)}</span>
                              {#if item.isOptimized}
                                <span class="text-[8px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-100 uppercase font-bold">Tối ưu</span>
                              {:else}
                                <span class="text-[8px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold">-{formatBytes(item.file.size - (item.resultSize || 0))}</span>
                              {/if}
                            </div>
                          </div>
                        {/each}
                      </div>
                    </div>
                  </div>

                </div>
              {/if}
            </div>
          {/if}
        {/if}

        {#if error}
          <div class="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-mono font-bold uppercase flex items-center justify-center gap-2">
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
                <span class="text-xs font-bold block group-hover:text-black text-slate-700 leading-tight">{r.name}</span>
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
