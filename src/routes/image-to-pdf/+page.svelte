<script lang="ts">
  // @ts-nocheck
  import { PDFDocument, PageSizes } from 'pdf-lib';
  import { Loader2, Trash2, Settings2, AlertCircle } from 'lucide-svelte';
  
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  import Content from '$lib/content/image-to-pdf.md';

  // --- LOGIC GỐC (GIỮ NGUYÊN ĐỂ ĐẢM BẢO CHẠY TỐT) ---
  const toolInfo = allTools.find((t) => t.id === 'image-to-pdf')!;
  const related = allTools.filter((t) => t.id !== 'image-to-pdf').slice(0, 5);

  let images = $state([]);
  let isProcessing = $state(false);
  let pdfUrl = $state(null);
  let resultFileName = $state("");
  let resultSize = $state(0);
  let errorMessage = $state(null);
  let pageSize = $state("original");
  let draggedIndex = $state(null);

  function handleFiles(newFiles) {
    errorMessage = null;
    const valid = newFiles.filter(f => f.type.startsWith('image/')).map(f => ({
        id: Math.random().toString(36).substring(2, 11),
        file: f,
        preview: URL.createObjectURL(f)
    }));
    images = [...images, ...valid];
    pdfUrl = null;
  }

  function onDragStart(index) { draggedIndex = index; }
  function onDragOver(e, index) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newImages = [...images];
    const item = newImages.splice(draggedIndex, 1)[0];
    newImages.splice(index, 0, item);
    images = newImages;
    draggedIndex = index;
  }

  function remove(index) {
    URL.revokeObjectURL(images[index].preview);
    images = images.filter((_, i) => i !== index);
    pdfUrl = null;
  }

  async function imageToJpgBytes(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsArrayBuffer(blob);
            }, 'image/jpeg', 0.9);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
  }

  async function convertToPdf() {
    if (images.length === 0) return;
    isProcessing = true;
    errorMessage = null;
    pdfUrl = null; 
    try {
      const pdfDoc = await PDFDocument.create();
      for (const item of images) {
        const jpgArrayBuffer = await imageToJpgBytes(item.file);
        const img = await pdfDoc.embedJpg(jpgArrayBuffer);
        if (pageSize === 'a4') {
          const page = pdfDoc.addPage(PageSizes.A4);
          const { width, height } = page.getSize();
          const scale = Math.min(width / img.width, height / img.height) * 0.95;
          const imgW = img.width * scale;
          const imgH = img.height * scale;
          page.drawImage(img, {
            x: (width - imgW) / 2, y: (height - imgH) / 2,
            width: imgW, height: imgH
          });
        } else {
          const page = pdfDoc.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
      }
      const pdfBytes = await pdfDoc.save();
      resultSize = pdfBytes.length;
      resultFileName = `JustLocalTools_${Date.now()}.pdf`;
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      pdfUrl = URL.createObjectURL(blob);
    } catch (e) {
      errorMessage = "Error converting images. Please try again.";
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    images = [];
    pdfUrl = null;
    errorMessage = null;
  }
</script>

<svelte:head>
  <title>{toolInfo.name} - Convert Images to PDF Online & Offline Free</title>
  
  <meta name="description" content="Convert JPG, PNG, WebP, and BMP images to PDF directly in your browser. Securely combine and reorder multiple images into a single PDF without uploading to any server." />
  <meta name="keywords" content="image to pdf, convert jpg to pdf, png to pdf converter, webp to pdf, combine images to pdf, browser-based pdf creator, no upload pdf converter, secure image to pdf" />
  <link rel="canonical" href="https://justlocaltools.com/image-to-pdf" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://justlocaltools.com/image-to-pdf" />
  <meta property="og:title" content="{toolInfo.name} - 100% Private & No Uploads" />
  <meta property="og:description" content="Turn your photos, scans, and documents into high-quality PDFs instantly. Your images stay on your device for total privacy." />

  {@html `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "${toolInfo.name}",
      "operatingSystem": "Any",
      "applicationCategory": "MultimediaApplication",
      "description": "A secure browser-based tool to combine and convert multiple images into a single PDF document locally.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  </script>`}
</svelte:head>

<div class="max-w-[980px] mx-auto px-4 py-6 md:py-10">
  <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

  <div class="flex flex-col lg:flex-row gap-8">
    <main class="flex-1 min-w-0">
      <div class="bg-white border border-slate-200 rounded-sm shadow-sm p-5 md:p-8">
        
        <Dropzone 
          accept="image/*" 
          multiple={true} 
          hasFiles={images.length > 0}
          onfiles={handleFiles}
          onClear={reset}
          label="Select Images"
        />

        {#if images.length > 0}
          <div class="mt-6 animate-in fade-in duration-300">
            <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-6 p-3 bg-slate-50 border border-slate-100 rounded-sm">
              {#each images as img, i (img.id)}
                <div 
                  draggable="true" ondragstart={() => onDragStart(i)} ondragover={(e) => onDragOver(e, i)}
                  class="relative aspect-square bg-white border border-slate-200 rounded-sm overflow-hidden group cursor-move shadow-sm"
                >
                  <img src={img.preview} alt="" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onclick={() => remove(i)} class="p-1 bg-red-500 text-white rounded-sm"><Trash2 size={10}/></button>
                  </div>
                  <span class="absolute bottom-0 left-0 bg-black/60 text-white text-[8px] px-1 font-mono">{i + 1}</span>
                </div>
              {/each}
            </div>

            <div class="flex items-center gap-4 mb-6 py-3 border-y border-slate-50">
              <span class="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1">
                <Settings2 size={12}/> Layout:
              </span>
              <div class="flex gap-4">
                {#each ['original', 'a4'] as size}
                  <label class="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" bind:group={pageSize} value={size} class="w-3 h-3 accent-black" />
                    <span class="text-[10px] font-mono uppercase text-slate-500 group-hover:text-black transition-colors">{size}</span>
                  </label>
                {/each}
              </div>
            </div>

            <button 
              onclick={convertToPdf} disabled={isProcessing} 
              class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-200 transition-all shadow-lg flex items-center justify-center"
            >
              {#if isProcessing} <Loader2 class="animate-spin mr-2" size={16} /> Converting... {:else} Convert to PDF {/if}
            </button>
          </div>
        {/if}

        {#if pdfUrl && !isProcessing}
          <div class="mt-6">
            <SuccessState 
              file={{ name: resultFileName, size: resultSize, url: pdfUrl }}
              onReset={reset}
            />
            
          </div>
        {/if}

        {#if errorMessage}
          <div class="mt-4 p-3 bg-red-50 text-red-600 text-[10px] font-mono uppercase font-bold flex items-center gap-2 border border-red-100">
            <AlertCircle size={14} /> {errorMessage}
          </div>
        {/if}
      </div>

      <article class="prose max-w-none pt-10 border-t border-slate-100">
        <Content />
      </article>
    </main>

    <aside class="w-full lg:w-[300px] shrink-0">
      <div class="sticky top-6 space-y-8">
        
        <div class="bg-white border border-slate-100 p-5 rounded-sm shadow-sm">
          <h3 class="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-50">Related Tools</h3>
          <div class="space-y-4">
            {#each related as r}
              <a href={r.href} class="group block">
                <span class="text-xs font-bold block group-hover:underline text-[#1a1a1a]">{r.name}</span>
                <span class="text-[10px] text-slate-400 font-mono uppercase block mt-1 line-clamp-1">{r.desc}</span>
              </a>
            {/each}
          </div>
        </div>
      </div>
    </aside>
  </div>
</div>

<style>
  /* Loại bỏ các khoảng trống thừa của typography để Ads gần content hơn */
  :global(.prose h2) { margin-top: 1.5rem !important; }
</style>

