import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';
import {
    View,
    Text,
    TextInput,
    Pressable,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Username'>;

const BASE_URL = 'http://localhost:8080';

type SaveUsernameResponse = {
    userId: number;
    username: string;
    message: string;
};

export default function UsernameScreen({ route, navigation }: Props) {
    const { userId } = route.params;
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const trimmed = username.trim();

        if (!trimmed) {
            Alert.alert('알림', '별명을 입력해주세요.');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${BASE_URL}/api/onboarding/username`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, username: trimmed }),
            });

            if (!response.ok) {
                throw new Error('별명 저장 실패');
            }

            const data: SaveUsernameResponse = await response.json();

            await AsyncStorage.setItem(STORAGE_KEYS.USERNAME, data.username);

            Alert.alert('완료', data.message);
            navigation.replace('GoalSetup', { userId });
        } catch (error) {
            console.error(error);
            Alert.alert('오류', '별명 저장 중 문제가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.keyboard}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <Text style={styles.title}>별명을 입력해주세요</Text>
                <Text style={styles.subtitle}>별명 등록 전에는 서비스를 사용할 수 없어요.</Text>

                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="예: 주은"
                    placeholderTextColor="#777"
                    style={styles.input}
                    maxLength={20}
                />

                <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? '저장 중...' : '다음'}</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboard: {
        flex: 1,
        backgroundColor: '#090909',
    },
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#090909',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
        color: '#f5f5f5',
    },
    subtitle: {
        fontSize: 15,
        color: '#a1a1a1',
        marginBottom: 24,
    },
    input: {
        borderWidth: 1,
        borderColor: '#2a2a2a',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 16,
        marginBottom: 20,
        color: '#f5f5f5',
        backgroundColor: '#121212',
    },
    button: {
        backgroundColor: '#c8f7a6',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#111',
        fontWeight: '700',
        fontSize: 16,
    },
});