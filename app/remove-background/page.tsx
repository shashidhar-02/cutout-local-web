'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Dropzone } from '@/components/Dropzone';
import { SingleImageEditor } from '@/features/editor/SingleImageEditor';
import { ShieldCheck, CheckCircle2, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function RemoveBackgroundPage() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header hardware={null} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Search Intent Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Free & Local
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Remove Background from Image
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Instantly isolate subjects from photos and remove backdrops locally in your browser.
            No sign-ups, no monthly credits, and no photo uploads.
          </p>
        </div>

        {/* Live Functional Tool */}
        <section className="p-4 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          {file ? (
            <SingleImageEditor file={file} onReset={() => setFile(null)} />
          ) : (
            <Dropzone onFilesSelected={(files) => setFile(files[0])} isMultiple={false} />
          )}
        </section>

        {/* Informative Guidance & Specifications */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 space-y-2">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Supported Input Formats
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Accepts PNG, JPG, JPEG, WebP, and AVIF. Paste directly from your clipboard using Ctrl+V.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 space-y-2">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Export Capabilities
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Export lossless transparent PNGs, modern WebP with custom quality, or solid studio JPGs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 space-y-2">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Zero Server Inference
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Your image bytes never leave this device. Processing executes via WebGPU or WASM.
            </p>
          </div>
        </section>

        {/* Genuine FAQ Section */}
        <section className="space-y-4 pt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-600" /> Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {[
              {
                q: 'How does Cutout remove backgrounds without uploading?',
                a: 'Cutout compiles the open-source RMBG-1.4 neural network into WebAssembly and WebGPU compute shaders. Your browser downloads the model weights once, caches them locally, and performs all tensor calculations on your own graphics card or CPU.',
              },
              {
                q: 'Are there resolution or quantity limitations?',
                a: 'No. Cutout imposes no artificial limits, subscriptions, or credit systems. You can process high-resolution photos as many times as your device memory permits.',
              },
              {
                q: 'Can I replace the background with a color or photo?',
                a: 'Yes. Once isolated, you can choose transparent, solid studio colors (white, black, pastels, chroma green), or upload a custom scenery photo with optional blur.',
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-1"
              >
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{faq.q}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
