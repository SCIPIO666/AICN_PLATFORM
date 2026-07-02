
import api from '@/lib/axios';

/**
 * Get my certificates (authenticated user)
 */
export const getMyCertificates = (filters = {}) => {
  return api.get('/certificates/me', { params: filters }).then(res => res.data);
};

/**
 * Get all certificates (Admin only)
 */
export const getAllCertificates = (filters = {}) => {
  return api.get('/certificates', { params: filters }).then(res => res.data);
};

/**
 * Get certificate statistics (Admin only)
 */
export const getCertificateStats = () => {
  return api.get('/certificates/stats').then(res => res.data);
};

/**
 * Verify a certificate (public)
 */
export const verifyCertificate = (certCode) => {
  return api.get(`/certificates/verify/${certCode}`).then(res => res.data);
};

/**
 * Issue a single certificate (Admin only)
 */
export const issueCertificate = (userId, sessionId) => {
  return api.post('/certificates', { userId, sessionId }).then(res => res.data);
};

/**
 * Batch issue certificates (Admin only)
 */
export const batchIssueCertificates = (sessionId) => {
  return api.post(`/certificates/batch/${sessionId}`).then(res => res.data);
};

/**
 * Download certificate PDF with progress support.
 */
export const downloadCertificatePdf = (certificateId, onDownloadProgress) => {
  return api.get(`/certificates/${certificateId}/download`, {
    responseType: 'blob',
    onDownloadProgress,
  });
};
