import { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { api } from '../api/client';
import { STORAGE_KEYS } from '../constants/storage';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'GoalManage'>;

export default function GoalManageScreen({ navigation }: Props) {
    const theme = useTheme();

    const [userId, setUserId] = useState<string | null>(null);
    const [goalPlans, setGoalPlans] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [characters, setCharacters] = useState<any[]>([]);

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (!userId) return;
        loadData();
    }, [userId]);

    const init = async () => {
        const storedId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
        if (!storedId) return;
        setUserId(storedId);
    };

    const loadData = async () => {
        if (!userId) return;

        try {
            const goalRes = await api.get(`/goals/users/${userId}`);
            setGoalPlans(goalRes.data);
        } catch (e) {
            console.error(e);
        }
    };

    const loadCharacters = async () => {
        try {
            const res = await api.get('/characters');
            setCharacters(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const onRefresh = async () => {
        if (!userId) return;
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const updateLocalGoal = (id: number, field: string, value: any) => {
        setGoalPlans((prev) =>
            prev.map((g) => (g.id === id ? { ...g, [field]: value } : g))
        );
    };

    const saveGoal = async (goalId: number) => {
        try {
            const goal = goalPlans.find((g) => g.id === goalId);
            if (!goal) return;

            const body = {
                title: goal.title,
                emoji: goal.emoji,
                characterId: goal.characterId,
            };

            const res = await api.patch(`/goals/${goalId}`, body);

            setGoalPlans((prev) =>
                prev.map((g) => (g.id === goalId ? res.data : g))
            );
        } catch (e) {
            console.error(e);
        }
    };

    const toggleExpand = async (id: number) => {
        setExpandedId((prev) => (prev === id ? null : id));

        if (expandedId !== id) {
            await loadCharacters();
        }
    };

    if (!userId) return null;

    return (
        <ScrollView
            style={[styles.screen, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={theme.primary}
                />
            }
        >
            <View style={styles.headerTop}>
                <TouchableOpacity
                    style={[
                        styles.back,
                        { backgroundColor: theme.card, borderColor: theme.border },
                    ]}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color={theme.text} />
                </TouchableOpacity>

                <Text style={[styles.title, { color: theme.text }]}>목표 관리</Text>

                <View style={{ width: 42 }} />
            </View>

            <Text style={[styles.subtitle, { color: theme.text, opacity: 0.55 }]}>
                진행 중인 목표를 수정하고 완료된 목표를 확인해요
            </Text>

            {goalPlans.map((goal) => {
                const isExpanded = expandedId === goal.id;
                const isEditable = goal.active;

                return (
                    <View
                        key={goal.id}
                        style={[
                            styles.card,
                            { backgroundColor: theme.card, borderColor: theme.border },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.cardHeader}
                            onPress={() => toggleExpand(goal.id)}
                            activeOpacity={0.85}
                        >
                            <Text
                                style={[styles.cardTitle, { color: theme.text }]}
                                numberOfLines={1}
                            >
                                {goal.title}
                            </Text>

                            <View style={styles.right}>
                                <Text
                                    style={[
                                        styles.statusText,
                                        { color: goal.active ? theme.primary : '#999' },
                                    ]}
                                >
                                    {goal.active ? '진행중' : '완료'}
                                </Text>

                                <Ionicons
                                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                    size={18}
                                    color={theme.text}
                                />
                            </View>
                        </TouchableOpacity>

                        {isExpanded && (
                            <View style={[styles.editBox, { borderTopColor: theme.border }]}>
                                {isEditable ? (
                                    <>
                                        <View style={styles.fieldRow}>
                                            <Text style={[styles.fieldLabel, { color: theme.text, opacity: 0.6 }]}>
                                                목표
                                            </Text>
                                            <TextInput
                                                style={[
                                                    styles.fieldInput,
                                                    {
                                                        backgroundColor: theme.background,
                                                        borderColor: theme.border,
                                                        color: theme.text,
                                                    },
                                                ]}
                                                value={goal.title}
                                                onChangeText={(t) =>
                                                    updateLocalGoal(goal.id, 'title', t)
                                                }
                                            />
                                        </View>

                                        <View style={styles.fieldRow}>
                                            <Text style={[styles.fieldLabel, { color: theme.text, opacity: 0.6 }]}>
                                                이모지
                                            </Text>
                                            <TextInput
                                                style={[
                                                    styles.fieldInput,
                                                    {
                                                        backgroundColor: theme.background,
                                                        borderColor: theme.border,
                                                        color: theme.text,
                                                    },
                                                ]}
                                                value={goal.emoji}
                                                onChangeText={(t) =>
                                                    updateLocalGoal(goal.id, 'emoji', t)
                                                }
                                            />
                                        </View>

                                        <Text style={[styles.characterTitle, { color: theme.text, opacity: 0.6 }]}>
                                            캐릭터
                                        </Text>

                                        <View style={styles.characterList}>
                                            {characters.map((c) => {
                                                const isSelected = goal.characterId === c.id;

                                                return (
                                                    <TouchableOpacity
                                                        key={c.id}
                                                        style={[
                                                            styles.characterItem,
                                                            {
                                                                backgroundColor: isSelected
                                                                    ? theme.primary
                                                                    : theme.background,
                                                                borderColor: isSelected
                                                                    ? theme.primary
                                                                    : theme.border,
                                                            },
                                                        ]}
                                                        onPress={() =>
                                                            updateLocalGoal(goal.id, 'characterId', c.id)
                                                        }
                                                    >
                                                        <Text
                                                            style={{
                                                                color: isSelected
                                                                    ? theme.isDark
                                                                        ? '#1D3A29'
                                                                        : '#FFFFFF'
                                                                    : theme.text,
                                                                fontWeight: '700',
                                                            }}
                                                        >
                                                            {c.name}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>

                                        <TouchableOpacity
                                            style={[styles.saveButton, { backgroundColor: theme.primary }]}
                                            onPress={() => saveGoal(goal.id)}
                                        >
                                            <Text style={styles.saveButtonText}>저장</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <Text style={[styles.readText, { color: theme.text, opacity: 0.55 }]}>
                                        🔒 완료된 목표는 수정할 수 없어요.
                                    </Text>
                                )}
                            </View>
                        )}
                    </View>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        paddingTop: 54,
        paddingHorizontal: 20,
        paddingBottom: 80,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    back: {
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
        marginTop: 10,
        marginBottom: 28,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    card: {
        borderRadius: 22,
        borderWidth: 1,
        marginBottom: 14,
        overflow: 'hidden',
    },
    cardHeader: {
        minHeight: 72,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardTitle: {
        flex: 1,
        fontSize: 17,
        fontWeight: '900',
        marginRight: 12,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '800',
    },
    editBox: {
        borderTopWidth: 1,
        padding: 16,
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    fieldLabel: {
        width: 60,
        fontSize: 13,
        fontWeight: '700',
    },
    fieldInput: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderWidth: 1,
        fontSize: 14,
        fontWeight: '600',
    },
    characterTitle: {
        fontSize: 13,
        fontWeight: '700',
        marginTop: 4,
    },
    characterList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 10,
    },
    characterItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    saveButton: {
        marginTop: 16,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#1D3A29',
        fontWeight: '900',
    },
    readText: {
        fontSize: 14,
        fontWeight: '600',
    },
});