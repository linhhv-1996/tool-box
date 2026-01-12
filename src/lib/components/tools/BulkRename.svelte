<script lang="ts">
    import JSZip from "jszip";
    import {
        Loader2,
        X,
        ArrowRight,
        Trash2,
        CaseSensitive,
        Hash,
        Type,
        ArrowLeftRight,
        AlertCircle,
    } from "lucide-svelte";
    import Dropzone from "$lib/components/Dropzone.svelte";
    import SuccessState from "$lib/components/SuccessState.svelte";
    import { ui, type Language } from "$lib/translate/ui";
    
    let { lang = "en" }: { lang: Language } = $props();

    // Types for Rules
    type RuleType = "find-replace" | "prefix-suffix" | "numbering" | "case";
    interface Rule {
        id: string;
        type: RuleType;
        data: any;
    }

    // --- STATE ---
    let files = $state<File[]>([]);
    let isProcessing = $state(false);
    let error = $state(""); // Đã thêm khai báo để fix lỗi ReferenceError
    let zipUrl = $state<string | null>(null);
    let zipSize = $state(0);
    let resultFileName = $state("");
    let rules = $state<Rule[]>([]);

    // --- HELPER FUNCTIONS ---
    function addRule(type: RuleType) {
        const id = Math.random().toString(36).substring(2, 9);
        let data = {};
        if (type === "find-replace") data = { find: "", replace: "" };
        if (type === "prefix-suffix") data = { prefix: "", suffix: "" };
        if (type === "numbering") data = { start: 1, padding: 2 };
        if (type === "case") data = { mode: "lower" };
        rules.push({ id, type, data });
    }

    function removeRule(id: string) {
        rules = rules.filter((r) => r.id !== id);
    }

    function formatBytes(bytes: number) {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    }

    function handleFiles(newFiles: File[]) {
        error = "";
        files = [...files, ...newFiles];
        if (rules.length === 0) addRule("prefix-suffix");
        zipUrl = null;
    }

    function removeFile(index: number) {
        files = files.filter((_, i) => i !== index);
        zipUrl = null;
        if (files.length === 0) reset();
    }

    function reset() {
        files = [];
        rules = [];
        zipUrl = null;
        zipSize = 0;
        error = "";
    }

    // --- LOGIC PREVIEW ---
    let previewFiles = $derived(
        files.map((file, index) => {
            const ext = file.name.includes(".")
                ? file.name.split(".").pop()
                : "";
            let name =
                file.name.substring(0, file.name.lastIndexOf(".")) || file.name;

            for (const rule of rules) {
                const { type, data } = rule;
                if (type === "find-replace" && data.find) {
                    name = name.split(data.find).join(data.replace);
                } else if (type === "prefix-suffix") {
                    name = `${data.prefix || ""}${name}${data.suffix || ""}`;
                } else if (type === "numbering") {
                    const num = (data.start + index)
                        .toString()
                        .padStart(data.padding, "0");
                    name = `${name}_${num}`;
                } else if (type === "case") {
                    if (data.mode === "lower") name = name.toLowerCase();
                    else if (data.mode === "upper") name = name.toUpperCase();
                    else if (data.mode === "title")
                        name = name.replace(/\b\w/g, (c) => c.toUpperCase());
                }
            }
            return {
                original: file.name,
                new: ext ? `${name}.${ext}` : name,
            };
        }),
    );

    // --- ACTION ---
    async function processAction() {
        if (files.length === 0) return;
        isProcessing = true;
        error = "";
        try {
            const zip = new JSZip();
            previewFiles.forEach((item, i) => {
                zip.file(item.new, files[i]);
            });
            const zipContent = await zip.generateAsync({ type: "blob" });
            zipSize = zipContent.size;
            resultFileName = `renamed_${Date.now()}.zip`;
            if (zipUrl) URL.revokeObjectURL(zipUrl);
            zipUrl = URL.createObjectURL(zipContent);
        } catch (e) {
            error = ui.bulk_rename.err_1[lang as Language];
        } finally {
            isProcessing = false;
        }
    }
