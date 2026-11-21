import { describe, it, expect } from 'vitest';
import { SMART_PRESETS } from '../lib/presets';

describe('Smart Export Presets', () => {
  it('defines all required user presets', () => {
    const presetIds = SMART_PRESETS.map((p) => p.id);
    expect(presetIds).toContain('profile-photo');
    expect(presetIds).toContain('passport-photo');
    expect(presetIds).toContain('ecommerce-product');
    expect(presetIds).toContain('marketplace-listing');
    expect(presetIds).toContain('social-media');
    expect(presetIds).toContain('linkedin-avatar');
    expect(presetIds).toContain('presentation-slide');
    expect(presetIds).toContain('sticker-transparent');
  });

  it('configures e-commerce product preset with square aspect and clean margin', () => {
    const ecommerce = SMART_PRESETS.find((p) => p.id === 'ecommerce-product')!;
    expect(ecommerce.format).toBe('png');
    expect(ecommerce.crop.aspectRatio).toBe('1:1');
    expect(ecommerce.crop.autoCrop).toBe(true);
    expect(ecommerce.crop.padding).toBeGreaterThanOrEqual(20);
    expect(ecommerce.resize.width).toBe(1000);
    expect(ecommerce.resize.height).toBe(1000);
  });

  it('configures passport preparation preset with standard framing', () => {
    const passport = SMART_PRESETS.find((p) => p.id === 'passport-photo')!;
    expect(passport.crop.aspectRatio).toBe('1:1');
    expect(passport.background.type).toBe('color');
    expect(passport.background.color).toBe('#ffffff');
    expect(passport.resize.width).toBe(600);
    expect(passport.resize.height).toBe(600);
  });
});
