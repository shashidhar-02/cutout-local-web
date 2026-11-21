'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Dropzone } from '@/components/Dropzone';
import { SingleImageEditor } from '@/features/editor/SingleImageEditor';
import { Sparkles, ShieldCheck, Check, ArrowRight } from 'lucide-react';

export default function TransparentBackgroundMakerPage() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header hardware={null} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Transparent PNG & WebP
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Transparent Background Maker
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Create clean, alpha-channel transparent PNG and WebP assets for logos, stickers,
            illustrations, and presentations. Runs 100% locally.
          </p>
        </div>

        <section className="p-4 sm:p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
          {file ? (
            <SingleImageEditor file={file} onReset={() => setFile(null)} />
          ) : (
            <Dropzone onFilesSelected={(files) => setFile(files[0])} isMultiple={false} />
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Why Transparent PNGs Matter
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Transparent backgrounds allow designers and marketers to layer assets over colored
              slides, website headers, video overlays, and product mockups without unsightly white
              bounding boxes.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Smart Auto-Crop Integration
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Cutout includes an automated bounding-box trimmer that discards useless transparent
              margins around your subject with adjustable padding for pixel-perfect stickers.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
