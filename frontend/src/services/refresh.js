import api from './api';

export async function refreshData(domain = 'general') {
  const response = await api.post('/refresh', { domain });
  return response.data;
}