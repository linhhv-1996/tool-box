<script lang="ts">
    import { page } from "$app/stores";
    import type { Language } from "$lib/translate/ui";
  let currentLang = $derived(($page.params.lang === 'ja' ? 'ja' : 'en') as Language);
  let pathPrefix = $derived(currentLang === 'ja' ? '/ja' : '');
</script>

<footer class="max-w-[980px] mx-auto px-4 md:px-0 py-6 mt-auto border-t border-slate-100 w-full text-[10px] font-mono text-slate-400 flex justify-between items-center uppercase font-bold">
  <div>
    &copy; {new Date().getFullYear()} JustLocalTools
  </div>
  
  <div class="space-x-4">
    <a href="{pathPrefix}/privacy" class="hover:text-black transition-colors">Privacy</a>
    <a href="{pathPrefix}/terms" class="hover:text-black transition-colors">Terms</a>
    <a href="https://x.com/MaxSlashWang" class="hover:text-black transition-colors">Twitter</a>
  </div>
</footer>
