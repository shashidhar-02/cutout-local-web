'use client';

import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const PrivacyBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-medium shadow-sm transition-all hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 ${className}`}
    >
      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      <span className="font-semibold tracking-tight">100% On-Device AI</span>
      <span className="text-emerald-600/80 dark:text-emerald-400/80 hidden sm:inline">
        • Zero Image Uploads
      </span>
    </div>
  );
};
