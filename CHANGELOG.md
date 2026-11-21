# Changelog

All notable changes to the Cutout project are documented in this file.

## [1.0.0] - 2026-11-21

### Added
- **Browser-Local AI Engine**: Real-time neural background removal via RMBG-1.4 with zero server uploads.
- **Hardware Acceleration**: Automatic WebGPU compute shader dispatch with multi-threaded WASM CPU fallback.
- **Quality Controls**: Fast (512px downscaled), Balanced (1024px), and High Quality (edge refinement) inference modes.
- **Smart Presets**: One-click framing for E-commerce products, LinkedIn avatars, Passport photos, Marketplace listings, and Presentation slides.
- **Interactive Split Slider**: Draggable Before/After comparison view with touch and keyboard navigation.
- **Multi-Format Export**: PNG (transparent), WebP (adjustable quality), and JPG (solid background).
- **Batch Processing**: Sequential local processing queue with one-click ZIP archive export.
- **Lazy Runtime Loading**: Lightweight initial page shell; model runtime loads only upon user interaction.
- **Automated Privacy Audit**: Continuous network test suite verifying zero image data exits the browser.
- **PWA Offline Support**: Pre-caching service worker for complete offline background removal once cached.
- **Search-Intent Pages**: Dedicated static pages for Product removal, Profile photo framing, and Transparent PNGs.
- **Internationalization (i18n)**: Interface localization for English, Hindi, and Telugu.
