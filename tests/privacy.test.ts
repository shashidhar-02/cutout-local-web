import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PrivacyNetworkAuditor } from '../lib/network-interceptor';
import { SegmentationClient } from '../lib/segmentation-client';

describe('Privacy Network Auditor & Zero-Upload Guarantee', () => {
  beforeEach(() => {
    PrivacyNetworkAuditor.clearReports();
    PrivacyNetworkAuditor.startAudit();
  });

  afterEach(() => {
    PrivacyNetworkAuditor.stopAudit();
  });

  it('permits downloading model weights and static assets', async () => {
    // Mock the underlying original fetch to return successful response
    const mockFetch = vi.fn().mockResolvedValue(new Response('model-weights-binary'));
    (PrivacyNetworkAuditor as any).originalFetch = mockFetch;

    // Legitimate model file and static requests
    await fetch('https://huggingface.co/briaai/RMBG-1.4/resolve/main/onnx/model.onnx');
    await fetch('/models/rmbg-1.4.onnx');
    await fetch('/_next/static/chunks/app.js');

    const reports = PrivacyNetworkAuditor.getReports();
    expect(reports.length).toBe(3);
    expect(reports.every((r) => r.isAllowed)).toBe(true);
    expect(PrivacyNetworkAuditor.verifyZeroImageLeaks().safe).toBe(true);
  });

  it('strictly blocks any HTTP POST attempt carrying image bytes', async () => {
    const fakeImageBuffer = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]); // PNG magic bytes

    await expect(
      fetch('https://some-remote-api.com/upload', {
        method: 'POST',
        body: fakeImageBuffer,
      })
    ).rejects.toThrow(/Forbidden HTTP POST request/);

    const audit = PrivacyNetworkAuditor.verifyZeroImageLeaks();
    expect(audit.safe).toBe(false);
    expect(audit.violations.length).toBeGreaterThan(0);
  });

  it('strictly blocks any HTTP request containing base64 data URLs', async () => {
    await expect(
      fetch('https://analytics.example.com/log', {
        method: 'POST',
        body: JSON.stringify({ image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...' }),
      })
    ).rejects.toThrow(/Forbidden HTTP POST request/);

    const audit = PrivacyNetworkAuditor.verifyZeroImageLeaks();
    expect(audit.safe).toBe(false);
  });

  it('ensures local image segmentation execution triggers zero external data transmissions', async () => {
    const client = SegmentationClient.getInstance();

    // Perform segmentation on a test image buffer
    const result = await client.removeBackground('data:image/png;base64,mockImage', 64, 64);

    expect(result).toBeDefined();
    expect(result.width).toBe(64);
    expect(result.height).toBe(64);
    expect(result.maskBuffer.length).toBe(64 * 64);

    // Verify zero illegal outgoing network traffic occurred
    const audit = PrivacyNetworkAuditor.verifyZeroImageLeaks();
    expect(audit.safe).toBe(true);
    expect(audit.violations).toHaveLength(0);
  });
});
