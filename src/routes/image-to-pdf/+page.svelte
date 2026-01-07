<script lang="ts">
  // @ts-nocheck
  import { PDFDocument } from 'pdf-lib';
  import { Download, Check, Loader2, Trash2, GripHorizontal } from 'lucide-svelte';
  
  import { allTools } from '$lib/config/tools';
  import ToolLayout from '$lib/components/ToolLayout.svelte';
  import Dropzone from '$lib/components/Dropzone.svelte';
  import Content from '$lib/content/image-to-pdf.md';

  const toolInfo = allTools.find((t) => t.id === 'image-to-pdf')!;
  const related = allTools.filter((t) => t.id !== 'image-to-pdf').slice(0, 6);

  let images = $state<{id: string, file: File, preview: string}[]>([]);
  let isProcessing = $state(false);
  let pdfUrl = $state<string | null>(null);
  let resultFileName = $state("");
  let draggedIndex = $state<number | null>(null);

  function handleFiles(newFiles: File[]) {
    const valid = newFiles.filter(f => f.type.startsWith('image/')).map(f => ({
        id: Math.random().toString(36).substr(2, 9),
        file: f,
        preview: URL.createObjectURL(f)
    }));
    images = [...images, ...valid];
    pdfUrl = null;
  }

  // Drag & Drop logic
  function onDragStart(index: number) {
    draggedIndex = index;
  }

  function onDragOver(e: DragEvent, index: number) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newImages = [...images];
    const item = newImages.splice(draggedIndex, 1)[0];
    newImages.splice(index, 0, item);
    images = newImages;
    draggedIndex = index;
  }

  function remove(index: number) {
    URL.revokeObjectURL(images[index].preview);
    images = images.filter((_, i) => i !== index);
    pdfUrl = null;
  }

  async function convertToPdf() {
    if (images.length === 0) return;
    isProcessing = true;

    try {
      const pdfDoc = await PDFDocument.create();
      for (const item of images) {
        const arrayBuffer = await item.file.arrayBuffer();
        let img;
        if (item.file.type.includes('png')) {
            img = await pdfDoc.embedPng(arrayBuffer);
        } else {
            img = await pdfDoc.embedJpg(arrayBuffer);
        }
        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      pdfUrl = URL.createObjectURL(blob);
      resultFileName = `converted_images_${Date.now()}.pdf`;
    } catch (e) {
      console.error(e);
    } finally {
      isProcessing = false;
    }
  }
</script>

<svelte:head>
  <title>{toolInfo.name} | JUSTLOCALTOOLS_</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-12">
  <ToolLayout title={toolInfo.name} description={toolInfo.desc} />

  <div class="mt-10 bg-white border border-slate-200 p-6 md:p-10 rounded-sm shadow-sm">
    <Dropzone onfiles={handleFiles} multiple={true} accept="image/*" />

    {#if images.length > 0}
      <div class="mt-10 animate-in fade-in slide-in-from-bottom-2">
        <div class="flex justify-between items-end border-b border-slate-100 pb-2 mb-6">
          <span class="font-mono text-[10px] font-bold uppercase text-slate-400 tracking-widest">Workspace (Drag to Reorder)</span>
          <button onclick={() => {images = []; pdfUrl = null;}} class="text-[10px] font-mono uppercase hover:text-black cursor-pointer underline underline-offset-4 decoration-slate-200">Remove All</button>
        </div>

        <div class="w-full overflow-x-auto pb-4 mb-10 custom-scrollbar bg-slate-50/30 p-4 border border-slate-100 rounded-sm">
            <div class="flex gap-2 min-w-max">
                {#each images as img, i (img.id)}
                <div 
                    draggable="true"
                    ondragstart={() => onDragStart(i)}
                    ondragover={(e) => onDragOver(e, i)}
                    ondragend={() => draggedIndex = null}
                    class="relative group cursor-grab active:cursor-grabbing transition-all {draggedIndex === i ? 'opacity-20 scale-95' : 'opacity-100'}"
                >
                    <div class="h-[60px] w-auto min-w-[45px] bg-white border border-slate-200 overflow-hidden shadow-sm group-hover:border-black transition-colors relative">
                        <img src={img.preview} alt="p{i+1}" class="h-full w-auto object-contain pointer-events-none" />
                        
                        <div class="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[7px] font-mono py-0.5 text-center leading-none">
                            {i + 1}
                        </div>

                        <button 
                            onclick={() => remove(i)} 
                            class="absolute top-0 right-0 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={8}/>
                        </button>
                    </div>
                </div>
                {/each}
                
                {#if images.length > 0}
                   <div class="h-[60px] w-12 border border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                       <GripHorizontal size={14} />
                   </div>
                {/if}
            </div>
        </div>

        <button 
          onclick={convertToPdf} 
          disabled={isProcessing} 
          class="w-full h-14 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-400 transition-all flex items-center justify-center"
        >
          {#if isProcessing} 
            <Loader2 class="animate-spin mr-2" size={14} /> 
            Generating PDF... 
          {:else} 
            {pdfUrl ? 'Update PDF Document' : 'Convert Images to PDF'} 
          {/if}
        </button>

        {#if pdfUrl && !isProcessing}
          <div class="mt-12 p-8 border border-slate-100 bg-slate-50/30 rounded-sm flex flex-col items-center animate-in fade-in slide-in-from-bottom-2">
            <div class="w-10 h-10 bg-[#22c55e] text-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Check size={20} />
            </div>
            <h4 class="text-md font-bold text-black mb-1">Conversion Successful</h4>
            <p class="text-[12px] text-slate-500 font-mono mb-6">{images.length} pages combined locally</p>
            
            <a 
              href={pdfUrl} 
              download={resultFileName}
              class="inline-flex items-center gap-3 bg-[#22c55e] text-white px-12 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#16a34a] transition-all shadow-md active:scale-[0.98]"
            >
              <Download size={14} /> Download PDF
            </a>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <article class="prose mt-24 border-t border-slate-100 pt-16 mx-auto">
    <Content />
  </article>

  <div class="mt-24 border-t border-slate-100 pt-16 pb-20">
    <h3 class="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-10 pb-2 border-b border-slate-50">Related Tools</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
      {#each related as r}
        <a href={r.href} class="group block">
          <span class="font-bold block group-hover:underline text-[#1a1a1a] transition-all underline-offset-2 tracking-tight">{r.name}</span>
          <span class="text-[11px] text-slate-400 font-mono uppercase tracking-tight mt-0.5 block">{r.desc}</span>
        </a>
      {/each}
    </div>
  </div>
</div>

<style>
    .custom-scrollbar::-webkit-scrollbar { height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>
