import React, { useMemo, useState } from 'react';
import type { DimensionValue } from 'react-native';

import {
    Alert,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import FloatingField from '../components/FloatingField';
import PrimaryButton from '../components/PrimaryButton';
import StepLayout from '../components/StepLayout';
import {
    checkNickname,
    createGuestUser,
    saveUsername,
    setupOnboarding,
} from '../api/onboardingApi';
import type { CycleOption, Step } from '../types/onboarding';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const cycleOptions: CycleOption[] = ['매일', '주 3회', '주 5회'];
const emojiOptions = ['🌱', '🔥', '💫', '📚', '🏃‍♂️','🚀'];
const characterOptions = [
    { id: 1, emoji: '🐥' },
    { id: 2, emoji: '🦔' },
    { id: 3, emoji: '🍦' },
    { id: 4, emoji: '🥔' },
    { id: 5, emoji: '🐰' },
    { id: 6, emoji: '🐯' },
];

export default function OnboardingScreen() {
    const navigation = useNavigation<NavigationProp>();

    const [step, setStep] = useState<Step>(1);
    const [userId, setUserId] = useState<number | null>(null);

    const [nickname, setNickname] = useState('');
    const [nicknameChecked, setNicknameChecked] = useState(false);
    const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);
    const [nicknameMessage, setNicknameMessage] = useState('');

    const [goalTitle, setGoalTitle] = useState('');
    const [motto, setMotto] = useState('');
    const [deadline, setDeadline] = useState('2026-04-30');
    const [cycle, setCycle] = useState<CycleOption>('주 5회');
    const [preferredEmoji, setPreferredEmoji] = useState('🌱');
    const [characterName, setCharacterName] = useState('');

    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [showCustomEmojiInput, setShowCustomEmojiInput] = useState(false);
    const [customEmojiInput, setCustomEmojiInput] = useState('');

    const [characterId, setCharacterId] = useState<number | null>(1);

    const totalSteps = 8;

    const progressText = useMemo(
        () => `${Math.min(step, totalSteps)}/${totalSteps}`,
        [step]
    );

    const progressWidth = useMemo<DimensionValue>(
        () => `${(Math.min(step, totalSteps) / totalSteps) * 100}%`,
        [step]
    );

    const canGoNickname =
        nickname.trim() !== '' && nicknameChecked && nicknameAvailable === true;
    const canGoGoalTitle = goalTitle.trim() !== '';
    const canGoMotto = motto.trim() !== '';
    const canGoDeadline = deadline.trim() !== '';
    const canGoCycle = cycle.trim() !== '';
    const canGoEmoji = showCustomEmojiInput
        ? customEmojiInput.trim() !== ''
        : preferredEmoji.trim() !== '';
    const canComplete = characterName.trim() !== '' && characterId !== null;

    const goNext = () =>
        setStep((prev) => {
            if (prev === totalSteps) return totalSteps as Step;
            return (prev + 1) as Step;
        });

    const goPrev = () =>
        setStep((prev) => {
            if (prev === 1) return 1;
            return (prev - 1) as Step;
        });

    const handleNicknameChange = (value: string) => {
        setNickname(value);
        setNicknameChecked(false);
        setNicknameAvailable(null);
        setNicknameMessage('');
    };

    const handleEmojiNext = () => {
        if (showCustomEmojiInput) {
            if (!isSingleEmoji(customEmojiInput)) {
                Alert.alert('입력 필요', '이모지는 1개만 올바르게 입력해주세요.');
                return;
            }

            setPreferredEmoji(customEmojiInput.trim());
        }

        goNext();
    };
    const cycleToNumber = (cycle: CycleOption): number => {
        switch (cycle) {
            case '매일':
                return 1;
            case '주 3회':
                return 3;
            case '주 5회':
                return 5;
            default:
                return 1;
        }
    };

    const handleStart = async () => {
        try {
            setLoading(true);
            const data = await createGuestUser();
            setUserId(data.userId);
            goNext();
        } catch (error) {
            console.error(error);
            Alert.alert('게스트 생성 실패', '서버 연결에 실패했어요.');
        } finally {
            setLoading(false);
        }
    };

    const handleNicknameCheck = async () => {
        const trimmed = nickname.trim();
        if (!trimmed) {
            Alert.alert('안내', '별명을 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            const data = await checkNickname(trimmed);
            setNicknameChecked(true);
            setNicknameAvailable(data.available);
            setNicknameMessage(data.message);
        } catch (error) {
            console.error(error);
            Alert.alert('중복확인 실패', '별명 중복확인 중 오류가 발생했어요.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNicknameAndNext = async () => {
        if (!userId) {
            Alert.alert('오류', '게스트 사용자 정보가 없어요.');
            return;
        }

        try {
            setLoading(true);
            await saveUsername({
                userId,
                username: nickname.trim(),
            });
            goNext();
        } catch (error) {
            console.error(error);
            Alert.alert('별명 저장 실패', '별명 저장 중 문제가 발생했어요.');
        } finally {
            setLoading(false);
        }
    };

    const isSingleEmoji = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return false;

        const emojiRegex = /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/u;
        return emojiRegex.test(trimmed);
    };

    const handleComplete = async () => {
        if (submitLoading) return;

        if (!userId) {
            Alert.alert('오류', '사용자 정보가 없어요.');
            return;
        }

        if (showCustomEmojiInput && !isSingleEmoji(customEmojiInput)) {
            Alert.alert('입력 필요', '이모지는 1개만 올바르게 입력해주세요.');
            return;
        }
        if (!characterId) {
            Alert.alert('입력 필요', '캐릭터를 선택해주세요.');
            return;
        }

        try {
            setSubmitLoading(true);

            const onboardingResult = await setupOnboarding({
                userId,
                goalTitle: goalTitle.trim(),
                motto: motto.trim(),
                characterId,
                characterName: characterName.trim(),
                startDate: new Date().toISOString().slice(0, 10),
                endDate: deadline,
                alarmCycle: cycleToNumber(cycle),
                preferredEmoji,
            });


            await AsyncStorage.setItem(
                STORAGE_KEYS.GOAL_PLAN_ID,
                String(onboardingResult.goalPlanId)
            );

            await AsyncStorage.setItem(
                STORAGE_KEYS.USER_ID,
                String(userId)
            );

            await AsyncStorage.setItem(
                STORAGE_KEYS.USERNAME,
                String(nickname)
            );

            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'MainTabs',
                        params: { userId },
                    },
                ],
            });
        } catch (error: any) {
            Alert.alert('설정 완료 실패', error.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.screen}>
                {step === 1 ? (
                    <View style={styles.container}>
                        <View style={styles.startBody}>
                            <Text style={styles.startEmoji}>🥚</Text>
                            <Text style={styles.startTitle}>SlowCommit</Text>
                            <Text style={styles.startSubtitle}>
                                천천히 가도 괜찮아.{'\n'}
                                작은 반복으로 목표를 키워봐.
                            </Text>

                            <View style={styles.startInfoCard}>
                                <Text style={styles.startInfoTitle}>온보딩에서 정할 것</Text>
                                <Text style={styles.startInfoText}>
                                    별명 · 목표 이름 · 모토 · 마감일 · 목표 주기 · 이모지 · 캐릭터 이름
                                </Text>
                            </View>
                        </View>

                        <View style={styles.footer}>
                            <PrimaryButton label="시작하기" loading={loading} onPress={handleStart} />

                            <Pressable
                                style={[styles.button, { backgroundColor: '#444', marginTop: 10 }]}
                                onPress={async () => {
                                    await AsyncStorage.setItem(STORAGE_KEYS.GOAL_PLAN_ID, '2');
                                    await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, '2');
                                    navigation.replace('MainTabs', { userId: 2 });
                                }}
                            >
                                <Text style={styles.buttonText}>DEV 바로 시작 (userId=2)</Text>
                            </Pressable>
                        </View>
                    </View>
                ) : step === 2 ? (
                    <StepLayout
                        stepText={progressText}
                        progressWidth={progressWidth}
                        onBack={goPrev}
                        title="별명을 정해주세요"
                        subtitle="중복확인을 완료해야 다음으로 넘어갈 수 있어요."
                        footer={
                            <PrimaryButton
                                label="다음으로"
                                disabled={!canGoNickname || loading}
                                loading={loading}
                                onPress={handleSaveNicknameAndNext}
                            />
                        }
                    >
                        <FloatingField
                            label="별명"
                            value={nickname}
                            onChangeText={handleNicknameChange}
                            placeholder="예: 슈뉴"
                        />

                        <Pressable
                            onPress={handleNicknameCheck}
                            disabled={!nickname.trim() || loading}
                            style={[
                                styles.secondaryButton,
                                (!nickname.trim() || loading) && styles.secondaryButtonDisabled,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.secondaryButtonText,
                                    (!nickname.trim() || loading) && styles.secondaryButtonTextDisabled,
                                ]}
                            >
                                중복확인
                            </Text>
                        </Pressable>

                        {nicknameChecked && nicknameMessage !== '' ? (
                            <View
                                style={[
                                    styles.feedbackBox,
                                    nicknameAvailable ? styles.feedbackSuccess : styles.feedbackError,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.feedbackText,
                                        nicknameAvailable ? styles.feedbackTextSuccess : styles.feedbackTextError,
                                    ]}
                                >
                                    {nicknameMessage}
                                </Text>
                            </View>
                        ) : null}
                    </StepLayout>
                ) : step === 3 ? (
                    <StepLayout
                        stepText={progressText}
                        progressWidth={progressWidth}
                        onBack={goPrev}
                        title="목표 이름을 적어주세요"
                        subtitle="조금 구체적으로 적을수록 동기부여가 잘 돼요."
                        footer={<PrimaryButton label="다음으로" disabled={!canGoGoalTitle} onPress={goNext} />}
                    >
                        <FloatingField
                            label="목표 이름"
                            value={goalTitle}
                            onChangeText={setGoalTitle}
                            placeholder="예: 정보처리기사 합격"
                        />
                    </StepLayout>
                ) : step === 4 ? (
                    <StepLayout
                        stepText={progressText}
                        progressWidth={progressWidth}
                        onBack={goPrev}
                        title="모토를 적어주세요"
                        subtitle="목표를 이어가게 도와주는 한 문장을 적어보세요."
                        footer={<PrimaryButton label="다음으로" disabled={!canGoMotto} onPress={goNext} />}
                    >
                        <FloatingField
                            label="모토"
                            value={motto}
                            onChangeText={setMotto}
                            placeholder="예: 포기하지 않고 끝까지"
                        />
                    </StepLayout>
                ) : step === 5 ? (
                    <StepLayout
                        stepText={progressText}
                        progressWidth={progressWidth}
                        onBack={goPrev}
                        title="마감일을 정해주세요"
                        subtitle="지금은 문자열 입력으로 두고, 나중에 DatePicker로 바꾸면 돼요."
                        footer={<PrimaryButton label="다음으로" disabled={!canGoDeadline} onPress={goNext} />}
                    >
                        <FloatingField
                            label="목표 마감일"
                            value={deadline}
                            onChangeText={setDeadline}
                            placeholder="YYYY-MM-DD"
                        />
                    </StepLayout>
                ) : step === 6 ? (
                    <StepLayout
                        stepText={progressText}
                        progressWidth={progressWidth}
                        onBack={goPrev}
                        title="목표 주기를 골라주세요"
                        subtitle="내 리듬에 맞는 빈도를 선택하면 돼요."
                        footer={<PrimaryButton label="다음으로" disabled={!canGoCycle} onPress={goNext} />}
                    >
                        <View style={styles.cycleGrid}>
                            {cycleOptions.map((option) => {
                                const selected = cycle === option;
                                return (
                                    <Pressable
                                        key={option}
                                        onPress={() => setCycle(option)}
                                        style={[styles.cycleCard, selected && styles.cycleCardSelected]}
                                    >
                                        <Text style={styles.cycleLabel}>주기</Text>
                                        <Text style={styles.cycleValue}>{option}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </StepLayout>
                ) : step === 7 ? (
                    <StepLayout
                        stepText={progressText}
                        progressWidth={progressWidth}
                        onBack={goPrev}
                        title="대표 이모지를 골라주세요"
                        subtitle="달력에 표시될 이모지예요."
                        footer={<PrimaryButton label="다음으로" disabled={!canGoEmoji} onPress={handleEmojiNext} />}
                    >
                        <View style={styles.emojiGrid}>
                            {emojiOptions.map((emoji) => {
                                const selected = preferredEmoji === emoji && !showCustomEmojiInput;

                                return (
                                    <Pressable
                                        key={emoji}
                                        onPress={() => {
                                            setPreferredEmoji(emoji);
                                            setCustomEmojiInput('');
                                            setShowCustomEmojiInput(false);
                                        }}
                                        style={[styles.emojiCard, selected && styles.emojiCardSelected]}
                                    >
                                        <Text style={styles.emojiValue}>{emoji}</Text>
                                    </Pressable>
                                );
                            })}

                            <Pressable
                                onPress={() => setShowCustomEmojiInput((prev) => !prev)}
                                style={[styles.emojiCard, showCustomEmojiInput && styles.emojiCardSelected]}
                            >
                                <Text style={styles.emojiPlus}>＋</Text>
                            </Pressable>
                        </View>

                        {showCustomEmojiInput && (
                            <View style={styles.customEmojiBox}>
                                <FloatingField
                                    label="직접 이모지 입력"
                                    value={customEmojiInput}
                                    onChangeText={setCustomEmojiInput}
                                    placeholder="이모지 1개 입력"
                                />

                                <Text style={styles.helperText}>
                                    이모지 1개만 입력할 수 있어요.
                                </Text>
                            </View>
                        )}
                    </StepLayout>
                ) : step === 8 ? (
                    <StepLayout
                        stepText={progressText}
                        progressWidth={progressWidth}
                        onBack={goPrev}
                        title="캐릭터 이름을 정해주세요"
                        subtitle="이 친구가 앞으로 네 목표를 같이 키워줄 거예요."
                        footer={
                            <PrimaryButton
                                label="완료하기"
                                disabled={!canComplete || submitLoading}
                                loading={submitLoading}
                                onPress={handleComplete}
                            />
                        }
                    >
                        <View style={styles.characterGrid}>
                            {characterOptions.map((item) => {
                                const selected = characterId === item.id;

                                return (
                                    <Pressable
                                        key={item.id}
                                        onPress={() => setCharacterId(item.id)}
                                        style={[
                                            styles.characterSelectCard,
                                            selected && styles.characterSelectCardSelected,
                                        ]}
                                    >
                                        <View style={styles.characterEmojiWrap}>
                                            <Text style={styles.characterSelectEmoji}>{item.emoji}</Text>
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <FloatingField
                            label="캐릭터 이름"
                            value={characterName}
                            onChangeText={setCharacterName}
                            placeholder="예: 꾸미"
                        />
                    </StepLayout>
                ) : null}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#ffffff' },
    screen: { flex: 1, backgroundColor: '#ffffff' },
    container: { flex: 1, paddingHorizontal: 24, paddingBottom: 20, paddingTop: 12 },
    footer: { gap: 12, paddingTop: 12 },
    startBody: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
    startEmoji: { fontSize: 72, marginBottom: 16 },
    startTitle: { fontSize: 34, fontWeight: '700', color: '#171717' },
    startSubtitle: {
        marginTop: 14,
        fontSize: 17,
        lineHeight: 28,
        color: '#737373',
        textAlign: 'center',
    },
    startInfoCard: {
        width: '100%',
        marginTop: 32,
        borderRadius: 28,
        backgroundColor: '#ecfdf5',
        padding: 20,
    },
    startInfoTitle: { fontSize: 14, fontWeight: '700', color: '#047857' },
    startInfoText: { marginTop: 10, fontSize: 15, lineHeight: 24, color: '#525252' },
    secondaryButton: {
        height: 52,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#bbf7d0',
        backgroundColor: '#ecfdf5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonDisabled: {
        borderColor: '#e5e5e5',
        backgroundColor: '#fafafa',
    },
    secondaryButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#059669',
    },
    secondaryButtonTextDisabled: {
        color: '#a3a3a3',
    },
    feedbackBox: {
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    feedbackSuccess: {
        backgroundColor: '#ecfdf5',
    },
    feedbackError: {
        backgroundColor: '#fff1f2',
    },
    feedbackText: {
        fontSize: 14,
        fontWeight: '500',
    },
    feedbackTextSuccess: {
        color: '#047857',
    },
    feedbackTextError: {
        color: '#e11d48',
    },
    cycleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 14,
    },
    cycleCard: {
        width: '47.8%',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        backgroundColor: '#ffffff',
        padding: 18,
    },
    cycleCardSelected: {
        borderColor: '#86efac',
        backgroundColor: '#f0fdf4',
    },
    cycleLabel: {
        fontSize: 12,
        color: '#a3a3a3',
    },
    cycleValue: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '600',
        color: '#171717',
    },
    emojiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 14,
    },
    emojiCard: {
        width: 72,
        height: 72,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        backgroundColor: '#ffffff',

        justifyContent: 'center',  // ⭐
        alignItems: 'center',      // ⭐
    },
    emojiCardSelected: {
        borderColor: '#86efac',
        backgroundColor: '#f0fdf4',
    },
    emojiValue: {
        fontSize: 28,
        lineHeight: 30,
        textAlign: 'center',
    },
    emojiPlus: {
        fontSize: 26,
        color: '#6b7280',
        fontWeight: '700',
    },

    customEmojiBox: {
        marginTop: 14,
    },

    helperText: {
        marginTop: 8,
        fontSize: 12,
        color: '#737373',
    },
    // characterCard: {
    //     borderRadius: 28,
    //     backgroundColor: '#fffbeb',
    //     borderWidth: 1,
    //     borderColor: '#fde68a',
    //     paddingVertical: 28,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    // characterEmoji: {
    //     fontSize: 72,
    // },
    characterGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },

    characterSelectCard: {
        width: 72,
        height: 72,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },

    characterSelectCardSelected: {
        borderColor: '#86efac',
        backgroundColor: '#f0fdf4',
        transform: [{ scale: 1.03 }],
    },

    characterEmojiWrap: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },

    characterSelectEmoji: {
        fontSize: 28,
        lineHeight: 30,
        textAlign: 'center',
    },
    characterHint: {
        marginTop: 8,
        fontSize: 14,
        color: '#737373',
    },
    mainContent: {
        padding: 24,
        gap: 12,
    },
    mainHeaderTitle: {
        fontSize: 30,
        fontWeight: '700',
        color: '#171717',
    },
    mainCharacterName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#171717',
    },
    infoValue: {
        fontSize: 20,
        fontWeight: '600',
        color: '#171717',
    },
    infoValueSmall: {
        fontSize: 16,
        fontWeight: '600',
        color: '#171717',
    },
    button: {
        height: 52,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
});