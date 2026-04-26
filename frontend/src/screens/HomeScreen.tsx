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

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import { STORAGE_KEYS } from '../constants/storage';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import { api } from '../api/client';
import { GoalCategory } from "../types";
import { useTheme } from '../theme/ThemeContext';

import Constants from 'expo-constants';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

export default function HomeScreen({ navigation, route }: Props) {
    const theme = useTheme();

    const registerPushToken = async (userId: number) => {
        try {
            if (!Device.isDevice) {
                console.log('실기기에서만 푸시 토큰 발급 가능');
                return;
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('푸시 권한 거부됨');
                return;
            }

            const tokenData = await Notifications.getExpoPushTokenAsync({projectId: Constants.expoConfig?.extra?.eas?.projectId,});
            const pushToken = tokenData.data;

            await api.post('/push-tokens', {
                userId,
                pushToken,
            });

        } catch (e) {
            console.log(e);
        }
    };

    const getDDayInfo = (endDate: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);

        const diff = Math.ceil(
            (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diff > 0) {
            return {
                label: `D-${diff}`,
                text: `목표일이 다가와요.`,
            };
        }

        if (diff === 0) {
            return {
                label: 'D-DAY',
                text: '오늘이 목표 마감일이에요!',
            };
        }

        return {
            label: `D+${Math.abs(diff)}`,
            text: '목표 기간이 종료되었어요',
        };
    };
    const [username, setUsername] = useState('');
    const [currentLevel, setCurrentLevel] = useState<number | null>(null);
    const [goalPlanId, setGoalPlanId] = useState<number | null>(null);
    const [motto, setMotto] = useState('');

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

    const ddayInfo = selectedCategory?.endDate
        ? getDDayInfo(selectedCategory.endDate)
        : null;

    const [menuVisible, setMenuVisible] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
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
                    endDate: goal.endDate,
                    colorHex: getPastelColor(),
                }));

            setCategories(mapped);

            if (!goalPlanId) {
                const first = mapped[0];
                if (first) {
                    setSelectedGoalId(first.id);
                    setGoalPlanId(first.id);
                    setMotto(first.motto ?? '');
                }
            }

            if (savedUserId) {
                setUserId(Number(savedUserId));

            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (!userId) return;
        registerPushToken(userId);
    }, [userId]);


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
        const selected = categories.find(c => c.id === goalId);
        setSelectedGoalId(goalId);
        setGoalPlanId(goalId);
        setMotto(selected?.motto ?? '');
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
        navigation.navigate('GoalManage');
    };

    const handleReminderManage = () => {
        setMenuVisible(false);
        navigation.navigate('ReminderManage', { userId });
    };
    const handleRoutineManage = () => {
        setMenuVisible(false);
        if (!userId) return;
        navigation.navigate('RoutineManage', { userId });
    };


    return (
        <>
            <ScrollView
                style={{ flex: 1, backgroundColor: theme.background }}
                contentContainerStyle={styles.content}
            >
                <View style={styles.headerRow}>
                    <View style={styles.headerTextBox}>
                        <Text style={[styles.title, { color: theme.text }]}>
                            {username ? `${username}님, ${motto || '오늘도 한 칸 전진'}`
                                : motto || '오늘도 한 칸 전진'}
                        </Text>

                        {ddayInfo && (
                            <Text style={[styles.subtitle, { color: theme.text, opacity: 0.6 }]}>
                                {ddayInfo.label} · {ddayInfo.text}
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[styles.menuButton, { backgroundColor: theme.card }]}
                        onPress={() => setMenuVisible(true)}
                    >
                        <Ionicons name="menu" size={24} color={theme.text} />
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
                        // onLevelUp={() => fetchCharacter(Number(userId))}
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
                        <Pressable style={[
                            styles.dropdownMenu,
                            {
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                            }
                        ]} onPress={() => {}}>
                                <View style={styles.menuHeader}>
                                    <Text style={[styles.menuHeaderTitle,{ color: theme.text }]}>메뉴</Text>
                                    <TouchableOpacity onPress={() => setMenuVisible(false)}>
                                        <Ionicons name="close" size={22} color={theme.text} />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={styles.menuItem} onPress={handleCategoryCreate}>
                                    <Ionicons name="add-circle-outline" size={18} color={theme.text} />
                                    <Text style={[styles.menuItemText, { color: theme.text }]}>카테고리 등록</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.menuItem} onPress={handleCategoryManage}>
                                    <Ionicons name="grid-outline" size={18} color={theme.text} />
                                    <Text style={[styles.menuItemText, { color: theme.text }]}>카테고리 관리</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.menuItem} onPress={handleReminderManage}>
                                    <Ionicons name="notifications-outline" size={18} color={theme.text} />
                                    <Text style={[styles.menuItemText, { color: theme.text }]}>리마인더 관리</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.menuItem} onPress={handleRoutineManage}>
                                    <Ionicons name="notifications-outline" size={18} color={theme.text} />
                                    <Text style={[styles.menuItemText, { color: theme.text }]}>루틴 관리</Text>
                                </TouchableOpacity>
                            </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 96,
        paddingBottom: 120,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerTextBox: {
        flex: 1,
        paddingRight: 12,
    },
    title: {
        // color: colors.text,
        fontSize: 28,
        fontWeight: '900',
    },
    subtitle: {
        // color: colors.muted,
        marginTop: 6,
        fontSize: 15,
    },
    chipRow: {
        marginTop: 18,
    },
    level: {
        // color: colors.text,
        fontSize: 18,
        fontWeight: '700',
        marginTop: 14,
        marginBottom: 12,
    },
    calendarHeaderRow: {
        marginTop: 16,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    monthButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    modalBackdrop: {
        flex: 1,
    },
    menuButton: {
        width: 42,
        height: 42,
        borderRadius: 14,
        // backgroundColor: '#1E1E22',
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
        // backgroundColor: '#151518',
        borderRadius: 20,
        paddingTop: 8,
        paddingBottom: 6,
        paddingHorizontal: 14,
        borderWidth: 1,
        // borderColor: '#26262B',
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
        fontSize: 15,
        fontWeight: '700',
    },
    monthButtonText: {
        fontSize: 18,
        fontWeight: '700',
        // color: colors.text,
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
        // color: colors.text,
    },
});