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

import { mockCategories, mockSummary } from '../api/mock';
import { colors } from '../theme/colors';
import { STORAGE_KEYS } from '../constants/storage';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import { api } from '../api/client';


type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

export default function HomeScreen({ navigation,route }: Props) {
    const [username, setUsername] = useState('');
    const [currentLevel, setCurrentLevel] = useState<number | null>(null);
    const [goalPlanId, setGoalPlanId] = useState<number | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [characterImageUrl, setCharacterImageUrl] = useState<string | undefined>();

    const [completedDates, setCompletedDates] = useState<string[]>([]);
    const [preferredEmoji, setPreferredEmoji] = useState('🌱');

    const [motto, setMotto] = useState('');

    const today = new Date();

    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);

    //사용자가 누른 날짜 강조 표시
    const [selectedDate, setSelectedDate] = useState(
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    );

    const [menuVisible, setMenuVisible] = useState(false);

    const loadData = async () => {
        try {
            const savedUsername = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
            const savedGoalPlanId = await AsyncStorage.getItem(STORAGE_KEYS.GOAL_PLAN_ID);
            const savedUserId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);

            if (savedUsername) setUsername(savedUsername);
            if (savedGoalPlanId) {
                const goalId = Number(savedGoalPlanId);

                setGoalPlanId(goalId);

                const res = await api.get(`/goals/${goalId}`);

                setMotto(res.data.motto ?? '');
            }

            if (savedUserId) {
                const uid = Number(savedUserId);
                await fetchCharacter(uid);
            }
        } catch (e) {
            console.log('loadData error:', e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                if (!goalPlanId) return;

                const res = await api.get(`/goal-plans/${goalPlanId}/calendar`, {
                    params: {
                        year,
                        month,
                    },
                });

                setCompletedDates(res.data.completedDates ?? []);
                setPreferredEmoji(res.data.preferredEmoji ?? '🌱');

            } catch (e) {
                console.log('달력 조회 실패:', e);
                setCompletedDates([]);
                setPreferredEmoji('🌱');
            }
        };

        fetchCalendar();
    }, [goalPlanId, year, month, refreshKey]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshKey((prev) => prev + 1);
        setRefreshing(false);
    };

    const fetchCharacter = async (uid: number) => {
        try {
            if (!uid) return;

            const res = await api.get(`/characters/current?userId=${uid}`);
            setCharacterImageUrl(res.data.imageUrl);
            setCurrentLevel(res.data.level);
        } catch (e) {
            console.log(e);
        }
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
                            {username ? `${username}님, ${motto || '오늘도 한 칸 전진'}`
                                : motto || '오늘도 한 칸 전진'}
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

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.chipRow}
                >
                    {mockCategories.map((category) => (
                        <CategoryChip key={category.id} category={category} />
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
                        onLevelChange={setCurrentLevel}
                        refreshKey={refreshKey}
                        onLevelUp={fetchCharacter}
                        onTasksUpdated={() => setRefreshKey((prev) => prev + 1)}
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
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 64,
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
        backgroundColor: '#1E1E22',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
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