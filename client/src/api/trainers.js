import api from '../lib/axios'

export const getTrainers = (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.skill) params.append('skill', filters.skill)
  if (filters.search) params.append('search', filters.search)
  if (filters.page) params.append('page', filters.page)
  if (filters.limit) params.append('limit', filters.limit)
  
  return api.get(`trainers?${params.toString()}`)
    .then(res => res.data)
}

export const applyForTrainer = (applicationData) => {
  return api.post('trainers/apply', applicationData)
    .then(res => res.data.data)
}

export const getMyTrainerProfile = () => {
  return api.get('trainers/me')
    .then(res => res.data.data)
}

export const updateMyTrainerProfile = (profileData) => {
  return api.patch('trainers/me', profileData)
    .then(res => res.data.data)
}

export const withdrawTrainerApplication = () => {
  return api.delete('trainers/me')
    .then(res => res.data)
}

export const getMyTrainerSessions = (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.status) params.append('status', filters.status)
  if (filters.fromDate) params.append('fromDate', filters.fromDate)
  if (filters.toDate) params.append('toDate', filters.toDate)
  if (filters.page) params.append('page', filters.page)
  if (filters.limit) params.append('limit', filters.limit)
  
  return api.get(`trainers/me/sessions?${params.toString()}`)
    .then(res => res.data)
}

// Admin only endpoints
export const getAllTrainerApplications = (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.status) params.append('status', filters.status)
  if (filters.skill) params.append('skill', filters.skill)
  if (filters.search) params.append('search', filters.search)
  if (filters.page) params.append('page', filters.page)
  if (filters.limit) params.append('limit', filters.limit)
  
  return api.get(`trainers/admin/applications?${params.toString()}`)
    .then(res => res.data)
}

export const getTrainerApplicationById = (applicationId) => {
  return api.get(`trainers/admin/applications/${applicationId}`)
    .then(res => res.data.data)
}

export const approveTrainerApplication = (applicationId, message = null) => {
  const data = message ? { message } : {}
  return api.patch(`trainers/admin/applications/${applicationId}/approve`, data)
    .then(res => res.data.data)
}

export const rejectTrainerApplication = (applicationId, reason = null, feedback = null) => {
  const data = {}
  if (reason) data.reason = reason
  if (feedback) data.feedback = feedback
  return api.patch(`trainers/admin/applications/${applicationId}/reject`, data)
    .then(res => res.data.data)
}

export const deleteTrainerApplication = (applicationId) => {
  return api.delete(`trainers/admin/applications/${applicationId}`)
    .then(res => res.data)
}