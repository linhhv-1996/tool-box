<script lang="ts">
  import { page } from '$app/state';
  import { allTools } from '$lib/config/tools';

  // Lấy ngẫu nhiên vài tool để gợi ý user quay lại
  const suggestedTools = allTools.slice(0, 3);
</script>

<svelte:head>
  <title>Coming Soon | JUSTLOCALTOOLS_</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center text-center">

  <h1 class="text-[30px] font-bold tracking-tighter font-mono uppercase mb-8 mt-0 leading-none text-black">
    Coming <br /> Soon
  </h1>

  <p class="text-slate-500 text-sm max-w-md leading-relaxed mb-12 font-sans">
    The tool you are looking for is currently being refined in our workshop. 
    We are building it locally to ensure 100% privacy and zero data leakage.
  </p>

  <a 
    href="/" 
    class="px-10 py-4 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl shadow-black/5"
  >
    Return to Workshop
  </a>

  
</div>

<style>
  /* Hiệu ứng nhấp nháy dấu gạch dưới đặc trưng của terminal */
  h1::after {
    content: '';
    display: inline-block;
    width: 20px;
    height: 4px;
    background: #000;
    margin-left: 5px;
    animation: blink 1s step-end infinite;
    vertical-align: bottom;
  }

  @keyframes blink {
    50% { opacity: 0; }
  }
</style>
