import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { api } from '../api/client';
import { colors } from '../theme/colors';

export default function StatsScreen() {
  const [stats, setStats] = useState({
    completedCount: 0,
    totalCount: 0,
    streak: 0,
    currentLevel: 1
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats/1');
      setStats(res.data);
    } catch (err) {
      console.log('stats 조회 실패:', err);
    }
  };

  const rate =
      stats.totalCount === 0
          ? 0
          : Math.round((stats.completedCount / stats.totalCount) * 100);

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Stats</Text>

        <View style={styles.card}>
          <Text style={styles.label}>완료율</Text>
          <Text style={styles.value}>{rate}%</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>연속 달성일</Text>
          <Text style={styles.value}>{stats.streak}일</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>완료된 할 일</Text>
          <Text style={styles.value}>{stats.completedCount}개</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>현재 성장 단계</Text>
          <Text style={styles.value}>Lv.{stats.currentLevel}</Text>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 64,
    paddingHorizontal: 20
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 20
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  label: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 8
  },
  value: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900'
  }
});