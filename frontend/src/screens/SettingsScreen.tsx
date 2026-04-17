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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { api } from '../api/client';
import { colors } from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';
import InputModal from '../components/InputModal';

export default function SettingsScreen() {
    const [userId, setUserId] = useState<string | null>(null);

    const [username, setUsername] = useState('');
    const [usernameModalVisible, setUsernameModalVisible] = useState(false);

    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
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
            const userRes = await api.get(`/users/${userId}`);
            setUsername(userRes.data.username);
            setTheme(userRes.data.theme);

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

    // ✅ username 저장 (모달용)
    const saveUsername = async (newName: string) => {
        if (!userId) return;

        try {
            setUsername(newName);

            await api.patch(`/users/${userId}/username`, null, {
                params: { username: newName },
            });

            setUsernameModalVisible(false);
        } catch (e) {
            console.error(e);
        }
    };

    const saveTheme = async (value: 'light' | 'dark') => {
        if (!userId) return;

        try {
            setTheme(value);
            await api.patch(`/users/${userId}/theme`, null, {
                params: { theme: value },
            });
        } catch (e) {
            console.error(e);
        }
    };

    const updateLocalGoal = (id: number, field: string, value: any) => {
        setGoalPlans((prev) =>
            prev.map((g) =>
                g.id === id ? { ...g, [field]: value } : g
            )
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
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            enableOnAndroid
            extraScrollHeight={120}
            keyboardShouldPersistTaps="handled"
        >
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#4CAF50"
                    />
                }
            >
                <Text style={styles.title}>Settings</Text>

                {/* 계정 */}
                <View style={styles.accountRow}>
                    <View style={styles.accountInfo}>
                        <Text style={styles.accountLabel}>계정 이름</Text>
                        <Text style={styles.accountValue}>{username}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.editSmallButton}
                        onPress={() => setUsernameModalVisible(true)}
                    >
                        <Text style={styles.editSmallText}>수정</Text>
                    </TouchableOpacity>
                </View>
                {/* 테마 */}
                <Text style={styles.section}>테마</Text>
                <View style={styles.row}>
                    <TouchableOpacity
                        style={[
                            styles.toggle,
                            theme === 'light' && styles.activeToggle,
                        ]}
                        onPress={() => saveTheme('light')}
                    >
                        <Text>☀️ Light</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.toggle,
                            theme === 'dark' && styles.activeToggle,
                        ]}
                        onPress={() => saveTheme('dark')}
                    >
                        <Text>🌙 Dark</Text>
                    </TouchableOpacity>
                </View>

                {/* 목표 */}
                <Text style={styles.section}>목표 관리</Text>

                {goalPlans.map((goal) => {
                    const isExpanded = expandedId === goal.id;
                    const isEditable = goal.active;

                    return (
                        <View key={goal.id} style={styles.card}>
                            <TouchableOpacity
                                style={styles.cardHeader}
                                onPress={() => toggleExpand(goal.id)}
                            >
                                <Text style={styles.cardTitle}>
                                    {goal.title}
                                </Text>

                                <View style={styles.right}>
                                    <Text
                                        style={[
                                            styles.statusText,
                                            goal.active
                                                ? styles.activeText
                                                : styles.inactiveText,
                                        ]}
                                    >
                                        {goal.active ? '진행중' : '완료'}
                                    </Text>

                                    <Text style={styles.arrow}>
                                        {isExpanded ? '▲' : '▼'}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {isExpanded && (
                                <View style={styles.editBox}>
                                    {isEditable ? (
                                        <>
                                            <View style={styles.fieldRow}>
                                                <Text style={styles.fieldLabel}>목표</Text>
                                                <TextInput
                                                    style={styles.fieldInput}
                                                    value={goal.title}
                                                    onChangeText={(t) =>
                                                        updateLocalGoal(goal.id, 'title', t)
                                                    }
                                                />
                                            </View>

                                            <View style={styles.fieldRow}>
                                                <Text style={styles.fieldLabel}>이모지</Text>
                                                <TextInput
                                                    style={styles.fieldInput}
                                                    value={goal.emoji}
                                                    onChangeText={(t) =>
                                                        updateLocalGoal(goal.id, 'emoji', t)
                                                    }
                                                />
                                            </View>

                                            <Text style={styles.fieldLabel}>
                                                캐릭터
                                            </Text>

                                            <View style={styles.characterList}>
                                                {characters.map((c) => {
                                                    const isSelected =
                                                        goal.characterId === c.id;

                                                    return (
                                                        <TouchableOpacity
                                                            key={c.id}
                                                            style={[
                                                                styles.characterItem,
                                                                isSelected &&
                                                                styles.selectedCharacter,
                                                            ]}
                                                            onPress={() =>
                                                                updateLocalGoal(
                                                                    goal.id,
                                                                    'characterId',
                                                                    c.id
                                                                )
                                                            }
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: isSelected
                                                                        ? '#fff'
                                                                        : colors.text,
                                                                }}
                                                            >
                                                                {c.name}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>

                                            <TouchableOpacity
                                                style={styles.smallButton}
                                                onPress={() => saveGoal(goal.id)}
                                            >
                                                <Text style={styles.buttonText}>
                                                    저장
                                                </Text>
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <Text style={styles.readText}>
                                            🔒 수정 불가 (완료된 목표)
                                        </Text>
                                    )}
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>

            {/* ✅ MODAL */}
            <InputModal
                visible={usernameModalVisible}
                title="계정 이름 변경"
                value={username}
                onCancel={() => setUsernameModalVisible(false)}
                onSubmit={saveUsername}
            />
        </KeyboardAwareScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        paddingTop: 64,
        paddingHorizontal: 20,
        paddingBottom: 80,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: colors.text,
        marginBottom: 24,
    },
    section: {
        fontSize: 14,
        color: colors.muted,
        marginTop: 24,
        marginBottom: 10,
        fontWeight: '600',
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        color: colors.text,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.border,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 6,
    },
    smallButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    toggle: {
        flex: 1,
        padding: 12,
        backgroundColor: colors.surface,
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    activeToggle: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.text,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    activeText: {
        color: '#4CAF50',
    },
    inactiveText: {
        color: '#999',
    },
    arrow: {
        fontSize: 12,
        color: '#999',
    },
    editBox: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
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
        color: colors.muted,
    },

    fieldInput: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 10,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
    },
    characterList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    characterItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    selectedCharacter: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    readText: {
        color: colors.muted,
    },
    accountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },

    accountInfo: {
        flexDirection: 'column',
    },

    accountLabel: {
        fontSize: 12,
        color: colors.muted,
        marginBottom: 2,
    },

    accountValue: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.text,
    },

    editSmallButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
    },

    editSmallText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
});