import { describe, it, expect } from 'vitest';
import {
  calculateBoundingBox,
  renderFinalComposition,
  createCompatibleCanvas,
} from '../lib/image-processing';

describe('Image Processing & Auto-Crop Utilities', () => {
  it('correctly calculates bounding box around foreground mask pixels', () => {
    const width = 10;
    const height = 10;
    const maskBuffer = new Uint8ClampedArray(width * height).fill(0);

    // Place a 4x4 non-zero subject in the center (x: 3..6, y: 3..6)
    for (let y = 3; y <= 6; y++) {
      for (let x = 3; x <= 6; x++) {
        maskBuffer[y * width + x] = 255;
      }
    }

    const bbox = calculateBoundingBox(maskBuffer, width, height, 10, 0);

    expect(bbox.x).toBe(3);
    expect(bbox.y).toBe(3);
    expect(bbox.width).toBe(4);
    expect(bbox.height).toBe(4);
  });

  it('respects padding when calculating auto-crop bounding box', () => {
    const width = 20;
    const height = 20;
    const maskBuffer = new Uint8ClampedArray(width * height).fill(0);

    // Subject at 10..12
    for (let y = 10; y <= 12; y++) {
      for (let x = 10; x <= 12; x++) {
        maskBuffer[y * width + x] = 255;
      }
    }

    const padding = 2;
    const bbox = calculateBoundingBox(maskBuffer, width, height, 10, padding);

    expect(bbox.x).toBe(8);
    expect(bbox.y).toBe(8);
    expect(bbox.width).toBe(7);
    expect(bbox.height).toBe(7);
  });

  it('handles fully empty masks without out-of-bounds error', () => {
    const width = 10;
    const height = 10;
    const emptyMask = new Uint8ClampedArray(width * height).fill(0);

    const bbox = calculateBoundingBox(emptyMask, width, height, 10, 0);

    expect(bbox.x).toBe(0);
    expect(bbox.y).toBe(0);
    expect(bbox.width).toBe(width);
    expect(bbox.height).toBe(height);
  });

  it('renders final composition canvas with solid background color', async () => {
    const canvas = createCompatibleCanvas(100, 100);

    const result = await renderFinalComposition(
      canvas,
      { type: 'color', color: '#ff0000', blur: 0 },
      { autoCrop: false, padding: 0 },
      { enabled: false, width: 100, height: 100, maintainAspectRatio: true, scalePercent: 100 }
    );

    expect(result).toBeDefined();
    expect(result.width).toBe(100);
    expect(result.height).toBe(100);
  });

  it('resizes composition canvas when resize settings are applied', async () => {
    const canvas = createCompatibleCanvas(200, 100);

    const result = await renderFinalComposition(
      canvas,
      { type: 'transparent', color: '', blur: 0 },
      { autoCrop: false, padding: 0 },
      { enabled: true, width: 400, height: 200, maintainAspectRatio: true, scalePercent: 100 }
    );

    expect(result.width).toBe(400);
    expect(result.height).toBe(200);
  });
});
