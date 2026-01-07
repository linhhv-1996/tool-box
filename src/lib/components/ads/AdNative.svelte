<script lang="ts">
  // Ông có thể truyền ID quảng cáo hoặc type vào đây nếu dùng Google AdSense
  let { slot = "123456789" } = $props();
</script>

<div class="my-8 p-4 border border-slate-100 bg-slate-50/50 rounded-sm">
  <div class="flex justify-between items-center mb-2">
    <span class="font-mono text-[9px] uppercase tracking-widest text-slate-400">Sponsored Content</span>
  </div>
  
  <div class="min-h-25 flex items-center justify-center text-slate-300 italic text-xs">
    [ Native Ad Slot: {slot} ]
  </div>
</div>
