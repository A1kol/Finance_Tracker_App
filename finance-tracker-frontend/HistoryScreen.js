import React, { useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    FlatList,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://10.73.170.236:8080/api/user/transactions";
const PAGE_SIZE = 20;


const TransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
        <Text>{item.description}</Text>
        <Text style={{ color: item.type === "INCOME" ? "green" : "red" }}>
            {item.type === "INCOME" ? "+" : "-"} ${item.amount}
        </Text>
    </View>
);

function HistoryScreen() {
    const navigation = useNavigation();
    const [transactions, setTransactions] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const fetchTransactions = async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        const pageToFetch = Math.floor(transactions.length / PAGE_SIZE);
        const controller = new AbortController();

        const timeoutId = setTimeout(() => {
            controller.abort();
            Alert.alert("Таймаут", "Сервер не отвечает (10 секунд).");
        }, 10000);

        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) throw new Error("Токен не найден");

            const response = await fetch(
                `${API_BASE_URL}?page=${pageToFetch}&size=${PAGE_SIZE}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                    signal: controller.signal,
                }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка: ${response.status}`);
            }

            const data = await response.json();
            const newTransactions = data.content || [];
            const isLastPage = data.last;

            setTransactions((prev) => {
                const existingIds = new Set(prev.map((t) => t.id));
                const unique = newTransactions.filter((t) => !existingIds.has(t.id));
                return [...prev, ...unique];
            });

            if (isLastPage) {
                setHasMore(false);
            }
        } catch (error) {
            if (error.name !== "AbortError") {
                Alert.alert("Ошибка", error.message || "Не удалось загрузить транзакции.");
                setHasMore(false);
            }
        } finally {
            clearTimeout(timeoutId);
            setIsLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            setTransactions([]);
            setHasMore(true);
            setIsLoading(false);
            fetchTransactions();

            return () => {};
        }, [])
    );

    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            fetchTransactions();
        }
    };

    const renderFooter = () => {
        if (isLoading && transactions.length > 0) {
            return <ActivityIndicator style={{ marginVertical: 20 }} />;
        }

        if (!hasMore && transactions.length > 0) {
            return <Text style={styles.footerText}>--- Конец истории ---</Text>;
        }

        return null;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </Pressable>
                <Text style={styles.headerText}>История</Text>
            </View>

            {transactions.length === 0 && isLoading ? (
                <ActivityIndicator size="large" style={styles.centered} />
            ) : (
                <FlatList
                    data={transactions}
                    renderItem={({ item }) => <TransactionItem item={item} />}
                    keyExtractor={(item, index) =>
                        item.id ? item.id.toString() : index.toString()
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={
                        !isLoading && (
                            <Text style={styles.emptyText}>Транзакций нет.</Text>
                        )
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    backButton: {
        marginRight: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    transactionItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    emptyText: {
        textAlign: "center",
        marginTop: 50,
        fontSize: 16,
        color: "#888",
    },
    footerText: {
        textAlign: "center",
        paddingVertical: 20,
        color: "#999",
    },
});

export default HistoryScreen;


