import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from 'src/navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { View } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResultModal from './src/components/ResultModal';
import { api } from './src/api/client';
import { STORAGE_KEYS } from './src/constants/storage'; // ← 경로 확인

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
    const [result, setResult] = useState<any>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        checkResult();
    }, []);

    const checkResult = async () => {
        try {
            const goalPlanId = await AsyncStorage.getItem(STORAGE_KEYS.GOAL_PLAN_ID);
            if (!goalPlanId) {
                console.log("checkResult(결과 이미지 생성) : goalPlanId 없음");
                return;
            }

            const key = `result_seen_${goalPlanId}`;
            const seen = await AsyncStorage.getItem(key);
            if (seen) return; // ← 이미 봤으면 여기서 종료

            const res = await api.get(`/goals/${goalPlanId}/result`);
            const data = res.data;
            if (!data) return;

            setResult(data);
            setVisible(true);
            await AsyncStorage.setItem(key, "true");

        } catch (e) {
            console.log("결과 없음 또는 에러", e);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <NavigationContainer theme={theme}>
                <StatusBar style="light" />
                <RootNavigator />
            </NavigationContainer>

            <ResultModal
                visible={visible}
                result={result}
                onClose={() => setVisible(false)}
            />
            <Toast />
        </View>
    );
}