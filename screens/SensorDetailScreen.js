// screens/SensorDetailScreen.js
import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { sensorAPI } from "../services/apiService";

export default function SensorDetailScreen({ route, navigation }) {
  const { sensor: initialSensor } = route.params;

  const [currentSensor, setCurrentSensor] = useState(initialSensor);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarHistorico = async () => {
    try {
      console.log('Carregando histórico para sensor:', currentSensor.sensorId);
      const data = await sensorAPI.getSensorReadings(currentSensor.sensorId);
      console.log('Dados recebidos da API:', data);

      // CORREÇÃO: Ordenação segura com verificação de timestamp
      const historicoOrdenado = data
        .filter(item => item && item.timestamp) // Remove itens inválidos
        .sort((a, b) => {
          try {
            return new Date(a.timestamp) - new Date(b.timestamp);
          } catch (error) {
            console.warn('Erro ao ordenar timestamp:', error);
            return 0;
          }
        });

      console.log('Histórico ordenado:', historicoOrdenado);
      setHistorico(historicoOrdenado);

      // ATUALIZAR O SENSOR ATUAL COM OS DADOS MAIS RECENTES
      if (historicoOrdenado.length > 0) {
        const leituraMaisRecente = historicoOrdenado[historicoOrdenado.length - 1];
        console.log('Leitura mais recente:', leituraMaisRecente);

        setCurrentSensor(prevSensor => ({
          ...prevSensor,
          readingValue: leituraMaisRecente.readingValue,
          timestamp: leituraMaisRecente.timestamp,
          status: leituraMaisRecente.status || prevSensor.status || 'OK'
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico do sensor');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const registrarNovaLeitura = async () => {
    try {
      // Gerar valor mock para teste - entre 10 e 40
      const mockValue = Math.random() * 30 + 10;

      const novaLeitura = {
        sensorId: currentSensor.sensorId,
        nome: currentSensor.nome || `Sensor ${currentSensor.sensorId}`,
        readingValue: parseFloat(mockValue.toFixed(2)),
        status: 'OK'
      };

      console.log('Enviando nova leitura:', novaLeitura);
      const leituraCriada = await sensorAPI.createReading(novaLeitura);
      console.log('Leitura criada:', leituraCriada);

      // ATUALIZAR O SENSOR ATUAL COM A NOVA LEITURA
      setCurrentSensor(prevSensor => ({
        ...prevSensor,
        readingValue: leituraCriada.readingValue,
        timestamp: leituraCriada.timestamp
      }));

      Alert.alert('Sucesso', `Nova leitura registrada: ${leituraCriada.readingValue}°`);

      // Pequeno delay antes de recarregar o histórico
      setTimeout(() => {
        carregarHistorico();
      }, 1000);
    } catch (error) {
      console.error('Erro ao registrar leitura:', error);
      Alert.alert('Erro', 'Não foi possível registrar a nova leitura');
    }
  };

  const atualizarDados = () => {
    console.log('Atualizando dados...');
    setRefreshing(true);
    carregarHistorico();
  };

  // Atualizar o título da tela com o nome do sensor
  useEffect(() => {
    navigation.setOptions({
      title: `Sensor: ${currentSensor.nome || currentSensor.sensorId}`
    });
  }, [currentSensor, navigation]);

  useEffect(() => {
    console.log('useEffect executado para sensor:', currentSensor.sensorId);
    carregarHistorico();
  }, [currentSensor.sensorId]);

  // Formatação simplificada de timestamp - COM TRY/CATCH
  const formatarTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'N/A';
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } catch (error) {
      console.warn('Erro ao formatar timestamp:', timestamp, error);
      return 'N/A';
    }
  };

  // PREPARAR DADOS PARA GRÁFICO DE FORMA SEGURA
  const prepararDadosGrafico = () => {
    if (!historico || historico.length === 0) {
      return { labels: [], data: [] };
    }

    const ultimasLeituras = historico.slice(-6);

    const labels = ultimasLeituras.map(item => {
      return formatarTimestamp(item.timestamp);
    });

    const data = ultimasLeituras.map(item => {
      return item.readingValue !== undefined ? item.readingValue : 0;
    });

    console.log('Dados preparados para gráfico:', { labels, data });
    return { labels, data };
  };

  const { labels, data } = prepararDadosGrafico();

  // DEBUG - Verificar estado atual
  console.log('Estado atual - loading:', loading, 'refreshing:', refreshing);
  console.log('Sensor atual:', currentSensor);
  console.log('Histórico:', historico.length, 'leituras');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Carregando histórico do sensor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* CABEÇALHO FIXO */}
      <View style={styles.header}>
        <Text style={styles.title}>Detalhes do Sensor</Text>
        <Text style={styles.subtitle}>
          {currentSensor.nome || currentSensor.sensorId}
        </Text>
      </View>

      {/* CONTEÚDO COM SCROLL */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={atualizarDados}
            colors={['#2196F3']}
            tintColor="#2196F3"
          />
        }
      >
        {/* INFORMAÇÕES DO SENSOR */}
        <View style={styles.sensorInfo}>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>ID:</Text> {currentSensor.sensorId || 'N/A'}
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nome:</Text> {currentSensor.nome || 'N/A'}
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[
              styles.statusText,
              (currentSensor.status === 'OK' || !currentSensor.status) ? styles.statusOK : styles.statusError
            ]}>
              {currentSensor.status || 'OK'}
            </Text>
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Valor Atual:</Text>
            <Text style={styles.valueText}>
              {currentSensor.readingValue !== undefined ? currentSensor.readingValue + '°' : 'N/A'}
            </Text>
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>Última Atualização:</Text>
            <Text style={styles.timestampText}>
              {currentSensor.timestamp ? new Date(currentSensor.timestamp).toLocaleString() : 'N/A'}
            </Text>
          </Text>
        </View>

        {/* BOTÕES */}
        <View style={styles.buttonsSection}>
          <Text style={styles.sectionTitle}>Ações</Text>

          <TouchableOpacity
            style={[styles.button, styles.updateButton, refreshing && styles.buttonDisabled]}
            onPress={atualizarDados}
            disabled={refreshing}
          >
            <Text style={styles.buttonIcon}>🔄</Text>
            <Text style={styles.buttonText}>
              {refreshing ? 'ATUALIZANDO...' : 'ATUALIZAR DADOS'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={registrarNovaLeitura}
          >
            <Text style={styles.buttonIcon}>📝</Text>
            <Text style={styles.buttonText}>REGISTRAR NOVA LEITURA</Text>
          </TouchableOpacity>
        </View>

        {/* GRÁFICO - CORRIGIDO E SEGURO */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>
            Histórico de Leituras ({historico.length} registros)
          </Text>

          {data.length > 0 && labels.length > 0 ? (
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: labels,
                  datasets: [{ data: data }],
                }}
                width={Math.max(Dimensions.get("window").width - 40, 300)}
                height={220}
                yAxisSuffix="°"
                chartConfig={{
                  backgroundColor: "#1e2923",
                  backgroundGradientFrom: "#2196F3",
                  backgroundGradientTo: "#21CBF3",
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: {
                    r: "4",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                  }
                }}
                bezier
                style={styles.chart}
              />
              <Text style={styles.chartNote}>
                Últimas {data.length} leituras - Valor atual: {currentSensor.readingValue}°
              </Text>
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>📊 Nenhum dado histórico disponível</Text>
              <Text style={styles.noDataSubtext}>Use o botão acima para registrar uma leitura</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ESTILOS SIMPLIFICADOS E SEGUROS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  sensorInfo: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoItem: {
    fontSize: 16,
    marginBottom: 10,
    paddingVertical: 5,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  statusText: {
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statusOK: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  statusError: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  valueText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2196F3',
  },
  timestampText: {
    fontStyle: 'italic',
    color: '#666',
  },
  buttonsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  updateButton: {
    backgroundColor: '#2196F3',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
  },
  buttonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chartSection: {
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
  },
  chart: {
    borderRadius: 16,
  },
  chartNote: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  noDataContainer: {
    backgroundColor: '#fff3cd',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  noDataText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    textAlign: 'center',
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
});