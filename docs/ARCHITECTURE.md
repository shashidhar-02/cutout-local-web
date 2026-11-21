# Technical Architecture

Cutout is an offline-first, client-side web application architected for privacy, responsiveness, and hardware efficiency.

---

## 1. Concurrency & Web Worker Isolation

Image segmentation is a computationally intensive matrix operation. To prevent stuttering or blocking the browser's UI thread:

```
[ Main Thread ]
       |
       | 1. Drops Image / Selects File
       | 2. Spawns Web Worker
       | 3. Posts 'SEGMENT' message with transferable image data
       v
[ Web Worker Thread ]
       |
       | 4. AutoProcessor transforms image into tensor
       | 5. Neural Model executes via WebGPU or WASM
       | 6. Raw alpha mask quantized to Uint8ClampedArray
       | 7. Transfers buffer back via postMessage (Zero-Copy)
       v
[ Main Thread ]
       |
       | 8. Canvas compositing (Feathering, Auto-Crop, Resizing, Backgrounds)
       | 9. Download trigger (PNG/JPG/WebP)
```

---

## 2. Hardware Acceleration Pipeline

When initializing, Cutout performs a non-destructive capability detection:

1. **WebGPU Probe:** Calls `navigator.gpu.requestAdapter()`. If an adapter is returned, WebGPU execution provider is selected.
2. **WASM Fallback:** If WebGPU is unsupported (or throws a shader compilation error), the engine smoothly re-initializes on multi-threaded WebAssembly (WASM).
3. **Graceful Warning:** If WebAssembly is also absent, an informational banner guides the user rather than failing silently.

---

## 3. Memory & Resource Management

- **Model Caching:** Model weights are stored in the browser's Cache API / IndexedDB, eliminating redundant downloads on repeat visits.
- **Buffer Transfer:** Pixel buffers are transferred using transferable objects (`[result.maskBuffer.buffer]`) instead of cloned, minimizing heap allocations.
- **Canvas Cleanup:** Temporary Object URLs created for rendering are revoked via `URL.revokeObjectURL()` to prevent memory leaks during large batch operations.
