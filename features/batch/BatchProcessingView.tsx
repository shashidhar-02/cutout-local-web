'use client';

import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import {
  Archive,
  Play,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Plus,
  Sparkles,
  Loader2,
  Layers,
} from 'lucide-react';
import { ExportFormat, ProcessedItem } from '@/lib/types';
import { SegmentationClient } from '@/lib/segmentation-client';
import { applyAlphaMask, canvasToBlob } from '@/lib/image-processing';
import { BatchItemCard } from './BatchItemCard';
import { useTranslation } from '@/lib/i18n-context';
import confetti from 'canvas-confetti';

interface BatchProcessingViewProps {
  initialFiles: File[];
  onClear: () => void;
}

export const BatchProcessingView: React.FC<BatchProcessingViewProps> = ({
  initialFiles,
  onClear,
}) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<ProcessedItem[]>(() =>
    initialFiles.map((file) => ({
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      file,
      name: file.name,
      size: file.size,
      originalUrl: URL.createObjectURL(file),
      width: 0,
      height: 0,
      status: 'idle',
      progress: 0,
    }))
  );

  const [isProcessingAll, setIsProcessingAll] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [format, setFormat] = useState<ExportFormat>('png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add more files to queue
  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newItems: ProcessedItem[] = Array.from(e.target.files)
        .filter((f) => f.type.startsWith('image/'))
        .map((file) => ({
          id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          file,
          name: file.name,
          size: file.size,
          originalUrl: URL.createObjectURL(file),
          width: 0,
          height: 0,
          status: 'idle',
          progress: 0,
        }));
      setItems((prev) => [...prev, ...newItems]);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.originalUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  // Process a single item
  const processSingleItem = async (item: ProcessedItem): Promise<ProcessedItem> => {
    const client = SegmentationClient.getInstance();

    return new Promise((resolve) => {
      const img = new Image();
      img.src = item.originalUrl;
      img.onload = async () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        try {
          const result = await client.removeBackground(item.originalUrl, width, height, 'balanced');
          const transparentCanvas = applyAlphaMask(img, result.maskBuffer, width, height);
          const transparentDataUrl = transparentCanvas.toDataURL('image/png');

          resolve({
            ...item,
            width,
            height,
            status: 'complete',
            result: {
              maskBuffer: result.maskBuffer,
              inferenceTimeMs: result.inferenceTimeMs,
              deviceUsed: result.deviceUsed,
              qualityMode: result.qualityMode,
              transparentDataUrl,
            },
          });
        } catch (err: any) {
          console.error(`Batch processing error for ${item.name}:`, err);
          resolve({
            ...item,
            status: 'error',
            error: err?.message || 'Segmentation failed',
          });
        }
      };
      img.onerror = () => {
        resolve({
          ...item,
          status: 'error',
          error: 'Image loading failed',
        });
      };
    });
  };

  // Process all queued items sequentially to optimize memory footprint
  const handleProcessAll = async () => {
    setIsProcessingAll(true);

    const updatedItems = [...items];
    for (let i = 0; i < updatedItems.length; i++) {
      if (updatedItems[i].status === 'complete') continue;

      setItems((current) =>
        current.map((it, idx) => (idx === i ? { ...it, status: 'processing' } : it))
      );

      const completedItem = await processSingleItem(updatedItems[i]);
      updatedItems[i] = completedItem;

      setItems([...updatedItems]);
    }

    setIsProcessingAll(false);

    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    } catch {}
  };

  // Download individual processed item
  const handleDownloadSingle = (item: ProcessedItem) => {
    if (!item.result?.transparentDataUrl) return;
    const link = document.createElement('a');
    link.href = item.result.transparentDataUrl;
    link.download = `${item.name.replace(/\.[^/.]+$/, '')}-cutout.png`;
    link.click();
  };

  // Download all completed cutouts bundled as a single ZIP
  const handleDownloadZip = async () => {
    const completedItems = items.filter((i) => i.status === 'complete' && i.result?.transparentDataUrl);
    if (completedItems.length === 0) return;

    setIsZipping(true);
    const zip = new JSZip();
    const folder = zip.folder('cutouts');

    for (const item of completedItems) {
      const dataUrl = item.result!.transparentDataUrl;
      const base64Data = dataUrl.replace(/^data:image\/(png|jpeg|webp);base64,/, '');
      const cleanName = item.name.replace(/\.[^/.]+$/, '');
      folder?.file(`${cleanName}-cutout.png`, base64Data, { base64: true });
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cutout-batch-${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsZipping(false);
  };

  const completedCount = items.filter((i) => i.status === 'complete').length;

  return (
    <div className="w-full space-y-6">
      {/* Batch Header & Queue Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              {t.batchQueue}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
              {completedCount} / {items.length} Ready
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t.localPoint1}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleAddFiles}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> + {t.browseBtn}
          </button>

          <button
            type="button"
            onClick={handleProcessAll}
            disabled={isProcessingAll || completedCount === items.length}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all ${
              !isProcessingAll && completedCount < items.length
                ? 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/20'
                : 'bg-gray-300 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isProcessingAll ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> {t.processingImage}
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> {t.processAll} ({items.length - completedCount})
              </>
            )}
          </button>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm transition-all"
            >
              {isZipping ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Zipping...
                </>
              ) : (
                <>
                  <Archive className="w-3.5 h-3.5" /> {t.downloadZip}
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onClear}
            className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {items.map((item) => (
          <BatchItemCard
            key={item.id}
            item={item}
            onRemove={removeItem}
            onDownload={handleDownloadSingle}
          />
        ))}
      </div>
    </div>
  );
};
