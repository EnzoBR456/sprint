import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SensorItem from '../components/SensorItem';
import mockSensors from '../mock/sensors.json';

export default function SensorListScreen({ navigation }) {
  const [sensores, setSensores] = useState([]);

  useEffect(() => {
    const carregarSensores = async () => {
      try {
        const savedUrl = await AsyncStorage.getItem('apiUrl');
        const url = savedUrl || 'http://localhost:8080/api/readings'; // endpoint correto

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Erro de status ${response.status}`);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
          console.warn('Resposta da API vazia. Usando mock local.');
          setSensores(mockSensors.sensores);
          Alert.alert('Aviso', 'Dados do backend estão vazios. Usando dados locais.');
        } else {
          setSensores(data);
        }
      } catch (error) {
        console.warn('Falha ao buscar da API. Carregando mock local.', error);
        setSensores(mockSensors.sensores);
        Alert.alert('Aviso', 'Não foi possível conectar à API. Usando dados locais.');
      }
    };

    carregarSensores();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={sensores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SensorItem
            sensor={item}
            onPress={() => navigation.navigate('Detalhes', { sensor: item })}
          />
        )}
      />
      <Button
        title="Configuração de Conexão"
        onPress={() => navigation.navigate('Configuração de Conexão')}
      />
    </View>
  );
}

