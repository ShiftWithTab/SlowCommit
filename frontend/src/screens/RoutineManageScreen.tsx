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
import {RootStackParamList} from "../types/navigation";

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
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [routinesMap, setRoutinesMap] = useState<Record<string, any[]>>({});

    useEffect(() => {
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

        fetchData();
    }, [route.params]);

    const handlePressCategory = (category: Category) => {
        navigation.navigate('RoutineCreate', { goalId: category.id });
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
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.back}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>루틴 관리</Text>
            </View>

            <Text style={styles.description}>
                카테고리를 선택하여 해당 카테고리의 루틴을 추가할 수 있습니다.
            </Text>

            {categories.map((category) => {
                const isExpanded = expandedId === category.id;
                const color = stringToColor(category.name);

                return (
                    <View key={category.id} style={styles.card}>
                        {/* 🔽 헤더 */}
                        <TouchableOpacity
                            style={[styles.categoryButton, { color }]}
                            onPress={() => toggleExpand(category.id)}
                        >
                            <Text style={[styles.categoryText, { color }]}>
                                {category.name}
                            </Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Ionicons name="add-circle-outline" size={26} color="#fff"
                                          onPress={() =>
                                              navigation.navigate('RoutineCreate', { goalId: category.id })
                                          }
                                />

                                <Text style={styles.arrow}>
                                    {isExpanded ? '▲' : '▼'}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* 🔽 펼쳐진 루틴 리스트 */}
                        {isExpanded && (
                            <View style={styles.routineBox}>
                                {(routinesMap[category.id] || []).map((routine) => (
                                    <View key={routine.id} style={styles.routineRow}>
                                        <Text style={styles.routineText}>
                                            {routine.title}
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() => deleteRoutine(routine.id, category.id)}
                                        >
                                            <Text style={styles.deleteBtn}>삭제</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
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
        backgroundColor: '#050506',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 54,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#050506',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    back: {
        position: 'absolute',
        left: 0,
        width: 42,
        height: 42,
        borderRadius: 16,
        backgroundColor: '#18181E',
        borderWidth: 1,
        borderColor: '#24242C',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '800',
    },
    description: {
        marginTop: 34,
        color: '#8B8B94',
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 24,
    },
    categoryList: {
        marginTop: 22,
        gap: 12,
    },
    categoryButton: {
        height: 58,
        borderRadius: 18,
        backgroundColor: '#17171B',
        borderWidth: 1,
        borderColor: '#25252B',
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoryText: {
        fontSize: 18,
        fontWeight: '800',
    },
    plusCircle: {
        width: 34,
        height: 34,
        borderRadius: 14,
        backgroundColor: '#0D0D10',
        borderWidth: 1,
        borderColor: '#202027',
        alignItems: 'center',
        justifyContent: 'center',
    },
    plusText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '500',
        marginTop: -2,
    },
    card: {
        borderRadius: 18,
        backgroundColor: '#17171B',
        borderWidth: 1,
        borderColor: '#25252B',
        overflow: 'hidden',
    },

    arrow: {
        color: '#8B8B94',
        fontSize: 12,
    },

    routineBox: {
        borderTopWidth: 1,
        borderTopColor: '#25252B',
        padding: 12,
        gap: 8,
    },

    routineRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    routineText: {
        color: '#fff',
        fontSize: 14,
    },

    deleteBtn: {
        color: '#FF5F5F',
        fontSize: 13,
        fontWeight: '700',
    },
});