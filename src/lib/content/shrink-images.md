<script lang="ts">
	import ToolLayout from '$lib/components/ToolLayout.svelte';
	import Dropzone from '$lib/components/Dropzone.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Slider } from '$lib/components/ui/slider'; // Giả sử mày có slider từ shadcn/ui hoặc input range
	import { Download, Loader2, ImageIcon, FileWarning } from 'lucide-svelte';
	import { onMount } from 'svelte';

	// Jsquash imports
	import decodeJpeg from '@jsquash/jpeg/decode';
	import encodeJpeg from '@jsquash/jpeg/encode';
	import decodePng from '@jsquash/png/decode';
	import encodePng from '@jsquash/png/encode';
	import decodeWebp from '@jsquash/webp/decode';
	import encodeWebp from '@jsquash/webp/encode';

	let files = $state<File[]>([]);
	let isProcessing = $state(false);
	let quality = $state([75]); // Default quality 75%
	let results = $state<{ name: string; oldSize: number; newSize: number; blob: Blob; url: string }[]>([]);

	async function handleFiles(newFiles: File[]) {
		files = [...files, ...newFiles];
		await processImages();
	}

	async function processImages() {
		if (files.length === 0) return;
		isProcessing = true;
		results = [];

		try {
			for (const file of files) {
				const arrayBuffer = await file.arrayBuffer();
				let imageData: ImageData;
				let compressedBuffer: ArrayBuffer;

				// 1. Decode dựa trên mime type
				if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
					imageData = await decodeJpeg(arrayBuffer);
					compressedBuffer = await encodeJpeg(imageData, { quality: quality[0] });
				} else if (file.type === 'image/png') {
					imageData = await decodePng(arrayBuffer);
					compressedBuffer = await encodePng(imageData); // Oxipng nén lossless mặc định cực tốt
				} else if (file.type === 'image/webp') {
					imageData = await decodeWebp(arrayBuffer);
					compressedBuffer = await encodeWebp(imageData, { quality: quality[0] });
				} else {
					continue; // Bỏ qua định dạng không hỗ trợ
				}

				const resultBlob = new Blob([compressedBuffer], { type: file.type });
				results.push({
					name: file.name,
					oldSize: file.size,
					newSize: resultBlob.size,
					blob: resultBlob,
					url: URL.createObjectURL(resultBlob)
				});
			}
		} catch (error) {
			console.error('Compression error:', error);
		} finally {
			isProcessing = false;
		}
	}

	function formatSize(bytes: number) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
</script>

<ToolLayout
	title="Compress Images Online"
	description="Shrink JPG, PNG, and WebP images using professional WASM encoders. 100% private."
>
	<div class="space-y-8">
		{#if results.length === 0}
			<Dropzone
				accept="image/jpeg,image/png,image/webp"
				multiple={true}
				onUpload={handleFiles}
				placeholder="Drop JPG, PNG or WebP images here"
			/>
		{/if}

		{#if files.length > 0}
			<div class="bg-card rounded-xl border p-6 space-y-6">
				<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div class="space-y-1">
						<h3 class="font-medium">Compression Quality: {quality[0]}%</h3>
						<p class="text-sm text-muted-foreground">Lower quality = smaller file size</p>
					</div>
					<div class="w-full md:w-64">
						<input 
                            type="range" 
                            min="1" max="100" 
                            bind:value={quality[0]} 
                            onchange={processImages}
                            class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                        />
					</div>
				</div>

				{#if isProcessing}
					<div class="flex items-center justify-center py-12">
						<Loader2 class="w-8 h-8 animate-spin text-primary" />
						<span class="ml-3 text-lg">Optimizing your images...</span>
					</div>
				{:else}
					<div class="grid gap-4">
						{#each results as res}
							<div class="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border">
								<div class="flex items-center gap-4">
									<div class="w-12 h-12 rounded bg-background overflow-hidden border">
										<img src={res.url} alt="preview" class="w-full h-full object-cover" />
									</div>
									<div class="min-w-0">
										<p class="font-medium truncate max-w-[200px]">{res.name}</p>
										<p class="text-xs text-muted-foreground">
											<span class="line-through">{formatSize(res.oldSize)}</span> 
											→ <span class="text-primary font-bold">{formatSize(res.newSize)}</span>
											({Math.round((1 - res.newSize / res.oldSize) * 100)}% off)
										</p>
									</div>
								</div>
								<a href={res.url} download="optimized-{res.name}">
									<Button size="sm">
										<Download class="w-4 h-4 mr-2" />
										Download
									</Button>
								</a>
							</div>
						{/each}
					</div>

					<div class="flex justify-center">
						<Button variant="outline" onclick={() => { files = []; results = []; }}>
							Clear all and start over
						</Button>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	{#snippet info()}
		{/snippet}
</ToolLayout>
