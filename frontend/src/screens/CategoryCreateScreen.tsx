import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../api/client';
import { STORAGE_KEYS } from '../constants/storage';

export default function CategoryCreateScreen({ navigation }: any) {
    const [goalTitle, setGoalTitle] = useState('');
    const [motto, setMotto] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [alarmCycle, setAlarmCycle] = useState<number>(1);
    const [preferredEmoji, setPreferredEmoji] = useState('🌱');
    const [characterId, setCharacterId] = useState<number>(1);
    const [submitting, setSubmitting] = useState(false);

    const emojiOptions = ['🌱', '🔥', '💫', '📚', '🏃‍♂️','🚀'];
    const [showCustomEmojiInput, setShowCustomEmojiInput] = useState(false);
    const [customEmojiInput, setCustomEmojiInput] = useState('');

    const cycleOptions = [
        { label: '매일', value: 1 },
        { label: '3일마다', value: 3 },
        { label: '일주일에 1번', value: 7 },
    ];

    const characterOptions = [
        { id: 1, emoji: '🐥' },
        { id: 2, emoji: '🦔' },
        { id: 3, emoji: '🍦' },
        { id: 4, emoji: '🥔' },
        { id: 5, emoji: '🐰' },
        { id: 6, emoji: '🐯' },
    ];

    const [showCustomCycleInput, setShowCustomCycleInput] = useState(false);
    const [alarmInput, setAlarmInput] = useState('');

    const isSingleEmoji = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return false;

        const emojiRegex = /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/u;
        return emojiRegex.test(trimmed);
    };

    const handleSubmit = async () => {
        try {
            const userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);

            if (!userId) {
                Alert.alert('에러', '유저 정보가 없습니다.');
                return;
            }

            if (!goalTitle.trim()) {
                Alert.alert('입력 필요', '목표명을 입력해주세요.');
                return;
            }

            if (!startDate.trim() || !endDate.trim()) {
                Alert.alert('입력 필요', '시작일과 종료일을 입력해주세요.');
                return;
            }

            if (showCustomCycleInput && !alarmInput.trim()) {
                Alert.alert('입력 필요', '직접 입력한 주기를 입력해주세요.');
                return;
            }

            if (!alarmCycle || alarmCycle <= 0) {
                Alert.alert('입력 필요', '올바른 리마인더 주기를 입력해주세요.');
                return;
            }

            if (showCustomEmojiInput && !isSingleEmoji(customEmojiInput)) {
                Alert.alert('입력 필요', '이모지는 1개만 올바르게 입력해주세요.');
                return;
            }

            setSubmitting(true);

            const payload = {
                userId: Number(userId),
                goalTitle: goalTitle.trim(),
                motto: motto.trim(),
                startDate: startDate.trim(),
                endDate: endDate.trim(),
                alarmCycle,
                preferredEmoji,
                characterId,
            };

            await api.post('/goals', payload);

            Alert.alert('완료', '카테고리가 등록되었습니다.', [
                {
                    text: '확인',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (e: any) {
            console.log('카테고리 등록 실패', e);
            Alert.alert(
                '에러',
                e?.response?.data?.message ?? '카테고리 등록 중 오류가 발생했습니다.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerRow}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={20} color="#D8D8DD" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>카테고리 등록</Text>

                    <View style={styles.headerSpacer} />
                </View>

                <View style={styles.formCard}>
                    <Text style={styles.label}>목표명</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="예: 매일 운동하기"
                        placeholderTextColor="#6E6E73"
                        value={goalTitle}
                        onChangeText={setGoalTitle}
                    />

                    <Text style={styles.label}>다짐</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="한 줄 다짐"
                        placeholderTextColor="#6E6E73"
                        value={motto}
                        onChangeText={setMotto}
                    />

                    <View style={styles.row}>
                        <View style={styles.halfBox}>
                            <Text style={styles.label}>시작일</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor="#6E6E73"
                                value={startDate}
                                onChangeText={setStartDate}
                            />
                        </View>

                        <View style={styles.halfBox}>
                            <Text style={styles.label}>종료일</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor="#6E6E73"
                                value={endDate}
                                onChangeText={setEndDate}
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>리마인더 주기</Text>
                    <View style={styles.chipRow}>
                        {cycleOptions.map((item) => {
                            const selected = alarmCycle === item.value && !showCustomCycleInput;

                            return (
                                <TouchableOpacity
                                    key={item.value}
                                    style={[
                                        styles.cycleChip,
                                        selected && styles.cycleChipSelected,
                                    ]}
                                    onPress={() => {
                                        setAlarmCycle(item.value);
                                        setAlarmInput(String(item.value));
                                        setShowCustomCycleInput(false);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.cycleChipText,
                                            selected && styles.cycleChipTextSelected,
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
                                showCustomCycleInput && styles.cycleChipSelected,
                            ]}
                            onPress={() => setShowCustomCycleInput((prev) => !prev)}
                        >
                            <Text
                                style={[
                                    styles.cycleChipText,
                                    showCustomCycleInput && styles.cycleChipTextSelected,
                                ]}
                            >
                                직접 입력
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {showCustomCycleInput && (
                        <View style={styles.customCycleBox}>
                            <TextInput
                                style={styles.input}
                                placeholder="예: 1 (매일)"
                                placeholderTextColor="#6E6E73"
                                keyboardType="numeric"
                                value={alarmInput}
                                onChangeText={(text) => {
                                    setAlarmInput(text);

                                    const num = Number(text);
                                    if (!isNaN(num) && num > 0) {
                                        setAlarmCycle(num);
                                    }
                                }}
                            />
                            <Text style={styles.helperText}>
                                숫자 입력: 1 = 매일, 3 = 3일마다
                            </Text>
                        </View>
                    )}

                    <Text style={styles.label}>이모지</Text>
                    <View style={styles.emojiRow}>
                        {emojiOptions.map((emoji) => {
                            const selected = preferredEmoji === emoji && !showCustomEmojiInput;

                            return (
                                <TouchableOpacity
                                    key={emoji}
                                    style={[
                                        styles.emojiButton,
                                        selected && styles.emojiButtonSelected,
                                    ]}
                                    onPress={() => {
                                        setPreferredEmoji(emoji);
                                        setCustomEmojiInput('');
                                        setShowCustomEmojiInput(false);
                                    }}
                                >
                                    <Text style={styles.emojiText}>{emoji}</Text>
                                </TouchableOpacity>
                            );
                        })}

                        <TouchableOpacity
                            style={[
                                styles.emojiButton,
                                showCustomEmojiInput && styles.emojiButtonSelected,
                            ]}
                            onPress={() => setShowCustomEmojiInput((prev) => !prev)}
                        >
                            <Text style={styles.emojiPlusText}>＋</Text>
                        </TouchableOpacity>
                    </View>

                    {showCustomEmojiInput && (
                        <View style={styles.customCycleBox}>
                            <TextInput
                                style={styles.input}
                                placeholder="이모지 1개 입력"
                                placeholderTextColor="#6E6E73"
                                value={customEmojiInput}
                                onChangeText={(text) => {
                                    setCustomEmojiInput(text);

                                    if (isSingleEmoji(text)) {
                                        setPreferredEmoji(text.trim());
                                    }
                                }}
                                maxLength={4}
                            />
                            <Text style={styles.helperText}>
                                이모지 1개만 입력할 수 있어요.
                            </Text>
                        </View>
                    )}

                    <Text style={styles.label}>캐릭터</Text>
                    <View style={styles.characterRow}>
                        {characterOptions.map((item) => {
                            const selected = characterId === item.id;

                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.characterButton,
                                        selected && styles.characterButtonSelected,
                                    ]}
                                    onPress={() => setCharacterId(item.id)}
                                >
                                    <View style={styles.characterEmojiWrap}>
                                        <Text style={styles.characterEmoji}>{item.emoji}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    <Text style={styles.submitText}>
                        {submitting ? '등록 중...' : '등록하기'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 40,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 22,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 16,
        backgroundColor: '#17171B',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#EDEDF0',
        fontSize: 16,
        fontWeight: '800',
    },
    headerSpacer: {
        width: 40,
    },
    formCard: {
        backgroundColor: '#151518',
        borderRadius: 28,
        paddingHorizontal: 16,
        paddingVertical: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },
    label: {
        color: '#8E8E93',
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        height: 48,
        borderRadius: 16,
        backgroundColor: '#0F0F12',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 14,
        color: '#F4F4F5',
        fontSize: 15,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfBox: {
        flex: 1,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    cycleChip: {
        height: 40,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: '#0F0F12',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cycleChipSelected: {
        backgroundColor: '#B8F1C6',
        borderColor: '#C9F7D4',
    },
    cycleChipText: {
        color: '#A1A1AA',
        fontSize: 13,
        fontWeight: '700',
    },
    cycleChipTextSelected: {
        color: '#1D3A29',
    },
    customCycleBox: {
        marginTop: 10,
    },
    helperText: {
        marginTop: 6,
        color: '#7E7E88',
        fontSize: 12,
    },
    emojiRow: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
    },
    emojiButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#0F0F12',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emojiButtonSelected: {
        backgroundColor: '#B8F1C6',
        borderColor: '#C9F7D4',
    },
    emojiText: {
        fontSize: 20,
    },
    emojiPlusText: {
        fontSize: 22,
        color: '#A1A1AA',
        fontWeight: '700',
    },
    characterRow: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
    },
    characterButton: {
        width:52,
        height: 52,
        borderRadius: 18,
        backgroundColor: '#0F0F12',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
    },
    characterButtonSelected: {
        backgroundColor: '#B8F1C6',
        borderColor: '#C9F7D4',
        transform: [{scale:1.05}],
    },
    characterEmojiWrap:{
      width: 28,
      height: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    characterEmoji: {
        fontSize: 24,
        lineHeight: 24,
        textAlign: 'center',
        includeFontPadding: false,
    },
    characterText: {
        color: '#A1A1AA',
        fontSize: 13,
        fontWeight: '700',
    },
    characterTextSelected: {
        color: '#1D3A29',
    },
    submitButton: {
        marginTop: 22,
        height: 54,
        borderRadius: 20,
        backgroundColor: '#B8F1C6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitText: {
        color: '#1D3A29',
        fontSize: 16,
        fontWeight: '800',
    },
});