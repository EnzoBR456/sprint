import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SensorItem({ sensor, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.nome}>{sensor.nome}</Text>

      {/* Mostra ID e Data apenas se timestamp existir (dados reais) */}
      {sensor.timestamp !== undefined && (
        <>
          <Text>ID do Sensor: {sensor.id || sensor.sensorId}</Text>
          <Text>Data: {new Date(sensor.timestamp).toLocaleString()}</Text>
        </>
      )}

      <Text>Status: {sensor.status}</Text>
      <Text>Valor: {sensor.readingValue ?? sensor.valor}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});