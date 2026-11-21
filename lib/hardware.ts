import { HardwareInfo } from './types';

/**
 * Probes the client browser environment for WebGPU and WebAssembly support.
 * Returns hardware details and fallback guidance.
 */
export async function detectHardwareCapabilities(): Promise<HardwareInfo> {
  // Check for basic browser environment
  if (typeof window === 'undefined') {
    return {
      mode: 'unsupported',
      isWebGpu: false,
      supported: false,
      notes: 'Server-side execution is disabled. Processing is client-side only.',
    };
  }

  // Check WebAssembly support
  const hasWasm = typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function';
  if (!hasWasm) {
    return {
      mode: 'unsupported',
      isWebGpu: false,
      supported: false,
      notes: 'Your browser does not support WebAssembly, which is required for local inference.',
    };
  }

  // Check WebGPU availability safely with runtime check
  const navAny = navigator as any;
  if ('gpu' in navAny && navAny.gpu && typeof navAny.gpu.requestAdapter === 'function') {
    try {
      const adapter = await navAny.gpu.requestAdapter({
        powerPreference: 'high-performance',
      });

      if (adapter) {
        let adapterName = 'WebGPU Compatible Adapter';
        try {
          const info = 'requestAdapterInfo' in adapter
            ? await adapter.requestAdapterInfo()
            : adapter.info;

          if (info && (info.description || info.vendor)) {
            adapterName = [info.vendor, info.architecture, info.description].filter(Boolean).join(' ');
          }
        } catch {
          // Ignore adapter detail permissions, WebGPU is still active
        }

        return {
          mode: 'webgpu',
          isWebGpu: true,
          supported: true,
          adapterName,
          notes: 'High-performance WebGPU hardware acceleration detected.',
        };
      }
    } catch (err) {
      console.warn('WebGPU adapter query failed; falling back to WebAssembly.', err);
    }
  }

  // Fallback to WASM CPU inference
  return {
    mode: 'wasm',
    isWebGpu: false,
    supported: true,
    adapterName: 'CPU via WebAssembly (WASM)',
    notes: 'WebGPU is not active in this browser. Running via optimized multi-threaded WASM.',
  };
}
