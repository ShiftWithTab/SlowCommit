import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Switch,
    Alert,
    ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { api } from '../api/client';
import {Ionicons} from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = NativeStackScreenProps<RootStackParamList, 'RoutineCreate'>;

export default function RoutineCreateScreen({ route, navigation }: Props) {
    const { goalId } = route.params;

    const [title, setTitle] = useState('');
    const [repeatCycle, setRepeatCycle] = useState('매일');
    const [time, setTime] = useState('없음');
    const [manualAdd, setManualAdd] = useState(false);
    const [loading, setLoading] = useState(false);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [showStartPicker, setShowStartPicker] = useState(false);

    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const [showCycleOptions, setShowCycleOptions] = useState(false);
    const [showCustomCycleInput, setShowCustomCycleInput] = useState(false);
    const [customCycleInput, setCustomCycleInput] = useState('');
    const formatDate = (date: Date) => {
        return date.toISOString().slice(0, 10);
    };

    const [showTimeOptions, setShowTimeOptions] = useState(false);
    const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
    const [hour, setHour] = useState(8);
    const [minute, setMinute] = useState(0);

    const handleCreateRoutine = async () => {
        if (!title.trim()) {
            Alert.alert('알림', '루틴 내용을 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            //수정필요 (실제 api주소로)
            await api.post('/routines', {
                goalId: Number(goalId),
                title: title.trim(),
                startDate: startDate ? formatDate(startDate) : formatDate(new Date()),
                endDate: endDate ? formatDate(endDate) : formatDate(new Date()),
                repeatCycle,
                time: time === '없음' ? null : time,
                manualAdd,
            });

            Alert.alert('완료', '루틴이 생성되었습니다.');
            navigation.goBack();
        } catch (e) {
            console.log('루틴 생성 실패:', e);
            Alert.alert('오류', '루틴 생성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>루틴</Text>

                <TouchableOpacity style={styles.circleBtn} onPress={handleCreateRoutine}>
                    <Ionicons name="checkmark" size={28} color="#fff" />
                </TouchableOpacity>
            </View>

            <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="루틴 입력"
                placeholderTextColor="#8c8c8c"
                style={styles.input}
            />

            <View style={styles.card}>
                <TouchableOpacity
                    style={styles.row}
                    onPress={() => {
                        setShowEndPicker(false); // 다른 picker 닫기
                        setShowStartPicker((prev) => !prev); // 현재 picker 토글
                    }}
                >
                    <Text style={styles.rowLabel}>시작 날짜</Text>
                    <Text style={styles.rowValue}>
                        {startDate ? formatDate(startDate) : '오늘'}
                    </Text>
                </TouchableOpacity>
                {showStartPicker && (
                    <DateTimePicker
                        value={startDate ?? new Date()}
                        mode="date"
                        display="spinner"
                        onChange={(event, selectedDate) => {
                            if (event.type === 'dismissed') {
                                setShowStartPicker(false);
                                return;
                            }

                            if (selectedDate) {
                                setStartDate(selectedDate);
                            }
                        }}
                    />
                )}
                <TouchableOpacity
                    style={styles.row}
                    onPress={() => {
                        setShowStartPicker(false); // 다른 picker 닫기
                        setShowEndPicker((prev) => !prev); // 현재 picker 토글
                    }}
                >
                    <Text style={styles.rowLabel}>종료 날짜</Text>
                    <Text style={styles.rowValue}>
                        {endDate ? formatDate(endDate) : '목표 종료일'}
                    </Text>
                </TouchableOpacity>
            </View>
            {showEndPicker && (
                <DateTimePicker
                    value={endDate ?? new Date()}
                    mode="date"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                        if (event.type === 'dismissed') {
                            setShowEndPicker(false);
                            return;
                        }

                        if (selectedDate) {
                            setEndDate(selectedDate);
                        }
                    }}
                />
            )}
            <View style={styles.card}>
                <TouchableOpacity
                    style={styles.row}
                    onPress={() => setShowCycleOptions((prev) => !prev)}
                >
                    <Text style={styles.rowLabel}>반복</Text>
                    <Text style={styles.rowValue}>{repeatCycle}</Text>
                </TouchableOpacity>
            </View>
            {showCycleOptions && (
                <View style={styles.cycleDropdown}>
                    {['매일', '3일마다', '일주일마다','매월','매년'].map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={styles.cycleOption}
                            onPress={() => {
                                setRepeatCycle(item);
                                setCustomCycleInput('');
                                setShowCustomCycleInput(false);
                                setShowCycleOptions(false);
                            }}
                        >
                            <Text style={styles.cycleOptionText}>{item}</Text>
                        </TouchableOpacity>
                    ))}

                    <View style={styles.customCycleRow}>
                        <TouchableOpacity
                            style={styles.customCycleLabelBox}
                            onPress={() => {
                                setRepeatCycle('직접 입력');
                                setShowCustomCycleInput(true);
                            }}
                        >
                            <Text style={styles.cycleOptionText}>직접 입력</Text>
                        </TouchableOpacity>

                        {showCustomCycleInput && (
                            <>
                                <TextInput
                                    style={styles.inlineCycleInput}
                                    placeholder="숫자"
                                    placeholderTextColor="#6E6E73"
                                    keyboardType="numeric"
                                    value={customCycleInput}
                                    onChangeText={(text) => {
                                        const onlyNumber = text.replace(/[^0-9]/g, '');
                                        setCustomCycleInput(onlyNumber);

                                        if (onlyNumber) {
                                            setRepeatCycle(`${onlyNumber}일마다`);
                                        } else {
                                            setRepeatCycle('직접 입력');
                                        }
                                    }}
                                />
                                <Text style={styles.dayText}>일마다</Text>
                            </>
                        )}
                    </View>
                </View>
            )}
            <View style={styles.card}>
                <TouchableOpacity
                    style={styles.row}
                    onPress={() => setShowTimeOptions((prev) => !prev)}
                >
                    <Text style={styles.rowLabel}>시간</Text>
                    <Text style={styles.rowValue}>{time}</Text>
                </TouchableOpacity>
            </View>
            {showTimeOptions && (
                <View style={styles.timeBox}>
                    <Text style={styles.timeSectionTitle}>오전 / 오후</Text>
                    <View style={styles.timeButtonRow}>
                        {[
                            { label: '오전', value: 'AM' },
                            { label: '오후', value: 'PM' },
                        ].map((item) => {
                            const selected = ampm === item.value;

                            return (
                                <TouchableOpacity
                                    key={item.value}
                                    style={[styles.timeChip, selected && styles.timeChipSelected]}
                                    onPress={() => {
                                        const nextAmpm = item.value as 'AM' | 'PM';
                                        setAmpm(nextAmpm);
                                        setTime(`${item.label} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
                                    }}
                                >
                                    <Text style={[styles.timeChipText, selected && styles.timeChipTextSelected]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Text style={styles.timeSectionTitle}>시</Text>
                    <View style={styles.timeGrid}>
                        {Array.from({ length: 24 }, (_, i) => i).map((item) => {
                            const selected = hour === item;

                            return (
                                <TouchableOpacity
                                    key={item}
                                    style={[styles.timeNumberButton, selected && styles.timeChipSelected]}
                                    onPress={() => {
                                        setHour(item);
                                        setTime(`${ampm === 'AM' ? '오전' : '오후'} ${String(item).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
                                    }}
                                >
                                    <Text style={[styles.timeChipText, selected && styles.timeChipTextSelected]}>
                                        {String(item).padStart(2, '0')}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Text style={styles.timeSectionTitle}>분</Text>
                    <View style={styles.timeGrid}>
                        {Array.from({ length: 12 }, (_, i) => i * 5).map((item) => {
                            const selected = minute === item;

                            return (
                                <TouchableOpacity
                                    key={item}
                                    style={[styles.timeNumberButton, selected && styles.timeChipSelected]}
                                    onPress={() => {
                                        setMinute(item);
                                        setTime(`${ampm === 'AM' ? '오전' : '오후'} ${String(hour).padStart(2, '0')}:${String(item).padStart(2, '0')}`);
                                    }}
                                >
                                    <Text style={[styles.timeChipText, selected && styles.timeChipTextSelected]}>
                                        {String(item).padStart(2, '0')}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            )}

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
    header: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '800',
    },
    circleBtn: {
        width: 42,
        height: 42,
        borderRadius: 16,
        backgroundColor: '#18181E',
        borderWidth: 1,
        borderColor: '#24242C',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        marginTop: 34,
        height: 54,
        borderRadius: 16,
        backgroundColor: '#0D0D10',
        borderWidth: 1,
        borderColor: '#202027',
        paddingHorizontal: 16,
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    card: {
        marginTop: 14,
        borderRadius: 18,
        backgroundColor: '#17171B',
        borderWidth: 1,
        borderColor: '#25252B',
        overflow: 'hidden',
    },
    row: {
        height: 56,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#25252B',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowLabel: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    rowValue: {
        color: '#8B8B94',
        fontSize: 14,
        fontWeight: '600',
    },
    switchCard: {
        marginTop: 14,
        height: 58,
        borderRadius: 18,
        backgroundColor: '#17171B',
        borderWidth: 1,
        borderColor: '#25252B',
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    noticeBox: {
        marginTop: 18,
        flexDirection: 'row',
        gap: 10,
    },
    noticeIcon: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#FF5F5F',
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: '900',
        fontSize: 15,
        lineHeight: 22,
    },
    noticeTextBox: {
        flex: 1,
    },
    noticeTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
    },
    noticeDescription: {
        marginTop: 5,
        color: '#8B8B94',
        fontSize: 13,
        fontWeight: '500',
        lineHeight: 20,
    },
    cycleDropdown: {
        backgroundColor: '#17171B',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#25252B',
        marginTop: 6,
        overflow: 'hidden',
    },

    cycleOption: {
        height: 44,
        justifyContent: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#25252B',
    },

    cycleOptionText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    customCycleRow: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#25252B',
    },

    customCycleLabelBox: {
        height: 44,
        justifyContent: 'center',
        marginRight: 12,
    },

    inlineCycleInput: {
        width: 58,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#0D0D10',
        borderWidth: 1,
        borderColor: '#202027',
        paddingHorizontal: 10,
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },

    dayText: {
        marginLeft: 6,
        color: '#8B8B94',
        fontSize: 13,
        fontWeight: '600',
    },
    timeBox: {
        marginTop: 8,
        borderRadius: 18,
        backgroundColor: '#17171B',
        borderWidth: 1,
        borderColor: '#25252B',
        padding: 14,
    },

    timeSectionTitle: {
        color: '#8B8B94',
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 8,
        marginTop: 10,
    },

    timeButtonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },

    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },

    timeChip: {
        height: 36,
        paddingHorizontal: 16,
        borderRadius: 18,
        backgroundColor: '#0D0D10',
        borderWidth: 1,
        borderColor: '#202027',
        alignItems: 'center',
        justifyContent: 'center',
    },

    timeNumberButton: {
        width: 44,
        height: 36,
        borderRadius: 14,
        backgroundColor: '#0D0D10',
        borderWidth: 1,
        borderColor: '#202027',
        alignItems: 'center',
        justifyContent: 'center',
    },

    timeChipSelected: {
        backgroundColor: '#24242C',
        borderColor: '#3A3A44',
    },

    timeChipText: {
        color: '#8B8B94',
        fontSize: 13,
        fontWeight: '700',
    },

    timeChipTextSelected: {
        color: '#FFFFFF',
    },
});