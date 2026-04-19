import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from 'src/navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { View } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResultModal from './src/components/ResultModal';
import { api } from './src/api/client';
import { STORAGE_KEYS } from './src/constants/storage';

const theme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: '#090909',
        card: '#121212',
        border: '#1f1f1f',
        text: '#f5f5f5',
        primary: '#c8f7a6',
    },
};

export default function App() {
    const [current, setCurrent] = useState<any | null>(null);
    const [visible, setVisible] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const init = async () => {
            const id = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
            if (id) {
                setUserId(Number(id));
            }
        };

        init();
    }, []);

    useEffect(() => {
        if (userId) {
            checkResult();
        }
    }, [userId]);

    const checkResult = async () => {
        try {
            if (!userId) return;

            const res = await api.get(`/goals/result/next?userId=${userId}`);
            const data = res.data;

            if (!data) return;

            setCurrent(data);
            setVisible(true);

        } catch (e) {
            console.log(e);
        }
    };

    const handleClose = async () => {
        setVisible(false);
        setCurrent(null);

        setTimeout(() => {
            checkResult();
        }, 500);
    };

    return (
        <View style={{ flex: 1 }}>
            <NavigationContainer theme={theme}>
                <StatusBar style="light" />
                <RootNavigator />
            </NavigationContainer>

            <ResultModal
                visible={visible}
                result={current}
                onClose={handleClose}
            />
            <Toast />
        </View>
    );
}