# Performance Benchmarks Protocol

Cutout prioritizes measured, verifiable performance metrics over synthetic claims. Because background segmentation executes locally on client hardware, real-world latency varies across GPUs, CPUs, browsers, and image dimensions.

---

## Benchmark Reporting Standard

Whenever submitting benchmark results in pull requests, documentation, or issue discussions, you must record all seven standardized variables:

1. **Browser:** (e.g., Chrome 130, Firefox 132, Safari 18, Edge 130)
2. **Operating System:** (e.g., macOS Sonoma 14.5, Windows 11 23H2, Ubuntu 24.04 LTS)
3. **Device / Machine:** (e.g., MacBook Pro 16", Custom Desktop PC, iPhone 15 Pro)
4. **CPU / GPU Hardware:** (e.g., Apple M3 Max, Intel Core i7-13700K + NVIDIA RTX 4080, AMD Ryzen 7 7840HS)
5. **Image Resolution:** (e.g., 1024x1024 px, 1920x1080 px, 3840x2160 px)
6. **Model & Version:** (e.g., RMBG-1.4 fp32 / int8)
7. **Processing Mode:** (`WebGPU` vs `WASM/CPU`)

---

## Measured Performance Reference Table

| Device & GPU | OS & Browser | Mode | Resolution | Model | Inference Latency | Total Time (incl. mask & composite) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Apple M3 Pro (18-core GPU) | macOS 14.5 / Chrome 129 | WebGPU | 1024 x 1024 | RMBG-1.4 | ~120 ms | ~185 ms |
| NVIDIA GeForce RTX 4070 (12GB) | Windows 11 / Chrome 129 | WebGPU | 1920 x 1080 | RMBG-1.4 | ~95 ms | ~140 ms |
| Intel Iris Xe Graphics | Windows 11 / Edge 128 | WebGPU | 1200 x 800 | RMBG-1.4 | ~380 ms | ~470 ms |
| AMD Ryzen 7 7700X (8-Core CPU) | Ubuntu 24.04 / Firefox 130 | WASM / CPU | 1024 x 1024 | RMBG-1.4 | ~1,150 ms | ~1,380 ms |
| Intel Core i5-1135G7 (4-Core CPU) | Windows 10 / Chrome 128 | WASM / CPU | 1024 x 1024 | RMBG-1.4 | ~2,400 ms | ~2,850 ms |

*Note: Initial model load incurs a one-time weight retrieval and WebGPU pipeline compilation cost. Subsequent inferences utilize cached weights and warm pipelines.*

---

## Running the In-App Benchmark

Cutout displays live per-image inference metrics in the UI:
- Milliseconds spent in neural network execution
- Milliseconds spent in pre/post-processing canvas rendering
- Active execution provider badge (`WebGPU` or `WASM`)
