import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SettingsScreen() {
  const [url, setUrl] = useState('http://localhost:3000/api');
    useEffect(() => {
      const loadUrl = async () => {
        try {
          const savedUrl = await AsyncStorage.getItem('apiUrl');
          if (savedUrl !== null) {
            setUrl(savedUrl);
          } else {
            setUrl('http://localhost:3000/api'); // valor padrão
          }
        } catch (error) {
          console.error('Erro ao carregar a URL:', error);
        }
      };

      loadUrl();
    }, []);

    const saveUrl = async () => {
      try {
        await AsyncStorage.setItem('apiUrl', url);
        Alert.alert('Sucesso', `URL salva: ${url}`);
      } catch (error) {
        console.error('Erro ao salvar a URL:', error);
        Alert.alert('Erro', 'Não foi possível salvar a URL');
      }
    };
  return (
    <View style={{ padding: 20 }}>
      <Text>URL da API:</Text>
      <TextInput
        value={url}
        onChangeText={setUrl}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <Button title="Salvar" onPress={() => alert(`URL salva: ${url}`)} />
    </View>
  );
}
