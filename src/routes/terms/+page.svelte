<script lang="ts">
  import { Scale, ShieldAlert, FileText, Ban, HelpCircle, HardDrive } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Terms of Service | LOCALTOOLS_</title>
  <meta name="description" content="Terms of Service and Usage Agreement for LOCALTOOLS_." />
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-16">
  <div class="mb-16">
    <div class="flex items-center gap-2 mb-2">
       <Scale size={12} class="text-amber-600" />
       <span class="font-mono text-[10px] uppercase tracking-widest text-slate-400">Legal_Doc / Terms_v1.0</span>
    </div>
    <h1 class="text-xl font-bold tracking-tighter font-mono uppercase text-[#1a1a1a]">
      Terms of Service
    </h1>
    <p class="text-[10px] font-mono text-slate-400 mt-2 uppercase">Last Revised: January 2026</p>
    <hr class="mt-3 border-slate-100">
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
    <div class="md:col-span-3">
      <div class="sticky top-8 space-y-4">
        <div class="p-4 border border-slate-100 bg-slate-50/50 rounded-sm">
          <h4 class="font-mono text-[10px] font-bold uppercase mb-3 text-slate-900">User Agreement</h4>
          <ul class="space-y-2 text-[10px] text-slate-500 font-mono uppercase leading-tight">
            <li class="flex items-start gap-2">
              <span class="text-slate-400">01</span> Free for Commercial Use
            </li>
            <li class="flex items-start gap-2">
              <span class="text-slate-400">02</span> No Malware Processing
            </li>
            <li class="flex items-start gap-2">
              <span class="text-slate-400">03</span> No Data Warranty
            </li>
            <li class="flex items-start gap-2">
              <span class="text-slate-400">04</span> Browser-Only Execution
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="md:col-span-9">
      <article class="prose max-w-none">
        
        <section class="mb-12">
          <div class="flex items-center gap-2 mb-4">
            <FileText size={14} class="text-slate-900" />
            <h3 class="!m-0 uppercase text-[12px] tracking-wider">1. Agreement to Terms</h3>
          </div>
          <p>
            By accessing or using <strong>LOCALTOOLS_</strong>, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using or accessing this site. All tools are provided through your browser "as-is" without any account registration requirements.
          </p>
        </section>

        <section class="mb-12 pt-8 border-t border-dashed border-slate-100">
          <div class="flex items-center gap-2 mb-4">
            <HardDrive size={14} class="text-slate-900" />
            <h3 class="!m-0 uppercase text-[12px] tracking-wider">2. Use License & Scope</h3>
          </div>
          <p>
            Permission is granted to use the tools on LOCALTOOLS_ for both personal and commercial purposes. This is the grant of a usage license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>Attempt to decompile or reverse engineer any software contained on the website;</li>
            <li>Use the services for any illegal activities or to process malware-infected files;</li>
            <li>Remove any copyright or other proprietary notations from the materials;</li>
            <li>Automate access to the site via bots or scrapers that may degrade service performance.</li>
          </ul>
        </section>

        <section class="mb-12 pt-8 border-t border-dashed border-slate-100">
          <div class="flex items-center gap-2 mb-4">
            <ShieldAlert size={14} class="text-slate-900" />
            <h3 class="!m-0 uppercase text-[12px] tracking-wider">3. Disclaimer of Warranties</h3>
          </div>
          <p>
            The materials and tools on LOCALTOOLS_ are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation:
          </p>
          <ul>
            <li><strong>Data Integrity:</strong> We are not responsible for any data loss resulting from browser crashes, memory overflows, or file processing errors.</li>
            <li><strong>Availability:</strong> We do not guarantee that the tools will be uninterrupted, timely, or error-free.</li>
            <li><strong>Local Performance:</strong> Execution speed and success depend entirely on your device's hardware capability (CPU/RAM).</li>
          </ul>
        </section>

        <section class="mb-12 pt-8 border-t border-dashed border-slate-100">
          <div class="flex items-center gap-2 mb-4">
            <Ban size={14} class="text-slate-900" />
            <h3 class="!m-0 uppercase text-[12px] tracking-wider">4. Limitations of Liability</h3>
          </div>
          <p>
            In no event shall LOCALTOOLS_ or its developers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the tools, even if notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section class="mb-12 pt-8 border-t border-dashed border-slate-100">
          <div class="flex items-center gap-2 mb-4">
            <HelpCircle size={14} class="text-slate-900" />
            <h3 class="!m-0 uppercase text-[12px] tracking-wider">5. External Links & Ads</h3>
          </div>
          <p>
            LOCALTOOLS_ may contain links to third-party websites or services (such as advertisers). We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us.
          </p>
        </section>

        <section class="p-6 bg-slate-50 border border-slate-100 font-mono">
          <h3 class="!m-0 uppercase text-[12px] tracking-wider mb-4">6. Governing Law</h3>
          <p class="m-0 text-[12px] text-slate-500 leading-relaxed">
            These terms and conditions are governed by and construed in accordance with international web standards and the laws of your local jurisdiction. Any disputes shall be subject to the exclusive jurisdiction of the courts in your location.
          </p>
          <div class="mt-6 pt-6 border-t border-slate-200">
             <p class="m-0 text-[11px] text-slate-400 uppercase tracking-tighter">
               Contact: linhhv.196@gmail.com
             </p>
          </div>
        </section>

      </article>
    </div>
  </div>
</div>
