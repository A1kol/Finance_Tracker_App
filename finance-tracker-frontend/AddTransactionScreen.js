import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AddTransactionScreen() {
    const [type, setType] = useState('INCOME');
    const [category, setCategory] = useState('SALARY');
    const [description, setDescription] = useState('');
    const [amount ,setAmount] = useState('');
    const navigation = useNavigation();

    const handleSubmitTransaction = async () => {
        if(!description || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните описание и введите корректную сумму.');
            return;
        }

        try{
            const token = await AsyncStorage.getItem('userToken');
            if(!token) {
                console.log('Токен не найден!')
                return;
            }

            const transactionData = {
                amount: parseFloat(amount),
                description: description,
                type: type,
                category: category,
            };

            console.log('Отправляем транзакцию:', transactionData);

            const response = await fetch('http://10.73.170.236:8080/api/user/transactions/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(transactionData)
            });

            if(response.ok) {
                Alert.alert('Успех!', 'Транзакция успешно добавлена.');
                navigation.navigate('Home');
            } else {
                const errorText = await response.text();
                console.error('Ошибка при сохранении:', response.status, errorText);
                Alert.alert('Ошибка', `Не удалось сохранить транзакцию.`);
            } 
        } catch (error) {
            console.error('Произошла сетевая ошибка:', error);
            Alert.alert('Ошибка', 'Произошла сетевая ошибка.');
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.headerRow}>
                    <Pressable onPress={() => navigation.goBack()}>
                         <Ionicons name="arrow-back" size={24} color="white" />
                    </Pressable>
                    <Text style={styles.text}>Add Transaction</Text>
                    <Ionicons name="ellipsis-horizontal" size={24} color="white" />
                </View>
              <View style={styles.bottomCurve}/>
            </View>

            <View style={styles.middleContainer}>
                <View style={styles.block}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput style={styles.input} placeholder='for a coffee' 
                    value={description} onChangeText={setDescription}
                    />
                </View>

                <View style={styles.block}>
                    <Text style={styles.label}>Amount</Text>
                    <TextInput style={styles.input} placeholder='$0' keyboardType='numeric'
                    value={amount} onChangeText={setAmount}
                    />
                </View>

                 <View style={styles.block}>
                    <Text style={styles.label}>Type</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker selectedValue={type} onValueChange={(itemValue) => setType(itemValue)} style={{color: '#808080', height: 50, width:'100%'}}>
                        <Picker.Item label='INCOME' value='INCOME'/>
                        <Picker.Item label='EXPENSE' value='EXPENSE'/>
                    </Picker>
                    </View>
                </View>

                <View style={styles.block}>
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={{color: '#808080', height: 50, width:'100%'}}>
                            <Picker.Item label='FOOD' value='FOOD'/>
                            <Picker.Item label='SALARY' value='SALARY'/>
                        </Picker>
                    </View>
                </View>
            </View>

            <Pressable onPress={handleSubmitTransaction}>
            <View style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add</Text>
            </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
         alignItems: 'center',
    },
    topContainer: {
        backgroundColor: '#1f9d95fc',
        paddingTop: 80,
        width: '100%',
        height: 260,
        alignItems: 'center',
        zIndex: 1,
    },
    bottomCurve: {
    position: 'absolute',
     bottom: -39,
     width: 360,
     height: 56,
     backgroundColor: '#1f9d95fc',
     borderBottomLeftRadius: '100%',
     borderBottomRightRadius: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 24, 
        marginTop: 20,
    },
    text: {
        color: 'white',
        fontSize: 18,
        },
    middleContainer: {
        bottom: 90,
        width: '86%',
        height: 430,
        backgroundColor: '#fff',
        borderRadius: 25,
        zIndex: 2,
        padding: 20,
    },
    block: {
        width: '100%',
        alignItems: 'flex-start',
        marginTop: 20,
    },
    input: {
        borderColor: '#aaa',
        borderRadius: 10,
        borderWidth: 1,
        top: 12,
        width: '100%',
        height: 45,
    },
    label: {
        color: '#808080',
        fontSize: 15,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#aaa',
        width: '100%',
        borderRadius: 10,
        top: 12,
    },
    addButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1f9d95fc',
        borderRadius:  '100%',
        top: '20%',
        width: 65,
        height: 65,
    },
    addButtonText: {
        color: 'white',
        fontSize: 20,
    }
});

export default AddTransactionScreen;