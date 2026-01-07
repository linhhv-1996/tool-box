<script>
// @ts-nocheck

  let { onfiles, accept = ".pdf", multiple = true } = $props();
</script>

<div class="border-2 border-dashed border-slate-200 rounded-sm p-12 text-center bg-slate-50/50 hover:border-black transition-colors group">
  <input 
    type="file" {multiple} {accept}
    id="file-input" class="hidden"
    onchange={(e) => onfiles(Array.from(e.target.files))}
  />
  <label for="file-input" class="cursor-pointer">
    <span class="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-black transition-colors">
      [ Click to select or Drag files here ]
    </span>
  </label>
</div>
