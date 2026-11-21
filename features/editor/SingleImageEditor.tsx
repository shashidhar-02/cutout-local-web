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
  computeInstantCutoutMask,
  downloadCanvasFile,
  renderFinalComposition,
} from '@/lib/image-processing';
import { ComparisonSlider } from './ComparisonSlider';
import { BackgroundPicker } from './BackgroundPicker';
import { CropSettings as CropSettingsComponent } from './CropSettings';
import { ResizeSettingsPanel } from './ResizeSettingsModal';
import { SmartPresetsSelector } from './SmartPresetsSelector';
import { useTranslation } from '@/lib/i18n-context';
import confetti from 'canvas-confetti';

interface SingleImageEditorProps {
  file: File;
  onReset: () => void;
}

export const SingleImageEditor: React.FC<SingleImageEditorProps> = ({ file, onReset }) => {
  const { t } = useTranslation();
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const [status, setStatus] = useState<'loading-model' | 'processing' | 'done' | 'error'>(
    'processing'
  );
  const [statusMessage, setStatusMessage] = useState<string>('Segmenting image locally...');
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [inferenceResult, setInferenceResult] = useState<SegmentationResult | null>(null);

  // Quality Mode: Fast (Default Instant <40ms) | Balanced (Neural AI) | Quality (Ultra HD)
  const [qualityMode, setQualityMode] = useState<QualityMode>('fast');
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [refiningText, setRefiningText] = useState<string>('');
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
      // 1. Instant Zero-Download Computer Vision Engine (<35ms execution)
      if (mode === 'fast') {
        setStatus('processing');
        setStatusMessage('Segmenting background in real-time...');

        try {
          const startTime = performance.now();
          const imgEl = new Image();
          imgEl.src = url;
          await new Promise((resolve) => {
            if (imgEl.complete) resolve(true);
            else imgEl.onload = () => resolve(true);
          });

          const maskBuffer = computeInstantCutoutMask(imgEl, width, height);
          const compCanvas = applyAlphaMask(imgEl, maskBuffer, width, height);
          transparentCanvasRef.current = compCanvas;

          // Immediately render preview blob to guarantee instant feedback
          const finalCanvas = await renderFinalComposition(compCanvas, background, crop);
          finalCanvas.toBlob((blob) => {
            if (blob) {
              setPreviewUrl(URL.createObjectURL(blob));
            }
          }, 'image/png');

          const elapsed = Math.max(1, Math.round(performance.now() - startTime));
          setInferenceResult({
            maskBuffer,
            width,
            height,
            inferenceTimeMs: elapsed,
            deviceUsed: 'wasm',
            qualityMode: 'fast',
          });
          setStatus('done');

          // Trigger confetti
          try {
            confetti({
              particleCount: 35,
              spread: 45,
              origin: { y: 0.7 },
              colors: ['#10b981', '#3b82f6', '#8b5cf6'],
            });
          } catch {}
          return;
        } catch (err: any) {
          console.error('Instant cutout error:', err);
          setStatus('error');
          setStatusMessage('Failed to segment image.');
          return;
        }
      }

      // 2. Neural AI Edge Refinement (Optional non-blocking background inference)
      setIsRefining(true);
      setRefiningText(
        mode === 'balanced'
          ? 'Refining edges with Neural AI in background...'
          : 'Refining edges with Ultra HD Neural AI...'
      );

      try {
        const client = SegmentationClient.getInstance();

        const unsubStatus = client.subscribeStatus((st, text) => {
          if (text) setRefiningText(text);
        });

        const unsubProgress = client.subscribeProgress((p) => {
          if (p && typeof p.progress === 'number') {
            setLoadProgress(p.progress);
          }
        });

        // Execute local segmentation in Web Worker
        const result = await client.removeBackground(url, width, height, mode);
        unsubStatus();
        unsubProgress();

        setInferenceResult(result);

        const imgEl = new Image();
        imgEl.src = url;
        await new Promise((resolve) => {
          if (imgEl.complete) resolve(true);
          else imgEl.onload = () => resolve(true);
        });

        const compCanvas = applyAlphaMask(imgEl, result.maskBuffer, width, height);
        transparentCanvasRef.current = compCanvas;

        const finalCanvas = await renderFinalComposition(compCanvas, background, crop);
        finalCanvas.toBlob((blob) => {
          if (blob) {
            setPreviewUrl(URL.createObjectURL(blob));
          }
        }, 'image/png');

        setStatus('done');
      } catch (err: any) {
        console.warn('Neural refinement error, retaining instant cutout:', err);
        // Retain the existing instant cutout so user is never blocked
        if (!transparentCanvasRef.current) {
          const imgEl = new Image();
          imgEl.src = url;
          await new Promise((resolve) => {
            if (imgEl.complete) resolve(true);
            else imgEl.onload = () => resolve(true);
          });
          const maskBuffer = computeInstantCutoutMask(imgEl, width, height);
          transparentCanvasRef.current = applyAlphaMask(imgEl, maskBuffer, width, height);
          setStatus('done');
        }
      } finally {
        setIsRefining(false);
      }
    },
    [background, crop]
  );

  const urlRef = useRef<string>('');

  // Load and read input file once when file prop changes
  useEffect(() => {
    const url = URL.createObjectURL(file);
    urlRef.current = url;
    setOriginalUrl(url);

    const img = new Image();
    img.onload = () => {
      setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      executeSegmentation(url, img.naturalWidth, img.naturalHeight, qualityMode);
    };
    img.src = url;

    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = '';
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // Re-render preview canvas whenever background or crop changes
  useEffect(() => {
    if (!transparentCanvasRef.current || status !== 'done') return;

    let active = true;

    renderFinalComposition(transparentCanvasRef.current, background, crop)
      .then((finalCanvas) => {
        if (!active) return;
        finalCanvas.toBlob((blob) => {
          if (!active || !blob) return;
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(URL.createObjectURL(blob));
        }, 'image/png');
      })
      .catch((err) => console.error('Render error:', err));

    return () => {
      active = false;
    };
  }, [background, crop, status]);

  // Handle Quality Mode Change cleanly without revoking image URL
  const handleQualityModeChange = (newMode: QualityMode) => {
    if (newMode === qualityMode) return;
    setQualityMode(newMode);
    const activeUrl = urlRef.current || originalUrl;
    if (activeUrl && imgDimensions.width > 0) {
      executeSegmentation(activeUrl, imgDimensions.width, imgDimensions.height, newMode);
    }
  };

  // Handle Smart Preset selection
  const handleApplyPreset = (preset: SmartPreset) => {
    setActivePresetId(preset.id);
    setFormat(preset.format);

    if (preset.background) {
      setBackground({
        type: preset.background.type,
        color: preset.background.color || '#ffffff',
        blur: 0,
      });
    }

    if (preset.crop) {
      setCrop(preset.crop);
    }

    if (preset.resize) {
      setResize(preset.resize);
    }
  };

  // Export & Download
  const handleDownload = async () => {
    if (!transparentCanvasRef.current) return;
    setIsExporting(true);

    try {
      const finalCanvas = await renderFinalComposition(
        transparentCanvasRef.current,
        background,
        crop,
        resize.enabled ? resize : undefined
      );

      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const downloadFilename = `${baseName}_cutout.${format}`;

      await downloadCanvasFile(finalCanvas, downloadFilename, format, quality);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const getQualityLabel = (mode: QualityMode) => {
    if (mode === 'fast') return `⚡ ${t.fast} (<40ms)`;
    if (mode === 'balanced') return `🚀 ${t.balanced}`;
    return `💎 ${t.quality}`;
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
            {t.uploadNewBtn}
          </button>
          <span className="text-xs text-gray-500 font-medium truncate max-w-[200px] sm:max-w-xs">
            {file.name}
          </span>
        </div>

        {/* Quality Controls Selector & Live Refine Status */}
        <div className="flex flex-wrap items-center gap-3">
          {isRefining && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-spin" />
              <span>{refiningText || 'Refining edges...'}</span>
              {loadProgress > 0 && loadProgress < 100 && (
                <span className="text-[10px] font-mono">({loadProgress}%)</span>
              )}
            </div>
          )}

          <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-medium">
            {(['fast', 'balanced', 'quality'] as QualityMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => handleQualityModeChange(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  qualityMode === mode
                    ? 'bg-white dark:bg-gray-700 text-brand-700 dark:text-brand-300 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {getQualityLabel(mode)}
              </button>
            ))}
          </div>
        </div>

        {/* Inference Execution Metadata */}
        {inferenceResult && (
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-mono">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t.cutoutLabel}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {inferenceResult.inferenceTimeMs}ms
            </span>
            <span className="uppercase px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-bold">
              {inferenceResult.qualityMode === 'fast' ? 'Instant Engine' : inferenceResult.deviceUsed}
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
                  {status === 'loading-model' ? t.loadingModel : t.processingImage}
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
                {t.uploadNewBtn}
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
            {isExporting ? 'Generating File...' : `${t.downloadBtn} ${format.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
};
