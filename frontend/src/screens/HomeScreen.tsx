import { useCallback, useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    RefreshControl,
    View,
    TouchableOpacity,
    Modal,
    Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import CategoryChip from '../components/CategoryChip';
import MonthlyCalendar from '../components/MonthlyCalendar';
import PixelCard from '../components/PixelCard';
import DailyTaskSection from '../components/DailyTaskSection';

import { mockSummary } from '../api/mock';
import { colors } from '../theme/colors';
import { STORAGE_KEYS } from '../constants/storage';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import { api } from '../api/client';
import { GoalCategory } from "../types";

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const [username, setUsername] = useState('');
    const [currentLevel, setCurrentLevel] = useState<number | null>(null);
    const [goalPlanId, setGoalPlanId] = useState<number | null>(null);

    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [characterImageUrl, setCharacterImageUrl] = useState<string>();

    const [completedDates, setCompletedDates] = useState<string[]>([]);
    const [preferredEmoji, setPreferredEmoji] = useState('🌱');

    const [categories, setCategories] = useState<GoalCategory[]>([]);
    const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);

    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);

    const [selectedDate, setSelectedDate] = useState(
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    );
    const selectedCategory = categories.find(c => c.id === selectedGoalId);
    const [menuVisible, setMenuVisible] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const loadData = async () => {
        try {
            const savedUsername = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
            const savedUserId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);

            if (savedUsername) setUsername(savedUsername);
            if (!savedUserId) return;

            const uid = Number(savedUserId);

            const goalRes = await api.get(`/goals/users/${uid}`);

            const getPastelColor = () => {
                const h = Math.floor(Math.random() * 360);
                const s = 55;
                const l = 80;
                return `hsl(${h}, ${s}%, ${l}%)`;
            };

            const mapped = goalRes.data
                .sort((a: any, b: any) => b.id - a.id)
                .map((goal: any) => ({
                    id: goal.id,
                    name: goal.title,
                    emoji: goal.emoji,
                    active: goal.active,
                    motto: goal.motto,
                    colorHex: getPastelColor(),
                }));

            setCategories(mapped);

            if (!goalPlanId) {
                const first = mapped[0];
                if (first) {
                    setSelectedGoalId(first.id);
                    setGoalPlanId(first.id);
                }
            }

            if (savedUserId) {
                setUserId(savedUserId);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    // ✅ goalPlanId 바뀔 때만 필요한 데이터 fetch
    useEffect(() => {
        if (!goalPlanId) return;

        fetchCharacter();
        fetchCalendar();

    }, [goalPlanId, year, month, refreshKey]);

    const fetchCharacter = async () => {
        try {
            if (!goalPlanId) return;
            const res = await api.get(`/characters/current?goalPlanId=${goalPlanId}`);
            setCharacterImageUrl(res.data.imageUrl);
            setCurrentLevel(res.data.level);
        } catch (e) {
            console.log(e);
        }
    };

    const fetchCalendar = async () => {
        try {
            const res = await api.get(`/goal-plans/${goalPlanId}/calendar`, {
                params: { year, month },
            });

            setCompletedDates(res.data.completedDates ?? []);
            setPreferredEmoji(res.data.preferredEmoji ?? '🌱');
        } catch (e) {
            console.log(e);
        }
    };

    const handleSelectCategory = (goalId: number) => {
        setSelectedGoalId(goalId);
        setGoalPlanId(goalId);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshKey(prev => prev + 1);
        setRefreshing(false);
    };

    const goPrevMonth = () => {
        if (month === 1) {
            setYear(year - 1);
            setMonth(12);
        } else {
            setMonth(month - 1);
        }
    };

    const goNextMonth = () => {
        if (month === 12) {
            setYear(year + 1);
            setMonth(1);
        } else {
            setMonth(month + 1);
        }
    };

    const goTodayMonth = () => {
        const now = new Date();
        const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        setYear(now.getFullYear());
        setMonth(now.getMonth() + 1);
        setSelectedDate(todayKey);
    };

    const handleCategoryCreate = () => {
        setMenuVisible(false);
        navigation.navigate('CategoryCreate');
    };

    const handleCategoryManage = () => {
        setMenuVisible(false);
        console.log('카테고리 관리');
        // navigation.navigate('CategoryManage');
    };

    const handleReminderManage = () => {
        setMenuVisible(false);
        console.log('리마인더 관리');
        // navigation.navigate('ReminderManage');
    };
    const handleRoutineManage = () => {
        setMenuVisible(false);
        if (!userId) return;
        navigation.navigate('RoutineManage', { userId });
    };
    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.headerRow}>
                    <View style={styles.headerTextBox}>
                        <Text style={styles.title}>
                            {username
                                ? `${username}님, ${selectedCategory?.motto || '오늘도 한 칸 전진'}`
                                : selectedCategory?.motto || '오늘도 한 칸 전진'}
                        </Text>
                        <Text style={styles.subtitle}>
                            {mockSummary.streak}일째 루틴 이어가는 중
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => setMenuVisible(true)}
                    >
                        <Ionicons name="menu" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                    {categories.map((category) => (
                        <CategoryChip
                            key={category.id}
                            category={category}
                            isSelected={category.id === selectedGoalId}
                            onPress={() => handleSelectCategory(category.id)}
                        />
                    ))}
                </ScrollView>

                <PixelCard
                    message={currentLevel === null ? '불러오는 중...' : `현재 성장 단계 Lv.${currentLevel} / 10`}
                    avatarUrl={characterImageUrl}
                />

                <MonthlyCalendar
                    year={year}
                    month={month}
                    completedDates={completedDates}
                    preferredEmoji={preferredEmoji}
                    onPrevMonth={goPrevMonth}
                    onNextMonth={goNextMonth}
                    onPressToday={goTodayMonth}
                    selectedDate={selectedDate}
                    onPressDate={setSelectedDate}
                />

                {goalPlanId && (
                    <DailyTaskSection
                        goalPlanId={goalPlanId}
                        selectedDate={selectedDate}
                        onLevelChange={setCurrentLevel}
                        refreshKey={refreshKey}
                        onLevelUp={fetchCharacter}
                        isActive={selectedCategory?.active ?? false}
                        onTasksUpdated={() => setRefreshKey(prev => prev + 1)}
                    />
                )}
            </ScrollView>

            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <Pressable style={styles.dropdownOverlay} onPress={() => setMenuVisible(false)}>
                    <View style={styles.dropdownWrapper}>
                        <Pressable style={styles.dropdownMenu} onPress={() => {}}>
                            <View style={styles.menuHeader}>
                                <Text style={styles.menuHeaderTitle}>메뉴</Text>
                                <TouchableOpacity onPress={() => setMenuVisible(false)}>
                                    <Ionicons name="close" size={22} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.menuItem} onPress={handleCategoryCreate}>
                                <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
                                <Text style={styles.menuItemText}>카테고리 등록</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem} onPress={handleCategoryManage}>
                                <Ionicons name="grid-outline" size={18} color="#FFFFFF" />
                                <Text style={styles.menuItemText}>카테고리 관리</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem} onPress={handleReminderManage}>
                                <Ionicons name="notifications-outline" size={18} color="#FFFFFF" />
                                <Text style={styles.menuItemText}>리마인더 관리</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={handleRoutineManage}>
                                <Ionicons name="notifications-outline" size={18} color="#FFFFFF" />
                                <Text style={styles.menuItemText}>루틴 관리</Text>
                            </TouchableOpacity>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: 20, paddingTop: 64, paddingBottom: 120 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
    headerTextBox: { flex: 1 },
    title: { color: colors.text, fontSize: 28, fontWeight: '900' },
    subtitle: { color: colors.muted, marginTop: 6 },
    chipRow: { marginTop: 18, paddingLeft: 5,},
    menuButton: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: '#1E1E22',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
    dropdownWrapper: {
        position: 'absolute',
        top: 105,
        right: 20,
    },
    dropdownMenu: {
        width: 210,
        backgroundColor: '#151518',
        borderRadius: 20,
        paddingTop: 8,
        paddingBottom: 6,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#26262B',
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
    },

    dropdownItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
    },

    dropdownItemText: {
        color: '#F5F5F5',
        fontSize: 15,
        fontWeight: '700',
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
        paddingTop: 6,
        paddingBottom: 10,
    },
    menuHeaderTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 14,
        paddingHorizontal: 4,
    },
    menuItemText: {
        color: '#F5F5F5',
        fontSize: 15,
        fontWeight: '700',
    },
    monthButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
    },
    todayButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },
    todayButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.text,
    },
});