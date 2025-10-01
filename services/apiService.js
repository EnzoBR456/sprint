// services/apiService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração inicial
let API_BASE_URL = 'http://localhost:8080';

export const setApiBaseUrl = async (url) => {
  API_BASE_URL = url;
  await AsyncStorage.setItem('apiBaseUrl', url);
};

export const getApiBaseUrl = async () => {
  try {
    const savedUrl = await AsyncStorage.getItem('apiBaseUrl');
    return savedUrl || 'http://localhost:8080';
  } catch (error) {
    console.error('Erro ao carregar URL:', error);
    return 'http://localhost:8080';
  }
};

// Serviços para suas rotas específicas
export const sensorAPI = {
  // GET todas as leituras
  getAllReadings: async () => {
    try {
      const baseUrl = await getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/readings`);
      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar leituras:', error);
      throw error;
    }
  },

  // GET leituras por sensor (para o gráfico)
  getSensorReadings: async (sensorId) => {
    try {
      const baseUrl = await getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/readings/sensor/${sensorId}`);
      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar leituras do sensor ${sensorId}:`, error);
      throw error;
    }
  },

  // POST nova leitura
  createReading: async (readingData) => {
    try {
      const baseUrl = await getApiBaseUrl();
      const payload = {
        sensorId: readingData.sensorId,
        nome: readingData.nome || `Sensor ${readingData.sensorId}`,
        readingValue: readingData.readingValue,
        status: readingData.status || 'OK'
      };

      const response = await fetch(`${baseUrl}/api/readings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar leitura:', error);
      throw error;
    }
  }
};