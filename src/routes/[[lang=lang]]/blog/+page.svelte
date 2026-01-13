<script lang="ts">
  import { page } from "$app/stores";
  import { ui, type Language } from "$lib/translate/ui";
  import { allTools } from "$lib/config/tools";

  let { data } = $props();
  
  // Logic đa ngôn ngữ chuẩn
  let lang = $derived((['ja', 'ko'].includes($page?.params?.lang || "en") ? $page.params.lang : 'en') as Language);
  let langPreUrl = $derived(lang === 'en' ? '' : `/${lang}`);

  // SEO Metadata 
  let title = $derived(ui.blog.title[lang]);
  let description = $derived(ui.blog.p[lang]);
  let url = $derived($page.url.href);
  
  // Logic tạo URL cho hreflang (bỏ prefix ngôn ngữ hiện tại để lấy base path) 
  let pathWithoutLang = $derived($page.url.pathname.replace(/^\/(ja|ko)/, '') || '/');
  let baseUrl = $derived($page.url.origin);

  // Lấy 8 tools cho sidebar 
  const quickTools = allTools.slice(0, 6);

  // JSON-LD cho trang danh sách bài viết 
  let jsonLd = $derived({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": url,
    "publisher": {
      "@type": "Organization",
      "name": "JustLocalTools"
    }
  });
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={url} />

  <link rel="alternate" hreflang="en" href="{baseUrl}{pathWithoutLang}" />
  <link rel="alternate" hreflang="ja" href="{baseUrl}/ja{pathWithoutLang}" />
  <link rel="alternate" hreflang="ko" href="{baseUrl}/ko{pathWithoutLang}" />
  <link rel="alternate" hreflang="x-default" href="{baseUrl}{pathWithoutLang}" />

  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={url} />

  {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>


<div class="max-w-[980px] mx-auto px-4 md:px-0 py-10 font-sans">
  <section class="text-left mb-16">
    <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-[#1a1a1a]">
      {ui.blog.h1[lang]}
      <br>
      <span class="bg-black text-white px-2 inline-block mt-1 font-mono text-2xl tracking-tighter italic">
        {ui.blog.span[lang]}
      </span>
    </h1>
    <p class="mt-4 text-slate-500 text-sm max-w-xl font-mono opacity-80">
      {ui.blog.p[lang]}
    </p>
  </section>

  <div class="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12">
    
    <main class="space-y-12">
      {#each data.posts as post}
        <article class="group">
          <a href="{langPreUrl}/blog/{post.slug}" class="block border-l-2 border-transparent hover:border-black pl-5 transition-all">
            <time class="font-mono text-[10px] text-slate-400 block mb-1 uppercase tracking-widest">
              // {post.meta.date || "RECENT"}
            </time>
            
            <h2 class="text-xl font-bold text-[#1a1a1a] group-hover:underline decoration-slate-300 underline-offset-4">
              {post.meta.title}
            </h2>
            
            <p class="text-[13px] text-slate-500 leading-relaxed mt-2 font-mono opacity-70 line-clamp-2">
              {post.meta.description}
            </p>
          </a>
        </article>
      {/each}
    </main>

    <aside class="hidden md:block">
      <div class="sticky top-6 space-y-8">
        <div class="bg-white border border-slate-100 p-5 rounded-sm shadow-sm">
          <h3 class="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-50">
             { ui.related_tools[lang] }
          </h3>
          
          <div class="space-y-4">
            {#each quickTools as tool}
              <a href="{langPreUrl}{tool.href}" class="group block">
                <span class="text-xs font-bold block group-hover:underline text-[#1a1a1a]">
                  {tool.name[lang]}
                </span>
                <span class="text-[10px] text-slate-400 font-mono uppercase block mt-1 line-clamp-1">
                  {tool.desc[lang]}
                </span>
              </a>
            {/each}
          </div>
        </div>

       
      </div>
    </aside>

  </div>


</div>
