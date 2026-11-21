'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Dropzone } from '@/components/Dropzone';
import { SingleImageEditor } from '@/features/editor/SingleImageEditor';
import { User, Briefcase, FileCheck } from 'lucide-react';

export default function ProfilePhotoBackgroundRemoverPage() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header hardware={null} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <User className="w-3.5 h-3.5" /> Professional Avatars & Passports
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Profile Photo Background Remover
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Transform casual selfies or cluttered portraits into polished LinkedIn, resume, and
            passport headshots with studio neutral backgrounds.
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
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-600" /> LinkedIn & Corporate Avatars
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Replace bedroom walls or outdoor distractions with clean studio grey, soft slate, or
              office blur backgrounds for a standout professional appearance.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" /> Passport & Visa Preparation
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Apply 1:1 square framing and neutral off-white or plain light-grey solid backdrops
              suitable for digital ID submissions without sending biometric headshots to cloud APIs.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
