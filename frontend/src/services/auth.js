import api from './api';

export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

export async function signup(email, password) {
  const response = await api.post('/auth/signup', { email, password });
  return response.data;
}

export async function getAnalytics(domain, limit = 10) {
  const response = await api.get(`/analytics?domain=${domain}&limit=${limit}`);
  return response.data;
}

export async function askQuestion(domain, query) {
  const response = await api.post('/ask', { domain, query });
  return response.data;
}