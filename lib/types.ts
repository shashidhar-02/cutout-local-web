export type DeviceMode = 'webgpu' | 'wasm' | 'detecting' | 'unsupported';

export type ProcessingStatus = 
  | 'idle'
  | 'loading-model'
  | 'processing'
  | 'complete'
  | 'error';

export type QualityMode = 'fast' | 'balanced' | 'quality';

export interface HardwareInfo {
  mode: DeviceMode;
  adapterName?: string;
  isWebGpu: boolean;
  supported: boolean;
  notes?: string;
}

export interface ModelProgressUpdate {
  status: 'progress' | 'ready' | 'initiate' | 'done';
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}

export interface SegmentationResult {
  maskBuffer: Uint8ClampedArray;
  width: number;
  height: number;
  inferenceTimeMs: number;
  deviceUsed: 'webgpu' | 'wasm';
  qualityMode: QualityMode;
}

export interface ProcessedItem {
  id: string;
  file: File;
  name: string;
  size: number;
  originalUrl: string;
  width: number;
  height: number;
  status: ProcessingStatus;
  progress: number;
  statusText?: string;
  result?: {
    maskBuffer: Uint8ClampedArray;
    inferenceTimeMs: number;
    deviceUsed: 'webgpu' | 'wasm';
    qualityMode: QualityMode;
    transparentDataUrl: string;
    compositedDataUrl?: string;
  };
  error?: string;
}

export type ExportFormat = 'png' | 'jpeg' | 'webp';

export type BackgroundType = 'transparent' | 'color' | 'image';

export interface BackgroundSettings {
  type: BackgroundType;
  color: string;
  customImageUrl?: string;
  blur: number; // 0 to 20px
}

export interface CropSettings {
  autoCrop: boolean;
  padding: number; // in pixels
  aspectRatio?: 'original' | '1:1' | '4:3' | '16:9' | 'custom';
}

export interface ResizeSettings {
  enabled: boolean;
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  scalePercent: number;
}

export interface ExportOptions {
  format: ExportFormat;
  quality: number; // 0 to 1 for webp/jpeg
  background: BackgroundSettings;
  crop: CropSettings;
  resize: ResizeSettings;
  fileName: string;
}

export type SmartPresetId = 
  | 'profile-photo'
  | 'passport-photo'
  | 'ecommerce-product'
  | 'marketplace-listing'
  | 'social-media'
  | 'linkedin-avatar'
  | 'presentation-slide'
  | 'sticker-transparent';

export interface SmartPreset {
  id: SmartPresetId;
  name: string;
  description: string;
  iconName: string;
  format: ExportFormat;
  background: BackgroundSettings;
  crop: CropSettings;
  resize: ResizeSettings;
}

export type LanguageCode = 'en' | 'hi' | 'te';
