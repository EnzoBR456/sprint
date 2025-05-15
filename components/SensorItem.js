import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

export default function SensorItem({ sensor, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{sensor.nome}</Text>
      <Text>Valor: {sensor.valor}</Text>
      <Text>Status: {sensor.status}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15, borderBottomWidth: 1 },
  title: { fontWeight: 'bold' }
});
