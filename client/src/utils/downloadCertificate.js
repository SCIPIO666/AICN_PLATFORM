import { downloadCertificatePdf } from '@/api/certificates';

function safeFilename(value) {
  return String(value || 'certificate')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Download a certificate PDF.
 *
 * Flow:
 *   1. axios GET /certificates/:id/download  →  responseType: 'blob'
 *   2. Server auth-checks ownership/admin, fetches PDF from Cloudinary,
 *      and pipes the bytes back with Content-Disposition: attachment.
 *   3. axios collects the response as a Blob.
 *   4. We create a same-origin blob: URL from it.
 *   5. We programmatically click a hidden <a download="filename.pdf">
 *      pointing at the blob URL — link.download works because blob: URLs
 *      are treated as same-origin by the browser.
 *   6. We revoke the blob URL immediately after the click to free memory.
 *
 * Progress tracking works because the bytes flow through the server and
 * axios can measure them via onDownloadProgress.
 *
 * @param {Object}   certificate  - Certificate object: { id, certCode, ... }
 * @param {Function} onProgress   - Called with 0-100 (or null if no content-length)
 */
export async function downloadCertificateFile(certificate, onProgress) {
  if (!certificate?.id) {
    throw new Error('Certificate is missing an ID');
  }

  const response = await downloadCertificatePdf(certificate.id, (event) => {
    if (!event.total) {
      onProgress?.(null); // indeterminate — server didn't send Content-Length
      return;
    }
    onProgress?.(Math.round((event.loaded * 100) / event.total));
  });

  // Build a same-origin blob: URL so link.download is respected by the browser
  const blob = new Blob([response.data], {
    type: response.headers['content-type'] || 'application/pdf',
  });

  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = safeFilename(`${certificate.certCode || certificate.id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Free the blob from memory — the browser has queued the download by now
  window.URL.revokeObjectURL(blobUrl);
}