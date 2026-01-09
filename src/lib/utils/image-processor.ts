import decodeJpeg from '@jsquash/jpeg/decode';
import encodeJpeg from '@jsquash/jpeg/encode';
import decodePng from '@jsquash/png/decode';
import encodePng from '@jsquash/png/encode';
import decodeWebp from '@jsquash/webp/decode';
import encodeWebp from '@jsquash/webp/encode';

// Hàm helper để nạp wasm từ thư mục static
async function initWasm(url: string) {
  const response = await fetch(url);
  return await response.arrayBuffer();
}

export async function compressImage(file: File, quality: number = 75) {
  const arrayBuffer = await file.arrayBuffer();
  let imageData: ImageData;

  // 1. Decode dựa trên mime type
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    // Nạp wasm từ static trước khi dùng
    const wasmModule = await initWasm('/wasm/mozjpeg_dec.wasm');
    imageData = await decodeJpeg(arrayBuffer, { wasmModule });
  } else if (file.type === 'image/png') {
    const wasmModule = await initWasm('/wasm/squoosh_png_bg.wasm');
    imageData = await decodePng(arrayBuffer, { wasmModule });
  } else if (file.type === 'image/webp') {
    const wasmModule = await initWasm('/wasm/webp_dec.wasm');
    imageData = await decodeWebp(arrayBuffer, { wasmModule });
  } else {
    throw new Error('Định dạng không hỗ trợ');
  }

  // 2. Encode lại với chất lượng mong muốn
  let compressedBuffer: ArrayBuffer;
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    const wasmModule = await initWasm('/wasm/mozjpeg_enc.wasm');
    compressedBuffer = await encodeJpeg(imageData, { quality, wasmModule });
  } else if (file.type === 'image/png') {
    // PNG encode của jsquash cũng cần wasm nếu dùng bản mới
    const wasmModule = await initWasm('/wasm/squoosh_png_bg.wasm');
    compressedBuffer = await encodePng(imageData, { wasmModule });
  } else {
    const wasmModule = await initWasm('/wasm/webp_enc.wasm');
    compressedBuffer = await encodeWebp(imageData, { quality, wasmModule });
  }

  return new Blob([compressedBuffer], { type: file.type });
}
