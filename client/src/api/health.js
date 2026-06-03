import api from './axios'

export const healthCheck = () => {
  return api.get('health')
    .then(res => res.data)
}