import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';
import HomeScreen from './HomeScreen';
import AddTransationScreen from './AddTransactionScreen';
import HistoryScreen from './HistoryScreen';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name = "Login" component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Registration" component={RegistrationScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name='AddTransaction' component={AddTransationScreen} options={{headerShown: false}}/>
        <Stack.Screen name='History' component={HistoryScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

