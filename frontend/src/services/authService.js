// services/authService.js — Funciones de autenticación
import api from './api';

export const login = async (usuario, password) => {
  const { data } = await api.post('/auth/login', { usuario, password });
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const getStats = async () => {
  const { data } = await api.get('/auth/stats');
  return data;
};

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};
