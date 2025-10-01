// screens/SensorListScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import SensorItem from '../components/SensorItem';
import { sensorAPI } from '../services/apiService';

export default function SensorListScreen({ navigation }) {
  const [sensores, setSensores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // FUNÇÃO PARA AGRUPAR LEITURAS POR SENSOR E PEGAR A MAIS RECENTE
  const processarLeituras = (leituras) => {
    if (!leituras || leituras.length === 0) return [];

    // Agrupar leituras por sensorId
    const sensoresMap = new Map();

    leituras.forEach(leitura => {
      const sensorId = leitura.sensorId;

      if (!sensoresMap.has(sensorId)) {
        // Primeira vez vendo este sensor
        sensoresMap.set(sensorId, { ...leitura });
      } else {
        // Já existe este sensor, verificar se esta leitura é mais recente
        const sensorExistente = sensoresMap.get(sensorId);
        const timestampExistente = new Date(sensorExistente.timestamp);
        const timestampNova = new Date(leitura.timestamp);

        if (timestampNova > timestampExistente) {
          // Esta leitura é mais recente, atualizar o sensor
          sensoresMap.set(sensorId, { ...leitura });
        }
      }
    });

    // Converter Map para array
    return Array.from(sensoresMap.values());
  };

  const carregarSensores = async () => {
    try {
      setError(null);
      console.log('Carregando leituras do backend...');

      const leituras = await sensorAPI.getAllReadings();
      console.log('Leituras recebidas:', leituras.length);

      if (!leituras || leituras.length === 0) {
        setError('Nenhuma leitura encontrada no backend');
        setSensores([]);
      } else {
        // Processar leituras para agrupar por sensor
        const sensoresProcessados = processarLeituras(leituras);
        console.log('Sensores processados:', sensoresProcessados.length);
        setSensores(sensoresProcessados);
      }
    } catch (error) {
      console.error('Erro ao carregar sensores:', error);
      setError(`Falha na conexão: ${error.message}`);
      setSensores([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarSensores();
  };

  useEffect(() => {
    carregarSensores();
  }, []);

  const testarConexao = async () => {
    try {
      Alert.alert(
        'Informações de Debug',
        `Total de sensores: ${sensores.length}\n\nCada sensor deve aparecer apenas UMA vez, mostrando sua leitura mais recente.`
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível verificar a configuração');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando sensores do backend...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={testarConexao}
          >
            <Text style={styles.smallButtonText}>Ver Debug</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.configButton}
            onPress={() => navigation.navigate('Configuração de Conexão')}
          >
            <Text style={styles.configButtonText}>Configurar Conexão</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CABEÇALHO INFORMATIVO */}
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>Sensores ({sensores.length})</Text>
        <Text style={styles.headerSubtitle}>
          Mostrando leitura mais recente de cada sensor
        </Text>
      </View>

      <FlatList
        data={sensores}
        keyExtractor={(item) => `${item.sensorId}-${item.timestamp}`}
        renderItem={({ item }) => (
          <SensorItem
            sensor={item}
            onPress={() => navigation.navigate('Detalhes', { sensor: item })}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !error && (
            <View style={styles.center}>
              <Text>Nenhum sensor encontrado no backend</Text>
              <TouchableOpacity style={styles.button} onPress={carregarSensores}>
                <Text style={styles.buttonText}>Recarregar</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {sensores.length} sensor(es) único(s) encontrado(s)
        </Text>
        <TouchableOpacity
          style={styles.configButton}
          onPress={() => navigation.navigate('Configuração de Conexão')}
        >
          <Text style={styles.configButtonText}>Configuração de Conexão</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  headerInfo: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#bbdefb'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    textAlign: 'center'
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#1976D2',
    textAlign: 'center',
    marginTop: 4
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336'
  },
  errorText: {
    color: '#c62828',
    marginBottom: 10,
    textAlign: 'center'
  },
  footer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  footerText: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
    fontSize: 12
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  smallButton: {
    backgroundColor: '#FF9800',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  smallButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  configButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  configButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});