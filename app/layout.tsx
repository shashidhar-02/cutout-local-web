import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cutout | Remove backgrounds. Keep your photos private.',
  description:
    'Free, open-source background remover that runs AI locally in your browser. No account, no upload, no subscription and no watermark.',
  keywords: [
    'background-removal',
    'remove-background',
    'transparent-background',
    'image-segmentation',
    'image-processing',
    'computer-vision',
    'on-device-ai',
    'webgpu',
    'wasm',
    'onnx',
    'browser-ai',
    'privacy-first',
    'local-ai',
    'offline-first',
    'client-side',
    'image-editor',
    'photo-editor',
    'open-source',
    'nextjs',
    'typescript',
  ],
  authors: [{ name: 'Cutout Contributors' }],
  metadataBase: new URL('https://YOUR-VERCEL-DOMAIN.vercel.app'),
  openGraph: {
    title: 'Cutout | Remove backgrounds. Keep your photos private.',
    description:
      'Private, browser-based AI background removal. WebGPU/WASM inference runs on your device — no uploads, accounts, subscriptions or watermarks.',
    url: 'https://YOUR-VERCEL-DOMAIN.vercel.app',
    siteName: 'Cutout',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cutout | Remove backgrounds. Keep your photos private.',
    description:
      'Private, browser-based AI background removal. WebGPU/WASM inference runs on your device — no uploads, accounts, subscriptions or watermarks.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-slate-100 transition-colors">
        {children}
      </body>
    </html>
  );
}
