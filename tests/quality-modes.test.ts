import { describe, it, expect } from 'vitest';
import { SegmentationClient } from '../lib/segmentation-client';

describe('Quality Modes & Processing Settings', () => {
  it('supports fast, balanced, and quality execution', async () => {
    const client = SegmentationClient.getInstance();

    const fastResult = await client.removeBackground('mock-data-uri', 100, 100, 'fast');
    expect(fastResult.qualityMode).toBe('fast');
    expect(fastResult.maskBuffer.length).toBe(100 * 100);

    const balancedResult = await client.removeBackground('mock-data-uri', 100, 100, 'balanced');
    expect(balancedResult.qualityMode).toBe('balanced');

    const qualityResult = await client.removeBackground('mock-data-uri', 100, 100, 'quality');
    expect(qualityResult.qualityMode).toBe('quality');
  });
});
