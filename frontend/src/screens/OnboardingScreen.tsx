import React, { useMemo, useState } from 'react';
import type { DimensionValue } from 'react-native';

import {
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
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

const cycleOptions: CycleOption[] = ['매일', '주 3회', '주 5회', '평일'];

export default function OnboardingScreen() {
    const [step, setStep] = useState<Step>(1);
    const [userId, setUserId] = useState<number | null>(null);

    const [nickname, setNickname] = useState('');
    const [nicknameChecked, setNicknameChecked] = useState(false);
    const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);
    const [nicknameMessage, setNicknameMessage] = useState('');

    const [goalTitle, setGoalTitle] = useState('');
    const [deadline, setDeadline] = useState('2026-06-30');
    const [cycle, setCycle] = useState<CycleOption>('주 5회');
    const [characterName, setCharacterName] = useState('');

    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const progressText = useMemo(() => `${Math.min(step, 6)}/6`, [step]);
    const progressWidth = useMemo<DimensionValue>(
        () => `${(Math.min(step, 6) / 6) * 100}%`,
        [step]
    );

    const canGoNickname = nickname.trim() !== '' && nicknameChecked && nicknameAvailable === true;
    const canGoGoalTitle = goalTitle.trim() !== '';
    const canGoDeadline = deadline.trim() !== '';
    const canGoCycle = cycle.trim() !== '';
    const canComplete = characterName.trim() !== '';

    const goNext = () =>
        setStep((prev) => {
            if (prev === 7) return 7;
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

    const handleStart = async () => {
        console.log('🔥 시작하기 버튼 클릭됨');
        try {
            setLoading(true);
            console.log('📡 createGuestUser 호출 직전');
            const data = await createGuestUser();

            console.log('✅ createGuestUser 성공 응답:', data);

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
            console.log('📡nickname 변경 완료 : ' + nickname);
            goNext();
        } catch (error) {
            console.error(error);
            Alert.alert('별명 저장 실패', '별명 저장 중 문제가 발생했어요.');
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        if (!userId) {
            Alert.alert('오류', '사용자 정보가 없어요.');
            return;
        }

        try {
            setSubmitLoading(true);
            await setupOnboarding({
                userId,
                goalTitle: goalTitle.trim(),
                motto: `${goalTitle.trim()} 꾸준히 달성하기`,
                characterId: 1,
                startDate: new Date().toISOString().slice(0, 10),
                endDate: deadline,
                alarmCycle: cycle,
                preferredEmoji: '🌱',
            });
            goNext();
        } catch (error) {
            console.error(error);
            Alert.alert('설정 완료 실패', '목표 저장 중 문제가 발생했어요.');
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
                                    별명 · 목표 이름 · 마감일 · 목표 주기 · 캐릭터 이름
                                </Text>
                            </View>
                        </View>

                        <View style={styles.footer}>
                            <PrimaryButton label="시작하기" loading={loading} onPress={handleStart} />
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
                ) : step === 5 ? (
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
                ) : step === 6 ? (
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
                        <View style={styles.characterCard}>
                            <Text style={styles.characterEmoji}>🐣</Text>
                            <Text style={styles.characterHint}>아직 작은 알 상태예요</Text>
                        </View>

                        <FloatingField
                            label="캐릭터 이름"
                            value={characterName}
                            onChangeText={setCharacterName}
                            placeholder="예: 꾸미"
                        />
                    </StepLayout>
                ) : (
                    <ScrollView contentContainerStyle={styles.mainContent}>
                        <Text style={styles.mainHeaderTitle}>안녕, {nickname} 👋</Text>
                        <Text style={styles.mainCharacterName}>{characterName}</Text>
                        <Text style={styles.infoValue}>{goalTitle}</Text>
                        <Text style={styles.infoValueSmall}>{deadline}</Text>
                        <Text style={styles.infoValueSmall}>{cycle}</Text>

                        <View style={styles.footer}>
                            <PrimaryButton
                                label="집중 시작하기"
                                onPress={() => Alert.alert('다음 단계', '이제 메인 기능 화면으로 연결하면 돼요.')}
                            />
                        </View>
                    </ScrollView>
                )}
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
    characterCard: {
        borderRadius: 28,
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fde68a',
        paddingVertical: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    characterEmoji: {
        fontSize: 72,
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
});