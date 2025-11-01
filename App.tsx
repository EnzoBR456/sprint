import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SensorListScreen from './screens/SensorListScreen';
import SensorDetailScreen from './screens/SensorDetailScreen';
import SettingsScreen from './screens/SettingsScreen';
import RegisterScreen from './screens/RegisterScreen';
import AddSensorScreen from './screens/AddSensorScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Sensores" component={SensorListScreen} />
        <Stack.Screen name="Detalhes" component={SensorDetailScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Adicionar Sensor" component={AddSensorScreen} options={{ title: 'Novo Sensor' }} />
        <Stack.Screen name="Configuração de Conexão" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
