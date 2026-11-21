'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Dropzone } from '@/components/Dropzone';
import { BatchProcessingView } from '@/features/batch/BatchProcessingView';
import { Layers, ShieldCheck, Archive } from 'lucide-react';

export default function BatchBackgroundRemoverPage() {
  const [batchFiles, setBatchFiles] = useState<File[]>([]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header hardware={null} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Layers className="w-3.5 h-3.5 text-purple-600" /> Multi-Image Queue & ZIP Export
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Batch Background Remover
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Select 5, 10, 25, or 50 photos at once. Cutout processes each image locally in sequence
            without overflowing device memory, bundling all results into a single ZIP file.
          </p>
        </div>

        <section className="p-4 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          {batchFiles.length > 0 ? (
            <BatchProcessingView initialFiles={batchFiles} onClear={() => setBatchFiles([])} />
          ) : (
            <Dropzone onFilesSelected={setBatchFiles} isMultiple={true} />
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-2">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              No Upload Bandwidth Waste
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Batching 50 photos doesn&apos;t consume gigabytes of mobile data. Only the lightweight model
              is cached once.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-2">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Adaptive Concurrency
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Queue items execute sequentially to respect browser memory limits and prevent tab
              crashes on consumer laptops or smartphones.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-2">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              One-Click ZIP Bundle
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Download all completed cutouts in a clean `.zip` archive or download individual photos
              as they finish processing.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
