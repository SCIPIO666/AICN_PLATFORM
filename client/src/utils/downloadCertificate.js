// src/utils/downloadCertificate.js - Simple version

function safeFilename(value) {
  return String(value || 'certificate')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-');
}

export async function downloadCertificateFile(certificate, onProgress) {
  if (!certificate?.pdfUrl) {
    throw new Error('Certificate PDF not available');
  }

  try {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = certificate.pdfUrl;
    link.download = safeFilename(`${certificate.certCode || certificate.id}.pdf`);
    link.target = '_blank';
    
    // Append, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // If progress callback provided, notify completion
    if (onProgress) {
      onProgress(100);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Download error:', error);
    throw new Error('Failed to download certificate');
  }
}