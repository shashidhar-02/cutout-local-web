# Cutout-https://cutout-local-web-seven.vercel.app/batch-background-remover

**Remove backgrounds. Keep your photos private.**

Cutout is a free, open-source background-removal tool that runs directly in your browser.

Your image stays on your device.

No account.  
No upload.  
No subscription.  
No watermark.  

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![WebGPU](https://img.shields.io/badge/WebGPU-local%20inference-blue)](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)
[![Privacy](https://img.shields.io/badge/Images-stay%20local-success)](PRIVACY.md)

---

## Core Idea

Most background-removal websites require some combination of:

- image uploads
- account creation
- credits
- subscriptions
- watermarks
- resolution limitations

Cutout takes a different approach:

```
Image
  ↓
Browser
  ↓
Local AI inference
  ↓
Segmentation mask
  ↓
Transparent image
```

The image is not uploaded for inference.

---

## Core Features

- **Automatic background removal:** High-precision segmentation powered by RMBG-1.4.
- **Transparent PNG export:** Download lossless transparency ready for design workflows.
- **JPG export:** Output solid-color backdrops formatted for web and marketplace listings.
- **WebP export:** Efficient modern web image format with custom compression quality.
- **Solid background replacement:** Quick color palette presets plus full RGB color picker.
- **Custom background image:** Composite cutouts over any uploaded scenery or background photo with optional blur.
- **Before/after comparison:** Interactive draggable split-screen slider.
- **Batch processing:** Multi-image queue with sequential execution and one-click ZIP download.
- **Auto crop:** Automatically trims surrounding transparent margins with configurable padding.
- **Output resizing:** Custom width/height adjustment, percentage presets, and aspect ratio locking.
- **Touch-friendly mobile interface:** Responsive layout optimized for smartphones and tablets.
- **WebGPU inference:** Hardware-accelerated neural network execution via client GPU.
- **WASM fallback:** Automatic fallback to multi-threaded CPU WebAssembly when WebGPU is unavailable.
- **Local model caching:** Model weights persist in browser cache to avoid repeated downloads.
- **Offline processing:** Operates without an active internet connection once assets are cached.

---

## Supported Use Cases

- **Product photography:** Clean white cutouts for Amazon, Shopify, and Etsy stores.
- **Profile pictures:** Background isolation for avatars, resumes, and social profiles.
- **Social media:** Transparent overlays and promotional banners.
- **Presentations:** Clean subject extraction for pitch decks and slides.
- **E-commerce assets:** Consistent catalog backgrounds across hundreds of SKUs.
- **Marketplace listings:** Fast image cleanups for eBay, Facebook Marketplace, and Mercari.
- **Transparent PNG creation:** Graphics and assets for digital designers and illustrators.
- **Sticker creation:** Cutout outlines for messaging apps and print stickers.
- **Personal photos:** Editing family and travel moments with complete privacy.

---

## Privacy Architecture

Cutout separates website delivery from image processing.

**Vercel / Web Host:**
- serves HTML
- serves CSS
- serves JavaScript
- serves model/runtime assets when required

**Browser:**
- reads the image
- preprocesses the image
- runs the model
- creates the mask
- creates the transparent output
- downloads the result

The user's image is not sent to a Cutout inference server. Read more in [PRIVACY.md](PRIVACY.md).

---

## Model Transparency

The repository documents:

- model name
- model version
- model source
- model license
- runtime
- preprocessing
- postprocessing
- expected limitations

See [MODEL_LICENSES.md](MODEL_LICENSES.md) for full technical documentation.  
*Never claim that model performance is perfect.*

---

## Performance

Benchmarks must be measured, not invented.

When publishing benchmark results record:

- browser
- operating system
- device
- CPU/GPU
- image resolution
- model
- processing mode

See [docs/BENCHMARKS.md](docs/BENCHMARKS.md) for reporting standards and reference measurements.

---

## Browser Modes

- **Preferred:** WebGPU
- **Fallback:** WASM/CPU

The application detects unsupported browsers and displays informative guidance rather than failing silently.

---

## Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## Production Build

```bash
npm run build
npm run start
```

---

## Testing

```bash
# Run unit & privacy test suite
npm run test

# Run ESLint
npm run lint

# Check TypeScript types
npm run typecheck
```

### Privacy Testing

The automated test suite verifies that user image bytes are not transmitted over the network:

```bash
npm run test:privacy
```

Model downloads and static application assets are allowed. User image uploads are not.

---

## Repository Structure

```
app/          # Next.js App Router pages, layout, and global CSS
components/   # Shared UI components (Dropzone, Header, Footer, Badges)
features/     # Feature-specific modules (editor, batch processing, device status)
workers/      # Web Worker for isolated WebGPU/WASM AI inference
models/       # Model configuration and local weights documentation
lib/          # Core utilities (image processing, hardware detection, privacy auditor)
public/       # Static assets, icons, and social share graphics
tests/        # Automated test suite (unit and network privacy tests)
docs/         # Architecture guides, benchmark protocols, and documentation
```

---

## Roadmap

- [ ] Better hair/edge quality
- [ ] More model choices
- [ ] Smart edge refinement
- [ ] Brush erase/restore
- [ ] More batch controls
- [ ] Better mobile performance
- [ ] Background blur
- [ ] Background color presets
- [ ] More WebGPU optimization
- [ ] Offline model management

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

For model-related changes include:

- model license
- model source
- benchmark
- size impact
- browser compatibility impact

---

## Security

See [SECURITY.md](SECURITY.md).

Do not submit sensitive images in public issues. For security vulnerabilities, follow the private disclosure instructions in SECURITY.md.

---

## License

Cutout application source code is released under the [MIT License](LICENSE).  
Model weights are governed by their respective author licenses documented in [MODEL_LICENSES.md](MODEL_LICENSES.md).
