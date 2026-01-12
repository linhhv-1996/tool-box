<script lang="ts">
    import { ui, type Language } from "$lib/translate/ui";
    let { related, lang = "en" }: { related: any, lang: Language } = $props();
    let langPreUrl = $derived(lang === 'en' ? '' : `/${lang}`);
</script>

<div class="sticky top-6 space-y-8">
    <div class="bg-white border border-slate-100 p-5 rounded-sm shadow-sm">
        <h3
            class="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-50"
        >
            { ui.related_tools[lang] }
        </h3>
        <div class="space-y-4">
            {#each related as r}
                <a href="{langPreUrl}{r.href}" class="group block">
                    <span
                        class="text-xs font-bold block group-hover:underline text-[#1a1a1a]"
                        >{r.name[lang]}</span
                    >
                    <span
                        class="text-[10px] text-slate-400 font-mono uppercase block mt-1 line-clamp-1"
                        >{r.desc[lang]}</span
                    >
                </a>
            {/each}
        </div>
    </div>
</div>
