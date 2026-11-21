import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Code2,
  ArrowRight,
  Database,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How Cutout Works | Local WebGPU & WASM AI Architecture',
  description:
    'Deep dive into Cutouts zero-server architecture: Web Worker execution, WebGPU shaders, multi-threaded WebAssembly, and local alpha mask compositing.',
};

export default function HowItWorksPage() {
  const pipelineSteps = [
    {
      num: '01',
      title: 'Local File Intake & ImageBitmap Decoding',
      desc: 'When an image is dropped, selected, or pasted via Ctrl+V, the browser decodes it locally via the Canvas / ImageBitmap API into an uncompressed RGBA pixel buffer. No remote request is dispatched.',
      badge: 'Zero Network',
    },
    {
      num: '02',
      title: 'Non-Blocking Web Worker Dispatch',
      desc: 'To prevent UI freezing, the raw image buffer is transferred to a dedicated Web Worker thread. Transferable ArrayBuffers are used for zero-copy memory dispatch.',
      badge: 'Worker Thread',
    },
    {
      num: '03',
      title: 'Hardware Execution: WebGPU vs WASM',
      desc: 'The worker detects if navigator.gpu is active. If supported, matrix multiplications are computed via WebGPU compute shaders on your GPU. If unavailable, execution automatically falls back to multi-threaded WebAssembly (WASM).',
      badge: 'WebGPU / WASM',
    },
    {
      num: '04',
      title: 'Neural Segmentation via RMBG-1.4',
      desc: 'The neural network processes the standardized tensor and generates a high-confidence single-channel foreground probability mask.',
      badge: 'Bria RMBG-1.4',
    },
    {
      num: '05',
      title: 'Resolution Restoration & Edge Quantization',
      desc: 'The output tensor is resized to match your original photo dimensions and converted into an 8-bit unsigned clamped alpha channel (Uint8ClampedArray).',
      badge: 'Full Resolution',
    },
    {
      num: '06',
      title: 'Canvas Compositing & Direct Blob Export',
      desc: 'The original RGB pixels and new alpha mask are blended on an HTML5 canvas. The final image (PNG, WebP, or JPG) is converted directly to a local Blob URL for one-click downloading.',
      badge: 'Instant Download',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header hardware={null} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Code2 className="w-3.5 h-3.5" /> Open-Source Architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            How Cutout Operates
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            A transparent technical walkthrough of how modern browser primitives enable
            serverless, private, on-device AI inference without compromising latency or quality.
          </p>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" /> Complete Inference Pipeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pipelineSteps.map((step) => (
              <div
                key={step.num}
                className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black font-mono text-brand-600 dark:text-brand-400">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Comparisons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" /> WebGPU vs WebAssembly
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              When WebGPU is active, model tensor calculations run concurrently across thousands of
              GPU shader cores, achieving inference in 90ms–200ms. On devices lacking WebGPU, Cutout
              switches dynamically to multi-threaded WASM compiled with SIMD optimizations.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" /> Caching & Zero Model Redownloads
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Once downloaded on first interaction, model weights persist in the browser Cache
              API / IndexedDB. Subsequent visits load instantly from local disk storage, permitting
              complete offline processing without internet connectivity.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all"
          >
            Try Background Removal Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
