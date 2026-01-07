<script>
  const categories = [
    {
      id: "01",
      title: "PDF Utilities",
      tools: [
        { name: "Combine PDF Files", desc: "Merge multiple PDF documents into one.", href: "/combine-pdf" },
        { name: "Split PDF", desc: "Extract or split pages from a PDF file.", href: "/split-pdf" },
        { name: "Unlock PDF", desc: "Remove password protection from PDFs locally.", href: "/unlock-pdf" },
        { name: "Protect PDF", desc: "Add a password to secure your documents.", href: "/protect-pdf" },
        { name: "PDF to Image", desc: "Convert PDF pages into JPG or PNG images.", href: "/pdf-to-image" }
      ]
    },
    {
      id: "02",
      title: "Photo & Media",
      tools: [
        { name: "Remove Background", desc: "Automatically remove image backgrounds in-browser.", href: "/remove-background" },
        { name: "iPhone Photo Converter", desc: "Convert HEIC photos to standard JPG format.", href: "/heic-to-jpg" },
        { name: "Shrink Image Size", desc: "Compress images while preserving visual quality.", href: "/shrink-images" },
        { name: "Social Media Resizer", desc: "Resize images for Instagram, YouTube, and TikTok.", href: "/social-media-resizer" },
        { name: "Video to GIF", desc: "Turn short video clips into animated GIFs.", href: "/video-to-gif" }
      ]
    },
    {
      id: "03",
      title: "Productivity",
      tools: [
        { name: "Copy Text from Image", desc: "Extract text from photos and scanned documents.", href: "/copy-text-from-image" },
        { name: "Excel to PDF", desc: "Convert Excel spreadsheets into printable PDFs.", href: "/excel-to-pdf" },
        { name: "Spreadsheet to JSON", desc: "Transform spreadsheet data into JSON format.", href: "/spreadsheet-to-json" }
      ]
    },
    {
      id: "04",
      title: "Security & Others",
      tools: [
        { name: "Secure Password Generator", desc: "Generate strong passwords using your device only.", href: "/secure-password-generator" },
        { name: "Private QR Generator", desc: "Create QR codes without tracking or data sharing.", href: "/private-qr-generator" }
      ]
    }
  ];
</script>

<div class="max-w-4xl mx-auto px-4 py-12">
  <section class="mb-20">
    <h2 class="text-2xl leading-snug max-w-2xl font-semibold tracking-tight">
      Stop uploading your private files to random servers. 
      <span class="bg-black text-white px-1 ml-1">Everything stays on your computer.</span> 
      Our tools use your browser's power to get the job done instantly.
    </h2>
  </section>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
    {#each categories as category}
      <div>
        <h3 class="font-mono uppercase text-[11px] font-bold tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-100 pb-2">
          {category.id}. {category.title}
        </h3>
        <ul class="space-y-6">
          {#each category.tools as tool}
            <li>
              <a href={tool.href} class="group block">
                <span class="font-bold block group-hover:underline">{tool.name}</span>
                <span class="text-xs text-slate-500">{tool.desc}</span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</div>
