<script lang="ts">
    import qpdfWasmUrl from "@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url";
    import { Loader2, FileText, Zap, AlertCircle, Trash2 } from "lucide-svelte";
    import Dropzone from "$lib/components/Dropzone.svelte";
    import SuccessState from "$lib/components/SuccessState.svelte";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import JSZip from "jszip";
    import { ui, type Language } from "$lib/translate/ui";

    // --- LOGIC XỬ LÝ NÉN ---
    let createModule = $state<any>(null);
    onMount(async () => {
        if (browser) {
            const module = await import("@neslinesli93/qpdf-wasm");
            createModule = module.default || module;
        }
    });

    let { lang = "en" }: { lang: Language } = $props();

    let files = $state<File[]>([]);
    let isProcessing = $state(false);
    let progress = $state({ current: 0, total: 0 });
    let error = $state("");
    let resultUrl = $state<string | null>(null);
    let resultFileName = $state("");
    let resultSize = $state(0);
    let totalOriginalSize = $state(0);

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
        const pdfs = newFiles.filter((f) => f.type === "application/pdf");
        if (pdfs.length === 0) {
            error = ui.compress_pdf.err_1[lang as Language];
            return;
        }
        files = [...files, ...pdfs];
        totalOriginalSize = files.reduce((acc, f) => acc + f.size, 0);
    }

    async function compressAction() {
        if (files.length === 0 || !createModule) return;
        isProcessing = true;
        error = "";
        progress = { current: 0, total: files.length };
        const zip = new JSZip();

        try {
            const qpdf = await createModule({ locateFile: () => qpdfWasmUrl });
            for (const file of files) {
                progress.current++;
                const inputBuffer = await file.arrayBuffer();
                const inputName = "input.pdf";
                const outputName = "output.pdf";

                qpdf.FS.writeFile(inputName, new Uint8Array(inputBuffer));
                try {
                    qpdf.callMain([
                        inputName,
                        "--compress-streams=y",
                        "--object-streams=generate",
                        outputName,
                    ]);
                } catch (e: any) {
                    if (e.name !== "ExitStatus" || e.status !== 0) throw e;
                }

                const outputData = qpdf.FS.readFile(outputName);
                if (files.length === 1) {
                    const blob = new Blob([outputData], {
                        type: "application/pdf",
                    });
                    resultSize = blob.size;
                    resultFileName = `${file.name.replace(".pdf", "")}_compressed.pdf`;
                    resultUrl = URL.createObjectURL(blob);
                } else {
                    zip.file(
                        `${file.name.replace(".pdf", "")}_compressed.pdf`,
                        outputData,
                    );
                }
                qpdf.FS.unlink(inputName);
                qpdf.FS.unlink(outputName);
            }

            if (files.length > 1) {
                const content = await zip.generateAsync({ type: "blob" });
                resultSize = content.size;
                resultFileName = `compressed_pdfs_${Date.now()}.zip`;
                resultUrl = URL.createObjectURL(content);
            }
        } catch (e: any) {
            error = ui.compress_pdf.err_2[lang as Language];
        } finally {
            isProcessing = false;
        }
    }

    function reset() {
        files = [];
        resultUrl = null;
        resultSize = 0;
        error = "";
        totalOriginalSize = 0;
    }

    function removeFile(index: number) {
        files = files.filter((_, i) => i !== index);
        totalOriginalSize = files.reduce((acc, f) => acc + f.size, 0);
        resultUrl = null;
    }
</script>

<div class="bg-white border border-slate-200 rounded-sm shadow-sm p-5 md:p-8">
    <Dropzone
        lang={lang as Language}
        onfiles={handleFiles}
        hasFiles={files.length > 0}
        onClear={reset}
        accept=".pdf"
        multiple={true}
        label={ui.compress_pdf.select_file[lang as Language]}
        compactLabel={ui.common.add_more[lang as Language]}
    />

    {#if files.length > 0}
        <div
            class="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
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
                    class="divide-y divide-slate-100 max-h-[200px] overflow-y-auto custom-scrollbar"
                >
                    {#each files as f, i}
                        <li
                            class="px-4 py-2.5 flex items-center justify-between gap-4 bg-white"
                        >
                            <div class="flex items-center gap-3 flex-1 min-w-0">
                                <FileText
                                    size={14}
                                    class="text-slate-300 shrink-0"
                                />
                                <span
                                    class="text-[12px] font-medium text-black truncate block leading-tight"
                                >
                                    {f.name}
                                </span>
                            </div>

                            <div class="flex items-center gap-3 shrink-0 ml-2">
                                <span
                                    class="text-[10px] font-mono text-slate-400 uppercase whitespace-nowrap bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100"
                                >
                                    {formatBytes(f.size)}
                                </span>
                                <button
                                    onclick={() => removeFile(i)}
                                    class="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-100 transition-all rounded-sm shrink-0"
                                    title="Remove"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>

            <button
                onclick={compressAction}
                disabled={isProcessing || !createModule}
                class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:bg-slate-200 transition-all flex items-center justify-center shadow-lg"
            >
                {#if isProcessing}
                    <Loader2 class="animate-spin mr-2" size={16} />
                    {ui.compress_pdf.compressing[lang as Language]} {progress.current}/{progress.total}...
                {:else}
                    <Zap size={14} class="mr-2" /> {ui.compress_pdf.compress_pdf_file[lang as Language]}
                {/if}
            </button>

            {#if resultUrl && !isProcessing}
                <div class="mt-6 animate-in fade-in zoom-in-95 duration-500">
                    <SuccessState
                        lang={lang}
                        title="Compression Complete"
                        file={{
                            name: resultFileName,
                            size: resultSize,
                            url: resultUrl,
                            savings:
                                Math.max(
                                    0,
                                    Math.round(
                                        (1 - resultSize / totalOriginalSize) *
                                            100,
                                    ),
                                ) + "%",
                        }}
                        onReset={reset}
                    />
                </div>
            {/if}
        </div>
    {/if}

    {#if error}
        <div
            class="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-mono font-bold uppercase flex items-center gap-2"
        >
            <AlertCircle size={14} />
            {error}
        </div>
    {/if}
</div>
