import api from '../lib/axios'

export const healthCheck = () => {
  return api.get('health')
    .then(res => res.data)
}