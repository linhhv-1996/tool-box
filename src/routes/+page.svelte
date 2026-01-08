<script lang="ts">
  // @ts-nocheck
  import { categories, allTools } from "$lib/config/tools";
  import { Search, ArrowRight } from 'lucide-svelte';
  import { fade } from 'svelte/transition';

  let searchQuery = $state("");
  let isFocused = $state(false);

  // Logic search kết quả
  let filteredResults = $derived(
    searchQuery.trim() === "" 
      ? [] 
      : allTools.filter(t => 
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          t.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
  );

  function handleBlur() {
    setTimeout(() => { isFocused = false; }, 200);
  }
</script>

<svelte:head>
  <title>JustLocalTools | Private & Fast Browser Tools</title>
</svelte:head>

<div class="max-w-[980px] mx-auto px-0 py-12">
  <section class="mb-8">
    <h2 class="text-2xl leading-snug max-w-2xl font-semibold tracking-tight">
      Stop uploading your private files to random servers.
      <span class="bg-black text-white px-1 ml-1">Everything stays on your computer.</span> 
      Our tools use your browser's power to get the job done instantly.
    </h2>
  </section>

  <div class="mb-16 max-w-md relative">
    <div class="relative group">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-black transition-colors">
        <Search size={16} />
      </div>
      <input 
        type="text"
        placeholder="Find a tool..."
        bind:value={searchQuery}
        onfocus={() => isFocused = true}
        onblur={handleBlur}
        class="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 font-mono text-[13px] focus:border-black focus:ring-1 focus:ring-black outline-none transition-all rounded-sm shadow-sm"
      />
    </div>

    {#if isFocused && searchQuery.length > 0}
      <div 
        class="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-2xl z-50 rounded-sm overflow-hidden"
        transition:fade={{ duration: 100 }}
      >
        {#if filteredResults.length > 0}
          <div class="max-h-[300px] overflow-y-auto custom-scrollbar">
            {#each filteredResults as tool}
              <a 
                href={tool.href}
                class="block px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <span class="text-sm font-bold text-[#1a1a1a] group-hover:underline underline-offset-4">{tool.name}</span>
                    <p class="text-[10px] text-slate-400 font-mono uppercase mt-0.5 line-clamp-1">{tool.desc}</p>
                  </div>
                  <ArrowRight size={12} class="text-slate-200 group-hover:text-black transition-colors" />
                </div>
              </a>
            {/each}
          </div>
        {:else}
          <div class="py-6 text-center">
            <p class="font-mono text-[10px] text-slate-400 uppercase tracking-widest">No tools found</p>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
    {#each categories as category}
      <div>
        <h3 class="font-mono uppercase text-[11px] font-bold tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-100 pb-2">
          {category.id}. {category.title}
        </h3>
        <ul class="space-y-6">
          {#each category.tools as tool}
            <li>
              <a href={tool.href} class="group block">
                <span class="font-bold block group-hover:underline">{tool.name}</span>
                <span class="text-xs text-slate-500">{tool.desc}</span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e8f0; }
</style>
