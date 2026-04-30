import React, {useEffect, useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert, Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../api/client';
import { STORAGE_KEYS } from '../constants/storage';
import { useTheme} from "../theme/ThemeContext";
import { Calendar } from 'react-native-calendars';
import { Modal } from 'react-native';
export default function CategoryCreateScreen({ navigation }: any) {
    const theme = useTheme();

    const [goalTitle, setGoalTitle] = useState('');
    const [motto, setMotto] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const today = new Date().toISOString().slice(0, 10);
    const formatDate = (date: Date) => date.toISOString().slice(0, 10);
    const [showCalendar, setShowCalendar] = useState(false);
    const onDayPress = (day: any) => {
        const selectedDate = day.dateString;

        if (selecting === 'start') {
            setStartDate(selectedDate);

            if (endDate && new Date(selectedDate) > new Date(endDate)) {
                setEndDate('');
            }

            setSelecting('end');
            return;
        }

        if (selecting === 'end') {
            if (!startDate) {
                setStartDate(selectedDate);
                setEndDate('');
                setSelecting('end');
                return;
            }

            // 종료일로 누른 날짜가 시작일보다 작으면
            // 그 날짜를 새 시작일로 잡고 종료일 초기화
            if (new Date(selectedDate) < new Date(startDate)) {
                setStartDate(selectedDate);
                setEndDate('');
                setSelecting('end');
                return;
            }

            setEndDate(selectedDate);
            setShowCalendar(false);
        }
    };
    const getMarkedDates = () => {
        if (!startDate) return {};

        let marked: any = {
            [startDate]: { startingDay: true, color: '#B8F1C6', textColor: '#1D3A29' },
        };

        if (endDate) {
            let current = new Date(startDate);
            const end = new Date(endDate);

            while (current <= end) {
                const dateStr = formatDate(current);

                if (dateStr !== startDate && dateStr !== endDate) {
                    marked[dateStr] = {
                        color: '#DDF7E5',
                        textColor: '#1D3A29',
                    };
                }

                current.setDate(current.getDate() + 1);
            }

            marked[endDate] = {
                endingDay: true,
                color: '#B8F1C6',
                textColor: '#1D3A29',
            };
        }

        return marked;
    };
    const [selecting, setSelecting] = useState<'start' | 'end'>('start');


    const [preferredEmoji, setPreferredEmoji] = useState('🌱');
    const [characterId, setCharacterId] = useState<number>(1);
    const [submitting, setSubmitting] = useState(false);

    const emojiOptions = ['🌱', '🔥', '💫', '📚', '🏃‍️','🚀'];
    const [showCustomEmojiInput, setShowCustomEmojiInput] = useState(false);
    const [customEmojiInput, setCustomEmojiInput] = useState('');

    const characterOptions = [
        { id: 1, emoji: '🐥' },
        { id: 2, emoji: '🦔' },
        { id: 3, emoji: '🍦' },
        { id: 4, emoji: '🥔' },
        { id: 5, emoji: '🐰' },
        { id: 6, emoji: '🐯' },
    ];



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
    const isFormValid =
        goalTitle.trim().length > 0 &&
        startDate.trim().length > 0 &&
        endDate.trim().length > 0 &&
        (!showCustomEmojiInput || customEmojiInput.trim().length > 0);
    useEffect(() => {
        if (startDate && endDate) {
            setShowCalendar(false);
        }
    }, [startDate, endDate]);
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerRow}>
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={20} color={theme.text} />
                    </TouchableOpacity>

                    <Text style={[styles.headerTitle, { color: theme.text }]}>카테고리 등록</Text>

                    <View style={styles.headerSpacer} />
                </View>

                <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.label, { color: theme.text, opacity: 0.6 }]}>목표명</Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: theme.background,
                                borderColor: theme.border,
                                color: theme.text,
                            },
                        ]}
                        placeholder="목표명 (예: 정보처리기사 합격)"
                        placeholderTextColor={theme.isDark ? '#7E7E88' : '#9CA3AF'}
                        value={goalTitle}
                        onChangeText={setGoalTitle}
                    />

                    <Text style={[styles.label, { color: theme.text, opacity: 0.6 }]}>다짐</Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: theme.background,
                                borderColor: theme.border,
                                color: theme.text,
                            },
                        ]}
                        placeholder="한 줄 다짐"
                        placeholderTextColor={theme.isDark ? '#7E7E88' : '#9CA3AF'}
                        value={motto}
                        onChangeText={setMotto}
                    />

                    <View style={styles.row}>
                        <View style={styles.halfBox}>
                            <Text style={styles.label}>시작일</Text>
                            <Pressable onPress={() => {
                                setSelecting('start');
                                setShowCalendar(true);
                            }}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: theme.background,
                                            borderColor: theme.border,
                                            color: theme.text,
                                        },
                                    ]}
                                    value={startDate}
                                    placeholder="날짜 선택"
                                    editable={false}
                                    pointerEvents="none"
                                />
                            </Pressable>
                        </View>

                        <View style={styles.halfBox}>
                            <Text style={styles.label}>종료일</Text>
                            <Pressable onPress={() => {
                                setSelecting('end');
                                setShowCalendar(true);
                            }}>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: theme.background,
                                            borderColor: theme.border,
                                            color: theme.text,
                                        },
                                    ]}
                                    value={endDate}
                                    placeholder="날짜 선택"
                                    editable={false}
                                    pointerEvents="none"
                                />
                            </Pressable>
                        </View>
                    </View>
                    {showCalendar && (
                        <View style={[styles.calendarBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <Calendar
                                minDate={today}
                                onDayPress={onDayPress}
                                markingType="period"
                                markedDates={getMarkedDates()}
                                theme={{
                                    backgroundColor: theme.card,
                                    calendarBackground: theme.card,
                                    textSectionTitleColor: '#8E8E93',
                                    dayTextColor: theme.text,
                                    todayTextColor: theme.primary,
                                    arrowColor: theme.primary,
                                    monthTextColor: theme.text,
                                    textDayFontWeight: '600',
                                    textMonthFontWeight: '800',
                                    textDayHeaderFontWeight: '600',
                                }}
                            />
                        </View>
                    )}
                    {startDate && endDate && (
                        <View style={[styles.dateRangeBox, { backgroundColor: theme.background, borderColor: theme.primary }]}>
                            <Text style={[styles.dateRangeText, { color: theme.text }]}>
                                {startDate} ~ {endDate}
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
                                        { backgroundColor: theme.background, borderColor: theme.border },
                                        selected && { backgroundColor: theme.primary, borderColor: theme.primary },
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
                                { backgroundColor: theme.background, borderColor: theme.border },
                                showCustomEmojiInput && { backgroundColor: theme.primary, borderColor: theme.primary },
                            ]}
                            onPress={() => setShowCustomEmojiInput((prev) => !prev)}
                        >
                            <Ionicons name="add-circle-outline" size={18} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    {showCustomEmojiInput && (
                        <View style={styles.customCycleBox}>
                            <TextInput
                                style={[styles.input,
                                    {
                                        backgroundColor: theme.background,
                                        borderColor: theme.border,
                                        color: theme.text,
                                    },
                                ]}
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
                                        { backgroundColor: theme.background, borderColor: theme.border },
                                        selected && { backgroundColor: theme.primary, borderColor: theme.primary },
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
                    style={[styles.submitButton,
                        { backgroundColor: isFormValid ? theme.primary : theme.card, opacity: isFormValid ? 1 : 0.5,},
                        submitting && styles.submitButtonDisabled
                    ]}
                    onPress={handleSubmit}
                    disabled={!isFormValid || submitting}
                >
                    <Text style={[
                        styles.submitText,
                        {
                            color: theme.isDark ? '#1D3A29' : '#1D3A29',
                        },
                    ]}>
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
        width: 42,
        height: 42,
        borderRadius: 16,
        backgroundColor: '#18181E',
        borderWidth: 1,
        borderColor: '#24242C',
        alignItems: 'center',
        justifyContent: 'center',
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
    calendarBox: {
        marginTop: 14,
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
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
    dateRangeBox: {
        marginTop: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 16,
        borderWidth: 1,
    },
    dateRangeText: {
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'center',
    },
});