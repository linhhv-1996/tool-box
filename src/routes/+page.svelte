<script>
    import { categories } from "$lib/config/tools";
</script>

<div class="max-w-4xl mx-auto px-4 py-12">
  <section class="mb-20">
    <h2 class="text-2xl leading-snug max-w-2xl font-semibold tracking-tight">
      Stop uploading your private files to random servers. 
      <span class="bg-black text-white px-1 ml-1">Everything stays on your computer.</span> 
      Our tools use your browser's power to get the job done instantly.
    </h2>
  </section>

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
