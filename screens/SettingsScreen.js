import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function SettingsScreen() {
  const [url, setUrl] = useState('http://localhost:3000/api');

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
