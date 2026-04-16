import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import CategoryChip from '../components/CategoryChip';
import MonthlyCalendar from '../components/MonthlyCalendar';
import PixelCard from '../components/PixelCard';
import DailyTaskSection from '../components/DailyTaskSection';

import { mockCategories, mockSummary } from '../api/mock';
import { colors } from '../theme/colors';
import { STORAGE_KEYS } from '../constants/storage';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import { api } from '../api/client';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

export default function HomeScreen({ route }: Props) {
    const [username, setUsername] = useState('');
    const [currentLevel, setCurrentLevel] = useState<number | null>(null);
    const [goalPlanId, setGoalPlanId] = useState<number | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [characterImageUrl, setCharacterImageUrl] = useState<string | undefined>();

    const loadData = async () => {
        const savedUsername = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
        const savedGoalPlanId = await AsyncStorage.getItem(STORAGE_KEYS.GOAL_PLAN_ID);
        const savedUserId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);

        if (savedUsername) setUsername(savedUsername);
        if (savedGoalPlanId) setGoalPlanId(Number(savedGoalPlanId));

        if (savedUserId) {
            const uid = Number(savedUserId);
            await fetchCharacter(uid);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshKey((prev) => prev + 1); // ⭐ 강제 리렌더
        setRefreshing(false);
    };

    const fetchCharacter = async (uid: number) => {
        try {
            const res = await api.get(
                `/characters/current?userId=${uid}`
            );

            setCharacterImageUrl(res.data.imageUrl);
            setCurrentLevel(res.data.level);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Text style={styles.title}>
                {username ? `${username}님, 오늘도 한 칸 전진` : '오늘도 한 칸 전진'}
            </Text>

            <Text style={styles.subtitle}>
                {mockSummary.streak}일째 루틴 이어가는 중
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                {mockCategories.map((category) => (
                    <CategoryChip key={category.id} category={category} />
                ))}
            </ScrollView>

            <PixelCard
                message={currentLevel === null ? '불러오는 중...' : `현재 성장 단계 Lv.${currentLevel} / 10`}
                avatarUrl={characterImageUrl}
            />

            <MonthlyCalendar />

            {goalPlanId && (
                <DailyTaskSection
                    goalPlanId={goalPlanId}
                    onLevelChange={setCurrentLevel}
                    refreshKey={refreshKey}
                    onLevelUp={fetchCharacter}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 64,
        paddingBottom: 120,
    },
    title: {
        color: colors.text,
        fontSize: 28,
        fontWeight: '900',
    },
    subtitle: {
        color: colors.muted,
        marginTop: 6,
        fontSize: 15,
    },
    chipRow: {
        marginTop: 18,
    },
    level: {
        color: colors.text,
        fontSize: 18,
        fontWeight: '700',
        marginTop: 14,
        marginBottom: 12,
    },
});