import api from './axios'

export const getMyCertificates = (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.page) params.append('page', filters.page)
  if (filters.limit) params.append('limit', filters.limit)
  
  return api.get(`certificates/me?${params.toString()}`)
    .then(res => res.data)
}

export const verifyCertificate = (certificateCode) => {
  return api.get(`certificates/verify/${certificateCode}`)
    .then(res => res.data.data)
}

export const issueCertificate = (userId, sessionId) => {
  return api.post('certificates', { userId, sessionId })
    .then(res => res.data.data)
}

export const batchIssueCertificates = (sessionId) => {
  return api.post(`certificates/batch/${sessionId}`)
    .then(res => res.data.data)
}