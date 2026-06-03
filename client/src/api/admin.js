import api from './axios'

export const getAdminStats = () => {
  return api.get('admin/stats')
    .then(res => res.data.data)
}

export const getAllUsers = (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.role) params.append('role', filters.role)
  if (filters.search) params.append('search', filters.search)
  if (filters.page) params.append('page', filters.page)
  if (filters.limit) params.append('limit', filters.limit)
  
  return api.get(`admin/users?${params.toString()}`)
    .then(res => res.data)
}

export const updateUserRole = (userId, newRole, approvalMessage = null, rejectionReason = null, isRejection = false) => {
  const data = { newRole, isRejection }
  if (approvalMessage) data.approvalMessage = approvalMessage
  if (rejectionReason) data.rejectionReason = rejectionReason
  
  return api.patch(`admin/users/${userId}/role`, data)
    .then(res => res.data.data)
}

export const getAllAnnouncements = (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.audience) params.append('audience', filters.audience)
  if (filters.fromDate) params.append('fromDate', filters.fromDate)
  if (filters.toDate) params.append('toDate', filters.toDate)
  if (filters.page) params.append('page', filters.page)
  if (filters.limit) params.append('limit', filters.limit)
  
  return api.get(`admin/announcements?${params.toString()}`)
    .then(res => res.data)
}

export const createAnnouncement = (announcementData) => {
  return api.post('admin/announcements', announcementData)
    .then(res => res.data.data)
}

export const updateAnnouncement = (id, announcementData) => {
  return api.put(`admin/announcements/${id}`, announcementData)
    .then(res => res.data.data)
}

export const deleteAnnouncement = (id) => {
  return api.delete(`admin/announcements/${id}`)
    .then(res => res.data)
}