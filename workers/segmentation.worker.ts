// Segmentation Web Worker for client-side WebGPU/WASM neural background removal

const workerScope = self as any;

const PRIMARY_MODEL = 'briaai/RMBG-1.4';
const LITE_MODEL = 'Xenova/modnet';
const TRANSFORMERS_CDN_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.1.2';

let transformersLib: any = null;
let segmenterPipeline: any = null;
let activeModelName: string = PRIMARY_MODEL;
let currentDevice: 'webgpu' | 'wasm' = 'webgpu';
let isInitializing: boolean = false;

/**
 * Dynamically loads Transformers.js library inside Web Worker
 */
async function loadTransformers() {
  if (transformersLib) return transformersLib;

  try {
    const dynamicImport = new Function('url', 'return import(url)');
    transformersLib = await dynamicImport(TRANSFORMERS_CDN_URL);
    transformersLib.env.allowLocalModels = false;
    transformersLib.env.useBrowserCache = true;
    return transformersLib;
  } catch (err) {
    console.error('Failed to load Transformers.js runtime module:', err);
    throw err;
  }
}

/**
 * Initializes the AI segmentation pipeline with WebGPU and multi-threaded WASM fallback
 */
async function loadPipeline(preferredDevice: 'webgpu' | 'wasm' = 'webgpu', useLite: boolean = false) {
  if (segmenterPipeline && currentDevice === preferredDevice && (!useLite || activeModelName === LITE_MODEL)) {
    return segmenterPipeline;
  }

  isInitializing = true;
  currentDevice = preferredDevice;
  const targetModel = useLite ? LITE_MODEL : PRIMARY_MODEL;

  workerScope.postMessage({
    type: 'status',
    status: 'loading-model',
    text: `Loading ${targetModel.split('/')[1]} (${currentDevice.toUpperCase()})...`,
  });

  const tf = await loadTransformers();

  const progressCallback = (progressData: any) => {
    workerScope.postMessage({
      type: 'progress',
      data: progressData,
    });
  };

  try {
    // Prefer FP16 on WebGPU for 2x faster inference and 50% download size; Q8 on WASM for fast INT8 execution
    const dtype = currentDevice === 'webgpu' ? 'fp16' : 'q8';
    segmenterPipeline = await tf.pipeline('image-segmentation', targetModel, {
      device: currentDevice,
      dtype,
      progress_callback: progressCallback,
    });
    activeModelName = targetModel;
  } catch (error) {
    console.warn(`Failed to initialize ${targetModel} with ${currentDevice}:`, error);

    // Fallback 1: If WebGPU failed, fallback to WASM
    if (currentDevice === 'webgpu') {
      currentDevice = 'wasm';
      workerScope.postMessage({
        type: 'status',
        status: 'loading-model',
        text: 'WebGPU unavailable. Falling back to multi-threaded WASM...',
      });

      try {
        segmenterPipeline = await tf.pipeline('image-segmentation', targetModel, {
          device: 'wasm',
          dtype: 'q8',
          progress_callback: progressCallback,
        });
        activeModelName = targetModel;
      } catch (wasmError) {
        // Fallback 2: If primary model failed, try ultra-compact lite model (25MB)
        if (targetModel !== LITE_MODEL) {
          console.warn('Falling back to ultra-compact lite model:', wasmError);
          activeModelName = LITE_MODEL;
          segmenterPipeline = await tf.pipeline('image-segmentation', LITE_MODEL, {
            device: 'wasm',
            progress_callback: progressCallback,
          });
        } else {
          throw wasmError;
        }
      }
    } else if (targetModel !== LITE_MODEL) {
      // Try lite model directly on failure
      activeModelName = LITE_MODEL;
      segmenterPipeline = await tf.pipeline('image-segmentation', LITE_MODEL, {
        device: 'wasm',
        progress_callback: progressCallback,
      });
    } else {
      throw error;
    }
  }

  isInitializing = false;
  workerScope.postMessage({
    type: 'ready',
    device: currentDevice,
    model: activeModelName,
  });

  return segmenterPipeline;
}

/**
 * Preprocesses, runs neural inference, and extracts alpha mask
 */
