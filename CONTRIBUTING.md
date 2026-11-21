# Contributing to Cutout

Thank you for your interest in contributing to Cutout! We are building a privacy-first, client-side background removal tool that empowers users to edit photos locally without sacrificing privacy.

---

## Code of Conduct

Please be respectful, constructive, and collaborative in discussions, pull requests, and issue reports.

---

## Local Development Setup

Ensure you have Node.js 18+ installed.

```bash
# Clone the repository
git clone https://github.com/shashidhar-02/cutout-local-web.git
cd cutout-local-web

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Development Commands

Before opening a pull request, run all verification checks:

```bash
# Run unit & privacy tests
npm run test

# Run ESLint
npm run lint

# Check TypeScript types
npm run typecheck

# Validate production build
npm run build
```

---

## Privacy Testing Rule

Every pull request must maintain the core privacy promise: **zero transmission of user image bytes**.
If you introduce any network requests or dependencies:
- Run `npm run test:privacy` to verify that no user image payload exits the client.
- Model downloads and static asset requests are permitted; user image uploads are strictly forbidden.

---

## Requirements for Model-Related Changes

If you are proposing an alternative model, an updated weight checkpoint, or a new segmentation pipeline, your pull request **must** provide the following information:

1. **Model License:** Full verification that the model weights are commercially/openly licensed for client redistribution.
2. **Model Source:** Upstream repository, paper citation, or Hugging Face repository link.
3. **Benchmarks:** Measured inference latency on both WebGPU and WASM execution modes (see `docs/BENCHMARKS.md`).
4. **Size Impact:** Model file size in megabytes (uncompressed and compressed).
5. **Browser Compatibility Impact:** Minimum browser version required, memory footprint during execution, and fallback behavior.

---

## Submitting Pull Requests

1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. Commit changes with clear, concise messages.
3. Verify tests and build pass (`npm run test && npm run typecheck && npm run build`).
4. Push to your branch and submit a Pull Request following the PR template.
