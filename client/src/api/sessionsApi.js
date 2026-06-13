import api from '../lib/axios'

export const getSessions = (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.upcoming) params.append('upcoming', filters.upcoming)
  if (filters.status) params.append('status', filters.status)
  if (filters.skillArea) params.append('skillArea', filters.skillArea)
  if (filters.locationType) params.append('locationType', filters.locationType)
  if (filters.county) params.append('county', filters.county)
  if (filters.trainerId) params.append('trainerId', filters.trainerId)
  if (filters.fromDate) params.append('fromDate', filters.fromDate)
  if (filters.toDate) params.append('toDate', filters.toDate)
  if (filters.page) params.append('page', filters.page)
  if (filters.limit) params.append('limit', filters.limit)
  
  return api.get(`sessions?${params.toString()}`)
    .then(res => res.data)
}



export const getSessionById = (id) => {
  return api.get(`sessions/${id}`)
    .then(res => res.data.data)
}

export const createSession = (sessionData) => {
  return api.post('sessions', sessionData)
    .then(res => res.data.data)
}

export const updateSession = (id, sessionData) => {
  return api.put(`sessions/${id}`, sessionData)
    .then(res => res.data.data)
}

export const cancelSession = (id) => {
  return api.delete(`sessions/${id}`)
    .then(res => res.data)
}

