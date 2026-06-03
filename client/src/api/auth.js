import api from './axios'

export const login = (email, password) => {
  return api.post('auth/login', { email, password })
    .then(res => res.data.data)
}

export const logout = () => {
  return api.post('auth/signout')
    .then(res => res.data)
}

export const signup = (userData) => {
  return api.post('auth/signup', userData)
    .then(res => res.data.data)
}

export const forgotPassword = (email) => {
  return api.post('auth/forgot-password', { email })
    .then(res => res.data)
}

export const resetPassword = (token, newPassword, confirmPassword) => {
  return api.post('auth/reset-password', { token, newPassword, confirmPassword })
    .then(res => res.data)
}

export const changePassword = (currentPassword, newPassword, confirmPassword) => {
  return api.post('auth/change-password', { currentPassword, newPassword, confirmPassword })
    .then(res => res.data)
}

export const getMe = () => {
  return api.get('auth/me')
    .then(res => res.data.data.user)
}

export const refreshToken = (token) => {
  return api.post('auth/refresh-token', { token })
    .then(res => res.data.data)
}