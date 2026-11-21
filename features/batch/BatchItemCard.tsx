'use client';

import React from 'react';
import { Download, Trash2, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { ProcessedItem } from '@/lib/types';

interface BatchItemCardProps {
  item: ProcessedItem;
  onRemove: (id: string) => void;
  onDownload: (item: ProcessedItem) => void;
}

export const BatchItemCard: React.FC<BatchItemCardProps> = ({ item, onRemove, onDownload }) => {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm gap-4 transition-all hover:border-gray-300 dark:hover:border-gray-700">
      {/* Thumbnail */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-gray-800 bg-checkerboard-pattern dark:bg-checkerboard-pattern-dark bg-checkerboard flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.result?.transparentDataUrl || item.originalUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[180px] sm:max-w-xs">
            {item.name}
          </p>
          <p className="text-[11px] text-gray-500 font-mono">
            {(item.size / 1024).toFixed(1)} KB
            {item.width > 0 && ` • ${item.width}×${item.height}px`}
          </p>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 mt-1">
            {item.status === 'complete' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Done ({item.result?.inferenceTimeMs}ms)
              </span>
            )}
            {item.status === 'processing' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Segmenting...
              </span>
            )}
            {item.status === 'idle' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400">
                <Clock className="w-3 h-3" /> Queued
              </span>
            )}
            {item.status === 'error' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600">
                <AlertCircle className="w-3.5 h-3.5" /> Failed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        {item.status === 'complete' && (
          <button
            type="button"
            onClick={() => onDownload(item)}
            title="Download Cutout"
            className="p-2 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          title="Remove from queue"
          className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
