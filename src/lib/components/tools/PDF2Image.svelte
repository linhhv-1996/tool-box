<script lang="ts">
    import JSZip from "jszip";
    import {
        Loader2,
        FileText,
        Image as ImageIcon,
        Settings2,
    } from "lucide-svelte";
    import Dropzone from "$lib/components/Dropzone.svelte";
    import SuccessState from "$lib/components/SuccessState.svelte";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { ui, type Language } from "$lib/translate/ui";

    // --- LOGIC GỐC (GIỮ NGUYÊN) ---
    let pdfjs: any = $state(null);
    onMount(async () => {
        if (browser) {
            pdfjs = await import("pdfjs-dist");
            const worker = await import("pdfjs-dist/build/pdf.worker.mjs?url");
            pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
        }
    });

    let { lang = "en" }: { lang: Language } = $props();

    let file = $state<File | null>(null);
    let isProcessing = $state(false);
    let progress = $state(0);
    let totalPages = $state(0);
    let images = $state<{ url: string; page: number }[]>([]);
    let format = $state("png");
    let scale = $state(2);
    let zipUrl = $state<string | null>(null);
    let zipSize = $state(0);
    let resultFileName = $state("");

    function formatBytes(bytes: number) {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    }

    async function handleFiles(newFiles: File[]) {
        const pdf = newFiles.find((f) => f.type === "application/pdf");
        if (!pdf) return;
        reset();
        file = pdf;
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;
    }

    async function convertAction() {
        if (!file) return;
        isProcessing = true;
        images = [];
        zipUrl = null;
        zipSize = 0;
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            const zip = new JSZip();

            for (let i = 1; i <= totalPages; i++) {
                progress = Math.round((i / totalPages) * 100);
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport }).promise;
                const dataUrl = canvas.toDataURL(`image/${format}`, 0.9);
                images.push({ url: dataUrl, page: i });
                const base64Data = dataUrl.split(",")[1];
                zip.file(`page-${i}.${format}`, base64Data, { base64: true });
            }
            const content = await zip.generateAsync({ type: "blob" });
            zipSize = content.size;
            resultFileName = `${file.name.replace(".pdf", "")}_images.zip`;
            zipUrl = URL.createObjectURL(content);
        } catch (e) {
            console.error(e);
        } finally {
            isProcessing = false;
        }
    }

    function reset() {
        file = null;
        images = [];
        zipUrl = null;
        zipSize = 0;
        progress = 0;
        totalPages = 0;
    }
</script>

<div class="bg-white border border-slate-200 rounded-sm shadow-sm p-5 md:p-8">
    <Dropzone
        lang={lang as Language}
        accept=".pdf"
        multiple={false}
        hasFiles={!!file}
        onfiles={handleFiles}
        onClear={reset}
        label={ui.pdf_to_image.select_file[lang as Language]}
    />

    {#if file}
        <div class="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div
                class="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-sm mb-6"
            >
                <div class="flex items-center gap-3 min-w-0">
                    <FileText size={18} class="text-slate-400" />
                    <div class="flex flex-col min-w-0">
                        <span
                            class="text-[12px] font-bold text-black truncate leading-tight"
                            >{file.name}</span
                        >
                        <span
                            class="text-[10px] font-mono text-slate-400 uppercase tracking-tighter"
                        >
                            {formatBytes(file.size)} • {totalPages} Pages
                        </span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div
                    class="bg-slate-50/50 p-4 border border-slate-100 rounded-sm"
                >
                    <!-- svelte-ignore a11y_label_has_associated_control -->
                    <label
                        class="block font-mono text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest"
                        >{ui.pdf_to_image.format[lang as Language]}</label
                    >
                    <div class="flex gap-2">
                        {#each ["png", "jpeg"] as f}
                            <button
                                onclick={() => (format = f)}
                                class="flex-1 py-2 border font-mono text-[10px] uppercase transition-all {format ===
                                f
                                    ? 'border-black bg-black text-white'
                                    : 'border-slate-200 bg-white text-slate-400 hover:border-slate-400'}"
                            >
                                {f === "jpeg" ? "JPG" : "PNG"}
                            </button>
                        {/each}
                    </div>
                </div>
                <div
                    class="bg-slate-50/50 p-4 border border-slate-100 rounded-sm"
                >
                    <!-- svelte-ignore a11y_label_has_associated_control -->
                    <label
                        class="block font-mono text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest"
                        >{ui.pdf_to_image.quality[lang as Language]}</label
                    >
                    <div class="flex gap-2">
                        {#each [1, 2, 3] as s}
                            <button
                                onclick={() => (scale = s)}
                                class="flex-1 py-2 border font-mono text-[10px] transition-all {scale ===
                                s
                                    ? 'border-black bg-black text-white'
                                    : 'border-slate-200 bg-white text-slate-400 hover:border-slate-400'}"
                            >
                                {s}x
                            </button>
                        {/each}
                    </div>
                </div>
            </div>

            <button
                onclick={convertAction}
                disabled={isProcessing}
                class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:bg-slate-200 transition-all flex items-center justify-center shadow-lg"
            >
                {#if isProcessing}
                    <Loader2 class="animate-spin mr-2" size={16} /> {ui.pdf_to_image.rendering[lang as Language]} {progress}%...
                {:else}
                    <ImageIcon size={16} class="mr-2" />
                    {images.length > 0
                        ? ui.pdf_to_image.convert_again[lang as Language]
                        : ui.pdf_to_image.convert_to_img[lang as Language]}
                {/if}
            </button>
        </div>
    {/if}

    {#if zipUrl && !isProcessing}
        <div class="mt-6 animate-in fade-in zoom-in-95 duration-500">
            <SuccessState
                lang={lang as Language}
                title="Conversion Done"
                file={{ name: resultFileName, size: zipSize, url: zipUrl }}
                onReset={reset}
            />
        </div>
    {/if}
</div>
