import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

function HomeScreen() {
    const[balance, setBalance]  = useState(0);
    const[income, setIncome] = useState(0);
    const[expense, setExpense] = useState(0);
    const[userName, setUserName] = useState('User');
    const[listTransactions, setListTransactions] = useState([]);
    const[selectedId, setSelectedId] = useState(null);
    const navigation = useNavigation();
    
    useEffect(() => {
        const fetchUserName = async () => {
            try{
                const token = await AsyncStorage.getItem('userToken');
                if(!token) {
                    console.log('Токен не найден!');
                    return;
                }

                const nameResponse = await fetch('http://10.73.170.236:8080/api/userInfo/getName', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                 if(nameResponse.ok) {
                    const name = await nameResponse.text();
                    setUserName(name);
                } else {
                     console.error('Ошибка при получении данных:', nameResponse.status);
                }
               
            } catch(error) {
                console.error('Произошла ошибка при запросе:', error);
            }
        };
        fetchUserName();
    }, []);

    const fetchSummaryandTransactions = useCallback(async () => {
        try{
                const token = await AsyncStorage.getItem('userToken');
                if(!token) {
                    console.log('Токен не найден!');
                    return;
                }

                 const summaryResponse = await fetch('http://10.73.170.236:8080/api/userInfo/getSummary', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                });

                if(summaryResponse.ok) {
                    const data = await summaryResponse.json();
                    setBalance(data.balance);
                    setIncome(data.income);
                    setExpense(data.expense);
                } else {
                    console.error('Ошибка при получении данных:', summaryResponse.status);
                } 

               const lastTransactionsResponse = await fetch('http://10.73.170.236:8080/api/user/transactions/latest?limit=4', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if(lastTransactionsResponse.ok) {
                    const list = await lastTransactionsResponse.json();

                    setListTransactions(list);

                } else {
                    console.error('Ошибка при получении данных:', lastTransactionsResponse.status);
                }
            }  catch(error) {
               console.error('Произошла ошибка:', error);
            }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchSummaryandTransactions();
        }, [fetchSummaryandTransactions])
    );

    const handleDelete = async (idToDelete) => {
            try{
                const token = await AsyncStorage.getItem('userToken');
                  if(!token) {
                    console.log('Токен не найден!');
                    return;
                }

                 const response = await fetch(`http://10.73.170.236:8080/api/user/transactions/${idToDelete}`, {
                     method: 'DELETE',
                     headers: {
                        'Authorization': `Bearer ${token}`
                       }
                    });

                    if(response.ok) {
                        console.log(`Транзакция ${idToDelete} успешно удалена.`);
                        const updateList = listTransactions.filter((t) => t.id !== idToDelete);
                        setListTransactions(updateList);
                         setSelectedId(null);
                         fetchSummaryandTransactions();
                    }else if (response.status === 403 || response.status === 404) {
                        alert('Ошибка: Не удалось удалить транзакцию.');
                        setSelectedId(null);
                    }
                    
            } catch(error) {
                console.error('Произошла ошибка:', error);
            }
        }

    return(
        <View style={styles.container}>

            <View style={styles.topConteiner}>
               <Text style={styles.topPText}>Good afternoon,</Text>
               <Text style={styles.userNameText}>{userName}</Text>
               <View style={styles.bottomCurve}/>
            </View>

            <View style={styles.balanceRConteiner}>
                <Text style={styles.totalBalance}> Total Balance </Text>
                <Text style={styles.balanceAmount}>$ {balance}</Text>

                <View style={styles.underBalance}>
                    <View style={styles.incomeBlock}>
                        <View style={styles.iconTexRow}>
                         <Ionicons style={styles.incon1} name="arrow-down-circle" size={30} color="#117972fc"/>
                         <Text style={styles.incomeText}>Income</Text>
                        </View>

                        <Text style={styles.incomeAmount}>$ {income}</Text>
                    </View>

                    <View>
                        <View style={styles.iconTexRow}>
                             <Ionicons style={styles.incon1} name="arrow-up-circle" size={30} color="#117972fc"/>
                             <Text style={styles.expencesText}>Expences</Text>
                        </View>
                        <Text style={styles.expencesAmount}>$ {expense}</Text>
                    </View>

                </View>
            </View>

            <View style={styles.transactionListConteiner}>

                <View style={styles.transaction}>
                    <Text style={styles.thLabel}>Transactions History</Text>
                    <Text style={styles.seeLabel} onPress={()=>navigation.navigate('History') }>See all</Text>
                </View>

                <FlatList data={listTransactions} keyExtractor={(item) => item.id.toString()} renderItem={({item}) => (
                    <View style={styles.transaction}>

                        <View style={styles.dCont}>
                            <Pressable onPress={() => setSelectedId(item.id === selectedId ? null : item.id)}>
                               <Text style={styles.trDLabel}>{item.description}</Text>     
                               <Text style={styles.trDateLabel}>{item.date}</Text>
                            </Pressable>
                        </View>

                        {item.id === selectedId ? (
                              <Pressable onPress={() => handleDelete(item.id)}>
                                 <Ionicons name="trash" size={30} color="red"/>
                             </Pressable>
                        ) : (
                              <Text style={
                                { color: item.type === 'INCOME' ? 'green' : 'red' , fontSize: 18}
                            } > {item.type === 'INCOME' ? '+' : '-'} ${item.amount}</Text>
                        )}
                       
                   </View>
                )}/>
            </View>

            <View style={styles.addButton}>
                <Pressable onPress={() => navigation.navigate('AddTransaction')}>
                    <Ionicons name="add-outline" size={40} color="white"/>
                </Pressable>
            </View>

        </View>
    );
} 


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topConteiner: {
      backgroundColor: '#1f9d95fc',
      paddingTop: 80,
      width: 360,
      height: 260,
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
    balanceRConteiner: {
        position: 'absolute',
        width: 310,
        height: 191,
        backgroundColor: '#119289ff',
        borderRadius: 20,
        top: 180,
        marginLeft: 24,
    },
    topPText: {
        color: 'white',
        fontSize: 17,
        width: '100%',
        paddingTop: 20,
        paddingLeft: 26,
    },
    userNameText: {
         color: 'white',
        fontSize: 25,
        width: '100%',
        paddingTop: 5,
        paddingLeft: 28,
    },
    totalBalance: {
        marginTop: 20,
        marginLeft: 20,
        fontSize: 17,
        color: 'white',
    },
    balanceAmount: {
        color: 'white',
        marginLeft: 22,
        marginTop: 5,
        fontSize: 26,
    },
    underBalance: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 24,
    },
    iconTexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    incomeText: {
        color: '#D0E5E4',
        fontSize: 17,
    },
    incomeAmount: {
        color: 'white',
        marginLeft: 10,
         fontSize: 21,

    }, 
    expencesText: {
        color: '#D0E5E4',
        fontSize: 17,
    },
    expencesAmount: {
        color: 'white',
        marginLeft: 10,
        fontSize: 21,
    },
    addButton: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: '7%',
        marginLeft: '42%',
        width: 65,
        height: 65,
        borderRadius: '100%',
        backgroundColor: '#1f9d95fc',
    },
    transactionListConteiner: {
        alignItems: 'center',
        top: '13%',

    },
    transaction: {
       flexDirection: 'row',
       alignItems: 'center',      
       width: '100%',
       justifyContent: 'space-between',
       paddingHorizontal: 35,
       paddingTop: '6%',
    }, 
    thLabel: {
        width: '70%',
        fontSize: 18,
        fontWeight: 'bold',
    },
    trDLabel: {
        fontSize: 16,
        fontWeight: 'bold',

    }, 
    trDateLabel: {
        justifyContent: 'center',
        fontSize: 13,
        color: '#aaa',
    },
    trALabel: {
        width: '30%',
    },
    dCont: {
        width: '70%',
    },
    seeLabel: {
        color: '#aaa',
        fontSize: 14,

    }
});

export default HomeScreen;