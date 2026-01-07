<script lang="ts">
  // @ts-nocheck
  import { PDFDocument, PageSizes } from 'pdf-lib';
  import { Loader2, Trash2, GripHorizontal, Plus, AlertCircle, Settings2 } from 'lucide-svelte';
  
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import SuccessState from '$lib/components/SuccessState.svelte';
  import Content from '$lib/content/image-to-pdf.md';

  // --- LOGIC GIỮ NGUYÊN ---
  const toolInfo = allTools.find((t) => t.id === 'image-to-pdf')!;
  const related = allTools.filter((t) => t.id !== 'image-to-pdf').slice(0, 6);

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
    resultSize = 0;
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
    resultSize = 0;
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
            x: (width - imgW) / 2,
            y: (height - imgH) / 2,
            width: imgW,
            height: imgH
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
      console.error(e);
      errorMessage = "Error converting images. Please try again.";
    } finally {
      isProcessing = false;
    }
  }

  function reset() {
    images = [];
    pdfUrl = null;
    resultSize = 0;
    errorMessage = null;
  }
</script>

<svelte:head>
  <title>{toolInfo.name} | JustLocalTools</title>
</svelte:head>

<div class="max-w-[980px] mx-auto px-0 py-12">
  <div class="flex flex-col lg:flex-row lg:justify-between">
    
    <div class="w-full lg:w-[640px] shrink-0">
      <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

      <div class="mt-10 bg-white border border-slate-200 p-6 md:p-10 rounded-sm shadow-sm">
        <Dropzone onfiles={handleFiles} multiple={true} accept="image/*" />

        {#if images.length > 0}
          <div class="mt-10 animate-in fade-in slide-in-from-bottom-2">
            
            <div class="flex justify-between items-end border-b border-slate-100 pb-2 mb-4">
              <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                Workspace ({images.length} images - Drag to reorder)
              </span>
              <button onclick={() => {images = []; pdfUrl = null; resultSize = 0;}} class="text-[10px] font-mono uppercase underline underline-offset-4 decoration-slate-200 hover:text-red-500 transition-colors">
                Clear all
              </button>
            </div>

            <div class="w-full overflow-x-auto pb-4 mb-8 custom-scrollbar bg-slate-50 border border-slate-200 p-4 rounded-sm">
                <div class="flex flex-nowrap gap-4 min-w-max">
                    {#each images as img, i (img.id)}
                    <div 
                        draggable="true"
                        ondragstart={() => onDragStart(i)}
                        ondragover={(e) => onDragOver(e, i)}
                        ondragend={() => draggedIndex = null}
                        class="relative flex-shrink-0 group cursor-grab active:cursor-grabbing transition-all {draggedIndex === i ? 'opacity-20 scale-95' : 'opacity-100'}"
                    >
                        <div class="h-[90px] w-[90px] bg-white border border-slate-200 overflow-hidden relative shadow-sm group-hover:border-black transition-all">
                            <img src={img.preview} alt="" class="h-full w-full object-cover pointer-events-none" />
                            <div class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] font-mono py-1 text-center leading-none">{i + 1}</div>
                            <button onclick={() => remove(i)} class="absolute top-0 right-0 p-1.5 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={12}/>
                            </button>
                        </div>
                    </div>
                    {/each}
                    <div class="h-[90px] w-12 flex-shrink-0 border border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                        <GripHorizontal size={20} />
                    </div>
                </div>
            </div>

            <div class="flex flex-wrap gap-6 mb-8 p-5 bg-slate-50/50 border border-slate-100 rounded-sm">
                <div class="flex items-center gap-2 mr-2">
                    <Settings2 size={14} class="text-slate-400" />
                    <span class="font-mono text-[10px] font-bold uppercase text-slate-500">Page Layout:</span>
                </div>
                <label class="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" bind:group={pageSize} value="original" class="w-3 h-3 accent-black" />
                    <span class="text-[11px] font-mono uppercase group-hover:text-black transition-colors">Original Size</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" bind:group={pageSize} value="a4" class="w-3 h-3 accent-black" />
                    <span class="text-[11px] font-mono uppercase group-hover:text-black transition-colors">Fit to A4</span>
                </label>
            </div>

            <button 
              onclick={convertToPdf} 
              disabled={isProcessing} 
              class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-300 transition-all flex items-center justify-center shadow-lg"
            >
              {#if isProcessing} <Loader2 class="animate-spin mr-2" size={16} /> Processing... {:else} Convert to PDF {/if}
            </button>

            {#if errorMessage}
              <div class="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 text-[12px] flex items-center gap-3 font-mono uppercase font-bold">
                <AlertCircle size={16} /> {errorMessage}
              </div>
            {/if}

            {#if pdfUrl && !isProcessing && resultSize > 0}
              <SuccessState 
                type="file"
                title="PDF Ready" 
                subTitle="{images.length} images merged successfully" 
                file={{ name: resultFileName, size: resultSize, url: pdfUrl }}
                onReset={reset}
              />
            {/if}
          </div>
        {/if}
      </div>

      <article class="prose mt-16 border-t border-slate-100 pt-12">
        <Content />
      </article>
    </div>

    <aside class="w-full lg:w-[310px] shrink-0 mt-16 lg:mt-0">
      <div class="sticky top-8">
        <h3 class="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 pb-2 border-b border-slate-100">
          Related Tools
        </h3>
        <div class="flex flex-col gap-y-6">
          {#each related as r}
            <a href={r.href} class="group block">
              <span class="font-bold block group-hover:underline text-[#1a1a1a] transition-all underline-offset-2 leading-tight">{r.name}</span>
              <span class="text-[10px] text-slate-400 font-mono uppercase mt-1 block line-clamp-2 leading-relaxed">{r.desc}</span>
            </a>
          {/each}
        </div>
        </div>
    </aside>

  </div>
</div>

<style>
    .custom-scrollbar::-webkit-scrollbar { height: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