</script>

<div class="bg-white border border-slate-200 rounded-sm shadow-sm p-5 md:p-8">
    <Dropzone
        lang={lang}
        onfiles={handleFiles}
        hasFiles={files.length > 0}
        onClear={reset}
        accept="*"
        multiple={true}
        label={ui.bulk_rename.select_file[lang as Language]}
        compactLabel={ui.common.add_more[lang as Language]}
    />

    {#if files.length > 0}
        <div
            class="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
            <div class="mb-8">
                <span
                    class="block font-mono text-[10px] font-bold uppercase text-slate-400 mb-4 tracking-widest border-b border-slate-50 pb-2"
                    >{ui.bulk_rename.rule[lang as Language]}</span
                >
                <div class="flex flex-wrap gap-2 mb-4">
                    <button
                        onclick={() => addRule("find-replace")}
                        class="flex items-center gap-2 px-3 py-1.5 border border-slate-200 text-[10px] font-mono uppercase hover:border-black transition-all bg-white rounded-sm"
                    >
                        <ArrowLeftRight size={12} /> {ui.bulk_rename.find_replace[lang as Language]}
                    </button>
                    <button
                        onclick={() => addRule("prefix-suffix")}
                        class="flex items-center gap-2 px-3 py-1.5 border border-slate-200 text-[10px] font-mono uppercase hover:border-black transition-all bg-white rounded-sm"
                    >
                        <Type size={12} /> {ui.bulk_rename.prefix_suffix[lang as Language]}
                    </button>
                    <button
                        onclick={() => addRule("numbering")}
                        class="flex items-center gap-2 px-3 py-1.5 border border-slate-200 text-[10px] font-mono uppercase hover:border-black transition-all bg-white rounded-sm"
                    >
                        <Hash size={12} /> {ui.bulk_rename.numbering[lang as Language]}
                    </button>
                    <button
                        onclick={() => addRule("case")}
                        class="flex items-center gap-2 px-3 py-1.5 border border-slate-200 text-[10px] font-mono uppercase hover:border-black transition-all bg-white rounded-sm"
                    >
                        <CaseSensitive size={12} /> {ui.bulk_rename.change_case[lang as Language]}
                    </button>
                </div>

                <div class="space-y-3">
                    {#each rules as rule (rule.id)}
                        <div
                            class="relative bg-slate-50 border border-slate-100 p-4 rounded-sm animate-in slide-in-from-left-2 duration-200"
                        >
                            <button
                                onclick={() => removeRule(rule.id)}
                                class="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                            <div class="flex flex-col gap-3">
                                <span
                                    class="text-[9px] font-bold font-mono uppercase text-slate-400 tracking-widest"
                                    >{ui.bulk_rename.rule_txt[lang]}: {rule.type.replace("-", " ")}</span
                                >

                                {#if rule.type === "find-replace"}
                                    <div class="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            bind:value={rule.data.find}
                                            placeholder="{ui.bulk_rename.find[lang]}"
                                            class="w-full h-10 border border-slate-200 p-2 text-xs font-mono focus:border-black outline-none bg-white rounded-sm"
                                        />
                                        <input
                                            type="text"
                                            bind:value={rule.data.replace}
                                            placeholder="{ui.bulk_rename.replace[lang]}"
                                            class="w-full h-10 border border-slate-200 p-2 text-xs font-mono focus:border-black outline-none bg-white rounded-sm"
                                        />
                                    </div>
                                {:else if rule.type === "prefix-suffix"}
                                    <div class="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            bind:value={rule.data.prefix}
                                            placeholder="{ui.bulk_rename.prefix[lang]}"
                                            class="w-full h-10 border border-slate-200 p-2 text-xs font-mono focus:border-black outline-none bg-white rounded-sm"
                                        />
                                        <input
                                            type="text"
                                            bind:value={rule.data.suffix}
                                            placeholder="{ui.bulk_rename.suffix[lang]}"
                                            class="w-full h-10 border border-slate-200 p-2 text-xs font-mono focus:border-black outline-none bg-white rounded-sm"
                                        />
                                    </div>
                                {:else if rule.type === "numbering"}
                                    <div class="flex gap-3">
                                        <div class="flex-1">
                                            <span
                                                class="text-[8px] uppercase text-slate-400 block mb-1 font-bold"
                                                >{ui.bulk_rename.start_at[lang]}</span
                                            >
                                            <input
                                                type="number"
                                                bind:value={rule.data.start}
                                                class="w-full h-10 border border-slate-200 p-2 text-xs font-mono focus:border-black outline-none bg-white rounded-sm"
                                            />
                                        </div>
                                        <div class="flex-1">
                                            <span
                                                class="text-[8px] uppercase text-slate-400 block mb-1 font-bold"
                                                >{ui.bulk_rename.padding[lang]}</span
                                            >
                                            <select
                                                bind:value={rule.data.padding}
                                                class="w-full h-10 border border-slate-200 p-2 text-xs font-mono focus:border-black outline-none bg-white rounded-sm"
                                            >
                                                <option value={1}>1</option>
                                                <option value={2}>01</option>
                                                <option value={3}>001</option>
                                            </select>
                                        </div>
                                    </div>
                                {:else if rule.type === "case"}
                                    <div class="flex gap-2">
                                        {#each ["lower", "upper", "title"] as m}
                                            <button
                                                onclick={() =>
                                                    (rule.data.mode = m)}
                                                class="flex-1 py-2 border text-[10px] font-mono uppercase transition-all {rule
                                                    .data.mode === m
                                                    ? 'bg-black text-white border-black'
                                                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'} rounded-sm"
                                                >{m}</button
                                            >
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="mb-10">
                <span
                    class="block font-mono text-[10px] font-bold uppercase text-slate-400 mb-4 tracking-widest border-b border-slate-50 pb-2"
                    >{ui.bulk_rename.prefix[lang]}</span
                >
                <ul
                    class="divide-y divide-slate-100 max-h-80 overflow-y-auto custom-scrollbar border border-slate-100 rounded-sm"
                >
                    {#each previewFiles as item, i}
                        <li
                            class="px-4 py-3 flex items-center justify-between gap-3 bg-white group hover:bg-slate-50 transition-colors"
                        >
                            <div class="flex items-center gap-3 flex-1 min-w-0">
                                <span
                                    class="text-[10px] font-mono text-slate-300 shrink-0 leading-none"
                                    >{(i + 1).toString().padStart(2, "0")}</span
                                >
                                <div class="flex flex-col min-w-0 flex-1">
                                    <span
                                        class="text-[10px] text-slate-400 truncate line-through mb-1"
                                        >{item.original}</span
                                    >
                                    <div
                                        class="flex items-center gap-2 text-black min-w-0"
                                    >
                                        <ArrowRight
                                            size={10}
                                            class="text-slate-300 shrink-0"
                                        />
                                        <span
                                            class="text-[12px] font-bold truncate leading-tight tracking-tight"
                                            title={item.new}>{item.new}</span
                                        >
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center gap-3 shrink-0 ml-2">
                                <span
                                    class="text-[9px] font-mono text-slate-400 uppercase whitespace-nowrap bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100"
                                    >{formatBytes(files[i].size)}</span
                                >
                                <button
                                    onclick={() => removeFile(i)}
                                    class="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-100 transition-all rounded-sm shrink-0"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>

            <button
                onclick={processAction}
                disabled={isProcessing || files.length === 0}
                class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:bg-slate-200 transition-all flex items-center justify-center shadow-lg"
            >
                {#if isProcessing}
                    <Loader2 class="animate-spin mr-2" size={16} /> {ui.bulk_rename.packaging[lang]}
                {:else}
                    {ui.bulk_rename.apply_download[lang]}
                {/if}
            </button>

            {#if zipUrl && !isProcessing}
                <div class="mt-6 animate-in fade-in zoom-in-95 duration-500">
                    <SuccessState
                        lang={lang}
                        title="Files Renamed"
                        file={{
                            name: resultFileName,
                            size: zipSize,
                            url: zipUrl,
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
