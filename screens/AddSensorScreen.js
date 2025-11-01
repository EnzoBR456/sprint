import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { sensorAPI } from '../services/apiService';

export default function AddSensorScreen({ navigation }) {
  const [sensorId, setSensorId] = useState('');
  const [nome, setNome] = useState('');
  const [readingValue, setReadingValue] = useState('');
  const [status, setStatus] = useState('');

  const handleAddSensor = async () => {
    if (!sensorId || !nome || !readingValue || !status) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      const novoSensor = {
        sensorId,
        nome,
        readingValue: parseFloat(readingValue),
        status,
      };

      await sensorAPI.addSensor(novoSensor);
      Alert.alert('Sucesso', 'Sensor adicionado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao adicionar sensor:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o sensor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Novo Sensor</Text>

      <TextInput
        placeholder="Sensor ID"
        style={styles.input}
        value={sensorId}
        onChangeText={setSensorId}
      />

      <TextInput
        placeholder="Nome"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="Valor da Leitura"
        style={styles.input}
        keyboardType="numeric"
        value={readingValue}
        onChangeText={setReadingValue}
      />

      <TextInput
        placeholder="Status"
        style={styles.input}
        value={status}
        onChangeText={setStatus}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddSensor}>
        <Text style={styles.buttonText}>Salvar Sensor</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E3F2FD',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1565C0',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
