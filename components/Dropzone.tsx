'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n-context';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  isMultiple?: boolean;
  disabled?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesSelected,
  isMultiple = false,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Global Paste (Ctrl+V / Cmd+V)
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (disabled) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }

      if (files.length > 0) {
        onFilesSelected(isMultiple ? files : [files[0]]);
      }
    },
    [disabled, isMultiple, onFilesSelected]
  );

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );
      if (droppedFiles.length > 0) {
        onFilesSelected(isMultiple ? droppedFiles : [droppedFiles[0]]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files).filter((f) => f.type.startsWith('image/'));
      if (selected.length > 0) {
        onFilesSelected(isMultiple ? selected : [selected[0]]);
      }
    }
  };

  // Helper to load sample synthetic image for immediate testing
  const loadSampleImage = (name: string, primaryColor: string, shape: 'circle' | 'rect' | 'star') => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 600, 600);
    grad.addColorStop(0, '#f97316');
    grad.addColorStop(0.5, '#e11d48');
    grad.addColorStop(1, '#4f46e5');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 600);

    ctx.fillStyle = primaryColor;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;

    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(300, 300, 160, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === 'rect') {
      ctx.beginPath();
      ctx.roundRect(160, 160, 280, 280, 32);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(300, 300, 170, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, 300, 300);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `${name.toLowerCase()}-sample.png`, { type: 'image/png' });
        onFilesSelected([file]);
      }
    }, 'image/png');
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 ${
          isDragging
            ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 scale-[1.01]'
            : 'border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-900/60 hover:border-brand-400 hover:bg-gray-50/70 dark:hover:bg-gray-850/50'
        } ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/avif"
          multiple={isMultiple}
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {isDragging ? 'Drop your image here' : t.dropzoneTitle}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.dropzoneSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-500/25 transition-all">
              <ImageIcon className="w-4 h-4" />
              {t.browseBtn} {isMultiple ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Sample Quick-Test Photos */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-gray-500 dark:text-gray-400">
        <span className="font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {t.trySample}
        </span>
        <button
          type="button"
          onClick={() => loadSampleImage('Product', '#0284c7', 'rect')}
          className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 dark:hover:text-brand-300 border border-gray-200 dark:border-gray-700 transition-colors font-medium"
        >
          📦 Product Box
        </button>
        <button
          type="button"
          onClick={() => loadSampleImage('Portrait', '#7c3aed', 'circle')}
          className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 dark:hover:text-brand-300 border border-gray-200 dark:border-gray-700 transition-colors font-medium"
        >
          👤 Portrait Avatar
        </button>
        <button
          type="button"
          onClick={() => loadSampleImage('Sticker', '#059669', 'star')}
          className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 dark:hover:text-brand-300 border border-gray-200 dark:border-gray-700 transition-colors font-medium"
        >
          ⭐ Logo Sticker
        </button>
      </div>
    </div>
  );
};