async function segmentImage(
  imageDataUriOrBlob: string | Blob,
  targetWidth: number,
  targetHeight: number,
  qualityMode: 'fast' | 'balanced' | 'quality' = 'balanced'
) {
  const tf = await loadTransformers();

  // For fast mode, use lite model if needed for instant responsiveness
  const pipe = await loadPipeline(currentDevice, qualityMode === 'fast');

  const startTime = performance.now();

  workerScope.postMessage({
    type: 'status',
    status: 'processing',
    text: `Running ${qualityMode.toUpperCase()} AI segmentation (${currentDevice.toUpperCase()})...`,
  });

  // 1. Load image into RawImage format
  let rawImage: any;
  if (typeof imageDataUriOrBlob === 'string') {
    rawImage = await tf.RawImage.fromURL(imageDataUriOrBlob);
  } else {
    const arrayBuffer = await imageDataUriOrBlob.arrayBuffer();
    const blob = new Blob([arrayBuffer]);
    const blobUrl = URL.createObjectURL(blob);
    rawImage = await tf.RawImage.fromURL(blobUrl);
    URL.revokeObjectURL(blobUrl);
  }

  const origWidth = targetWidth || rawImage.width;
  const origHeight = targetHeight || rawImage.height;

  // 2. Scale for performance if needed
  let inputImage = rawImage;
  if (qualityMode === 'fast') {
    const scale = Math.min(1.0, 512 / Math.max(rawImage.width, rawImage.height));
    if (scale < 1.0) {
      inputImage = await rawImage.resize(
        Math.round(rawImage.width * scale),
        Math.round(rawImage.height * scale)
      );
    }
  } else if (qualityMode === 'balanced') {
    const scale = Math.min(1.0, 1024 / Math.max(rawImage.width, rawImage.height));
    if (scale < 1.0) {
      inputImage = await rawImage.resize(
        Math.round(rawImage.width * scale),
        Math.round(rawImage.height * scale)
      );
    }
  }

  // 3. Run neural pipeline segmentation
  const output = await pipe(inputImage);

  // 4. Extract mask RawImage from output
  let maskRawImage: any = null;
  if (Array.isArray(output) && output.length > 0) {
    maskRawImage = output[0].mask || output[0];
  } else if (output && output.mask) {
    maskRawImage = output.mask;
  } else {
    maskRawImage = output;
  }

  // Resize mask back to exact original target image dimensions
  const resizedMask = await maskRawImage.resize(origWidth, origHeight);

  // 5. Build alpha mask buffer (single-channel 0..255)
  const totalPixels = origWidth * origHeight;
  const maskBuffer = new Uint8ClampedArray(totalPixels);
  const maskData = resizedMask.data;
  const channels = resizedMask.channels || Math.round(maskData.length / totalPixels) || 1;

  if (channels === 1) {
    maskBuffer.set(maskData.subarray(0, totalPixels));
  } else if (channels === 4) {
    // If RGBA, use the alpha channel (or green/luminance if grayscale RGB)
    for (let i = 0; i < totalPixels; i++) {
      maskBuffer[i] = maskData[i * 4 + 3];
    }
  } else {
    // 3 channels: take luminance
    for (let i = 0; i < totalPixels; i++) {
      const idx = i * channels;
      maskBuffer[i] = Math.round(0.299 * maskData[idx] + 0.587 * maskData[idx + 1] + 0.114 * maskData[idx + 2]);
    }
  }

  // 6. Quality mode edge refinement
  if (qualityMode === 'quality') {
    for (let i = 0; i < maskBuffer.length; i++) {
      const v = maskBuffer[i];
      if (v > 240) maskBuffer[i] = 255;
      else if (v < 15) maskBuffer[i] = 0;
    }
  }

  const inferenceTimeMs = Math.round(performance.now() - startTime);

  return {
    maskBuffer,
    width: origWidth,
    height: origHeight,
    inferenceTimeMs,
    deviceUsed: currentDevice,
    qualityMode,
  };
}

// Handle messages from main application thread
workerScope.addEventListener('message', async (event: MessageEvent) => {
  const { type, payload, id } = event.data;

  try {
    if (type === 'INIT') {
      await loadPipeline(payload?.device || 'webgpu');
    } else if (type === 'SEGMENT') {
      const result = await segmentImage(
        payload.image,
        payload.width,
        payload.height,
        payload.qualityMode || 'balanced'
      );

      workerScope.postMessage(
        {
          type: 'RESULT',
          id,
          result: {
            width: result.width,
            height: result.height,
            inferenceTimeMs: result.inferenceTimeMs,
            deviceUsed: result.deviceUsed,
            qualityMode: result.qualityMode,
            maskBuffer: result.maskBuffer,
          },
        },
        [result.maskBuffer.buffer]
      );
    }
  } catch (error: any) {
    console.error('Segmentation worker error:', error);
    workerScope.postMessage({
      type: 'ERROR',
      id,
      error: error?.message || 'Segmentation failed in worker.',
    });
  }
});
