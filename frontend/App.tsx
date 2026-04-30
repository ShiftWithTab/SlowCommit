import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from 'src/navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { View } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResultModal from './src/components/ResultModal';
import { api } from './src/api/client';
import { STORAGE_KEYS } from './src/constants/storage';
import { ThemeProvider } from './src/theme/ThemeContext';
import { useTheme } from './src/theme/ThemeContext';
import React from 'react';
import * as Notifications from 'expo-notifications';
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});
function AppContent() {
    const theme = useTheme();

    // 기존 state/useEffect 전부 여기로 이동
    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <NavigationContainer
                theme={{
                    dark: theme.isDark,
                    colors: {
                        primary: theme.primary,
                        background: theme.background,
                        card: theme.card,
                        text: theme.text,
                        border: theme.border,
                        notification: theme.primary,
                    },
                } as any}
            >
                <StatusBar style={theme.isDark ? 'light' : 'dark'} />
                <RootNavigator />
            </NavigationContainer>
        </View>
    );
}

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
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}