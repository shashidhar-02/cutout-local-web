import { BackgroundSettings, CropSettings, ResizeSettings } from './types';

/**
 * Creates an OffscreenCanvas or regular HTMLCanvasElement depending on runtime environment
 */
export function createCompatibleCanvas(width: number, height: number): HTMLCanvasElement {
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(width));
    canvas.height = Math.max(1, Math.round(height));
    return canvas;
  }
  throw new Error('Canvas requires browser DOM environment');
}

/**
 * Calculates the bounding box of non-transparent pixels in an alpha mask
 */
export function calculateBoundingBox(
  maskBuffer: Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number = 10,
  padding: number = 0
): { x: number; y: number; width: number; height: number } {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let hasPixels = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const alpha = maskBuffer[idx];
      if (alpha > threshold) {
        hasPixels = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!hasPixels) {
    return { x: 0, y: 0, width, height };
  }

  // Apply optional padding and clamp to boundaries
  const paddedMinX = Math.max(0, minX - padding);
  const paddedMinY = Math.max(0, minY - padding);
  const paddedMaxX = Math.min(width - 1, maxX + padding);
  const paddedMaxY = Math.min(height - 1, maxY + padding);

  return {
    x: paddedMinX,
    y: paddedMinY,
    width: Math.max(1, paddedMaxX - paddedMinX + 1),
    height: Math.max(1, paddedMaxY - paddedMinY + 1),
  };
}

/**
 * Merges source image pixels with an alpha mask into a transparent Canvas
 */
export function applyAlphaMask(
  sourceImage: CanvasImageSource,
  maskBuffer: Uint8ClampedArray,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = createCompatibleCanvas(width, height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Failed to acquire 2D canvas context');

  // Draw source image
  ctx.drawImage(sourceImage, 0, 0, width, height);

  // Extract pixel buffer
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Apply mask to alpha channel (data is RGBA, maskBuffer is single-channel alpha 0..255)
  for (let i = 0; i < maskBuffer.length; i++) {
    const alpha = maskBuffer[i];
    const dataIndex = i * 4 + 3;
    data[dataIndex] = alpha;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Renders the final composited image applying background, crop, and resize settings
 */
export async function renderFinalComposition(
  transparentForegroundCanvas: HTMLCanvasElement,
  background: BackgroundSettings,
  crop: CropSettings,
  resize: ResizeSettings
): Promise<HTMLCanvasElement> {
  const origWidth = transparentForegroundCanvas.width;
  const origHeight = transparentForegroundCanvas.height;

  // Step 1: Handle Auto-Crop bounding box if enabled
  let sourceX = 0;
  let sourceY = 0;
  let sourceW = origWidth;
  let sourceH = origHeight;

  if (crop.autoCrop) {
    const ctx = transparentForegroundCanvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      const imgData = ctx.getImageData(0, 0, origWidth, origHeight);
      const alphaBuffer = new Uint8ClampedArray(origWidth * origHeight);
      for (let i = 0; i < alphaBuffer.length; i++) {
        alphaBuffer[i] = imgData.data[i * 4 + 3];
      }
      const bbox = calculateBoundingBox(alphaBuffer, origWidth, origHeight, 10, crop.padding);
      sourceX = bbox.x;
      sourceY = bbox.y;
      sourceW = bbox.width;
      sourceH = bbox.height;
    }
  }

  // Step 2: Determine output dimensions
  let targetW = sourceW;
  let targetH = sourceH;

  if (resize.enabled) {
    if (resize.scalePercent && resize.scalePercent !== 100) {
      const scale = resize.scalePercent / 100;
      targetW = Math.max(1, Math.round(sourceW * scale));
      targetH = Math.max(1, Math.round(sourceH * scale));
    } else if (resize.width > 0 && resize.height > 0) {
      targetW = Math.max(1, Math.round(resize.width));
      targetH = Math.max(1, Math.round(resize.height));
    }
  }

  // Step 3: Create target output canvas
  const outputCanvas = createCompatibleCanvas(targetW, targetH);
  const outCtx = outputCanvas.getContext('2d');
  if (!outCtx) throw new Error('Failed to acquire canvas context');

  // High quality interpolation
  outCtx.imageSmoothingEnabled = true;
  outCtx.imageSmoothingQuality = 'high';

  // Step 4: Render Background Layer
  if (background.type === 'color' && background.color) {
    outCtx.fillStyle = background.color;
    outCtx.fillRect(0, 0, targetW, targetH);
  } else if (background.type === 'image' && background.customImageUrl) {
    await new Promise<void>((resolve) => {
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.onload = () => {
        if (background.blur > 0) {
          outCtx.filter = `blur(${background.blur}px)`;
        }
        // Fill canvas with cover mode
        const scale = Math.max(targetW / bgImg.naturalWidth, targetH / bgImg.naturalHeight);
        const x = (targetW / 2) - (bgImg.naturalWidth / 2) * scale;
        const y = (targetH / 2) - (bgImg.naturalHeight / 2) * scale;
        outCtx.drawImage(bgImg, x, y, bgImg.naturalWidth * scale, bgImg.naturalHeight * scale);
        outCtx.filter = 'none';
        resolve();
      };
      bgImg.onerror = () => {
        // Fallback transparent if background fails
        resolve();
      };
      bgImg.src = background.customImageUrl!;
    });
  }

  // Step 5: Render Transparent Foreground Subject
  outCtx.drawImage(
    transparentForegroundCanvas,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    0,
    0,
    targetW,
    targetH
  );

  return outputCanvas;
}

/**
 * Converts a Canvas to a Blob with exact MIME type and quality
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' | 'webp',
  quality: number = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      },
      mimeType,
      quality
    );
  });
}

/**
 * Triggers a direct browser file download without any server round-trips
 */
export async function downloadCanvasFile(
  canvas: HTMLCanvasElement,
  baseFileName: string,
  format: 'png' | 'jpeg' | 'webp',
  quality: number = 0.95
): Promise<void> {
  const blob = await canvasToBlob(canvas, format, quality);
  const cleanName = baseFileName.replace(/\.[^/.]+$/, '');
  const extension = format === 'jpeg' ? 'jpg' : format;
  const fileName = `${cleanName}-cutout.${extension}`;

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
}
