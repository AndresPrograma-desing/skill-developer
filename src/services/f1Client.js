import axios from 'axios';
import { F1_API } from '../../script/config';

export const jolpicaClient = axios.create({
  baseURL: F1_API.jolpica.baseUrl,
  timeout: 15000,
  headers: { Accept: 'application/json' },
});

jolpicaClient.interceptors.response.use(
  response => response.data,
  error => {
    if (error.request && !error.response) {
      return Promise.reject(new Error('No se pudo conectar con la API de Fórmula 1.'));
    }
    return Promise.reject(error);
  }
);

export const openF1Client = axios.create({
  baseURL: F1_API.openF1.baseUrl,
  timeout: 15000,
  headers: { Accept: 'application/json' },
});

openF1Client.interceptors.response.use(
  response => response.data,
  error => {
    if (error.request && !error.response) {
      return Promise.reject(new Error('No se pudo conectar con la API de telemetría OpenF1.'));
    }
    return Promise.reject(error);
  }
);
