import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import Dashboard from './src/screens/Dasboard';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { MMKV } from 'react-native-mmkv';
import { ActivityIndicator, View } from 'react-native';

// Initialize MMKV storage
export const MMKVstorage = new MMKV();
export type RootStackParamList = {
  Login: undefined; 
  Dashboard: undefined
};
const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null); // Start with null
  const { handleCredentials } = useAuth();

  useEffect(() => {
    const getStoredCredentials = () => {
      try {
        const getEmail = MMKVstorage.getString('email');
        const getPassword = MMKVstorage.getString('password');

        if (getEmail && getPassword) {
          console.log('Logged-in User:', getEmail, getPassword);
          handleCredentials(getEmail, 'email');
          handleCredentials(getPassword, 'password');
          setInitialRoute('Dashboard');
          
        } else {
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error('Error fetching credentials:', error);
        setInitialRoute('Login'); // Fallback in case of error
      }
    };

    getStoredCredentials();
  }, [handleCredentials]);

  // Show a loader until `initialRoute` is determined
  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
      <NavigationContainer>
    <AuthProvider>
        <Stack.Navigator initialRouteName={initialRoute === "Dashboard" ? "Dashboard" : "Login"}>
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
    </AuthProvider>
      </NavigationContainer>
  );
}

export default App;