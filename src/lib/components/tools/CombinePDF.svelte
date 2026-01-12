<script lang="ts">
    import { PDFDocument } from "pdf-lib";
    import {
        Loader2,
        FileText,
        Trash2,
        Settings2,
        AlertCircle,
    } from "lucide-svelte";

    import Dropzone from "$lib/components/Dropzone.svelte";
    import SuccessState from "$lib/components/SuccessState.svelte";
    import { ui, type Language } from "$lib/translate/ui";

    let { lang = "en" }: { lang: Language } = $props();

    let files = $state<File[]>([]);
    let isProcessing = $state(false);
    let error = $state("");
    let mergedUrl = $state<string | null>(null);
    let mergedSize = $state(0);
    let resultFileName = $state("");

    function formatBytes(bytes: number) {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    }

    function handleFiles(newFiles: File[]) {
        error = "";
        mergedUrl = null;
        const pdfs = newFiles.filter((f) => f.type === "application/pdf");
        files = [...files, ...pdfs];
    }

    async function mergeAction() {
        if (files.length < 2) {
            error = ui.combine_pdf.err_file_length[lang];
            return;
        }
        isProcessing = true;
        error = "";
        mergedUrl = null;
        try {
            const mergedPdf = await PDFDocument.create();
            for (const file of files) {
                const bytes = await file.arrayBuffer();
                const pdf = await PDFDocument.load(bytes);
                const copiedPages = await mergedPdf.copyPages(
                    pdf,
                    pdf.getPageIndices(),
                );
                copiedPages.forEach((p) => mergedPdf.addPage(p));
            }
            const pdfBytes = await mergedPdf.save();
            mergedSize = pdfBytes.length;
            resultFileName = `combined_${Date.now()}.pdf`;
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            if (mergedUrl) URL.revokeObjectURL(mergedUrl);
            mergedUrl = URL.createObjectURL(blob);
        } catch (e) {
            error = ui.combine_pdf.err_failed[lang];
        } finally {
            isProcessing = false;
        }
    }

    function reset() {
        files = [];
        mergedUrl = null;
        mergedSize = 0;
        error = "";
    }

    function removeFile(index: number) {
        files = files.filter((_, i) => i !== index);
        mergedUrl = null;
    }
</script>

<div class="bg-white border border-slate-200 rounded-sm shadow-sm p-5 md:p-8">
    <Dropzone
        lang={lang}
        accept=".pdf"
        multiple={true}
        hasFiles={files.length > 0}
        onfiles={handleFiles}
        onClear={reset}
        label={ui.combine_pdf.select_file[lang]}
        compactLabel={ui.common.add_more[lang as Language]}
    />

    {#if files.length > 0}
        <div class="mt-6 animate-in fade-in duration-300">
            <div
                class="mb-6 border border-slate-100 rounded-sm overflow-hidden bg-slate-50/50"
            >
                <div
                    class="px-4 py-2 bg-slate-100 border-b border-slate-200 flex justify-between items-center"
                >
                    <span
                        class="text-[10px] font-mono font-bold text-slate-500 uppercase"
                        >Queue ({files.length} files)</span
                    >
                </div>
                <ul
                    class="divide-y divide-slate-100 max-h-[300px] overflow-y-auto custom-scrollbar"
                >
                    {#each files as file, i}
                        <li
                            class="px-4 py-2.5 flex items-center justify-between gap-3 bg-white group hover:bg-slate-50 transition-colors"
                        >
                            <div class="flex items-center gap-3 flex-1 min-w-0">
                                <FileText
                                    size={14}
                                    class="text-slate-300 shrink-0"
                                />
                                <span
                                    class="text-[12px] font-medium text-black truncate block leading-tight"
                                    title={file.name}
                                >
                                    {file.name}
                                </span>
                            </div>

                            <div class="flex items-center gap-3 shrink-0 ml-2">
                                <span
                                    class="text-[9px] font-mono text-slate-400 uppercase whitespace-nowrap bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100"
                                >
                                    {formatBytes(file.size)}
                                </span>
                                <button
                                    onclick={() => removeFile(i)}
                                    class="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-100 transition-all rounded-sm shrink-0"
                                    title="Remove file"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>

            <button
                onclick={mergeAction}
                disabled={isProcessing}
                class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-200 transition-all flex items-center justify-center shadow-md shadow-black/5"
            >
                {#if isProcessing}
                    <Loader2 class="animate-spin mr-2" size={16} /> {ui.combine_pdf.processing[lang]}
                {:else}
                    {ui.combine_pdf.merge[lang]}
                {/if}
            </button>
        </div>
    {/if}

    {#if mergedUrl && !isProcessing}
        <div class="mt-6 animate-in fade-in zoom-in-95 duration-500">
            <SuccessState
                lang={lang}
                title="Merge Complete"
                file={{
                    name: resultFileName,
                    size: mergedSize,
                    url: mergedUrl,
                }}
                onReset={reset}
            />
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
