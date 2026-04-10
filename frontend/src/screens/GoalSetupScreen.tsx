import { useState } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    Pressable,
    Alert,
    StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'GoalSetup'>;

import { api } from '../api/client';

type SetupResponse = {
    goalDefinitionId: number;
    goalPlanId: number;
    message: string;
};

export default function GoalSetupScreen({ route, navigation }: Props) {
    const { userId } = route.params;

    const [goalTitle, setGoalTitle] = useState('');
    const [motto, setMotto] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [alarmCycle, setAlarmCycle] = useState('1');
    const [preferredEmoji, setPreferredEmoji] = useState('💪');
    const [characterId, setCharacterId] = useState('1');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!goalTitle.trim()) {
            Alert.alert('알림', '목표 제목을 입력해주세요.');
            return;
        }

        if (!startDate.trim() || !endDate.trim()) {
            Alert.alert('알림', '시작일과 종료일을 입력해주세요.');
            return;
        }

        if (!alarmCycle.trim()) {
            Alert.alert('알림', '실천 주기를 입력해주세요.');
            return;
        }

        try {
            setLoading(true);

            const response = await api.post('/onboarding/setup', {
                userId,
                goalTitle: goalTitle.trim(),
                motto: motto.trim(),
                startDate: startDate.trim(),
                endDate: endDate.trim(),
                alarmCycle: Number(alarmCycle),
                preferredEmoji: preferredEmoji.trim(),
                characterId: Number(characterId),
            });

            const data: SetupResponse = response.data;

            await AsyncStorage.setItem('goalPlanId', String(data.goalPlanId));

            Alert.alert('완료', data.message);
            navigation.replace('MainTabs', { userId });

        } catch (error) {
            console.error(error);
            Alert.alert('오류', '초기 설정 저장 중 문제가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>목표 설정</Text>
            <Text style={styles.subtitle}>목표와 다마고치 기본 정보를 입력해주세요.</Text>

            <Text style={styles.label}>목표 제목</Text>
            <TextInput
                value={goalTitle}
                onChangeText={setGoalTitle}
                placeholder="예: 매일 운동하기"
                placeholderTextColor="#777"
                style={styles.input}
            />

            <Text style={styles.label}>목표 문구</Text>
            <TextInput
                value={motto}
                onChangeText={setMotto}
                placeholder="예: 조금씩 꾸준히"
                placeholderTextColor="#777"
                style={styles.input}
            />

            <Text style={styles.label}>시작일</Text>
            <TextInput
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#777"
                style={styles.input}
            />

            <Text style={styles.label}>종료일</Text>
            <TextInput
                value={endDate}
                onChangeText={setEndDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#777"
                style={styles.input}
            />

            <Text style={styles.label}>실천 주기(일)</Text>
            <TextInput
                value={alarmCycle}
                onChangeText={setAlarmCycle}
                placeholder="예: 1"
                placeholderTextColor="#777"
                keyboardType="numeric"
                style={styles.input}
            />

            <Text style={styles.label}>이모지</Text>
            <TextInput
                value={preferredEmoji}
                onChangeText={setPreferredEmoji}
                placeholder="예: 💪"
                placeholderTextColor="#777"
                style={styles.input}
            />

            <Text style={styles.label}>캐릭터 ID</Text>
            <TextInput
                value={characterId}
                onChangeText={setCharacterId}
                placeholder="예: 1"
                placeholderTextColor="#777"
                keyboardType="numeric"
                style={styles.input}
            />

            <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? '저장 중...' : '완료'}</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: '#090909',
        flexGrow: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
        marginTop: 40,
        color: '#f5f5f5',
    },
    subtitle: {
        fontSize: 15,
        color: '#a1a1a1',
        marginBottom: 28,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 6,
        color: '#f5f5f5',
    },
    input: {
        borderWidth: 1,
        borderColor: '#2a2a2a',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 16,
        marginBottom: 14,
        color: '#f5f5f5',
        backgroundColor: '#121212',
    },
    button: {
        backgroundColor: '#c8f7a6',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 40,
    },
    buttonText: {
        color: '#111',
        fontWeight: '700',
        fontSize: 16,
    },
});