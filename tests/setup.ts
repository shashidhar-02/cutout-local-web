import { vi } from 'vitest';

// Setup mock environment for browser APIs when running under Node/JSDOM
if (typeof window !== 'undefined') {
  // Mock URL.createObjectURL and revokeObjectURL
  window.URL.createObjectURL = vi.fn(() => 'blob:mock-image-preview-url');
  window.URL.revokeObjectURL = vi.fn();

  // Mock HTMLCanvasElement.getContext
  HTMLCanvasElement.prototype.getContext = vi.fn(function (contextId: string) {
    if (contextId === '2d') {
      return {
        drawImage: vi.fn(),
        getImageData: vi.fn((x: number, y: number, w: number, h: number) => ({
          data: new Uint8ClampedArray(w * h * 4).fill(255),
          width: w,
          height: h,
        })),
        putImageData: vi.fn(),
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        fillStyle: '',
        filter: '',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      } as any;
    }
    return null;
  }) as any;

  // Mock canvas toBlob
  HTMLCanvasElement.prototype.toBlob = vi.fn(function (callback: (blob: Blob | null) => void, type?: string) {
    callback(new Blob(['mock-binary-data'], { type: type || 'image/png' }));
  });
}
