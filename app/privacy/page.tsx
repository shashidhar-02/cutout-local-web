import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ShieldCheck, Lock, EyeOff, ServerOff, Database, ArrowRight, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Guarantee & Technical Audit | Cutout',
  description:
    'Technical verification of Cutouts zero-upload policy: why your photos never leave your device, how client-side inference functions, and our automated network audit.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header hardware={null} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" /> Zero Transmission Policy
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Privacy Architecture
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Cutout was built specifically to solve the privacy hazard of uploading personal,
            confidential, or commercial photography to remote cloud servers.
          </p>
        </div>

        {/* 6 Ironclad Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Local Image Decoding',
              desc: 'Your photos are read into memory using browser-native Canvas and ImageBitmap interfaces directly on your CPU/GPU. No HTTP upload occurs.',
              icon: Lock,
            },
            {
              title: 'On-Device Neural Execution',
              desc: 'Segmentation calculations occur within your browser via WebGPU compute shaders or WebAssembly instructions. No remote inference API exists.',
              icon: ServerOff,
            },
            {
              title: 'Derived Pixels Stay Local',
              desc: 'Alpha masks and final composited images exist only inside your browser runtime memory and are discarded upon page navigation.',
              icon: EyeOff,
            },
            {
              title: 'No Image Databases or Storage',
              desc: 'There are no backend S3 buckets, SQL databases, or session caches storing your files. Vercel acts strictly as a static asset CDN.',
              icon: Database,
            },
            {
              title: 'Zero Tracking & No Image Telemetry',
              desc: 'We do not run tracking pixels, user session analytics, or telemetry that inspects image dimensions, color distributions, or filenames.',
              icon: ShieldCheck,
            },
            {
              title: 'Persistent Offline Support',
              desc: 'Once the model weights are retrieved and cached, Cutout operates completely offline. Disconnect Wi-Fi and verify background removal works.',
              icon: Check,
            },
          ].map((pillar) => (
            <div
              key={pillar.title}
              className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2"
            >
              <div className="flex items-center gap-2">
                <pillar.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{pillar.title}</h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Automated Privacy Testing */}
        <div className="p-6 rounded-3xl bg-gray-900 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Automated CI Network Audit
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300">
              tests/privacy.test.ts
            </span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            Our continuous integration pipeline intercepts all network requests during segmentation
            tests and strictly blocks any request containing binary image payloads, FormData, or
            base64 buffers:
          </p>

          <pre className="p-4 rounded-xl bg-black/60 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed border border-gray-800">
{`// Excerpt from tests/privacy.test.ts
it('strictly blocks any HTTP POST attempt carrying image bytes', async () => {
  await expect(
    fetch('https://some-remote-api.com/upload', {
      method: 'POST',
      body: fakeImageBuffer,
    })
  ).rejects.toThrow(/Forbidden HTTP POST request/);

  const audit = PrivacyNetworkAuditor.verifyZeroImageLeaks();
  expect(audit.safe).toBe(false);
});`}
          </pre>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all"
          >
            Launch Cutout Editor <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
