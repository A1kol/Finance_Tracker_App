import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';

function RegistrationScreen() {
  const [name, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleRegister = () => {
    fetch('http://10.73.170.236:8080/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        password: password,
      }),
    })
      .then(response => {
        
        if (response.status === 200) {
          alert('Регистрация прошла успешно!');
          navigation.navigate('Login');
          return response.json();
        }else{
          alert('Не успешно');

        }
        throw new Error('Регистрация не удалась, статус: ' + response.status);
      })
      .then(data => console.log('Успешная регистрация! Данные:', data))
      .catch(error => console.log('Произошла ошибка: ', error));
  };

  return (
    <View style={styles.container}>
      <Text>Регистрация</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={name}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Зарегистрироваться" onPress={handleRegister} />
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
    borderColor: 'gray',
  },
});

export default RegistrationScreen;