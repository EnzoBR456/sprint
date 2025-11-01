// services/apiService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

let API_BASE_URL = 'http://localhost:8080';

// === CONFIGURAÇÃO DA URL BASE ===
export const setApiBaseUrl = async (url) => {
  API_BASE_URL = url;
  await AsyncStorage.setItem('apiBaseUrl', url);
};

export const getApiBaseUrl = async () => {
  try {
    const savedUrl = await AsyncStorage.getItem('apiBaseUrl');
    return savedUrl || API_BASE_URL;
  } catch (error) {
    console.error('Erro ao carregar URL:', error);
    return API_BASE_URL;
  }
};

// === HEADERS DE AUTENTICAÇÃO ===
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('jwtToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// === ENDPOINTS ===
export const sensorAPI = {
  // 🔹 Buscar todas as leituras
  getAllReadings: async () => {
    const baseUrl = await getApiBaseUrl();
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}/api/readings`, { headers });

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  },

  // 🔹 Buscar leituras de um sensor específico
  getSensorReadings: async (sensorId) => {
    const baseUrl = await getApiBaseUrl();
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}/api/readings/sensor/${sensorId}`, { headers });

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  },

  // 🔹 Criar uma nova leitura
  createReading: async (readingData) => {
    const baseUrl = await getApiBaseUrl();
    const headers = {
      ...(await getAuthHeaders()),
      'Content-Type': 'application/json',
    };

    const response = await fetch(`${baseUrl}/api/readings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(readingData),
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  },

  // 🔹 Criar um novo sensor
  addSensor: async (sensorData) => {
    const baseUrl = await getApiBaseUrl();
    const headers = {
      ...(await getAuthHeaders()),
      'Content-Type': 'application/json',
    };

    console.log('Enviando novo sensor:', sensorData);

    const response = await fetch(`${baseUrl}/api/readings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(sensorData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao adicionar sensor:', errorText);
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    return await response.json();
  },
};
