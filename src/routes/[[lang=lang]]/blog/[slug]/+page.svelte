<script lang="ts">
  import SEO from '$lib/components/SEO.svelte';
  import { onMount, tick } from 'svelte'; // Thêm tick để đợi DOM render xong
  let { data } = $props();
  
  // 1. Content dùng $derived là đúng bài rồi, nó sẽ tự update khi data.content đổi
  const Content = $derived(data.content);
  let headings = $state<{id: string, text: string, level: number}[]>([]);

  // 2. Dùng $effect thay cho onMount để chạy lại mỗi khi slug hoặc lang thay đổi
  $effect(() => {
    // Chúng ta "lắng nghe" sự thay đổi của slug và lang từ data
    const _slug = data.slug;
    const _lang = data.lang;

    const updateHeadings = async () => {
      await tick();
      const articleHeadings = Array.from(document.querySelectorAll('.prose h2, .prose h3'));
      headings = articleHeadings.map((h, i) => {
        const id = h.id || `s-${i}`;
        h.id = id;
        return { 
          id, 
          text: h.textContent || "", 
          level: parseInt(h.tagName.substring(1)) 
        };
      });
    };

    updateHeadings();
  });
</script>


<SEO lang={data.lang} toolId="" />

<div class="max-w-[980px] mx-auto px-4 py-12 font-sans">
  <div class="flex flex-col md:flex-row gap-10">
    
    <aside class="md:w-[200px] shrink-0">
      <div class="sticky top-10 custom-scrollbar overflow-y-auto max-h-[calc(100vh-80px)] pr-2">
        <h4 class="font-mono text-[11px] font-bold uppercase tracking-widest text-black mb-6 border-b border-slate-100 pb-1">
          {data.lang === 'ja' ? '目次' : 'Index'}
        </h4>
        <nav class="space-y-3">
          {#each headings as heading}
            <a href="#{heading.id}" 
               class="block text-[12px] leading-tight transition-all duration-200 hover:text-black
                      {heading.level === 3 ? 'pl-3 text-slate-400 font-normal' : 'text-slate-600 font-medium'}">
              {heading.text}
            </a>
          {/each}
        </nav>
      </div>
    </aside>

    <main class="flex-1 min-w-0">
      <article>
        <header class="mb-10 pb-6 border-b border-slate-100">
          <div class="font-mono text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-3">
            {data.meta.date || 'Jan 2026'} / Security
          </div>
          <h1 class="font-mono text-3xl font-bold uppercase tracking-tight text-black mb-4">
            {data.meta.title}
          </h1>
          <p class="text-sm leading-6 text-slate-500 italic">
            {data.meta.description}
          </p>
        </header>

        <div class="prose">
          <Content />
        </div>
      </article>
    </main>
  </div>
</div>
