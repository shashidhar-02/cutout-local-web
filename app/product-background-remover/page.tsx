'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Dropzone } from '@/components/Dropzone';
import { SingleImageEditor } from '@/features/editor/SingleImageEditor';
import { ShoppingBag, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ProductBackgroundRemoverPage() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header hardware={null} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <ShoppingBag className="w-3.5 h-3.5" /> E-commerce & Marketplace Ready
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Product Background Remover
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Prepare pure-white or transparent product catalog photos for Amazon, Shopify, eBay, and
            Etsy directly on your device. Fast, consistent, and watermark-free.
          </p>
        </div>

        <section className="p-4 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          {file ? (
            <SingleImageEditor file={file} onReset={() => setFile(null)} />
          ) : (
            <Dropzone onFilesSelected={(files) => setFile(files[0])} isMultiple={false} />
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-2">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Amazon White Background (#FFFFFF)
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              One-click preset to composite isolated products onto standard pure-white 1000×1000px
              canvases conforming to major marketplace specifications.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-2">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Consistent Padding Margins
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Maintains standardized 10% edge margins so that your product catalog thumbnails align
              harmoniously in store search grids.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-2">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Unreleased Prototype Security
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Edit pre-launch commercial product prototypes and confidential manufacturing photos
              without leaking designs to third-party image servers.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
