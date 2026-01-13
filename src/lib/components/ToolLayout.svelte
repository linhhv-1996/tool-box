<script lang="ts">
  import { page } from "$app/state";
  import { DEFAULT_LANG, SUPPORTED_LANGS } from "$lib/config/constant";
  import type { Language } from "$lib/translate/ui";

  let { backText = "← [ Back to Toolbox ]", title, description } = $props();

  // 2. Logic lấy lang: Ngắn gọn và dễ đọc hơn nhiều
  let lang = $derived(
    (SUPPORTED_LANGS.includes(page.params.lang ?? "")
      ? page.params.lang
      : DEFAULT_LANG) as Language,
  );

  // 3. Generer backLink: Nếu là en thì về gốc, còn lại thì theo ngôn ngữ
  let backLink = $derived(lang === DEFAULT_LANG ? "/" : `/${lang}`);
</script>

<div class="mb-10">
  <a
    href={backLink}
    class="text-[10px] font-mono text-slate-500 hover:text-black mb-4 inline-block tracking-widest uppercase"
  >
    {backText}
  </a>
  <h1 class="text-3xl font-bold tracking-tighter font-mono uppercase">
    {title}
  </h1>
  {#if description}
    <p class="text-slate-500 mt-2 text-sm">{description}</p>
  {/if}
</div>
