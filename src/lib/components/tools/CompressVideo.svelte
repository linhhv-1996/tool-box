<script lang="ts">
    import { 
        Input, Output, Conversion, BlobSource, BufferTarget, 
        Mp4OutputFormat, ALL_FORMATS 
    } from 'mediabunny';
    import { 
        Loader2, Zap, FileVideo, CheckCircle2, AlertCircle, 
        Trash2, FileCheck, FileDown
    } from "lucide-svelte";
    import JSZip from "jszip";
    import Dropzone from "$lib/components/Dropzone.svelte";
    import SuccessState from "$lib/components/SuccessState.svelte";
    import { ui, type Language } from "$lib/translate/ui";

    let { lang = "en" }: { lang: Language } = $props();

    interface VideoFile {
        file: File;
        status: "pending" | "processing" | "done" | "error";
        progress: number;
        resultSize?: number;
        resultName?: string;
        isOptimized?: boolean;
    }

    let isProcessing = $state(false);
    let overallProgress = $state(0);
    let error = $state("");
    let videoQueue = $state<VideoFile[]>([]);
    let qualityLevel = $state(5); // Mức 1-10
    let batchZipUrl = $state<string | null>(null);
    let batchZipSize = $state(0);

    const totalSaving = $derived(
        videoQueue.reduce((acc, item) => {
            if (item.status === "done" && item.resultSize) {
                const saving = item.file.size - item.resultSize;
                return acc + (saving > 0 ? saving : 0);
            }
            return acc;
        }, 0)
    );

    function formatBytes(bytes: number) {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    }

    // --- LOGIC NÉN V6 ---
    async function compressOne(item: VideoFile, index: number) {
        const file = item.file;
        const videoEl = document.createElement('video');
        videoEl.src = URL.createObjectURL(file);
        videoEl.muted = true;
        await new Promise((r) => (videoEl.onloadedmetadata = r));
        
        const duration = videoEl.duration;
        const originalBitrate = (file.size * 8) / duration;

        const factor = 0.2 + (qualityLevel - 1) * (0.8 / 9);
        let targetBitrate = Math.round(originalBitrate * factor * 0.9);
        targetBitrate = Math.max(500_000, Math.min(targetBitrate, 5_000_000));
        const targetAudioBitrate = Math.round((64 + qualityLevel * 12.8) * 1000);

        const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
        const output = new Output({ format: new Mp4OutputFormat(), target: new BufferTarget() });

        const conversion = await Conversion.init({
            input, output,
            video: { forceTranscode: true, bitrate: targetBitrate, hardwareAcceleration: 'prefer-hardware' },
            audio: { forceTranscode: true, bitrate: targetAudioBitrate }
        });

        conversion.onProgress = (p: number) => {
            item.progress = Math.round(p * 100);
            overallProgress = Math.round(((index + p) / videoQueue.length) * 100);
        };

        await conversion.execute();
        URL.revokeObjectURL(videoEl.src);
        return output.target.buffer;
    }

    async function startBatchCompression() {
        if (videoQueue.length === 0 || isProcessing) return;
        
        // FIX LỖI: Reset trạng thái để nén lại khi thay đổi quality
        videoQueue.forEach(item => {
            item.status = "pending";
            item.progress = 0;
        });

        isProcessing = true;
        error = "";
        batchZipUrl = null;
        const zip = new JSZip();

        try {
            for (let i = 0; i < videoQueue.length; i++) {
                const item = videoQueue[i];
                item.status = "processing";

                try {
                    const buffer = await compressOne(item, i);
                    const compressedData = new Uint8Array(buffer);

                    // Giữ bản tốt nhất
                    const isBetter = compressedData.length < item.file.size;
                    const finalData = isBetter ? compressedData : new Uint8Array(await item.file.arrayBuffer());

                    item.resultSize = finalData.length;
                    item.isOptimized = !isBetter;
                    item.resultName = `shrink_${item.file.name.split(".")[0]}.mp4`;
                    item.status = "done";

                    zip.file(item.resultName, finalData);
                } catch (e) {
                    item.status = "error";
                    throw e;
                }
            }

            const zipContent = await zip.generateAsync({ type: "blob" });
            batchZipSize = zipContent.size;
            batchZipUrl = URL.createObjectURL(zipContent);
        } catch (e: any) {
            error = ui.video_compress.err_4[lang as Language];
        } finally {
            isProcessing = false;
        }
    }

    function handleFiles(newFiles: File[]) {
        const temp = newFiles.map(f => ({ file: f, status: "pending", progress: 0 } as VideoFile));
        videoQueue = [...videoQueue, ...temp];
        batchZipUrl = null;
    }

    function removeFile(index: number) {
        videoQueue = videoQueue.filter((_, i) => i !== index);
        if (videoQueue.length === 0) reset();
    }

    function reset() {
        videoQueue = [];
        batchZipUrl = null;
        error = "";
        overallProgress = 0;
    }
