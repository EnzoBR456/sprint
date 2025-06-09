import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import SensorListScreen from './screens/SensorListScreen';
import SensorDetailScreen from './screens/SensorDetailScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Sensores" component={SensorListScreen} />
        <Stack.Screen name="Detalhes" component={SensorDetailScreen} />
        <Stack.Screen name="Configuração de Conexão" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
