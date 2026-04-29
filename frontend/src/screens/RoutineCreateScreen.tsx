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
import { Calendar } from 'react-native-calendars';
import {useTheme} from "../theme/ThemeContext";
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = NativeStackScreenProps<RootStackParamList, 'RoutineCreate'>;

export default function RoutineCreateScreen({ route, navigation }: Props) {
    const theme = useTheme();

    const { goalId } = route.params;

    const [title, setTitle] = useState('');
    const [repeatCycle, setRepeatCycle] = useState('매일');
    const [time, setTime] = useState('없음');
    const [manualAdd, setManualAdd] = useState(false);
    const [loading, setLoading] = useState(false);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [selecting, setSelecting] = useState<'start' | 'end'>('start');

    const today = new Date().toISOString().slice(0, 10);

    const [showCycleOptions, setShowCycleOptions] = useState(false);
    const [showCustomCycleInput, setShowCustomCycleInput] = useState(false);
    const [customCycleInput, setCustomCycleInput] = useState('');
    const formatDate = (date: Date) => {
        return date.toISOString().slice(0, 10);
    };
    const getMarkedDates = () => {
        if (!startDate) return {};

        const marked: any = {
            [startDate]: {
                startingDay: true,
                endingDay: !endDate,
                color: theme.primary,
                textColor: theme.isDark ? '#1D3A29' : '#FFFFFF',
            },
        };

        if (endDate) {
            let current = new Date(startDate);
            const end = new Date(endDate);

            while (current <= end) {
                const dateStr = current.toISOString().slice(0, 10);

                marked[dateStr] = {
                    color: dateStr === startDate || dateStr === endDate
                        ? theme.primary
                        : theme.isDark
                            ? '#274832'
                            : '#DDF7E5',
                    textColor: dateStr === startDate || dateStr === endDate
                        ? theme.isDark ? '#1D3A29' : '#FFFFFF'
                        : theme.text,
                    startingDay: dateStr === startDate,
                    endingDay: dateStr === endDate,
                };

                current.setDate(current.getDate() + 1);
            }
        }

        return marked;
    };

    const onDayPress = (day: any) => {
        const selectedDate = day.dateString;

        if (selecting === 'start') {
            setStartDate(selectedDate);
            setEndDate('');
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
    const [showTimeOptions, setShowTimeOptions] = useState(false);

    const [selectedTime, setSelectedTime] = useState(new Date());

    const getFormattedTime = (): string | null => {
        if (time === '없음') return null;

        const h = selectedTime.getHours();
        const m = selectedTime.getMinutes();

        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
    };

    const parseInterval = (cycle: string): number | null => {
        if (cycle === '매일') return 1;
        if (cycle === '일주일마다') return 7;
        if (cycle === '매월') return 30;
        if (cycle === '매년') return 365;

        const match = cycle.match(/(\d+)일마다/);
        if (match) return Number(match[1]);

        return 1;
    };

    const handleCreateRoutine = async () => {
        if (!title.trim()) {
            Alert.alert('알림', '루틴 내용을 입력해주세요.');
            return;
        }

        try {
            setLoading(true);

            const today = new Date();

            const now = new Date();
            const finalStartDate = startDate || now.toISOString().slice(0, 10);

            const fallbackEndDateObj = new Date(finalStartDate);
            fallbackEndDateObj.setFullYear(fallbackEndDateObj.getFullYear() + 1);

            const finalEndDate = endDate || fallbackEndDateObj.toISOString().slice(0, 10);

            const interval = parseInterval(repeatCycle);

            const formattedTime = getFormattedTime();

            await api.post('/routines', {
                goalPlanId: Number(goalId),
                title: title.trim(),
                startDate: finalStartDate,
                endDate: finalEndDate,
                interval: interval,
                time: formattedTime,
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
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={styles.content}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    style={[
                        styles.circleBtn,
                        { backgroundColor: theme.card, borderColor: theme.border }
                    ]}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={28} color={theme.text} />
                </TouchableOpacity>

                <Text style={[styles.headerTitle, { color: theme.text }]}>루틴</Text>

                <TouchableOpacity style={[
                    styles.circleBtn,
                    { backgroundColor: theme.card, borderColor: theme.border }
                ]}
                                  onPress={handleCreateRoutine}
                >
                    <Ionicons name="checkmark" size={28} color={theme.text} />
                </TouchableOpacity>
            </View>

            <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="루틴 입력"
                placeholderTextColor={theme.isDark ? '#7E7E88' : '#9CA3AF'}
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        color: theme.text,
                    },
                ]}
            />

            <View style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.border }
            ]}>
                <TouchableOpacity
                    style={[styles.row, { borderBottomColor: theme.border }]}
                    onPress={() => {
                        setSelecting('start');
                        setShowCalendar(true);
                    }}
                >
                    <Text style={[styles.rowLabel, { color: theme.text }]}>시작 날짜</Text>
                    <Text style={[styles.rowValue, { color: theme.text, opacity: 0.6 }]}>
                        {startDate || '오늘'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.row, { borderBottomColor: theme.border }]}
                    onPress={() => {
                        setSelecting('end');
                        setShowCalendar(true);
                    }}
                >
                    <Text style={[styles.rowLabel, { color: theme.text }]}>종료 날짜</Text>
                    <Text style={[styles.rowValue, { color: theme.text, opacity: 0.6 }]}>
                        {endDate || '목표 종료일'}
                    </Text>
                </TouchableOpacity>
            </View>

            {showCalendar && (
                <View style={[
                    styles.calendarBox,
                    { backgroundColor: theme.card, borderColor: theme.border }
                ]}>
                    <Calendar
                        minDate={today}
                        onDayPress={onDayPress}
                        markingType="period"
                        markedDates={getMarkedDates()}
                        theme={{
                            backgroundColor: theme.card,
                            calendarBackground: theme.card,
                            dayTextColor: theme.text,
                            todayTextColor: theme.primary,
                            arrowColor: theme.primary,
                            monthTextColor: theme.text,
                            textSectionTitleColor: theme.text,
                            textDayFontWeight: '600',
                            textMonthFontWeight: '800',
                            textDayHeaderFontWeight: '600',
                        }}
                    />
                </View>
            )}
            <View style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.border }
            ]}>
                <TouchableOpacity
                    style={[
                        styles.row,
                        { borderBottomColor: theme.border }
                    ]}
                    onPress={() => setShowCycleOptions((prev) => !prev)}
                >
                    <Text style={[styles.rowLabel, { color: theme.text }]}>반복</Text>
                    <Text style={[styles.rowValue, { color: theme.text, opacity: 0.6 }]}>{repeatCycle}</Text>
                </TouchableOpacity>
            </View>
            {showCycleOptions && (
                <View style={[
                    styles.cycleDropdown,
                    { backgroundColor: theme.card, borderColor: theme.border }
                ]}>
                    {['매일', '3일마다', '일주일마다','매월','매년'].map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.cycleOption,
                                { borderBottomColor: theme.border }
                            ]}
                            onPress={() => {
                                setRepeatCycle(item);
                                setCustomCycleInput('');
                                setShowCustomCycleInput(false);
                                setShowCycleOptions(false);
                            }}
                        >
                            <Text style={[styles.cycleOptionText, { color: theme.text }]}>{item}</Text>
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
                            <Text style={[styles.cycleOptionText, { color: theme.text }]}>직접 입력</Text>
                        </TouchableOpacity>

                        {showCustomCycleInput && (
                            <>
                                <TextInput
                                    style={[
                                        styles.inlineCycleInput,
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
                                            setRepeatCycle(`${onlyNumber}일마다`);
                                        } else {
                                            setRepeatCycle('직접 입력');
                                        }
                                    }}
                                />
                                <Text style={[styles.dayText, { color: theme.text, opacity: 0.6 }]}>일마다</Text>
                            </>
                        )}
                    </View>
                </View>
            )}
            <View style={[
                styles.card,
                { backgroundColor: theme.card, borderColor: theme.border }
            ]}>
                <TouchableOpacity
                    style={[
                        styles.row,
                        { borderBottomColor: theme.border }
                    ]}
                    onPress={() => setShowTimeOptions((prev) => !prev)}
                >
                    <Text style={[styles.rowLabel, { color: theme.text }]}>시간</Text>
                    <Text style={[styles.rowValue, { color: theme.text, opacity: 0.6 }]}>{time}</Text>
                </TouchableOpacity>
            </View>
            {showTimeOptions && (
                <View
                    style={[
                        styles.timeBox,
                        {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <DateTimePicker
                        value={selectedTime}
                        mode="time"
                        display="spinner"
                        onChange={(event, date) => {
                            if (!date) return;

                            setSelectedTime(date);

                            const hh = String(date.getHours()).padStart(2, '0');
                            const mm = String(date.getMinutes()).padStart(2, '0');

                            setTime(`${hh}:${mm}`);
                        }}
                    />
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
        fontSize: 20,
        fontWeight: '800',
    },
    circleBtn: {
        width: 42,
        height: 42,
        borderRadius: 16,
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
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
    calendarBox: {
        marginTop: 8,
        borderRadius: 18,
        borderWidth: 1,
        overflow: 'hidden',
    },
});