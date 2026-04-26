import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
    TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../api/client';
import { useTheme } from '../theme/ThemeContext';

type Goal = {
    id: number;
    title: string;
    emoji?: string;
    active: boolean;
    alarmCycle: number; // 추가
};

type Reminder = {
    id: number;
    goalPlanId: number;
    reminderTime: string;
    active: boolean;
};

export default function ReminderManageScreen({ route, navigation }: any) {
    const theme = useTheme();
    const { userId } = route.params;

    const [goals, setGoals] = useState<Goal[]>([]);

    const [remindersMap, setRemindersMap] = useState<Record<number, Reminder[]>>({});
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedGoalPlanId, setSelectedGoalPlanId] = useState<number | null>(null);
    const [tempTime, setTempTime] = useState<Date>(new Date());

    const [cycleMap, setCycleMap] = useState<Record<number, number>>({});
    const [customCycleGoalId, setCustomCycleGoalId] = useState<number | null>(null);
    const [customCycleInput, setCustomCycleInput] = useState('');
    const [draftCycleMap, setDraftCycleMap] = useState<Record<number, number>>({});
    const [editingCycleGoalId, setEditingCycleGoalId] = useState<number | null>(null);

    useEffect(() => {
        fetchGoals();
    }, []);

    const updateCycle = async (goalPlanId: number, cycle: number) => {
        await api.patch(`/goals/${goalPlanId}/alarm-cycle`, {
            alarmCycle: cycle,
        });

        setCycleMap(prev => ({
            ...prev,
            [goalPlanId]: cycle,
        }));
    };

    const fetchGoals = async () => {
        try {
            const res = await api.get(`/goals/users/${userId}/active`);
            setGoals(res.data);
            const cycleInit: Record<number, number> = {};

            res.data.forEach((goal: Goal) => {
                cycleInit[goal.id] = goal.alarmCycle;
            });

            setCycleMap(cycleInit);
            for (const goal of res.data) {
                await fetchReminders(goal.id);
            }
        } catch (e) {
            console.log('목표 조회 실패', e);
        }
    };

    const fetchReminders = async (goalPlanId: number) => {
        try {
            const res = await api.get(`/reminders/goal-plans/${goalPlanId}`);

            setRemindersMap((prev) => ({
                ...prev,
                [goalPlanId]: res.data,
            }));
        } catch (e) {
            console.log('리마인더 조회 실패', e);
        }
    };

    const formatTime = (date: Date) => {
        return `${String(date.getHours()).padStart(2, '0')}:${String(
            date.getMinutes()
        ).padStart(2, '0')}`;
    };

    const createReminder = async (goalPlanId: number, time: string) => {
        try {
            await api.post('/reminders', {
                goalPlanId,
                reminderTime: time,
            });

            await fetchReminders(goalPlanId);
        } catch (e: any) {
            Alert.alert(
                '등록 실패',
                e?.response?.data?.message ?? '이미 등록된 시간이거나 오류가 발생했어요.'
            );
        }
    };

    const deleteReminder = async (goalPlanId: number, reminderId: number) => {
        try {
            await api.delete(`/reminders/${reminderId}`);
            await fetchReminders(goalPlanId);
        } catch (e) {
            Alert.alert('삭제 실패', '리마인더 삭제 중 오류가 발생했어요.');
        }
    };

    const toggleReminder = async (reminder: Reminder) => {
        try {
            await api.patch(`/reminders/${reminder.id}`, {
                active: !reminder.active,
            });

            await fetchReminders(reminder.goalPlanId);
        } catch (e) {
            Alert.alert('수정 실패', '리마인더 상태 변경 중 오류가 발생했어요.');
        }
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.content}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    style={[
                        styles.backButton,
                        { backgroundColor: theme.card, borderColor: theme.border },
                    ]}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color={theme.text} />
                </TouchableOpacity>

                <Text style={[styles.title, { color: theme.text }]}>리마인더 관리</Text>

                <View style={{ width: 42 }} />
            </View>

            <Text style={[styles.subtitle, { color: theme.text, opacity: 0.55 }]}>
                목표별로 알림 받을 시간을 설정해요
            </Text>

            {goals.map((goal) => {
                const reminders = remindersMap[goal.id] ?? [];

                return (
                    <View
                        key={goal.id}
                        style={[
                            styles.goalCard,
                            { backgroundColor: theme.card, borderColor: theme.border },
                        ]}
                    >
                        <View style={styles.goalHeader}>
                            <View style={styles.goalTitleBox}>
                                <Text style={[styles.goalTitle, { color: theme.text }]} numberOfLines={1}>
                                    {goal.title}
                                </Text>
                                <Text style={[styles.goalSubText, { color: theme.text, opacity: 0.5 }]}>
                                    {reminders.length}개 리마인더 등록됨
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.addSmallButton,
                                    { backgroundColor: theme.background, borderColor: theme.border },
                                ]}
                                onPress={() => {
                                    if (showTimePicker && selectedGoalPlanId === goal.id) {
                                        setShowTimePicker(false);
                                        setSelectedGoalPlanId(null);
                                        return;
                                    }

                                    setSelectedGoalPlanId(goal.id);
                                    setTempTime(new Date());
                                    setShowTimePicker(true);
                                }}
                            >
                                <Ionicons name="add" size={18} color={theme.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.cycleSection}>
                            <Text style={[styles.cycleTitle, { color: theme.text, opacity: 0.6 }]}>
                                알림 주기
                            </Text>

                            <View style={styles.cycleEditRow}>
                                <View style={styles.cycleRow}>
                                    {[
                                        { label: '매일', value: 1 },
                                        { label: '3일', value: 3 },
                                        { label: '7일', value: 7 },
                                    ].map((item) => {
                                        const selected =
                                            customCycleGoalId !== goal.id &&
                                            (draftCycleMap[goal.id] ?? cycleMap[goal.id]) === item.value;

                                        return (
                                            <TouchableOpacity
                                                key={item.value}
                                                style={[
                                                    styles.cycleChip,
                                                    {
                                                        backgroundColor: selected ? theme.primary : theme.background,
                                                        borderColor: selected ? theme.primary : theme.border,
                                                    },
                                                ]}
                                                onPress={() => {
                                                    setCustomCycleGoalId(null);
                                                    setCustomCycleInput('');

                                                    setDraftCycleMap((prev) => ({
                                                        ...prev,
                                                        [goal.id]: item.value,
                                                    }));

                                                    setEditingCycleGoalId(goal.id);
                                                }}
                                            >
                                                <Text
                                                    style={[
                                                        styles.cycleChipText,
                                                        {
                                                            color: selected
                                                                ? theme.isDark ? '#1D3A29' : '#FFFFFF'
                                                                : theme.text,
                                                        },
                                                    ]}
                                                >
                                                    {item.label}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}

                                    <TouchableOpacity
                                        style={[
                                            styles.cycleChip,
                                            {
                                                backgroundColor:
                                                    customCycleGoalId === goal.id ? theme.primary : theme.background,
                                                borderColor:
                                                    customCycleGoalId === goal.id ? theme.primary : theme.border,
                                            },
                                        ]}
                                        onPress={() => {
                                            setCustomCycleGoalId(goal.id);
                                            setCustomCycleInput('');
                                            setEditingCycleGoalId(goal.id);

                                            setDraftCycleMap((prev) => ({
                                                ...prev,
                                                [goal.id]: 0,
                                            }));
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.cycleChipText,
                                                {
                                                    color:
                                                        customCycleGoalId === goal.id
                                                            ? theme.isDark ? '#1D3A29' : '#FFFFFF'
                                                            : theme.text,
                                                },
                                            ]}
                                        >
                                            직접 입력
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {editingCycleGoalId === goal.id && (
                                    <TouchableOpacity
                                        style={[
                                            styles.cycleSaveIconButton,
                                            { backgroundColor: theme.primary },
                                        ]}
                                        onPress={() => {
                                            let cycle = draftCycleMap[goal.id];

                                            if (customCycleGoalId === goal.id) {
                                                cycle = Number(customCycleInput);
                                            }

                                            if (!cycle || cycle <= 0) {
                                                Alert.alert('입력 필요', '1 이상의 숫자를 입력해주세요.');
                                                return;
                                            }

                                            updateCycle(goal.id, cycle);

                                            setEditingCycleGoalId(null);
                                            setCustomCycleGoalId(null);
                                            setCustomCycleInput('');
                                        }}
                                    >
                                        <Ionicons
                                            name="checkmark"
                                            size={18}
                                            color={theme.isDark ? '#1D3A29' : '#FFFFFF'}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {customCycleGoalId === goal.id && (
                                <View style={styles.customCycleBox}>
                                    <TextInput
                                        style={[
                                            styles.customCycleInput,
                                            {
                                                backgroundColor: theme.background,
                                                borderColor: theme.border,
                                                color: theme.text,
                                            },
                                        ]}
                                        placeholder="숫자"
                                        placeholderTextColor={theme.isDark ? '#7E7E88' : '#9CA3AF'}
                                        keyboardType="numeric"
                                        value={customCycleInput}
                                        onChangeText={(text) => {
                                            const onlyNumber = text.replace(/[^0-9]/g, '');
                                            setCustomCycleInput(onlyNumber);

                                            if (onlyNumber) {
                                                setDraftCycleMap((prev) => ({
                                                    ...prev,
                                                    [goal.id]: Number(onlyNumber),
                                                }));
                                            }
                                        }}
                                    />

                                    <Text style={[styles.customCycleText, { color: theme.text, opacity: 0.6 }]}>
                                        일마다
                                    </Text>
                                </View>
                            )}
                        </View>

                        {showTimePicker && selectedGoalPlanId === goal.id && (
                            <View
                                style={[
                                    styles.timePickerBox,
                                    { backgroundColor: theme.card, borderColor: theme.border },
                                ]}
                            >
                                <DateTimePicker
                                    value={tempTime}
                                    mode="time"
                                    display="spinner"
                                    onChange={(event, selectedDate) => {
                                        if (event.type === 'dismissed') {
                                            setShowTimePicker(false);
                                            setSelectedGoalPlanId(null);
                                            return;
                                        }

                                        if (selectedDate) {
                                            setTempTime(selectedDate);
                                        }
                                    }}
                                />

                                <TouchableOpacity
                                    style={[styles.confirmButton, { backgroundColor: theme.primary }]}
                                    onPress={() => {
                                        const time = formatTime(tempTime);
                                        createReminder(selectedGoalPlanId, time);
                                        setShowTimePicker(false);
                                        setSelectedGoalPlanId(null);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.confirmButtonText,
                                            { color: theme.isDark ? '#1D3A29' : '#FFFFFF' },
                                        ]}
                                    >
                                        확인
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <View style={[styles.reminderList, { borderTopColor: theme.border }]}>
                            {reminders.length === 0 ? (
                                <Text style={[styles.emptyText, { color: theme.text, opacity: 0.45 }]}>
                                    아직 등록된 시간이 없어요.
                                </Text>
                            ) : (
                                reminders.map((reminder) => (
                                    <View key={reminder.id} style={styles.reminderRow}>
                                        <View>
                                            <Text style={[styles.reminderTime, { color: theme.text }]}>
                                                {reminder.reminderTime}
                                            </Text>
                                            <Text style={[styles.reminderStatus, { color: theme.text, opacity: 0.5 }]}>
                                                {reminder.active ? '알림 켜짐' : '알림 꺼짐'}
                                            </Text>
                                        </View>

                                        <View style={styles.rightActions}>
                                            <Switch
                                                value={reminder.active}
                                                onValueChange={() => toggleReminder(reminder)}
                                            />

                                            <TouchableOpacity
                                                style={[
                                                    styles.deleteButton,
                                                    { backgroundColor: theme.background },
                                                ]}
                                                onPress={() => deleteReminder(goal.id, reminder.id)}
                                            >
                                                <Ionicons name="trash-outline" size={17} color="#FF5F5F" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>
                    </View>
                );
            })}


        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 54,
        paddingBottom: 80,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 42,
        height: 42,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
    },
    subtitle: {
        marginTop: 12,
        marginBottom: 24,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    goalCard: {
        borderRadius: 24,
        borderWidth: 1,
        marginBottom: 14,
        overflow: 'hidden',
    },
    goalHeader: {
        minHeight: 72,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    goalTitleBox: {
        flex: 1,
        paddingRight: 12,
    },
    goalTitle: {
        fontSize: 17,
        fontWeight: '900',
    },
    goalSubText: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: '700',
    },
    addSmallButton: {
        width: 36,
        height: 36,
        borderRadius: 14,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reminderList: {
        borderTopWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    reminderRow: {
        minHeight: 58,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    reminderTime: {
        fontSize: 20,
        fontWeight: '900',
    },
    reminderStatus: {
        marginTop: 3,
        fontSize: 12,
        fontWeight: '700',
    },
    rightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    deleteButton: {
        width: 34,
        height: 34,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        paddingVertical: 16,
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
    },
    timePickerBox: {
        marginTop: 10,
        marginBottom: 16,
        borderRadius: 22,
        borderWidth: 1,
        overflow: 'hidden',
        paddingBottom: 14,
    },

    confirmButton: {
        marginHorizontal: 16,
        height: 46,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    confirmButtonText: {
        fontSize: 15,
        fontWeight: '900',
    },
    cycleSection: {
        paddingHorizontal: 18,
        paddingBottom: 14,
    },

    cycleTitle: {
        fontSize: 12,
        fontWeight: '800',
        marginBottom: 8,
    },

    cycleEditRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    cycleRow: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    cycleSaveIconButton: {
        width: 36,
        height: 36,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },

    cycleChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
    },

    cycleChipText: {
        fontSize: 13,
        fontWeight: '800',
    },

    customCycleBox: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    customCycleInput: {
        width: 70,
        height: 40,
        borderRadius: 14,
        borderWidth: 1,
        paddingHorizontal: 12,
        fontSize: 14,
        fontWeight: '800',
        textAlign: 'center',
    },

    customCycleText: {
        fontSize: 13,
        fontWeight: '700',
    },

    cycleConfirmButton: {
        height: 40,
        paddingHorizontal: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },

    cycleConfirmText: {
        fontSize: 13,
        fontWeight: '900',
    },
});