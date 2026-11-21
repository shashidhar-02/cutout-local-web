'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  Lock,
  Layers,
  Sparkles,
  EyeOff,
  CheckCircle2,
  ShoppingBag,
  User,
  Share2,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Dropzone } from '@/components/Dropzone';
import { UnsupportedBanner } from '@/components/UnsupportedBanner';
import { HeroBannerGraphic } from '@/components/HeroBannerGraphic';
import { SingleImageEditor } from '@/features/editor/SingleImageEditor';
import { BatchProcessingView } from '@/features/batch/BatchProcessingView';
import { HardwareInfo } from '@/lib/types';
import { detectHardwareCapabilities } from '@/lib/hardware';
import { useTranslation } from '@/lib/i18n-context';

export default function HomePage() {
  const { t } = useTranslation();
  const [hardware, setHardware] = useState<HardwareInfo | null>(null);
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);

  useEffect(() => {
    detectHardwareCapabilities().then(setHardware);
  }, []);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 1 && activeTab === 'single') {
      setSingleFile(files[0]);
    } else {
      setActiveTab('batch');
      setBatchFiles(files);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <UnsupportedBanner hardware={hardware} />
      <Header hardware={hardware} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          {/* Privacy Guarantee Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t.privacyPill}</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
              {t.heroTitle}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-400">
                {t.heroTitleHighlight}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-normal leading-relaxed">
              {t.heroSubtitle}
            </p>
          </div>

          {/* Core Feature Checklist */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 pt-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t.noAccount}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t.noUpload}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t.noSubscription}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t.noWatermark}
            </span>
          </div>
        </div>

        {/* Processing Workspace (Located FIRST at the Top for Immediate Upload) */}
        <section className="space-y-6 max-w-5xl mx-auto">
          {/* Tab Selector */}
          {!singleFile && batchFiles.length === 0 && (
            <div className="flex justify-center">
              <div className="inline-flex p-1 rounded-2xl bg-gray-200/80 dark:bg-gray-800 text-xs font-semibold shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveTab('single')}
                  className={`px-5 py-2 rounded-xl transition-all ${
                    activeTab === 'single'
                      ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {t.singleImageTab}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('batch')}
                  className={`px-5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeTab === 'batch'
                      ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  {t.batchQueueTab}
                </button>
              </div>
            </div>
          )}

          {/* Active View State */}
          {singleFile ? (
            <SingleImageEditor file={singleFile} onReset={() => setSingleFile(null)} />
          ) : batchFiles.length > 0 ? (
            <BatchProcessingView
              initialFiles={batchFiles}
              onClear={() => {
                setBatchFiles([]);
                setActiveTab('single');
              }}
            />
          ) : (
            <Dropzone
              onFilesSelected={handleFilesSelected}
              isMultiple={activeTab === 'batch'}
            />
          )}
        </section>

        {/* Visual Hero Showcase Banner (Located DOWN Below the Dropzone) */}
        {!singleFile && batchFiles.length === 0 && (
          <section className="pt-6 pb-2 max-w-5xl mx-auto space-y-4 border-t border-gray-200/80 dark:border-gray-800">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                ✨ Interactive Preview
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                Inspect Real-Time Edge & Transparency Quality
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Drag the center slider ↔ on either sample to test on-device background removal before uploading.
              </p>
            </div>
            <HeroBannerGraphic />
          </section>
        )}

        {/* How It Works & Privacy Architecture Section */}
        <section className="max-w-5xl mx-auto pt-8 border-t border-gray-200 dark:border-gray-800 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t.whyInBrowserTitle}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t.whyInBrowserSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-4">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm uppercase tracking-wide">
                <EyeOff className="w-4 h-4" /> {t.cloudServicesTitle}
              </div>
              <ul className="space-y-2.5 text-xs text-red-800/90 dark:text-red-300/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span> {t.cloudPoint1}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span> {t.cloudPoint2}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span> {t.cloudPoint3}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span> {t.cloudPoint4}
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4" /> {t.localArchitectureTitle}
              </div>
              <ul className="space-y-2.5 text-xs text-emerald-800/90 dark:text-emerald-300/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {t.localPoint1}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {t.localPoint2}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {t.localPoint3}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {t.localPoint4}
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Supported Use Cases */}
        <section className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {t.workflowsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {t.workflowsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              {
                title: t.workflowProductTitle,
                desc: t.workflowProductDesc,
                icon: ShoppingBag,
              },
              {
                title: t.workflowProfileTitle,
                desc: t.workflowProfileDesc,
                icon: User,
              },
              {
                title: t.workflowStickersTitle,
                desc: t.workflowStickersDesc,
                icon: Sparkles,
              },
              {
                title: t.workflowMarketplaceTitle,
                desc: t.workflowMarketplaceDesc,
                icon: Layers,
              },
              {
                title: t.workflowPresentationsTitle,
                desc: t.workflowPresentationsDesc,
                icon: Share2,
              },
              {
                title: t.workflowPersonalTitle,
                desc: t.workflowPersonalDesc,
                icon: ShieldCheck,
              },
            ].map((useCase) => (
              <div
                key={useCase.title}
                className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2"
              >
                <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <useCase.icon className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                  {useCase.title}
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                  {useCase.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
