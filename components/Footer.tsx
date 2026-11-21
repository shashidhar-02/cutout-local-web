'use client';

import React from 'react';
import { ShieldCheck, Lock, Cpu, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand and Mission */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Cutout
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
              A free, open-source AI background remover that runs 100% locally in your browser.
              No server uploads, no accounts, no credit limits, and no watermarks.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Zero Uploads
              </span>
              <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Cpu className="w-4 h-4" /> WebGPU + WASM
              </span>
              <span className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400">
                <Lock className="w-4 h-4" /> 100% Private
              </span>
            </div>
          </div>

          {/* Transparency & Safety Links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              Transparency
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a
                  href="/PRIVACY.md"
                  target="_blank"
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Privacy Architecture
                </a>
              </li>
              <li>
                <a
                  href="/MODEL_LICENSES.md"
                  target="_blank"
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Model Licenses & Limits
                </a>
              </li>
              <li>
                <a
                  href="/docs/BENCHMARKS.md"
                  target="_blank"
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Hardware Benchmarks
                </a>
              </li>
              <li>
                <a
                  href="/SECURITY.md"
                  target="_blank"
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Security Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Project & Community Links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              Open Source
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a
                  href="https://github.com/your-username/cutout-local-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1"
                >
                  GitHub Repository <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="/CONTRIBUTING.md"
                  target="_blank"
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Contributing Guide
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/your-username/cutout-local-web/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Report an Issue
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-500">
          <p>© {new Date().getFullYear()} Cutout. Released under the open-source MIT License.</p>
          <p className="flex items-center gap-1">
            Built with Next.js, Transformers.js, WebGPU, and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};
