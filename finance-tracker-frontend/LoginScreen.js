import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginScreen() {
  const [name, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!name.trim() || !password.trim()) {
      Alert.alert("Ошибка", "Пожалуйста, введите имя и пароль.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://10.73.170.236:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });

      if (!response.ok) {
        throw new Error('Логин не удался, статус: ' + response.status);
      }

      const data = await response.json();
      const token = data.token;

      if (token) {
        await AsyncStorage.setItem('userToken', token);
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось войти.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setUserName}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator size="small" color="#000" style={{ marginVertical: 10 }} />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}

      <Pressable onPress={() => navigation.navigate('Registration')} style={{ marginTop: 20 }}>
        <Text style={{ color: 'blue' }}>Don't have an account?</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
});

export default LoginScreen;
