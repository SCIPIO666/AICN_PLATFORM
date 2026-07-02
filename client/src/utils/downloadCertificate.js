import { downloadCertificatePdf } from '@/api/certificates';

function safeFilename(value) {
  return String(value || 'certificate')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-');
}

export async function downloadCertificateFile(certificate, onProgress) {
  if (!certificate?.id) {
    throw new Error('Certificate is missing an ID');
  }

  const response = await downloadCertificatePdf(certificate.id, (event) => {
    if (!event.total) {
      onProgress?.(null);
      return;
    }

    onProgress?.(Math.round((event.loaded * 100) / event.total));
  });

  const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = safeFilename(`${certificate.certCode || certificate.id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
