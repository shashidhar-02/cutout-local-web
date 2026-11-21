# Model Weights & Offline Storage

This directory documents model asset management in Cutout.

## Default Remote Model
By default, Cutout downloads the RMBG-1.4 model weights directly into the browser's persistent cache via Transformers.js:
- Source: `briaai/RMBG-1.4`
- Format: ONNX runtime format
- Storage: Browser Cache API / IndexedDB

## Local Hosting Option
For air-gapped, isolated, or self-hosted intranet deployments, ONNX model files can be placed in this directory and served directly as static assets from `/models/`.