</script>

<div class="bg-white border border-slate-200 rounded-sm shadow-sm p-5 md:p-8">
    <Dropzone
            lang={lang}
            onfiles={handleFiles}
            hasFiles={videoQueue.length > 0}
            onClear={reset}
            multiple={true}
            accept="video/*"
            label={ui.video_compress.drop_lbl[lang as Language]}
            compactLabel={ui.common.add_more[lang as Language]}
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
                                <FileVideo size={14} class={item.status === "processing" ? "text-blue-500 animate-pulse" : "text-slate-300"} />
                                <span class="text-[12px] font-medium text-black truncate leading-tight">{item.file.name}</span>
                            </div>
                            <div class="flex items-center gap-3 shrink-0 ml-2">
                                {#if item.status === "processing"}
                                    <span class="text-[10px] font-mono font-bold text-blue-500">{item.progress}%</span>
                                {:else}
                                    <span class="text-[10px] font-mono text-slate-400 uppercase">{formatBytes(item.file.size)}</span>
                                    <button onclick={() => removeFile(i)} disabled={isProcessing} class="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-100 transition-all rounded-sm shrink-0">
                                        <Trash2 size={14} />
                                    </button>
                                {/if}
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>

            <div class="bg-slate-50 border border-slate-100 p-5 rounded-sm mb-8">
                <!-- svelte-ignore a11y_label_has_associated_control -->
                <label class="block font-mono text-[10px] font-bold uppercase text-slate-500 mb-4 tracking-widest leading-relaxed">
                    {ui.video_compress.quality_lvl[lang as Language]}: {qualityLevel} (1: {ui.video_compress.strong_compress[lang as Language]} - 10: {ui.video_compress.high_quality[lang as Language]})
                </label>
                <input 
                    type="range" min="1" max="10" 
                    bind:value={qualityLevel} 
                    class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black" 
                />
                <div class="flex justify-between mt-2 text-[8px] font-mono text-slate-400 uppercase font-bold">
                    <span>{ui.video_compress.small_file[lang as Language]}</span>
                    <span>{ui.video_compress.high_quality[lang as Language]}</span>
                </div>
            </div>

            <button 
                onclick={startBatchCompression} 
                disabled={isProcessing} 
                class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:bg-slate-200 transition-all flex items-center justify-center shadow-lg"
            >
                {#if isProcessing}
                    <Loader2 class="animate-spin mr-2" size={16} /> {overallProgress}%
                {:else}
                    <Zap size={14} class="mr-2" /> {batchZipUrl ? ui.video_compress.process_new[lang] : ui.video_compress.start[lang]}
                {/if}
            </button>

            {#if batchZipUrl && !isProcessing}
                <div class="mt-6 animate-in fade-in zoom-in-95 duration-500">
                    <SuccessState 
                        lang={lang} 
                        title="Compression Done" 
                        file={{ 
                            name: `compressed_bundle.zip`, 
                            size: batchZipSize, 
                            url: batchZipUrl, 
                            savings: totalSaving > 0 ? Math.round((totalSaving / (totalSaving + batchZipSize)) * 100) + "%" : "0%" 
                        }} 
                        onReset={reset} 
                    />

                    <div class="mt-6 animate-in fade-in slide-in-from-top-2 duration-500 text-left">
                        <p class="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest px-1 mb-2">
                            {ui.video_compress.compress_detail[lang]}:
                        </p>
                        <div class="max-h-[160px] overflow-y-auto custom-scrollbar border-t border-slate-100 pr-1">
                            <div class="flex flex-col">
                                {#each videoQueue as item}
                                    {#if item.status === "done"}
                                        <div class="flex justify-between items-center py-2.5 px-1 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                            <div class="flex-1 min-w-0 pr-4">
                                                <span class="text-[11px] text-slate-500 truncate block font-mono" title={item.file.name}>{item.file.name}</span>
                                            </div>
                                            <div class="shrink-0 flex items-center gap-2 whitespace-nowrap font-mono text-right">
                                                <span class="text-[10px] text-black font-bold">{formatBytes(item.resultSize || 0)}</span>
                                                {#if item.isOptimized}
                                                    <span class="text-[8px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-100 uppercase font-bold">Optimized</span>
                                                {:else}
                                                    <span class="text-[8px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold">
                                                        -{formatBytes(item.file.size - (item.resultSize || 0))}
                                                    </span>
                                                {/if}
                                            </div>
                                        </div>
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    {/if}

    {#if error}
        <div class="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-mono font-bold uppercase flex items-center justify-center gap-2">
            <AlertCircle size={14} /> {error}
        </div>
    {/if}
</div>
