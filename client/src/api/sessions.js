import api from './axios';

// Get all sessions with filters & pagination
export const getSessions = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.skillArea) params.append('skillArea', filters.skillArea);
  if (filters.county) params.append('county', filters.county);
  if (filters.status) params.append('status', filters.status);
  if (filters.upcoming) params.append('upcoming', 'true');
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  
  return api.get(`/sessions?${params.toString()}`).then(res => res.data);
};

// Get single session
export const getSession = (id) =>
  api.get(`/sessions/${id}`).then(res => res.data.data);

// Create session (admin only)
export const createSession = (data) =>
  api.post('/sessions', data).then(res => res.data.data);

// Update session (admin only)
export const updateSession = (id, data) =>
  api.put(`/sessions/${id}`, data).then(res => res.data.data);

// Cancel session (admin only)
export const cancelSession = (id) =>
  api.delete(`/sessions/${id}`).then(res => res.data);

// Enrol in session (learner)
export const enrolInSession = (sessionId) =>
  api.post('/enrolments', { sessionId }).then(res => res.data.data);