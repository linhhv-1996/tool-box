<script lang="ts">
  import { Shield, EyeOff, BarChart3, Mail, Lock, Globe } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Privacy Policy | LOCALTOOLS_</title>
  <meta name="description" content="Privacy Policy and Data Protection for LOCALTOOLS_ - 100% Client-side processing." />
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-16">
  <div class="mb-16">
    <div class="flex items-center gap-2 mb-2">
       <Lock size={12} class="text-blue-600" />
       <span class="font-mono text-[10px] uppercase tracking-widest text-slate-400">Legal_Doc / Privacy_v1.0</span>
    </div>
    <h1 class="text-xl font-bold tracking-tighter font-mono uppercase text-[#1a1a1a]">
      Privacy Policy
    </h1>
    <p class="text-[10px] font-mono text-slate-400 mt-2 uppercase">Effective Date: January 2026</p>
    <hr class="mt-3 border-slate-100">
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
    <div class="md:col-span-3">
      <div class="sticky top-8 space-y-4">
        <div class="p-4 border border-slate-100 bg-slate-50/50 rounded-sm">
          <h4 class="font-mono text-[10px] font-bold uppercase mb-3 text-slate-900">Protocol Summary</h4>
          <ul class="space-y-2 text-[10px] text-slate-500 font-mono uppercase leading-tight">
            <li class="flex items-start gap-2">
              <span class="text-green-600">»</span> No File Uploads
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600">»</span> RAM-Only Processing
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600">»</span> AdSense Compliant
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-600">»</span> No Data Retention
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="md:col-span-9">
      <article class="prose max-w-none">
        
        <section class="mb-12">
          <div class="flex items-center gap-2 mb-4">
            <Shield size={14} class="text-slate-900" />
            <h3 class="!m-0 uppercase text-[12px] tracking-wider">1. Zero Data Collection Policy</h3>
          </div>
          <p>
            At <strong>LOCALTOOLS_</strong>, privacy is not a feature; it is the core architecture. We operate on a strict <strong>Zero-Knowledge</strong> basis regarding your files:
          </p>
          <ul>
            <li><strong>Local Runtime:</strong> All processing (PDF merging, image conversion, etc.) occurs exclusively within your browser's execution context.</li>
            <li><strong>Zero Ingestion:</strong> We do not transmit, upload, or store your files on any remote server. There is no backend database for user content.</li>
            <li><strong>Volatile Memory:</strong> Data processed is stored in temporary RAM buffers and is permanently purged once the browser tab is closed.</li>
          </ul>
        </section>

        <section class="mb-12 pt-8 border-t border-dashed border-slate-100">
          <div class="flex items-center gap-2 mb-4">
            <Globe size={14} class="text-slate-900" />
            <h3 class="!m-0 uppercase text-[12px] tracking-wider">2. Advertising & Cookies</h3>
          </div>
          <p>
            To keep our tools free, we partner with third-party advertising networks (specifically Google AdSense). These partners may use cookies to serve personalized ads based on your browsing behavior:
          </p>
          <ul>
            <li><strong>Google AdSense:</strong> Google uses cookies (such as the DART cookie) to serve ads to users based on their visit to this and other sites on the Internet.</li>
            <li><strong>Opt-out:</strong> You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" class="underline decoration-slate-200 underline-offset-4">Google Ads Settings</a>.</li>
            <li><strong>Analytics:</strong> We use Google Analytics to monitor traffic patterns and site performance. This data is aggregated and contains no personally identifiable information.</li>
          </ul>
        </section>

        <section class="mb-12 pt-8 border-t border-dashed border-slate-100">
          <div class="flex items-center gap-2 mb-4">
            <BarChart3 size={14} class="text-slate-900" />
            <h3 class="!m-0 uppercase text-[12px] tracking-wider">3. Log Files</h3>
          </div>
          <p>
            LOCALTOOLS_ follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected includes IP addresses, browser type, Internet Service Provider (ISP), date/time stamp, and referring/exit pages. 
          </p>
          <p>
            The purpose of the information is for analyzing trends, administering the site, and tracking users' movement on the website, and is not linked to any information that is personally identifiable.
          </p>
        </section>

        <section class="mb-12 pt-8 border-t border-dashed border-slate-100">
          <div class="flex items-center gap-2 mb-4">
            <EyeOff size={14} class="text-slate-900" />
            <h3 class="!m-0 uppercase text-[12px] tracking-wider">4. Children's Information</h3>
          </div>
          <p>
            Another part of our priority is adding protection for children while using the internet. We do not knowingly collect any Personal Identifiable Information from children under the age of 13. 
          </p>
          <p>
            If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information.
          </p>
        </section>

        <section class="p-6 bg-slate-50 border border-slate-100">
          <div class="flex items-center gap-2 mb-4">
            <Mail size={14} class="text-slate-900" />
            <h3 class="!m-0 uppercase text-[12px] tracking-wider">5. Contact</h3>
          </div>
          <p class="m-0 text-slate-500 text-[13px]">
            For any inquiries regarding this policy, please reach out via: <br />
            <em class="text-slate-900 not-italic font-mono text-[11px] mt-2 inline-block underline">linhhv.196@gmail.com</em>
          </p>
        </section>

      </article>
    </div>
  </div>
</div>
