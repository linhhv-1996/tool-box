<script lang="ts">
  import { ShieldCheck, Cpu, CloudOff, ArrowRight, Activity } from 'lucide-svelte';
</script>

<svelte:head>
  <title>How it works | LOCALTOOLS_</title>
  <meta name="description" content="Learn how our 100% client-side processing keeps your files safe." />
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-16">
  <div class="mb-16">
    <div class="flex items-center gap-2 mb-2">
       <Activity size={12} class="text-green-500" />
       <span class="font-mono text-[10px] uppercase tracking-widest text-slate-400">System Architecture / 01</span>
    </div>
    <h1 class="text-xl font-bold tracking-tighter font-mono uppercase text-[#1a1a1a]">
      How it works
    </h1>
    <hr class="mt-3 border-slate-100">
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 border border-slate-100 rounded-sm mb-20 divide-y md:divide-y-0 md:divide-x divide-slate-100">
    <div class="p-8 space-y-4">
      <div class="flex items-center justify-between">
        <div class="w-8 h-8 bg-slate-50 flex items-center justify-center border border-slate-100 rounded-sm">
          <CloudOff size={14} strokeWidth={1.5} />
        </div>
        <span class="font-mono text-[10px] text-slate-300">STEP_01</span>
      </div>
      <div>
        <h3 class="font-mono font-bold uppercase text-[11px] tracking-tight mb-2">Zero Uploads</h3>
        <p class="text-slate-500 text-[13px] leading-relaxed">
          Your files never touch our servers because there are no servers. Everything stays in the browser.
        </p>
      </div>
    </div>
    
    <div class="p-8 space-y-4 bg-slate-50/30">
      <div class="flex items-center justify-between">
        <div class="w-8 h-8 bg-slate-50 flex items-center justify-center border border-slate-100 rounded-sm">
          <Cpu size={14} strokeWidth={1.5} />
        </div>
        <span class="font-mono text-[10px] text-slate-300">STEP_02</span>
      </div>
      <div>
        <h3 class="font-mono font-bold uppercase text-[11px] tracking-tight mb-2">Local Processing</h3>
        <p class="text-slate-500 text-[13px] leading-relaxed">
          We use WebAssembly and JavaScript engines to process data directly on your device's CPU.
        </p>
      </div>
    </div>

    <div class="p-8 space-y-4">
      <div class="flex items-center justify-between">
        <div class="w-8 h-8 bg-slate-50 flex items-center justify-center border border-slate-100 rounded-sm">
          <ShieldCheck size={14} strokeWidth={1.5} />
        </div>
        <span class="font-mono text-[10px] text-slate-300">STEP_03</span>
      </div>
      <div>
        <h3 class="font-mono font-bold uppercase text-[11px] tracking-tight mb-2">Total Privacy</h3>
        <p class="text-slate-500 text-[13px] leading-relaxed">
          Processing happens in a local sandbox, ensuring no third-party can access your information.
        </p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-12 pt-12 border-t border-dashed border-slate-200">
    <div class="md:col-span-4">
      <h2 class="font-mono font-bold uppercase text-xs tracking-widest text-slate-900">
        The Technical Details
      </h2>
      <p class="mt-4 text-slate-400 text-[12px] leading-5">
        A deep dive into how we handle binary data without a backend.
      </p>
    </div>

    <div class="md:col-span-8">
      <article class="prose max-w-none">
        <p>
          When you select a file, the browser creates a temporary <code>Blob</code> or 
          <code>ArrayBuffer</code> in your device's RAM. Our algorithms operate on this memory buffer to generate the output.
        </p>
        <p>
          This approach is not only safer but often faster, as it eliminates the time spent on uploading large files and waiting for server queues.
        </p>
        
        <div class="mt-12 p-6 border-l-2 border-slate-900 bg-slate-50">
          <p class="italic m-0 text-slate-900">
            "Our mission is to provide professional-grade utilities that treat user data as a liability, not an asset."
          </p>
        </div>
      </article>
    </div>
  </div>
</div>