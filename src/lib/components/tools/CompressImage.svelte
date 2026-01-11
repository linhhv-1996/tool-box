<script lang="ts">
    import JSZip from "jszip";
    import {
        Loader2,
        Zap,
        FileImage,
        Trash2,
        SlidersHorizontal,
    } from "lucide-svelte";
    import Dropzone from "$lib/components/Dropzone.svelte";
    import SuccessState from "$lib/components/SuccessState.svelte";
    import { compressImage } from "$lib/utils/image-processor";
    import { browser } from "$app/environment";
    import type { Language } from "$lib/translate/ui";

    let { lang = "en" }: { lang: Language } = $props();

    let files = $state<File[]>([]);
    let isProcessing = $state(false);
    let quality = $state(75);
    let progress = $state({ current: 0, total: 0 });
    let error = $state("");
    let resultUrl = $state<string | null>(null);
    let resultFileName = $state("");
    let resultSize = $state(0);

    // Lưu trữ thông tin kết quả chi tiết
    let compressedDetails = $state<
        {
            name: string;
            oldSize: number;
            newSize: number;
            isOptimized: boolean;
        }[]
    >([]);

    function formatBytes(bytes: number) {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    }

    function handleFiles(newFiles: File[]) {
        error = "";
        resultUrl = null;
        const validTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];
        const validFiles = newFiles.filter((f) =>
            validTypes.includes(f.type.toLowerCase()),
        );

        if (validFiles.length === 0) {
            error = "Please select valid images (JPG, PNG, WebP).";
            return;
        }
        files = [...files, ...validFiles];
    }

    function removeFile(index: number) {
        files = files.filter((_, i) => i !== index);
        resultUrl = null;
        if (files.length === 0) reset();
    }

    function reset() {
        files = [];
        resultUrl = null;
        resultSize = 0;
        error = "";
        progress = { current: 0, total: 0 };
        compressedDetails = [];
    }

    // Derived: Chỉ tính toán số dung lượng thực sự tiết kiệm được (bỏ qua file tăng size)
    const totalSaving = $derived(
        compressedDetails.reduce((acc, img) => {
            const saving = img.oldSize - img.newSize;
            return acc + (saving > 0 ? saving : 0);
        }, 0),
    );

    async function shrinkAction() {
        if (files.length === 0 || !browser) return;
        isProcessing = true;
        error = "";
        progress = { current: 0, total: files.length };
        compressedDetails = [];
        const zip = new JSZip();
        let currentTotalOutputSize = 0;

        try {
            for (const file of files) {
                progress.current++;
                const compressedBlob = await compressImage(file, quality);

                // SMART LOGIC: Nếu nén xong mà to hơn gốc, lấy file gốc
                const isBetter = compressedBlob.size < file.size;
                const finalBlob = isBetter ? compressedBlob : file;

                compressedDetails.push({
                    name: file.name,
                    oldSize: file.size,
                    newSize: finalBlob.size,
                    isOptimized: !isBetter, // Đánh dấu file không nén thêm được
                });

                currentTotalOutputSize += finalBlob.size;
                zip.file(`shrink_${file.name}`, finalBlob);
            }

            const zipContent = await zip.generateAsync({ type: "blob" });
            resultSize = zipContent.size;
            resultFileName = `shrink_images_${Date.now()}.zip`;
            if (resultUrl) URL.revokeObjectURL(resultUrl);
            resultUrl = URL.createObjectURL(zipContent);
        } catch (e) {
            error = "Optimization failed. Try reducing quality.";
        } finally {
            isProcessing = false;
        }
    }
</script>

