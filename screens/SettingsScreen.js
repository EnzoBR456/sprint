// screens/SettingsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getApiBaseUrl, setApiBaseUrl } from '../services/apiService';

export default function SettingsScreen() {
  const [baseUrl, setBaseUrl] = useState('http://localhost:8080');

  useEffect(() => {
    const loadUrl = async () => {
      try {
        const savedUrl = await getApiBaseUrl();
        setBaseUrl(savedUrl);
      } catch (error) {
        console.error('Erro ao carregar a URL:', error);
      }
    };

    loadUrl();
  }, []);

  const saveUrl = async () => {
    try {
      await setApiBaseUrl(baseUrl);
      Alert.alert('Sucesso', `URL base salva: ${baseUrl}`);
    } catch (error) {
      console.error('Erro ao salvar a URL:', error);
      Alert.alert('Erro', 'Não foi possível salvar a URL');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>URL Base da API:</Text>
      <Text style={styles.note}>Ex: http://localhost:8080 ou http://192.168.1.100:8080</Text>
      <TextInput
        value={baseUrl}
        onChangeText={setBaseUrl}
        style={styles.input}
        placeholder="http://localhost:8080"
      />
      <Button title="Salvar URL Base" onPress={saveUrl} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  note: { fontSize: 12, color: '#666', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5
  },
});

