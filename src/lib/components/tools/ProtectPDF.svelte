<script lang="ts">
    import qpdfWasmUrl from "@neslinesli93/qpdf-wasm/dist/qpdf.wasm?url";
    import {
        Eye,
        EyeOff,
        Lock,
        Loader2,
        FileText,
        ShieldCheck,
        AlertCircle,
    } from "lucide-svelte";
    import Dropzone from "$lib/components/Dropzone.svelte";
    import SuccessState from "$lib/components/SuccessState.svelte";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import type { Language } from "$lib/translate/ui";

    let { lang = "en" }: { lang: Language } = $props();

    // --- LOGIC WASM & PROTECT ---
    let createModule = $state<any>(null);
    onMount(async () => {
        if (browser) {
            const module = await import("@neslinesli93/qpdf-wasm");
            createModule = module.default || module;
        }
    });

    let file = $state<File | null>(null);
    let password = $state("");
    let showPassword = $state(false);
    let isProcessing = $state(false);
    let error = $state("");
    let protectedUrl = $state<string | null>(null);
    let resultFileName = $state("");
    let fileSize = $state(0);

    function formatBytes(bytes: number) {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    }

    function handleFiles(newFiles: File[]) {
        error = "";
        protectedUrl = null;
        const pdf = newFiles.find((f) => f.type === "application/pdf");
        if (!pdf) {
            error = "Please select a valid PDF file.";
            return;
        }
        file = pdf;
    }

    async function protectAction() {
        if (!file || !password) return;
        isProcessing = true;
        error = "";
        protectedUrl = null;

        let qpdf;
        try {
            qpdf = await createModule({ locateFile: () => qpdfWasmUrl });
            const inputBuffer = await file.arrayBuffer();
            qpdf.FS.writeFile("input.pdf", new Uint8Array(inputBuffer));

            try {
                // Mã hóa AES-256
                qpdf.callMain([
                    "input.pdf",
                    "--encrypt",
                    password,
                    password,
                    "256",
                    "--",
                    "output.pdf",
                ]);
            } catch (e: any) {
                if (e.name !== "ExitStatus" || e.status !== 0) throw e;
            }

            const outputData = qpdf.FS.readFile("output.pdf");
            const blob = new Blob([outputData], { type: "application/pdf" });
            fileSize = blob.size;
            resultFileName = `${file.name.replace(".pdf", "")}_protected.pdf`;

            if (protectedUrl) URL.revokeObjectURL(protectedUrl);
            protectedUrl = URL.createObjectURL(blob);

            qpdf.FS.unlink("input.pdf");
            qpdf.FS.unlink("output.pdf");
        } catch (e: any) {
            error =
                "Encryption failed. Ensure the PDF is not already encrypted.";
        } finally {
            isProcessing = false;
        }
    }

    function reset() {
        file = null;
        password = "";
        protectedUrl = null;
        fileSize = 0;
        error = "";
    }
</script>

<div class="bg-white border border-slate-200 rounded-sm shadow-sm p-5 md:p-8">
    <Dropzone
        accept=".pdf"
        multiple={false}
        hasFiles={!!file}
        onfiles={handleFiles}
        onClear={reset}
        label="Select PDF File to Protect"
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
                <div>
                    <label
                        for="pw"
                        class="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1.5 ml-1"
                    >
                        Document Password:
                    </label>
                    <div class="relative group">
                        <div
                            class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-black transition-colors"
                        >
                            <Lock size={14} />
                        </div>
                        <input
                            id="pw"
                            type={showPassword ? "text" : "password"}
                            bind:value={password}
                            placeholder="Set a strong password..."
                            class="w-full h-12 pl-10 pr-12 bg-white border border-slate-200 font-mono text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all rounded-sm"
                        />
                        <button
                            type="button"
                            onclick={() => (showPassword = !showPassword)}
                            class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-black transition-colors"
                        >
                            {#if showPassword}
                                <EyeOff size={16} />
                            {:else}
                                <Eye size={16} />
                            {/if}
                        </button>
                    </div>
                </div>

                <button
                    onclick={protectAction}
                    disabled={isProcessing || !password}
                    class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-200 transition-all flex items-center justify-center shadow-lg"
                >
                    {#if isProcessing}
                        <Loader2 class="animate-spin mr-2" size={16} /> Encrypting...
                    {:else}
                        <ShieldCheck size={16} class="mr-2" /> Protect PDF Now
                    {/if}
                </button>
            </div>
        </div>
    {/if}

    {#if protectedUrl && !isProcessing}
        <div class="mt-6 animate-in fade-in zoom-in-95 duration-500">
            <SuccessState
                title="Protection Success"
                file={{
                    name: resultFileName,
                    size: fileSize,
                    url: protectedUrl,
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
