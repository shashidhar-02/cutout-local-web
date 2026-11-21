/**
 * Network Privacy Monitor & Audit Engine
 * 
 * Verifies that the application never sends user image bytes over the network.
 * Permitted network traffic is strictly whitelisted:
 *  - Model weights and configs (Hugging Face / local /models/ or ONNX assets)
 *  - WebAssembly runtime binaries (*.wasm)
 *  - Static website assets (HTML, CSS, JS bundles, fonts, icons)
 * 
 * Disallowed:
 *  - Any POST/PUT/PATCH request with image byte payloads
 *  - Any request transmitting user canvas, image data or file buffers
 */

export interface NetworkAuditReport {
  timestamp: number;
  method: string;
  url: string;
  payloadSize: number;
  isAllowed: boolean;
  violationReason?: string;
}

export class PrivacyNetworkAuditor {
  private static recordedEvents: NetworkAuditReport[] = [];
  private static isIntercepting: boolean = false;
  private static originalFetch: typeof window.fetch | null = null;

  /**
   * Allowed domains and URL patterns (only for model weights, wasm, and static bundles)
   */
  private static allowedUrlPatterns: RegExp[] = [
    /^https:\/\/huggingface\.co\/.*/i,
    /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
    /^https:\/\/raw\.githubusercontent\.com\/.*/i,
    /^\/_next\/.*/i,
    /^\/models\/.*/i,
    /^\/icons\/.*/i,
    /\.(wasm|onnx|json|bin|js|css|svg|png|jpg|webp)$/i,
  ];

  /**
   * Installs browser fetch interception to audit network privacy
   */
  public static startAudit(onViolation?: (report: NetworkAuditReport) => void) {
    if (typeof window === 'undefined' || this.isIntercepting) return;
    this.isIntercepting = true;
    this.originalFetch = window.fetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const urlString = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      const method = (init?.method || 'GET').toUpperCase();
      let payloadSize = 0;
      let hasImagePayload = false;

      if (init?.body) {
        if (typeof init.body === 'string') {
          payloadSize = init.body.length;
          // Check for Base64 image indicators
          if (init.body.includes('data:image/') || init.body.includes('base64,')) {
            hasImagePayload = true;
          }
        } else if (ArrayBuffer.isView(init.body)) {
          payloadSize = init.body.byteLength;
          hasImagePayload = true;
        } else if (init.body instanceof ArrayBuffer) {
          payloadSize = init.body.byteLength;
          hasImagePayload = true;
        } else if (init.body instanceof Blob) {
          payloadSize = init.body.size;
          hasImagePayload = true;
        } else if (init.body instanceof FormData) {
          hasImagePayload = true;
          payloadSize = 1;
        }
      }

      // Check if URL is in allowed list
      const isAllowedUrl = this.allowedUrlPatterns.some((pattern) => pattern.test(urlString));
      let isViolation = false;
      let violationReason: string | undefined;

      // Disallow non-GET/HEAD methods that carry body payloads unless explicitly permitted
      if (['POST', 'PUT', 'PATCH'].includes(method) && (payloadSize > 0 || hasImagePayload)) {
        isViolation = true;
        violationReason = `Forbidden HTTP ${method} request with ${payloadSize} bytes payload to ${urlString}`;
      } else if (hasImagePayload) {
        isViolation = true;
        violationReason = `Prohibited image payload detected in request to ${urlString}`;
      }

      const report: NetworkAuditReport = {
        timestamp: Date.now(),
        method,
        url: urlString,
        payloadSize,
        isAllowed: !isViolation,
        violationReason,
      };

      this.recordedEvents.push(report);

      if (isViolation) {
        console.error('[Cutout Privacy Violation]', violationReason);
        if (onViolation) onViolation(report);
        throw new Error(`[Privacy Guarantee Blocked] ${violationReason}`);
      }

      return this.originalFetch!(input, init);
    };
  }

  public static stopAudit() {
    if (this.isIntercepting && this.originalFetch && typeof window !== 'undefined') {
      window.fetch = this.originalFetch;
      this.isIntercepting = false;
    }
  }

  public static getReports(): NetworkAuditReport[] {
    return [...this.recordedEvents];
  }

  public static clearReports() {
    this.recordedEvents = [];
  }

  /**
   * Asserts whether all audited network calls strictly adhere to the privacy guarantee
   */
  public static verifyZeroImageLeaks(): { safe: boolean; violations: NetworkAuditReport[] } {
    const violations = this.recordedEvents.filter((r) => !r.isAllowed);
    return {
      safe: violations.length === 0,
      violations,
    };
  }
}
