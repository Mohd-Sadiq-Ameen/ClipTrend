import api from './api';

export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

export async function signup(email, password) {
  const response = await api.post('/auth/signup', { email, password });
  return response.data;
}

export async function getAnalytics(domain, limit = 10, source = '') {
  let url = `/analytics?domain=${domain}&limit=${limit}`;
  if (source) url += `&source=${source}`;
  const response = await api.get(url);
  return response.data;
}

export async function askQuestion(domain, query = '', source = '') {
  const response = await api.post('/ask', { domain, query, source });
  return response.data;
}