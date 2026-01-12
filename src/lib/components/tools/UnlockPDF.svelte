<script lang="ts">
    import qpdfWasmUrl from "@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url";
    import {
        Loader2,
        Lock,
        Unlock,
        AlertCircle,
        FileText,
    } from "lucide-svelte";
    import Dropzone from "$lib/components/Dropzone.svelte";
    import SuccessState from "$lib/components/SuccessState.svelte";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { ui, type Language } from "$lib/translate/ui";

    // --- LOGIC WASM ---
    let createModule = $state<any>(null);
    onMount(async () => {
        if (browser) {
            const module = await import("@neslinesli93/qpdf-wasm");
            createModule = module.default || module;
        }
    });

    let { lang = "en" }: { lang: Language } = $props();

    let file = $state<File | null>(null);
    let password = $state("");
    let isProcessing = $state(false);
    let error = $state("");
    let unlockedUrl = $state<string | null>(null);
    let unlockedSize = $state(0);
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
        unlockedUrl = null;
        if (newFiles.length > 0) {
            file = newFiles[0];
        }
    }

    async function unlockAction() {
        if (!file || !createModule) return;
        isProcessing = true;
        error = "";
        unlockedUrl = null;

        let qpdf;
        try {
            qpdf = await createModule({ locateFile: () => qpdfWasmUrl });
            const inputBuffer = await file.arrayBuffer();
            qpdf.FS.writeFile("input.pdf", new Uint8Array(inputBuffer));

            try {
                // Sử dụng qpdf để decrypt với mật khẩu
                qpdf.callMain([
                    "--password=" + password,
                    "--decrypt",
                    "input.pdf",
                    "output.pdf",
                ]);
            } catch (e: any) {
                // qpdf ném lỗi exit status 0 là bình thường, nếu khác 0 mới là lỗi thực sự
                if (e.name !== "ExitStatus" || e.status !== 0) {
                    throw new Error(
                        ui.unlock_pdf.err_1[lang as Language],
                    );
                }
            }

            const outputData = qpdf.FS.readFile("output.pdf");
            const blob = new Blob([outputData], { type: "application/pdf" });
            unlockedSize = blob.size;
            resultFileName = `unlocked_${file.name}`;

            if (unlockedUrl) URL.revokeObjectURL(unlockedUrl);
            unlockedUrl = URL.createObjectURL(blob);

            qpdf.FS.unlink("input.pdf");
            qpdf.FS.unlink("output.pdf");
        } catch (e) {
            error = ui.unlock_pdf.err_2[lang as Language];
            console.error(e);
        } finally {
            isProcessing = false;
        }
    }

    function reset() {
        file = null;
        password = "";
        unlockedUrl = null;
        unlockedSize = 0;
        error = "";
    }
</script>

<div class="bg-white border border-slate-200 rounded-sm shadow-sm p-5 md:p-8">
    <Dropzone
        lang={lang}
        accept=".pdf"
        multiple={false}
        hasFiles={!!file}
        onfiles={handleFiles}
        onClear={reset}
        label={ui.unlock_pdf.select_file[lang as Language]}
    />

    {#if file}
        <div class="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div
                class="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-sm mb-6"
            >
                <div
                    class="w-10 h-10 bg-white border border-slate-200 flex items-center justify-center text-slate-400"
                >
                    <FileText size={18} />
                </div>
                <div class="flex-1 min-w-0">
                    <p
                        class="text-[12px] font-bold text-black truncate leading-tight"
                    >
                        {file.name}
                    </p>
                    <p
                        class="text-[10px] font-mono text-slate-400 uppercase tracking-tighter"
                    >
                        {formatBytes(file.size)}
                    </p>
                </div>
            </div>

            <div class="space-y-4">
                <div
                    class="bg-slate-50/50 border border-slate-100 p-5 rounded-sm"
                >
                    <label
                        for="pw"
                        class="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-2 ml-1 tracking-widest"
                    >
                        {ui.unlock_pdf.pdf_pass[lang as Language]}
                    </label>
                    <div class="relative group">
                        <div
                            class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-black transition-colors"
                        >
                            <Lock size={14} />
                        </div>
                        <input
                            type="password"
                            id="pw"
                            bind:value={password}
                            placeholder={ui.unlock_pdf.enter_pass[lang as Language]}
                            class="w-full h-12 pl-10 px-4 bg-white border border-slate-200 rounded-sm font-mono text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                        />
                    </div>
                </div>

                <button
                    onclick={unlockAction}
                    disabled={isProcessing || !password}
                    class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-200 transition-all flex items-center justify-center shadow-lg"
                >
                    {#if isProcessing}
                        <Loader2 class="animate-spin mr-2" size={16} /> {ui.unlock_pdf.unlocking[lang as Language]}
                    {:else}
                        <Unlock size={14} class="mr-2" /> {ui.unlock_pdf.unlock_now[lang as Language]}
                    {/if}
                </button>
            </div>
        </div>
    {/if}

    {#if unlockedUrl && !isProcessing}
        <div class="mt-6 animate-in fade-in zoom-in-95 duration-500">
            <SuccessState
                lang={lang}
                title="Unlocked Successfully"
                file={{
                    name: resultFileName,
                    size: unlockedSize,
                    url: unlockedUrl,
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
