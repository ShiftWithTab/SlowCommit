import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { STORAGE_KEYS } from '../constants/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Init'>;

const BASE_URL = 'http://localhost:8080';

type StatusResponse = {
    userId: number;
    hasUsername: boolean;
    username: string | null;
    hasGoal: boolean;
};

type GuestUserResponse = {
    userId: number;
    username: string | null;
    message: string;
};

export default function InitScreen({ navigation }: Props) {
    useEffect(() => {
        const init = async () => {
            try {
                console.log('InitScreen 시작');
                let userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
                console.log('저장된 userId:', userId);
                if (!userId) {
                    const guestResponse = await fetch(`${BASE_URL}/api/users/guest`, {
                        method: 'POST',
                    });

                    if (!guestResponse.ok) {
                        throw new Error('게스트 유저 생성 실패');
                    }

                    const guestData: GuestUserResponse = await guestResponse.json();
                    userId = String(guestData.userId);
                    await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId);
                }

                const statusResponse = await fetch(
                    `${BASE_URL}/api/onboarding/status?userId=${userId}`
                );

                if (!statusResponse.ok) {
                    throw new Error('온보딩 상태 조회 실패');
                }

                const statusData: StatusResponse = await statusResponse.json();

                if (!statusData.hasUsername) {
                    navigation.replace('Username', { userId: Number(userId) });
                    return;
                }

                if (!statusData.hasGoal) {
                    navigation.replace('GoalSetup', { userId: Number(userId) });
                    return;
                }

                navigation.replace('MainTabs', { userId: Number(userId) });
            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#c8f7a6" />
            <Text style={styles.text}>앱을 준비하고 있어요...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#090909',
        padding: 24,
    },
    text: {
        marginTop: 16,
        fontSize: 16,
        color: '#f5f5f5',
    },
});