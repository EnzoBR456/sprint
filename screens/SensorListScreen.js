import React, { useEffect, useState } from 'react';
import { View, FlatList, Button } from 'react-native';
import SensorItem from '../components/SensorItem';
import mockData from '../data/mockData.json';

export default function SensorListScreen({ navigation }) {
  const [sensores, setSensores] = useState([]);

  useEffect(() => {
    // Simula fetch inicial
    setSensores(mockData.sensores);
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
      <Button title="Configurações" onPress={() => navigation.navigate('Configurações')} />
    </View>
  );
}
