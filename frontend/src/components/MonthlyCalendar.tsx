import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';

type MonthlyCalendarProps = {
  year: number;
  month: number; // 1~12
  completedDates?: string[];
  preferredEmoji?: string;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onPressToday?: () => void;
  selectedDate?: string;
  onPressDate?: (date: string) => void;
};

export default function MonthlyCalendar({
                                          year,
                                          month,
                                          completedDates = [],
                                          preferredEmoji = '🌱',
                                          onPrevMonth,
                                          onNextMonth,
                                          onPressToday,
                                          selectedDate,
                                          onPressDate
                                        }: MonthlyCalendarProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: firstDayOfWeek }, (_, i) => `empty-${i}`);
  const calendarCells = [...emptyCells, ...days];

  const today = new Date();
  const isCurrentMonth =
      today.getFullYear() === year && today.getMonth() + 1 === month;

  const colors = {
    cardBg: isDark ? '#151518' : '#FFFFFF',
    cardBorder: isDark ? '#26262B' : '#F0F0F3',
    title: isDark ? '#F5F5F7' : '#222222',
    sub: isDark ? '#9B9BA1' : '#9A9A9A',
    actionBg: isDark ? '#232329' : '#F4F4F6',
    actionText: isDark ? '#D8D8DD' : '#555555',
    weekText: isDark ? '#7E7E88' : '#A0A0A0',
    dayText: isDark ? '#F2F2F4' : '#3A3A3A',
    todayBg: isDark ? '#1E2C42' : '#EEF5FF',
    todayBorder: '#8FD9A3',
    todayText: '#B7F0C4',
    badgeBg: isDark ? '#2A2418' : '#FFF7E8',
    selectedBg: '#B8F1C6',
    selectedText: '#1E3A2A',
    selectedBorder: '#BFF3CC',
  };

  return (
      <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
            },
          ]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.title }]}>
              {year}년 {month}월
            </Text>
            <Text style={[styles.headerSub, { color: colors.sub }]}>
              이번 달 달성 현황
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: colors.actionBg }]}
                onPress={onPrevMonth}
            >
              <Text style={[styles.iconText, { color: colors.actionText }]}>‹</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.todayButton, { backgroundColor: colors.actionBg }]}
                onPress={onPressToday}
            >
              <Text style={[styles.todayButtonText, { color: colors.actionText }]}>오늘</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: colors.actionBg }]}
                onPress={onNextMonth}
            >
              <Text style={[styles.iconText, { color: colors.actionText }]}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.weekRow}>
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <Text
                  key={day}
                  style={[
                    styles.weekText,
                    { color: colors.weekText },
                    day === '일' && styles.sundayText,
                    day === '토' && styles.saturdayText,
                  ]}
              >
                {day}
              </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {calendarCells.map((cell) => {
            if (typeof cell === 'string') {
              return <View key={cell} style={[styles.dayCell, styles.emptyCell]} />;
            }

            const day = cell;
            const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isCompleted = completedDates.includes(dateKey);
            const isToday = isCurrentMonth && today.getDate() === day;

            const isSelected = selectedDate === dateKey;
            return (
                <TouchableOpacity
                    key={day}
                    activeOpacity={0.8}
                    onPress={() => onPressDate?.(dateKey)}
                    // style={[
                    //   styles.dayCell,
                    //   isSelected && {
                    //     backgroundColor: colors.selectedBg,
                    //     borderWidth: 1.5,
                    //     borderColor: colors.selectedBorder,
                    //   },
                    //   !isSelected && isToday && {
                    //     backgroundColor: colors.todayBg,
                    //     borderWidth: 1,
                    //     borderColor: colors.todayBorder,
                    //   },
                    // ]}
                    style={styles.dayCell}
                >
                  <View style={styles.dayTop}>
                      <View
                          style={[
                            styles.dayNumberCircle,
                            isSelected && {
                              backgroundColor: colors.selectedBg,
                              borderWidth: 0,
                            },
                            !isSelected && isToday && {
                              backgroundColor: 'transparent',
                              borderWidth: 1.5,
                              borderColor: colors.todayBorder,
                            },
                          ]}
                      >
                      <Text
                          style={[
                            styles.dayText,
                            { color: colors.dayText },
                            isToday && !isSelected && { color: colors.todayText },
                            isSelected && { color: colors.selectedText, fontWeight: '800' },
                          ]}
                      >
                        {day}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.badgeArea}>
                    {isCompleted ? (
                        <View
                            style={[
                              styles.emojiBadge,
                              { backgroundColor: colors.badgeBg },
                            ]}
                        >
                          <Text style={styles.emojiText}>{preferredEmoji}</Text>
                        </View>
                    ) : (
                        <View style={styles.badgePlaceholder} />
                    )}
                  </View>
                </TouchableOpacity>
            );
          })}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    marginTop: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerSub: {
    marginTop: 4,
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
    fontWeight: '700',
  },
  todayButton: {
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekText: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  sundayText: {
    color: '#F08A82',
  },
  saturdayText: {
    color: '#6FA8FF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 6,
  },
  emptyCell: {
    backgroundColor: 'transparent',
  },
  dayTop: {
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 15,
    fontWeight: '700',
  },
  badgeArea: {
    marginTop: 4,
    minHeight: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiBadge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 13,
  },
  badgePlaceholder: {
    width: 24,
    height: 24,
  },
  dayNumberCircle: {
    width: 26,
    height: 26,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});