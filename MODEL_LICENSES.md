# Model Transparency & Licensing

Cutout operates by executing open-weights neural networks directly inside the client's browser using WebGPU and WebAssembly. No image data is ever transmitted to a remote inference server.

This document details the machine learning models utilized, their origin, licensing parameters, runtimes, pre/post-processing pipelines, and known limitations.

---

## 1. RMBG-1.4 (Default Model)

- **Model Name:** RMBG-1.4 (Bria AI Background Removal v1.4)
- **Model Version:** 1.4
- **Model Source:** [briaai/RMBG-1.4 on Hugging Face](https://huggingface.co/briaai/RMBG-1.4)
- **ONNX Web Runtime Port:** [Transformers.js / Xenova](https://huggingface.co/briaai/RMBG-1.4)
- **Primary Runtime:** ONNX Runtime Web via Transformers.js (`@huggingface/transformers`)
- **Execution Providers:**
  - `WebGPU` (Hardware accelerated when supported by browser & GPU)
  - `WASM` (Multi-threaded WebAssembly CPU fallback)

### Licensing
- **Model License:** Bria AI Commercial & Non-Commercial License Agreement.
- **Reference:** Please review the official Bria license terms on the Hugging Face repository card (`https://huggingface.co/briaai/RMBG-1.4`).
- **Application Code vs Model Weights:** Cutout application code is licensed under the MIT License. Model weights are served or cached separately and retain their respective author licenses.

### Preprocessing Pipeline
1. **Input Normalization:** Color channels converted to normalized Float32 RGB values in range `[0.0, 1.0]`.
2. **Dimension Rescaling:** Target tensor shape resized to `1024 x 1024` pixels with bilinear interpolation while preserving aspect ratio.
3. **Statistical Standardization:** Scaled using ImageNet mean `[0.485, 0.456, 0.406]` and standard deviation `[0.229, 0.224, 0.225]`.

### Postprocessing Pipeline
1. **Mask Extraction:** Neural activation output mapped through Sigmoid non-linear function to produce per-pixel confidence `[0.0, 1.0]`.
2. **Rescaling:** Alpha mask interpolated back to the original image dimensions.
3. **Buffer Quantization:** Multiplied by 255 into an 8-bit unsigned clamped alpha buffer (`Uint8ClampedArray`).
4. **Canvas Composition:** Foreground RGB values are composited with the computed alpha channel on an HTML5 canvas.

### Expected Limitations & Transparency
No computer vision segmentation model produces flawless results on every input. Users should anticipate the following realistic limitations:
- **Fine Hair & Fur:** Wispy flyaway hair or fur on complex, high-contrast backgrounds may show minor feathering or haloing.
- **Translucent & Glass Objects:** Semi-transparent glassware, eyeglasses, and liquids may retain partial background reflections.
- **Low Contrast Subjects:** Subjects sharing identical lighting and color tones with background surfaces (e.g., a white shoe on a white studio seamless floor) may require manual edge thresholding.
- **Memory Footprint:** Client-side WebGPU/WASM allocation consumes approximately 150MB–250MB of browser memory during active inference.
