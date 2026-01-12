<script>
    import { page } from "$app/stores";

  let { backText="← [ Back to Toolbox ]", title, description } = $props();
  let lang = $derived($page.params.lang === 'ja' ? 'ja' : 'en');
  let backLink = $derived(lang == 'en' ? '/' : '/'+ lang);
</script>

<div class="mb-10">
  <a href="{backLink}" class="text-[10px] font-mono text-slate-500 hover:text-black mb-4 inline-block tracking-widest uppercase">
      {backText}
  </a>
  <h1 class="text-3xl font-bold tracking-tighter font-mono uppercase">{title}</h1>
  {#if description}
    <p class="text-slate-500 mt-2 text-sm">{description}</p>
  {/if}
</div>
