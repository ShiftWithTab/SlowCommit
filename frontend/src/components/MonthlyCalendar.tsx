import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const weekLabels = ['월', '화', '수', '목', '금', '토', '일'];
const activeDays = new Set([3, 11, 12, 23, 24, 25, 26, 27, 28]);

export default function MonthlyCalendar() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>2026년 3월</Text>
      <View style={styles.weekRow}>
        {weekLabels.map((label) => (
          <Text key={label} style={styles.weekLabel}>{label}</Text>
        ))}
      </View>
      <View style={styles.grid}>
        {days.map((day) => {
          const active = activeDays.has(day);
          return (
            <View key={day} style={[styles.cell, active && styles.activeCell]}>
              <Text style={[styles.dayText, active && styles.activeDayText]}>{day}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border
  },
  title: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 20,
    marginBottom: 12
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  weekLabel: {
    width: '14%',
    color: colors.muted,
    textAlign: 'center',
    fontWeight: '700'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  cell: {
    width: '12.6%',
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#3c3c3c',
    justifyContent: 'center',
    alignItems: 'center'
  },
  activeCell: {
    backgroundColor: colors.accent,
    borderColor: colors.accent
  },
  dayText: {
    color: colors.text,
    fontWeight: '700'
  },
  activeDayText: {
    color: '#111'
  }
});
