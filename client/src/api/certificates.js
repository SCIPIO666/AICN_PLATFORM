// import api from '../lib/axios'

// export const getMyCertificates = (filters = {}) => {
//   const params = new URLSearchParams()
//   if (filters.page) params.append('page', filters.page)
//   if (filters.limit) params.append('limit', filters.limit)
  
//   return api.get(`certificates/me?${params.toString()}`)
//     .then(res => res.data.data)
// }

// export const verifyCertificate = (certificateCode) => {
//   return api.get(`certificates/verify/${certificateCode}`)
//     .then(res => res.data.data)
// }

// export const issueCertificate = (userId, sessionId) => {
//   return api.post('certificates', { userId, sessionId })
//     .then(res => res.data.data)
// }

// export const batchIssueCertificates = (sessionId) => {
//   return api.post(`certificates/batch/${sessionId}`)
//     .then(res => res.data.data)
// }

// export const getAllCertificates = (filters = {}) => {
//   return api.get('/certificates', { params: filters });
// };

// export const getCertificateStats = () => {
//   return api.get('/certificates/stats');
// };

// src/api/certificates.js
import api from '@/lib/axios';

/**
 * Get all certificates (Admin only)
 */
export const getAllCertificates = (filters = {}) => {
  return api.get('/certificates', { params: filters });
};

/**
 * Get certificate statistics (Admin only)
 */
export const getCertificateStats = () => {
  return api.get('/certificates/stats');
};

/**
 * Get my certificates
 */
export const getMyCertificates = (filters = {}) => {
  return api.get('/certificates/me', { params: filters });
};

/**
 * Verify a certificate (public)
 */
export const verifyCertificate = (certCode) => {
  return api.get(`/certificates/verify/${certCode}`);
};

/**
 * Issue a single certificate (Admin only)
 */
export const issueCertificate = (userId, sessionId) => {
  return api.post('/certificates', { userId, sessionId });
};

/**
 * Batch issue certificates (Admin only)
 */
export const batchIssueCertificates = (sessionId) => {
  return api.post(`/certificates/batch/${sessionId}`);
};