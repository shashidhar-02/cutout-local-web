// Segmentation Web Worker for client-side WebGPU/WASM neural background removal

const workerScope = self as any;

// RMBG-1.4 model identifier
const DEFAULT_MODEL = 'briaai/RMBG-1.4';
const TRANSFORMERS_CDN_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.1.2';

let transformersLib: any = null;
let model: any = null;
let processor: any = null;
let currentDevice: 'webgpu' | 'wasm' = 'webgpu';

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
 * Initializes the AI segmentation model and processor
 */
async function loadModel(preferredDevice: 'webgpu' | 'wasm' = 'webgpu') {
  currentDevice = preferredDevice;
  workerScope.postMessage({
    type: 'status',
    status: 'loading-model',
    text: `Initializing segmentation model (${currentDevice.toUpperCase()})...`,
  });

  const tf = await loadTransformers();

  const progressCallback = (progressData: any) => {
    workerScope.postMessage({
      type: 'progress',
      data: progressData,
    });
  };

  try {
    model = await tf.AutoModel.from_pretrained(DEFAULT_MODEL, {
      device: currentDevice,
      progress_callback: progressCallback,
    });
    processor = await tf.AutoProcessor.from_pretrained(DEFAULT_MODEL);
  } catch (error) {
    if (currentDevice === 'webgpu') {
      console.warn('WebGPU model initialization failed. Falling back to WASM/CPU.', error);
      currentDevice = 'wasm';
      workerScope.postMessage({
        type: 'status',
        status: 'loading-model',
        text: 'WebGPU unavailable. Falling back to multi-threaded WASM...',
      });

      model = await tf.AutoModel.from_pretrained(DEFAULT_MODEL, {
        device: 'wasm',
        progress_callback: progressCallback,
      });
      processor = await tf.AutoProcessor.from_pretrained(DEFAULT_MODEL);
    } else {
      throw error;
    }
  }

  workerScope.postMessage({
    type: 'ready',
    device: currentDevice,
  });
}

/**
 * Preprocesses, runs inference, and extracts the alpha mask
 */
async function segmentImage(
  imageDataUriOrBlob: string | Blob,
  targetWidth: number,
  targetHeight: number,
  qualityMode: 'fast' | 'balanced' | 'quality' = 'balanced'
) {
  const tf = await loadTransformers();

  if (!model || !processor) {
    await loadModel(currentDevice);
  }

  const startTime = performance.now();

  workerScope.postMessage({
    type: 'status',
    status: 'processing',
    text: `Running ${qualityMode.toUpperCase()} AI segmentation...`,
  });

  // 1. Read input image into RawImage format
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

  // 2. Preprocess with resolution according to qualityMode
  let processTarget = rawImage;
  if (qualityMode === 'fast') {
    // Downscale for rapid inference on lower-spec hardware
    const scale = Math.min(1.0, 512 / Math.max(rawImage.width, rawImage.height));
    if (scale < 1.0) {
      processTarget = await rawImage.resize(
        Math.round(rawImage.width * scale),
        Math.round(rawImage.height * scale)
      );
    }
  }

  const imageInputs = await processor(processTarget);

  // 3. Run neural model inference
  const { output } = await model(imageInputs);

  // 4. Output post-processing: extract mask tensor and restore to original image dimensions
  const maskTensor = output[0][0]; // 1 x 1 x H x W -> H x W
  const maskRaw = await tf.RawImage.fromTensor(maskTensor.mul(255).to('uint8')).resize(
    origWidth,
    origHeight
  );

  const inferenceTimeMs = Math.round(performance.now() - startTime);

  const maskBuffer = new Uint8ClampedArray(maskRaw.data.buffer);

  // For 'quality' mode, apply gentle edge refinement on transition boundaries
  if (qualityMode === 'quality') {
    for (let i = 0; i < maskBuffer.length; i++) {
      const v = maskBuffer[i];
      // Sharpen definite foreground and background, smoothly interpolate transitions
      if (v > 240) maskBuffer[i] = 255;
      else if (v < 15) maskBuffer[i] = 0;
    }
  }

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
      await loadModel(payload?.device || 'webgpu');
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
