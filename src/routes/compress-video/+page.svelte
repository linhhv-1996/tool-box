<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { Loader2, Settings2, ShieldCheck, Zap, FileVideo, CheckCircle2, AlertCircle, Download, Trash2, X } from 'lucide-svelte';
  import { FFmpeg } from '@ffmpeg/ffmpeg';
  import { fetchFile, toBlobURL } from '@ffmpeg/util';
  import JSZip from 'jszip';
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  // @ts-ignore
  import Content from '$lib/content/video-compress.md';

  // --- INTERFACE & STATE (Svelte 5) ---
  interface VideoFile {
    file: File;
    status: 'pending' | 'processing' | 'done' | 'error';
    progress: number;
    resultUrl?: string;
    resultSize?: number;
    resultName?: string;
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

  // GIỚI HẠN
  const MAX_SINGLE_FILE_SIZE = 200 * 1024 * 1024; // 200MB mỗi file
  const MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500MB tổng cộng
  
  const toolInfo = allTools.find((t) => t.id === 'compress-video')!;
  const related = allTools.filter((t) => t.id !== 'compress-video' && t.id !== 'video-to-gif').slice(0, 6);

  onMount(async () => {
    if (browser) await loadFFmpeg();
  });

  onDestroy(() => {
    if (ffmpeg) ffmpeg.terminate(); // Giải phóng bộ nhớ
    // Thu hồi các URL đã tạo để tránh rò rỉ bộ nhớ
    videoQueue.forEach(v => { if (v.resultUrl) URL.revokeObjectURL(v.resultUrl); });
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
      error = "High-speed engine failed to load. Ensure COOP/COEP headers are active.";
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
        error = `File "${f.name}" is too large (Max 200MB).`;
        return;
      }
      currentTotal += f.size;
      tempQueue.push({ file: f, status: 'pending', progress: 0 });
    }

    if (currentTotal > MAX_TOTAL_SIZE) {
      error = "Total size exceeds 500MB limit. Please select fewer files.";
      return;
    }

    videoQueue = tempQueue;
    batchZipUrl = null;
  }

  function removeFile(index: number) {
    if (isProcessing) return;
    const item = videoQueue[index];
    if (item.resultUrl) {
      URL.revokeObjectURL(item.resultUrl);
    }
    videoQueue = videoQueue.filter((_, i) => i !== index);
    if (videoQueue.length === 0) {
      batchZipUrl = null;
    }
  }

  async function startBatchCompression() {
    if (videoQueue.length === 0 || !ffmpeg || !isLoaded) return;
    isProcessing = true;
    error = "";
    const zip = new JSZip();

    try {
      for (let i = 0; i < videoQueue.length; i++) {
        const item = videoQueue[i];
        item.status = 'processing';
        const inputName = `input_${i}.mp4`;
        const outputName = `output_${i}.mp4`;

        ffmpeg.on('progress', ({ progress: p }) => {
          item.progress = Math.round(p * 100);
          overallProgress = Math.round(((i + p) / videoQueue.length) * 100);
        });

        await ffmpeg.writeFile(inputName, await fetchFile(item.file));

        let crf = "26";
        let vf = "scale='min(1280,iw)':-2"; // Balanced: Capped at 720p

        if (quality === "small") { 
          crf = "32";
          vf = "scale='min(854,iw)':-2"; 
        } else if (quality === "high") { 
          crf = "20";
          vf = ""; 
        }

        const args = ['-i', inputName];
        if (vf) args.push('-vf', vf);
        args.push('-vcodec', 'libx264', '-crf', crf, '-preset', 'veryfast', '-acodec', 'aac', '-b:a', '128k', '-movflags', 'faststart', outputName);

        await ffmpeg.exec(args);

        const data = await ffmpeg.readFile(outputName);
        const blob = new Blob([data as any], { type: 'video/mp4' });

        // Lưu kết quả riêng cho từng file để download lẻ
        item.resultUrl = URL.createObjectURL(blob);
        item.resultSize = blob.size;
        item.resultName = `compressed_${item.file.name.split('.')[0]}.mp4`;
        item.status = 'done';

        // Add vào ZIP cho download bộ
        zip.file(item.resultName, data as Uint8Array);

        // Dọn dẹp RAM ngay lập tức
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);
      }

      const zipContent = await zip.generateAsync({ type: "blob" });
      batchZipUrl = URL.createObjectURL(zipContent);
      batchZipSize = zipContent.size;
    } catch (e: any) {
      error = "An error occurred: " + e.message;
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    videoQueue.forEach(v => { if (v.resultUrl) URL.revokeObjectURL(v.resultUrl); });
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

<div class="max-w-[980px] mx-auto px-0 py-12">
  <div class="flex flex-col lg:flex-row lg:justify-between">
    <div class="w-full lg:w-[640px] shrink-0">
      <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

      <div class="mt-10 bg-white border border-slate-200 p-6 md:p-10 rounded-sm shadow-sm">
       
        {#if !isLoaded}
          <div class="flex flex-col items-center py-12">
            <Loader2 class="animate-spin text-slate-300 mb-4" size={32} />
            <p class="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">Initializing Engine...</p>
          </div>
        {:else}
          <Dropzone onfiles={handleFiles} multiple={true} accept="video/*" />

          {#if videoQueue.length > 0}
   
            <div class="mt-10 animate-in fade-in slide-in-from-bottom-2">
              <div class="flex justify-between items-end border-b border-slate-100 pb-2 mb-4">
                <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">Processing Queue ({videoQueue.length})</span>
                <button onclick={reset} class="text-[10px] font-mono uppercase underline hover:text-red-500">Clear All</button>
              </div>

              <div class="space-y-2 mb-8 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                {#each videoQueue as item, i}
                  <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-sm">
                    <div class="flex items-center gap-3 min-w-0 flex-1">
                      <FileVideo size={14} class={item.status === 'processing' ? "text-blue-500 animate-pulse" : "text-slate-400"} />
                      <div class="flex flex-col min-w-0">
                        <span class="text-[11px] font-mono font-bold truncate" title={item.file.name}>{item.file.name}</span>
                        <div class="flex items-center gap-2 mt-0.5">
                          <span class="text-[9px] font-mono text-slate-400 uppercase">{formatBytes(item.file.size)}</span>
                          {#if item.resultSize}
                            <span class="text-[9px] font-mono text-green-600 font-bold">→ {formatBytes(item.resultSize)}</span>
                          {/if}
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-3 ml-4">
                      {#if item.status === 'done' && item.resultUrl}
                        <a 
                          href={item.resultUrl} 
                          download={item.resultName} 
                          class="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-sm text-[9px] font-bold font-mono uppercase text-blue-600 hover:border-blue-400 transition-colors"
                        >
                          <Download size={10} /> Download
                        </a>
                        <CheckCircle2 size={14} class="text-green-500" />
                      {:else if item.status === 'processing'}
                        <span class="text-[10px] font-mono font-bold text-blue-500">{item.progress}%</span>
                      {:else if item.status === 'pending'}
                        <span class="text-[9px] font-mono text-slate-300 uppercase italic">Waiting</span>
                      {/if}

                      {#if !isProcessing && item.status !== 'processing'}
                        <button 
                          onclick={() => removeFile(i)}
                          class="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                          title="Remove file"
                        >
                          <X size={14} />
                        </button>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>

              <div class="mb-8">
                <div>
                  <label class="block font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-3">Compression Level</label>
                  <div class="flex gap-2">
                    {#each [{id:'small', label:'Small'}, {id:'balanced', label:'Balanced'}, {id:'high', label:'High'}] as q}
                      <button 
                        onclick={() => quality = q.id} 
                        class="flex-1 py-3 border font-mono text-[11px] uppercase transition-all {quality === q.id ? 'border-black bg-black text-white' : 'border-slate-200 text-slate-400 hover:border-slate-400'}"
                      >
                        {q.label}
                      </button>
                    {/each}
                  </div>
                </div>
                <br>
                <div class="p-4 bg-amber-50 border border-amber-100 rounded-sm flex gap-3">
                  <AlertCircle size={16} class="text-amber-600 shrink-0 mt-0.5" />
                  <div class="flex flex-col">
                    <span class="text-[10px] font-bold uppercase text-amber-700 tracking-tight">Performance Warning</span>
                    <p class="text-[9px] text-amber-600/80 leading-relaxed font-mono italic">
                      Video compression is CPU-intensive. Keep this tab active for better speed.
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onclick={startBatchCompression} 
                disabled={isProcessing} 
                class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-300 transition-all flex items-center justify-center shadow-lg"
              >
                {#if isProcessing}
                  <Loader2 class="animate-spin mr-2" size={16} />
                  Processing {overallProgress}%
                {:else}
                  {batchZipUrl ? 'Process Again' : 'Start Batch Compression'}
                {/if}
              </button>

              {#if error}
                <p class="mt-4 text-[10px] font-mono text-red-500 uppercase text-center font-bold">{error}</p>
              {/if}

              {#if batchZipUrl && !isProcessing}
                <div class="mt-6 pt-6 border-t border-dashed border-slate-100">
                  <SuccessState 
                    type="file" 
                    title="All Done!"
                    subTitle="Videos are compressed. You can download them individually above or the full batch below."
                    file={{ name: `compressed_bundle.zip`, size: batchZipSize, url: batchZipUrl }}
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

<style>
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>
