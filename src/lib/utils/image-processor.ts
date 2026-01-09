import decodeJpeg from '@jsquash/jpeg/decode';
import encodeJpeg from '@jsquash/jpeg/encode';
import decodePng from '@jsquash/png/decode';
import encodePng from '@jsquash/png/encode';
import decodeWebp from '@jsquash/webp/decode';
import encodeWebp from '@jsquash/webp/encode';
import resize from '@jsquash/resize';

export async function compressImage(file: File, quality: number = 75) {
  const arrayBuffer = await file.arrayBuffer();
  let imageData: ImageData;

  // 1. Decode dựa trên mime type
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    imageData = await decodeJpeg(arrayBuffer);
  } else if (file.type === 'image/png') {
    imageData = await decodePng(arrayBuffer);
  } else if (file.type === 'image/webp') {
    imageData = await decodeWebp(arrayBuffer);
  } else {
    throw new Error('Định dạng không hỗ trợ');
  }

  // 2. Encode lại với chất lượng mong muốn
  let compressedBuffer: ArrayBuffer;
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    compressedBuffer = await encodeJpeg(imageData, { quality });
  } else if (file.type === 'image/png') {
    // PNG thường nén bằng cách giảm bảng màu (quantization) 
    // jsquash/png mặc định đã tối ưu rất tốt
    compressedBuffer = await encodePng(imageData);
  } else {
    compressedBuffer = await encodeWebp(imageData, { quality });
  }

  return new Blob([compressedBuffer], { type: file.type });
}
