<!-- <script lang="ts">
  // @ts-nocheck
  import { categories, allTools } from "$lib/config/tools";
  import { Search, ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-svelte';
  import { fade } from 'svelte/transition';

  let searchQuery = $state("");
  let isFocused = $state(false);

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
  <title>JustLocalTools | Free & Private Online Browser Tools (100% Local)</title>
  <meta name="description" content="Access a powerful collection of free, high-speed, and 100% private online tools. PDF utilities, image converters, and productivity tools that work entirely in your browser. No file uploads, no server tracking." />
  <meta property="og:title" content="JustLocalTools | Private & Fast Browser Tools" />
  <meta property="og:description" content="Stop uploading files to servers. Everything stays on your computer with our local-first PDF and Image tools." />
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 md:px-0 py-12">
  <section class="mb-10">
    <h1 class="text-3xl md:text-4xl leading-tight max-w-3xl font-bold tracking-tight text-[#1a1a1a]">
      Private & Fast Browser Tools. 
      <span class="bg-black text-white px-2 inline-block mt-1">100% Client-Side.</span> 
    </h1>
    <p class="mt-4 text-slate-500 text-lg max-w-2xl">
      Stop uploading your private files to random servers. Our tools use your browser's power to get the job done instantly and securely.
    </p>
  </section>

  <div class="mb-12 max-w-md relative">
    <div class="relative group">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-black transition-colors">
        <Search size={18} />
      </div>
      <input 
        type="text"
        placeholder="Search for a tool (e.g., PDF, JPG, HEIC...)"
        bind:value={searchQuery}
        onfocus={() => isFocused = true}
        onblur={handleBlur}
        class="w-full h-12 pl-11 pr-4 bg-white border border-slate-200 font-mono text-[14px] focus:border-black focus:ring-1 focus:ring-black outline-none transition-all rounded-sm shadow-sm"
      />
    </div>

    {#if isFocused && searchQuery.length > 0}
      <div 
        class="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-2xl z-50 rounded-sm overflow-hidden"
        transition:fade={{ duration: 100 }}
      >
        {#if filteredResults.length > 0}
          <div class="max-h-[350px] overflow-y-auto custom-scrollbar">
            {#each filteredResults as tool}
              <a 
                href={tool.href}
                class="block px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <span class="text-sm font-bold text-[#1a1a1a] group-hover:underline underline-offset-4">{tool.name}</span>
                    <p class="text-[11px] text-slate-400 font-mono uppercase mt-0.5 line-clamp-1">{tool.desc}</p>
                  </div>
                  <ArrowRight size={14} class="text-slate-200 group-hover:text-black transition-colors" />
                </div>
              </a>
            {/each}
          </div>
        {:else}
          <div class="py-8 text-center">
            <p class="font-mono text-[11px] text-slate-400 uppercase tracking-widest">No tools matching your search</p>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
    <div class="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-sm">
      <Lock size={18} class="mt-1 text-black" />
      <div>
        <span class="block font-bold text-sm uppercase font-mono tracking-tight">100% Private</span>
        <span class="text-xs text-slate-500">Files never leave your device. Processing happens locally.</span>
      </div>
    </div>
    <div class="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-sm">
      <Zap size={18} class="mt-1 text-black" />
      <div>
        <span class="block font-bold text-sm uppercase font-mono tracking-tight">Instant Speed</span>
        <span class="text-xs text-slate-500">No upload or download wait times. Zero server latency.</span>
      </div>
    </div>
    <div class="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-sm">
      <ShieldCheck size={18} class="mt-1 text-black" />
      <div>
        <span class="block font-bold text-sm uppercase font-mono tracking-tight">Always Free</span>
        <span class="text-xs text-slate-500">No subscriptions or hidden fees. Unlimited file processing.</span>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 mb-20">
    {#each categories as category}
      <div class="border-t border-slate-200 pt-8">
        <h2 class="font-mono uppercase text-[12px] font-bold tracking-[0.25em] text-black mb-8 flex justify-between items-center">
          <span>{category.id}. {category.title}</span>
          <span class="h-[1px] bg-slate-100 grow ml-4"></span>
        </h2>
        <ul class="space-y-4">
          {#each category.tools as tool}
            <li>
              <a href={tool.href} class="group block p-4 -mx-4 hover:bg-slate-50 transition-all rounded-sm border border-transparent hover:border-slate-100">
                <span class="font-bold block group-hover:text-black transition-colors text-base">{tool.name}</span>
                <span class="text-sm text-slate-500 mt-1 block leading-snug">{tool.desc}</span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>

  <article class="border-t border-slate-100 pt-16 pb-12 prose prose-slate max-w-none">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-slate-600 leading-relaxed">
      <div>
        <h3 class="text-black font-bold text-lg mb-3">Why choose local browser tools?</h3>
        <p>
          Most online converters require you to upload your sensitive documents to their servers. This poses a significant privacy risk. <strong>JustLocalTools</strong> changes that by utilizing modern web technologies like WebAssembly and client-side JavaScript to process your files directly in your browser. Your data never leaves your computer, making it the most secure way to manage your digital tasks.
        </p>
      </div>
      <div>
        <h3 class="text-black font-bold text-lg mb-3">Professional Quality, Zero Cost</h3>
        <p>
          Whether you are converting <strong>HEIC to JPG</strong>, merging complex <strong>PDF documents</strong>, or using AI to <strong>remove backgrounds</strong>, we provide professional-grade quality without the price tag. Our mission is to provide a fast, ad-supported (but non-intrusive), and private alternative to traditional cloud-based utility websites.
        </p>
      </div>
    </div>
  </article>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar { width: 5px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style> -->


<script lang="ts">
  // @ts-nocheck
  import { categories, allTools } from "$lib/config/tools";
  import { Search, ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-svelte';
  import { fade } from 'svelte/transition';

  let searchQuery = $state("");
  let isFocused = $state(false);

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
  <title>JustLocalTools | Free & Private Online Browser Tools (100% Local)</title>
  <meta name="description" content="Access a powerful collection of free, high-speed, and 100% private online tools. PDF utilities, image converters, and productivity tools that work entirely in your browser. No file uploads, no server tracking." />
  <meta property="og:title" content="JustLocalTools | Private & Fast Browser Tools" />
  <meta property="og:description" content="Stop uploading files to servers. Everything stays on your computer with our local-first PDF and Image tools." />
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 md:px-0 py-8 md:py-12">
  <section class="mb-10">
    <h1 class="text-3xl md:text-4xl leading-tight max-w-3xl font-bold tracking-tight text-[#1a1a1a]">
      Private & Fast Browser Tools. 
      <span class="bg-black text-white px-2 inline-block mt-1">100% Client-Side.</span> 
    </h1>
    <p class="mt-4 text-slate-500 text-lg max-w-xl">
      Stop uploading your private files to random servers. Our tools use your browser's power to get the job done instantly and securely.
    </p>
    <br>
    
    <div class="max-w-md relative">
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-black transition-colors">
          <Search size={16} />
        </div>
        <input 
          type="text"
          placeholder="Find a tool..."
          bind:value={searchQuery}
          onfocus={() => isFocused = true}
          onblur={handleBlur}
          class="w-full h-10 pl-9 pr-4 bg-white border border-slate-200 font-mono text-[13px] focus:border-black outline-none transition-all rounded-sm shadow-sm"
        />
      </div>

      {#if isFocused && searchQuery.length > 0}
        <div 
          class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-2xl z-50 rounded-sm overflow-hidden"
          transition:fade={{ duration: 100 }}
        >
          {#if filteredResults.length > 0}
            <div class="max-h-[300px] overflow-y-auto custom-scrollbar">
              {#each filteredResults as tool}
                <a href={tool.href} class="block px-4 py-2 hover:bg-slate-50 border-b border-slate-50 last:border-0 group">
                  <div class="flex justify-between items-center">
                    <div>
                      <span class="text-[13px] font-bold text-[#1a1a1a] group-hover:underline">{tool.name}</span>
                      <p class="text-[10px] text-slate-400 uppercase line-clamp-1">{tool.desc}</p>
                    </div>
                    <ArrowRight size={12} class="text-slate-200 group-hover:text-black" />
                  </div>
                </a>
              {/each}
            </div>
          {:else}
            <div class="py-4 text-center">
              <p class="font-mono text-[10px] text-slate-400 uppercase">No tools found</p>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </section>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 mb-16">
    {#each categories as category}
      <div class="flex flex-col">
        <h2 class="font-mono uppercase text-[10px] font-bold tracking-[0.2em] text-slate-400 mb-4 pb-2 border-b border-slate-100">
          {category.id}. {category.title}
        </h2>
        <ul class="space-y-3">
          {#each category.tools as tool}
            <li>
              <a href={tool.href} class="group block">
                <span class="text-[14px] font-bold block group-hover:underline underline-offset-2 tracking-tight">{tool.name}</span>
                <span class="text-[11px] text-slate-500 line-clamp-1 opacity-80">{tool.desc}</span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
    <div class="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-sm">
      <Lock size={18} class="mt-1 text-black" />
      <div>
        <span class="block font-bold text-sm uppercase font-mono tracking-tight">100% Private</span>
        <span class="text-xs text-slate-500">Files never leave your device. Processing happens locally.</span>
      </div>
    </div>
    <div class="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-sm">
      <Zap size={18} class="mt-1 text-black" />
      <div>
        <span class="block font-bold text-sm uppercase font-mono tracking-tight">Instant Speed</span>
        <span class="text-xs text-slate-500">No upload or download wait times. Zero server latency.</span>
      </div>
    </div>
    <div class="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-sm">
      <ShieldCheck size={18} class="mt-1 text-black" />
      <div>
        <span class="block font-bold text-sm uppercase font-mono tracking-tight">Always Free</span>
        <span class="text-xs text-slate-500">No subscriptions or hidden fees. Unlimited file processing.</span>
      </div>
    </div>
  </div>

  <article class="prose prose-slate max-w-none text-[13px] text-slate-500 border-t border-slate-100 pt-12">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 class="text-black font-bold text-sm mb-2">Private by Design</h3>
        <p>Most online tools require file uploads. <strong>JustLocalTools</strong> works differently: your files never leave your browser. We use local processing power for all PDF and Image tasks.</p>
      </div>
      <div>
        <h3 class="text-black font-bold text-sm mb-2">Zero Latency</h3>
        <p>By removing the upload and download steps, our tools provide instant results. Perfect for high-security environments or users with sensitive data.</p>
      </div>
    </div>
  </article>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e8f0; }
</style>
