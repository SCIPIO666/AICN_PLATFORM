import api from './axios'

export const enrolInSession = (sessionId) => {
  return api.post('enrolments', { sessionId })
    .then(res => res.data.data)
}

export const getMyEnrolments = (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.status) params.append('status', filters.status)
  if (filters.fromDate) params.append('fromDate', filters.fromDate)
  if (filters.toDate) params.append('toDate', filters.toDate)
  if (filters.page) params.append('page', filters.page)
  if (filters.limit) params.append('limit', filters.limit)
  
  return api.get(`enrolments/me?${params.toString()}`)
    .then(res => res.data)
}

export const markAttendance = (enrolmentId, status) => {
  return api.patch(`enrolments/${enrolmentId}/attend`, { status })
    .then(res => res.data.data)
}

export const cancelEnrolment = (enrolmentId, reason = null) => {
  const data = reason ? { reason } : {}
  return api.patch(`enrolments/${enrolmentId}/cancel`, data)
    .then(res => res.data.data)
}