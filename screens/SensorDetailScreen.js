import React, { useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';


export default function SensorDetailScreen({ route }) {
  const { sensor } = route.params;
  const [historico, setHistorico] = useState(sensor.historico);
  const atualizar = () => {
    // Simula novo fetch do histórico
    const novoHistorico = [...historico, (Math.random() * 5 + 1).toFixed(2)];
    setHistorico(novoHistorico);

  };
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>{sensor.nome}</Text>
      <FlatList
        data={historico}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>Valor: {item}</Text>}
      />
      <Button title="Atualizar" onPress={atualizar} />
    </View>
  );
}
