# Privacy Architecture & Guarantee

## Primary Principle

> **Remove backgrounds. Keep your photos private.**  
> Cutout never uploads your images, thumbnails, or segmented outputs to any server.

---

## Architectural Separation: Delivery vs Inference

Traditional background-removal services require users to transmit image binaries to cloud server farms for remote GPU processing. This exposes private family photos, confidential commercial product prototypes, IDs, and personal media to third-party servers, databases, and logs.

Cutout employs a **zero-transmission, local-first architecture**:

```
+-------------------------------------------------------------+
| Vercel / Web Host (Static Delivery Only)                    |
| - Serves HTML, CSS, JavaScript                              |
| - Delivers WebAssembly runtime and model weight files       |
+-------------------------------------------------------------+
                            |
                     (One-time assets)
                            v
+-------------------------------------------------------------+
| Client Web Browser (Your Device)                           |
|                                                             |
|  [User Image Input] (Local File System / Paste)             |
|           |                                                 |
|           v                                                 |
|  [Canvas & Offscreen Preprocessing]                         |
|           |                                                 |
|           v                                                 |
|  [Local Web Worker Inference (WebGPU / WASM)]               |
|           |                                                 |
|           v                                                 |
|  [Segmentation Mask Generation]                             |
|           |                                                 |
|           v                                                 |
|  [Alpha Compositing & Auto-Crop]                            |
|           |                                                 |
|           v                                                 |
|  [Direct File Download (PNG / JPG / WebP)]                  |
+-------------------------------------------------------------+
```

---

## What Leaves Your Browser?

| Data Category | Transmitted Over Network? | Destination |
| :--- | :--- | :--- |
| **User Images (Uploads)** | ❌ **NEVER** | Stays strictly in client device memory |
| **Image Previews / Thumbnails** | ❌ **NEVER** | Rendered only via local Object URLs |
| **Alpha Masks & Cutouts** | ❌ **NEVER** | Generated in local Web Worker |
| **User Metadata & Exif** | ❌ **NEVER** | Never captured or logged |
| **Model Weights & Runtime** | 📥 Downloaded once | Cached locally in browser Cache API |
| **Static HTML/CSS/JS** | 📥 Downloaded from CDN | Standard website files |

---

## Automated Privacy Testing

Our continuous integration test suite includes automated network auditing (`tests/privacy.test.ts`). The test harness wraps global network fetch interfaces, executes segmentation workloads, and asserts:
1. Zero HTTP `POST`, `PUT`, or `PATCH` payloads exit the client.
2. No base64 encoded strings or binary image buffers are contained in URL query parameters or request headers.
3. Only static scripts, styles, and model weight blobs from authorized CDNs are permitted.

---

## Offline Capability

Once model weights and application scripts are retrieved and cached in your browser's persistent storage, Cutout functions completely offline. You can disconnect Wi-Fi or enable Airplane Mode and continue processing single photos or batches without an active internet connection.
