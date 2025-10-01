// components/SensorItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SensorItem = ({ sensor, onPress }) => {
  // Garantir que temos valores padrão caso venham nulos do backend
  const sensorId = sensor.sensorId || 'N/A';
  const nome = sensor.nome || `Sensor ${sensorId}`;
  const status = sensor.status || 'DESCONHECIDO';
  const readingValue = sensor.readingValue !== undefined ? sensor.readingValue : 'N/A';
  const timestamp = sensor.timestamp ? new Date(sensor.timestamp).toLocaleString() : 'Não registrado';

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'OK': return '#4caf50';
      case 'ALERTA': return '#ff9800';
      case 'ERRO': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{nome}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <Text style={styles.id}>ID: {sensorId}</Text>
      <Text style={styles.value}>Valor: {readingValue}</Text>
      <Text style={styles.timestamp}>Última leitura: {timestamp}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  id: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196f3',
    marginBottom: 3,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default SensorItem;