<div class="bg-white border border-slate-200 rounded-sm shadow-sm p-5 md:p-8">
    <Dropzone
        onfiles={handleFiles}
        hasFiles={files.length > 0}
        onClear={reset}
        accept="image/*"
    />

    {#if files.length > 0}
        <div class="mt-8 animate-in fade-in slide-in-from-bottom-2">
            <div
                class="mb-6 border border-slate-100 rounded-sm overflow-hidden bg-slate-50/50"
            >
                <div
                    class="px-4 py-2 bg-slate-100 border-b border-slate-200 flex justify-between items-center"
                >
                    <span
                        class="text-[10px] font-mono font-bold text-slate-500 uppercase"
                        >Queue ({files.length})</span
                    >
                </div>

                <ul
                    class="divide-y divide-slate-100 max-h-[180px] overflow-y-auto custom-scrollbar"
                >
                    {#each files as f, i}
                        <li
                            class="px-4 py-2.5 flex items-center justify-between gap-3 bg-white"
                        >
                            <div class="flex items-center gap-3 flex-1 min-w-0">
                                <FileImage size={14} class="text-slate-300" />
                                <span class="text-[12px] font-medium truncate"
                                    >{f.name}</span
                                >
                            </div>
                            <div class="flex items-center gap-3 shrink-0">
                                <span
                                    class="text-[9px] font-mono text-slate-400"
                                    >{formatBytes(f.size)}</span
                                >
                                <button
                                    onclick={() => removeFile(i)}
                                    class="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-100 transition-all rounded-sm shrink-0"
                                >
                                    <Trash2 size={14} /></button
                                >
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>

            <div
                class="mb-8 p-5 bg-slate-50 border border-slate-100 rounded-sm"
            >
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                        <SlidersHorizontal size={14} class="text-slate-500" />
                        <span
                            class="font-mono text-[10px] font-bold uppercase text-slate-500"
                            >Quality: {quality}%</span
                        >
                    </div>
                </div>
                <input
                    type="range"
                    min="1"
                    max="100"
                    bind:value={quality}
                    class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
            </div>

            <button
                onclick={shrinkAction}
                disabled={isProcessing}
                class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:bg-slate-200 transition-all flex items-center justify-center"
            >
                {#if isProcessing}
                    <Loader2 class="animate-spin mr-2" size={16} /> Optimizing {progress.current}/{progress.total}...
                {:else}
                    <Zap size={14} class="mr-2" /> Compress Images
                {/if}
            </button>

            {#if resultUrl && !isProcessing}
                <div class="mt-6 animate-in fade-in zoom-in-95 duration-500">
                    <SuccessState
                        title="Compression Done"
                        file={{
                            name: resultFileName,
                            size: resultSize,
                            url: resultUrl,
                            savings:
                                totalSaving > 0
                                    ? Math.round(
                                          (totalSaving /
                                              (totalSaving + resultSize)) *
                                              100,
                                      ) + "%"
                                    : "0%",
                        }}
                        onReset={reset}
                    />

                    <div
                        class="mt-6 animate-in fade-in slide-in-from-top-2 duration-500 text-left"
                    >
                        <p
                            class="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest px-1 mb-2"
                        >
                            Compression Details:
                        </p>
                        <div
                            class="max-h-[160px] overflow-y-auto custom-scrollbar border-t border-slate-100 pr-1"
                        >
                            <div class="flex flex-col">
                                {#each compressedDetails as item}
                                    <div
                                        class="flex justify-between items-center py-2.5 px-1 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
                                    >
                                        <div
                                            class="flex-1 min-w-0 pr-4 text-left"
                                        >
                                            <span
                                                class="text-[11px] text-slate-500 truncate block font-mono"
                                                title={item.name}
                                                >{item.name}</span
                                            >
                                        </div>
                                        <div
                                            class="shrink-0 flex items-center gap-2 whitespace-nowrap font-mono text-right"
                                        >
                                            <span
                                                class="text-[10px] text-black font-bold"
                                                >{formatBytes(
                                                    item.newSize,
                                                )}</span
                                            >
                                            {#if item.isOptimized}
                                                <span
                                                    class="text-[8px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-100 uppercase font-bold"
                                                    >Optimized</span
                                                >
                                            {:else}
                                                <span
                                                    class="text-[8px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold"
                                                    >-{formatBytes(
                                                        item.oldSize -
                                                            item.newSize,
                                                    )}</span
                                                >
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
</div>
