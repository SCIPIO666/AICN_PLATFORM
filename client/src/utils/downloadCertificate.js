
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
    let downloadUrl = certificate.pdfUrl;
    
    if (downloadUrl.includes('?')) {
      downloadUrl += '&fl_attachment';
    } else {
      downloadUrl += '?fl_attachment';
    }

    const filename = `certificate-${certificate.certCode || certificate.id}.pdf`;
    downloadUrl += `&filename=${encodeURIComponent(filename)}`;

    const response = await fetch(downloadUrl, {
      method: 'GET',
      credentials: 'include', 
      headers: {
        'Accept': 'application/pdf',
      },
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    
    const reader = response.body.getReader();
    const chunks = [];
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;
      
      if (total > 0 && onProgress) {
        onProgress(Math.round((loaded * 100) / total));
      }
    }

    // Create download
    const blob = new Blob(chunks, { 
      type: response.headers.get('content-type') || 'application/pdf' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = safeFilename(`${certificate.certCode || certificate.id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    if (onProgress) {
      onProgress(100);
    }

    return { success: true };
  } catch (error) {
    console.error('Download error:', error);
    throw new Error(error.message || 'Failed to download certificate');
  }
}