import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import { useFocusEffect } from '@react-navigation/native';
import {RootStackParamList} from "../types/navigation";
import { useTheme } from '../theme/ThemeContext';
type Category = {
    id: string;
    name: string;
};

type GoalResponse = {
    id: number;
    title: string;
    emoji: string;
    characterId: number;
    characterName: string;
    motto: string;
    active: boolean;
};

type Props = NativeStackScreenProps<RootStackParamList, "RoutineManage">;

const COLORS = [
    '#DCEB54', // 기존 연두 (유지)
    '#C8E6C9', // 파스텔 민트
    '#FFB3BA', // 파스텔 핑크
    '#FFDFBA', // 파스텔 오렌지
    '#BAE1FF', // 파스텔 하늘
    '#D7BAFF', // 파스텔 보라
    '#FFF5BA', // 파스텔 옐로우
];

function stringToColor(str: string) {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    return COLORS[Math.abs(hash) % COLORS.length];
}


export default function RoutineManageScreen({ route, navigation }: Props) {
    const theme = useTheme();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [routinesMap, setRoutinesMap] = useState<Record<string, any[]>>({});

    const fetchData = async () => {
        try {
            const { userId } = route.params;

            if (!userId) {
                console.log('userId 없음');
                return;
            }

            const res = await api.get<GoalResponse[]>(`/goals/users/${userId}/active`);

            const data = res.data;

            const mapped: Category[] = data.map((item) => ({
                id: String(item.id),
                name: item.title,
            }));

            setCategories(mapped);
        } catch (err) {
            console.error('목표 목록 조회 에러:', err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData();

            // 루틴 캐시 초기화
            setRoutinesMap({});

            // 펼쳐진 카테고리가 있으면 루틴도 다시 조회
            if (expandedId) {
                fetchRoutines(expandedId);
            }
        }, [expandedId])
    );
    const handlePressCategory = (category: Category) => {
        navigation.navigate('RoutineCreate', { goalId: Number(category.id) });
    };

    const fetchRoutines = async (goalId: string) => {
        try {
            const res = await api.get(`/routines`, {
                params: { goalPlanId: goalId }
            });

            setRoutinesMap((prev) => ({
                ...prev,
                [goalId]: res.data,
            }));
        } catch (e) {
            console.error('루틴 조회 실패', e);
        }
    };

    const toggleExpand = async (goalId: string) => {
        if (expandedId === goalId) {
            setExpandedId(null);
        } else {
            setExpandedId(goalId);

            if (!routinesMap[goalId]) {
                await fetchRoutines(goalId);
            }
        }
    };

    const deleteRoutine = async (routineId: number, goalId: string) => {
        try {
            await api.delete(`/routines/${routineId}`);

            setRoutinesMap((prev) => ({
                ...prev,
                [goalId]: prev[goalId].filter((r) => r.id !== routineId),
            }));
        } catch (e) {
            console.error('루틴 삭제 실패', e);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.content}
        >
            <View style={styles.header}>

                {/* 상단 row */}
                <View style={styles.headerTop}>
                    <TouchableOpacity
                        style={[
                            styles.back,
                            { backgroundColor: theme.card, borderColor: theme.border }
                        ]}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={24} color={theme.text} />
                    </TouchableOpacity>

                    <Text style={[styles.headerTitle, { color: theme.text }]}>
                        루틴 관리
                    </Text>

                    {/* 오른쪽 균형용 빈칸 */}
                    <View style={{ width: 42 }} />
                </View>

                {/* 서브텍스트 */}
                <Text style={[styles.headerSubtitle, { color: theme.text, opacity: 0.55 }]}>
                    목표별 루틴을 추가하고 관리해요
                </Text>
            </View>

            {categories.map((category) => {
                const isExpanded = expandedId === category.id;
                const color = stringToColor(category.name);

                return (
                    <View
                        key={category.id}
                        style={[
                            styles.card,
                            { backgroundColor: theme.card, borderColor: theme.border },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.categoryButton}
                            activeOpacity={0.85}
                            onPress={() => toggleExpand(category.id)}
                        >
                            <View style={styles.categoryLeft}>
                                <View style={[styles.colorDot, { backgroundColor: color }]} />

                                <Text
                                    style={[styles.categoryText, { color: theme.text }]}
                                    numberOfLines={1}
                                >
                                    {category.name}
                                </Text>
                            </View>

                            <View style={styles.actionRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.iconButton,
                                        {
                                            backgroundColor: theme.background,
                                            borderColor: theme.border,
                                        },
                                    ]}
                                    onPress={() =>
                                        navigation.navigate('RoutineCreate', { goalId: Number(category.id) })
                                    }
                                >
                                    <Ionicons name="add" size={18} />
                                </TouchableOpacity>

                                <View
                                    style={[
                                        styles.iconButton,
                                        {
                                            backgroundColor: theme.background,
                                            borderColor: theme.border,
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                        size={18}
                                        color={theme.text}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>


                        {isExpanded && (
                            <View style={[styles.routineBox, { borderTopColor: theme.border }]}>
                                {(routinesMap[category.id] || []).length === 0 ? (
                                    <Text style={[styles.emptyText, { color: theme.text, opacity: 0.45 }]}>
                                        아직 등록된 루틴이 없어요.
                                    </Text>
                                ) : (
                                    (routinesMap[category.id] || []).map((routine, index) => (
                                        <View
                                            key={routine.id}
                                            style={[
                                                styles.routineRow,
                                                {
                                                    borderBottomColor:
                                                        index === (routinesMap[category.id] || []).length - 1
                                                            ? 'transparent'
                                                            : theme.border,
                                                },
                                            ]}
                                        >
                                            <View style={styles.routineLeft}>
                                                <View style={[styles.routineDot, { backgroundColor: color }]} />
                                                <Text
                                                    style={[styles.routineText, { color: theme.text }]}
                                                    numberOfLines={1}
                                                >
                                                    {routine.title}
                                                </Text>
                                            </View>

                                            <TouchableOpacity
                                                style={[
                                                    styles.deleteIconButton,
                                                    { backgroundColor: theme.background },
                                                ]}
                                                onPress={() => deleteRoutine(routine.id, category.id)}
                                            >
                                                <Ionicons name="trash-outline" size={17} color="#FF5F5F" />
                                            </TouchableOpacity>
                                        </View>
                                    ))
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
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 54,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'space-between',
    },
    header: {
        marginBottom: 28,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    headerTextBox: {
        flex: 1,
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
    },

    headerSubtitle: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
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
    description: {
        marginTop: 34,
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 24,
    },
    categoryList: {
        marginTop: 22,
        gap: 12,
    },
    categoryButton: {
        minHeight: 82,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoryText: {
        fontSize: 18,
        fontWeight: '800',
    },
    card: {
        marginBottom: 14,
        borderRadius: 26,
        borderWidth: 1,
        overflow: 'hidden',

        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 3,
    },
    iconButton: {
        width: 34,
        height: 34,
        borderRadius: 13,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    routineBox: {
        borderTopWidth: 1,
        padding: 12,
        gap: 8,
    },

    routineRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth : 1,
    },
    routineLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingRight: 10,
    },

    routineDot: {
        width: 6,
        height: 6,
        borderRadius: 999,
    },

    routineText: {
        fontSize: 14,
    },
    deleteIconButton: {
        width: 32,
        height: 32,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteBtn: {
        color: '#FF5F5F',
        fontSize: 13,
        fontWeight: '700',
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },

    categoryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    emptyText: {
        paddingVertical: 14,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});