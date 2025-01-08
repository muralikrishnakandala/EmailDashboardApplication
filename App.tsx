import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import Dashboard from './src/screens/Dasboard';
import { AuthProvider } from './src/context/AuthContext';
import { MMKV } from 'react-native-mmkv';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const MMKVstorage = new MMKV();
export type RootStackParamList = {
  Login: undefined; 
  Dashboard: undefined
};
const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {

  return (
    <GestureHandlerRootView>
      <NavigationContainer>
    <AuthProvider>
        <Stack.Navigator screenOptions={{headerTintColor:"#051f20", headerStyle:{backgroundColor:"#A7C8A9"}, headerTitleStyle:{fontWeight:"bold"}}}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
        </Stack.Navigator>
    </AuthProvider>
      </NavigationContainer>
      </GestureHandlerRootView>
  );
}

export default App;