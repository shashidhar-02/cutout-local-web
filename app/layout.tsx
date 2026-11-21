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
  alternates: {
    canonical: 'https://YOUR-VERCEL-DOMAIN.vercel.app',
  },
  openGraph: {
    title: 'Cutout | Remove backgrounds. Keep your photos private.',
    description:
      'Private, browser-based AI background removal. WebGPU/WASM inference runs on your device — no uploads, accounts, subscriptions or watermarks.',
    url: 'https://YOUR-VERCEL-DOMAIN.vercel.app',
    siteName: 'Cutout',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Cutout - Local Background Remover',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cutout | Remove backgrounds. Keep your photos private.',
    description:
      'Private, browser-based AI background removal. WebGPU/WASM inference runs on your device — no uploads, accounts, subscriptions or watermarks.',
    images: ['/og-image.svg'],
  },
};

// Schema.org SoftwareApplication JSON-LD
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Cutout',
  operatingSystem: 'Any (Web Browser)',
  applicationCategory: 'MultimediaApplication',
  offers: {
    '@type': 'Offer',
    price: '0.00',
    priceCurrency: 'USD',
  },
  description:
    'Free, open-source background remover that runs AI locally in your browser. No account, no upload, no subscription and no watermark.',
  featureList: [
    'Automatic background removal',
    'Transparent PNG export',
    'WebGPU hardware acceleration',
    'Offline capability',
    'Zero server uploads',
    'Batch processing',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-slate-100 transition-colors">
        {children}
      </body>
    </html>
  );
}
