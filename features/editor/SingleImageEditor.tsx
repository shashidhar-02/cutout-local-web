'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Download,
  RotateCcw,
  Sparkles,
  Zap,
  Cpu,
  Clock,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
} from 'lucide-react';
import {
  BackgroundSettings,
  CropSettings,
  ExportFormat,
  QualityMode,
  ResizeSettings,
  SegmentationResult,
  SmartPreset,
} from '@/lib/types';
import { SegmentationClient } from '@/lib/segmentation-client';
import {
  applyAlphaMask,
  downloadCanvasFile,
  renderFinalComposition,
} from '@/lib/image-processing';
import { ComparisonSlider } from './ComparisonSlider';
import { BackgroundPicker } from './BackgroundPicker';
import { CropSettings as CropSettingsComponent } from './CropSettings';
import { ResizeSettingsPanel } from './ResizeSettingsModal';
import { SmartPresetsSelector } from './SmartPresetsSelector';
import confetti from 'canvas-confetti';

interface SingleImageEditorProps {
  file: File;
  onReset: () => void;
}

export const SingleImageEditor: React.FC<SingleImageEditorProps> = ({ file, onReset }) => {
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const [status, setStatus] = useState<'loading-model' | 'processing' | 'done' | 'error'>(
    'loading-model'
  );
  const [statusMessage, setStatusMessage] = useState<string>('Preparing Cutout AI runtime...');
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [inferenceResult, setInferenceResult] = useState<SegmentationResult | null>(null);

  // Quality Mode: Fast | Balanced | Quality
  const [qualityMode, setQualityMode] = useState<QualityMode>('balanced');
  const [activePresetId, setActivePresetId] = useState<string | undefined>();

  // Master canvas & preview
  const transparentCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Processing & Export Settings
  const [background, setBackground] = useState<BackgroundSettings>({
    type: 'transparent',
    color: '#ffffff',
    blur: 0,
  });

  const [crop, setCrop] = useState<CropSettings>({
    autoCrop: false,
    padding: 16,
  });

  const [resize, setResize] = useState<ResizeSettings>({
    enabled: false,
    width: 0,
    height: 0,
    maintainAspectRatio: true,
    scalePercent: 100,
  });

  const [format, setFormat] = useState<ExportFormat>('png');
  const [quality, setQuality] = useState<number>(0.95);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Run segmentation
  const executeSegmentation = useCallback(
    async (url: string, width: number, height: number, mode: QualityMode) => {
      setStatus('loading-model');
      setStatusMessage('Initializing local neural model...');

      try {
        const client = SegmentationClient.getInstance();

        const unsubStatus = client.subscribeStatus((st, text) => {
          setStatus(st === 'processing' ? 'processing' : 'loading-model');
          if (text) setStatusMessage(text);
        });

        const unsubProgress = client.subscribeProgress((p) => {
          if (p.progress) setLoadProgress(Math.round(p.progress));
        });

        const result = await client.removeBackground(url, width, height, mode);
        unsubStatus();
        unsubProgress();

        setInferenceResult(result);

        const img = new Image();
        img.src = url;
        await new Promise((r) => (img.onload = r));

        const transparentCanvas = applyAlphaMask(img, result.maskBuffer, width, height);
        transparentCanvasRef.current = transparentCanvas;

        const dataUrl = transparentCanvas.toDataURL('image/png');
        setPreviewUrl(dataUrl);
        setStatus('done');
      } catch (err: any) {
        console.error(err);
        setStatus('error');
        setStatusMessage(err?.message || 'Segmentation failed');
      }
    },
    []
  );

  // Step 1: Load image on mount
  useEffect(() => {
    let isCancelled = false;
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      if (isCancelled) return;
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      setImgDimensions({ width, height });
      setResize((prev) => ({ ...prev, width, height }));
      executeSegmentation(url, width, height, qualityMode);
    };

    return () => {
      isCancelled = true;
      URL.revokeObjectURL(url);
    };
  }, [file, executeSegmentation, qualityMode]);

  // Handle Quality Mode switch
  const handleQualityModeChange = (newMode: QualityMode) => {
    if (newMode === qualityMode) return;
    setQualityMode(newMode);
    if (originalUrl && imgDimensions.width > 0) {
      executeSegmentation(originalUrl, imgDimensions.width, imgDimensions.height, newMode);
    }
  };

  // Handle Smart Preset Apply
  const handleApplyPreset = (preset: SmartPreset) => {
    setActivePresetId(preset.id);
    setFormat(preset.format);
    setBackground(preset.background);
    setCrop(preset.crop);
    setResize(preset.resize);
  };

  // Re-render preview canvas on visual adjustments
  const updatePreview = useCallback(async () => {
    if (!transparentCanvasRef.current || status !== 'done') return;

    if (background.type === 'transparent' && !crop.autoCrop && !resize.enabled) {
      setPreviewUrl(transparentCanvasRef.current.toDataURL('image/png'));
      return;
    }

    try {
      const composited = await renderFinalComposition(
        transparentCanvasRef.current,
        background,
        crop,
        resize
      );
      setPreviewUrl(composited.toDataURL('image/png'));
    } catch (e) {
      console.error('Preview update error:', e);
    }
  }, [background, crop, resize, status]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  // Handle Final Download
  const handleDownload = async () => {
    if (!transparentCanvasRef.current) return;
    setIsExporting(true);

    try {
      const finalCanvas = await renderFinalComposition(
        transparentCanvasRef.current,
        background,
        crop,
        resize
      );

      await downloadCanvasFile(finalCanvas, file.name, format, quality);

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {}
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-semibold shadow-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Upload New Photo
          </button>
          <span className="text-xs text-gray-500 font-medium truncate max-w-[200px] sm:max-w-xs">
            {file.name}
          </span>
        </div>

        {/* Quality Controls Selector */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-medium">
            {(['fast', 'balanced', 'quality'] as QualityMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => handleQualityModeChange(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all capitalize ${
                  qualityMode === mode
                    ? 'bg-white dark:bg-gray-700 text-brand-700 dark:text-brand-300 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Inference Execution Metadata */}
        {inferenceResult && (
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-mono">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Segmented
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {inferenceResult.inferenceTimeMs}ms
            </span>
            <span className="uppercase px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-bold">
              {inferenceResult.deviceUsed}
            </span>
          </div>
        )}
      </div>

      {/* Main Canvas View Area & Sidebar Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Preview */}
        <div className="lg:col-span-8 space-y-4">
          {status !== 'done' && status !== 'error' ? (
            <div className="aspect-[4/3] rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 flex flex-col items-center justify-center p-8 text-center space-y-4 shadow-sm">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-brand-200 dark:border-brand-900 border-t-brand-600 dark:border-t-brand-400 animate-spin" />
                <Sparkles className="w-6 h-6 text-brand-600 dark:text-brand-400 absolute inset-0 m-auto" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                  {status === 'loading-model' ? 'Downloading AI model' : 'Running AI on your device'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
                  {statusMessage}
                </p>
              </div>

              {loadProgress > 0 && loadProgress < 100 && (
                <div className="w-56 space-y-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-500 h-full transition-all duration-200"
                      style={{ width: `${loadProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] font-mono text-gray-400">{loadProgress}% cached</p>
                </div>
              )}
            </div>
          ) : status === 'error' ? (
            <div className="aspect-[4/3] rounded-3xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-red-500" />
              <h4 className="text-base font-bold text-red-900 dark:text-red-200">
                Processing Failed
              </h4>
              <p className="text-xs text-red-700 dark:text-red-300 max-w-md">{statusMessage}</p>
              <button
                onClick={onReset}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
              >
                Try Another Photo
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <ComparisonSlider
                originalUrl={originalUrl}
                processedUrl={previewUrl}
                width={imgDimensions.width}
                height={imgDimensions.height}
                showCheckerboard={background.type === 'transparent'}
              />
              <p className="text-center text-xs text-gray-400 select-none">
                ↔ Drag slider to inspect edge boundaries and subject segmentation
              </p>

              {/* Smart Export Presets Bar */}
              <SmartPresetsSelector
                onApplyPreset={handleApplyPreset}
                activePresetId={activePresetId}
              />
            </div>
          )}
        </div>

        {/* Right: Controls & Export Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <BackgroundPicker settings={background} onChange={setBackground} />

          <CropSettingsComponent settings={crop} onChange={setCrop} />

          <ResizeSettingsPanel
            originalWidth={imgDimensions.width}
            originalHeight={imgDimensions.height}
            resize={resize}
            format={format}
            quality={quality}
            onResizeChange={setResize}
            onFormatChange={setFormat}
            onQualityChange={setQuality}
          />

          <button
            type="button"
            onClick={handleDownload}
            disabled={status !== 'done' || isExporting}
            className={`w-full py-4 rounded-2xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              status === 'done' && !isExporting
                ? 'bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-700 hover:to-emerald-600 shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.01] active:scale-[0.99]'
                : 'bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Generating File...' : `Download ${format.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
};
