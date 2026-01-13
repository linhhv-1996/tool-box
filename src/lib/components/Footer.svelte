<script lang="ts">
    import { page } from "$app/state";
    import { DEFAULT_LANG, SUPPORTED_LANGS } from "$lib/config/constant";
    import { ui, type Language } from "$lib/translate/ui";

    let currentLang = $derived(
      (SUPPORTED_LANGS.includes(page.params.lang ?? '') 
        ? page.params.lang 
        : DEFAULT_LANG) as Language
    );

    let pathPrefix = $derived(currentLang === DEFAULT_LANG ? '' : `/${currentLang}`);
    
</script>

<footer class="max-w-[980px] mx-auto px-4 md:px-0 py-6 mt-auto border-t border-slate-100 w-full text-[10px] font-mono text-slate-400 flex justify-between items-center uppercase font-bold">
  <div>
    &copy; {new Date().getFullYear()} JustLocalTools
  </div>
  
  <div class="space-x-4">
    <a href="{pathPrefix}/privacy" class="hover:text-black transition-colors">{ui.footer.privacy[currentLang]}</a>
    <a href="{pathPrefix}/terms" class="hover:text-black transition-colors">{ui.footer.term[currentLang]}</a>
    <a href="https://x.com/MaxSlashWang" class="hover:text-black transition-colors">Twitter</a>
  </div>
</footer>
