# Security Policy

Cutout is designed from the foundation up to safeguard user data and preserve privacy through strictly client-side on-device computation.

---

## 1. Do Not Submit Sensitive Images

When opening issues, reporting edge-case artifacts, or submitting bug reports on GitHub:
- **Never upload confidential, personally identifiable, proprietary, or sensitive images to public issues.**
- If a segmentation artifact must be demonstrated, reproduce the issue using public domain test images or royalty-free stock photography.

---

## 2. Reporting Security Vulnerabilities

We take the security of Cutout and client data integrity seriously. If you identify a potential security issue, dependency vulnerability, or privacy leak:

1. **Do not create a public issue.**
2. Send a vulnerability disclosure report to our security maintainers via GitHub's private vulnerability reporting feature under the **Security** tab of this repository.
3. Include details of the vulnerability:
   - Nature of the issue (e.g., origin isolation, dependency vulnerability, network behavior)
   - Steps to reproduce
   - Potential impact
   - Proposed mitigation if known

We will acknowledge receipt within 48 hours and work with you on an expedited patch prior to coordinated public release.

---

## 3. Sandboxing & Runtime Isolation

- Web Workers execute in an isolated thread context.
- Model weights are loaded exclusively from verified repository endpoints or trusted model distribution points.
- Local browser cache access is scoped strictly to the application origin.
