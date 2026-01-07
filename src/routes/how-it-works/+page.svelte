<script lang="ts">
  import { ShieldCheck, Cpu, CloudOff } from 'lucide-svelte';
</script>

<svelte:head>
  <title>How it works | LOCALTOOLS_</title>
  <meta name="description" content="Learn how our 100% client-side processing keeps your files safe." />
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-16">
  <div class="mb-16 pb-8">
     <h1 class="text-xl font-bold tracking-tighter font-mono uppercase text-[#1a1a1a]">
      How it works
    </h1>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
    <div class="space-y-4">
      <div class="w-10 h-10 bg-slate-50 flex items-center justify-center border border-slate-100 rounded-sm">
        <CloudOff size={18} strokeWidth={1.5} />
      </div>
      <h3 class="font-mono font-bold uppercase text-sm tracking-tight">Zero Uploads</h3>
      <p class="text-slate-500 text-sm leading-relaxed">Unlike other tools, we don't have a backend. Your files never touch our servers because there are no servers.</p>
    </div>
    
    <div class="space-y-4">
      <div class="w-10 h-10 bg-slate-50 flex items-center justify-center border border-slate-100 rounded-sm">
        <Cpu size={18} strokeWidth={1.5} />
      </div>
      <h3 class="font-mono font-bold uppercase text-sm tracking-tight">Local Processing</h3>
      <p class="text-slate-500 text-sm leading-relaxed">We use your browser's WebAssembly and JavaScript engines to process data directly on your device's CPU.</p>
    </div>

    <div class="space-y-4">
      <div class="w-10 h-10 bg-slate-50 flex items-center justify-center border border-slate-100 rounded-sm">
        <ShieldCheck size={18} strokeWidth={1.5} />
      </div>
      <h3 class="font-mono font-bold uppercase text-sm tracking-tight">Total Privacy</h3>
      <p class="text-slate-500 text-sm leading-relaxed">Since processing happens in a local sandbox, no third-party (including us) can access your sensitive information.</p>
    </div>
  </div>

  <article class="prose max-w-none">
    <h3>The Technical Details</h3>
    <p>When you select a file, the browser creates a temporary <code>Blob</code> or <code>ArrayBuffer</code> in your device's RAM. Our algorithms (like <code>pdf-lib</code> for PDF merging) then operate on this memory buffer to generate the output.</p>
    <p>This approach is not only safer but often faster, as it eliminates the time spent on uploading large files and waiting for server queues.</p>
    
    <blockquote>
      "Our mission is to provide professional-grade utilities that treat user data as a liability, not an asset."
    </blockquote>
  </article>
</div>
