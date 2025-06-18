import React, { useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';

export default function SensorDetailScreen({ route }) {
  const { sensor } = route.params;
  const [historico, setHistorico] = useState(sensor.historico || []);

  const atualizar = () => {
    const novoValor = (Math.random() * 5 + 1).toFixed(2);
    const novoHistorico = [...historico, parseFloat(novoValor)];
    setHistorico(novoHistorico);

    // Simula envio de nova leitura para o backend
    enviarLeitura(sensor.sensorId || sensor.nome, parseFloat(novoValor));
  };

  const enviarLeitura = async (sensorId, valor) => {
    try {
      const apiUrl = await AsyncStorage.getItem('apiUrl');
      const leitura = {
        sensorId: sensorId,
        nome: sensor.nome,
        readingValue: valor,
        status: sensor.status || "OK"
      };

      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leitura)
      });
    } catch (error) {
      console.error('Erro ao enviar leitura:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>{sensor.nome || sensor.sensorId}</Text>

      <FlatList
        data={historico}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>Valor: {item}</Text>}
      />

      <Button title="Atualizar" onPress={atualizar} />
    </View>
  );
}

