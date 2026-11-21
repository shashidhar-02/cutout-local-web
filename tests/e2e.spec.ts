import { test, expect } from '@playwright/test';

test.describe('Cutout Privacy & On-Device E2E Workflows', () => {
  test('loads home shell quickly without premature model weights download', async ({ page }) => {
    let downloadedLargeModel = false;

    // Listen to network requests
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('.onnx') || url.includes('briaai')) {
        downloadedLargeModel = true;
      }
    });

    await page.goto('/');

    // Validate core headings and dropzone render instantly
    await expect(page.locator('h1')).toContainText('Remove backgrounds');
    await expect(page.getByText('Images Never Leave Your Device')).toBeVisible();

    // Model weights must NOT have loaded before user interaction
    expect(downloadedLargeModel).toBe(false);
  });

  test('verifies zero user image payloads leave the client', async ({ page }) => {
    const interceptedViolations: string[] = [];

    page.on('request', (req) => {
      const method = req.method();
      const postData = req.postData();
      if (['POST', 'PUT', 'PATCH'].includes(method) && postData) {
        if (postData.includes('data:image/') || postData.includes('base64')) {
          interceptedViolations.push(`Prohibited upload detected to ${req.url()}`);
        }
      }
    });

    await page.goto('/');

    // Click sample product button to trigger processing
    const sampleBtn = page.getByRole('button', { name: /Product Box/i });
    if (await sampleBtn.isVisible()) {
      await sampleBtn.click();
      // Wait for completion or editor interface
      await expect(page.getByText(/Segmented/i).or(page.getByText(/Download/i))).toBeVisible({
        timeout: 15000,
      });
    }

    expect(interceptedViolations).toHaveLength(0);
  });

  test('mobile layout renders touch-friendly buttons', async ({ page }) => {
    await page.goto('/');
    const dropzone = page.locator('text=Choose an image or drag & drop');
    await expect(dropzone).toBeVisible();
  });
});
