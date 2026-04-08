import { useCallback, useState } from 'react';
import { ScrollView, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { colors } from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';

export default function StatsScreen() {
  const [stats, setStats] = useState({
    completedCount: 0,
    totalCount: 0,
    streak: 0,
    currentLevel: 1
  });

  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
      useCallback(() => {
        fetchStats();
      }, [])
  );

  const fetchStats = async () => {
    try {
      const userId = Number(await AsyncStorage.getItem(STORAGE_KEYS.USER_ID));
      console.log('stats fetch 호출 userId : ' + userId);
      if (!userId) return;

      const res = await api.get(`/stats/${userId}`);

      setStats(res.data);
    } catch (err) {
      console.log('stats 조회 실패:', err);
    }
  };

  const onRefresh = async () => {
    console.log('새로고침');
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const rate =
      stats.totalCount === 0
          ? 0
          : Math.round((stats.completedCount / stats.totalCount) * 100);

  return (
      <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
      >
        <Text style={styles.title}>Stats</Text>

        <View style={styles.card}>
          <Text style={styles.label}>완료율</Text>
          <Text style={styles.value}>{rate}%</Text>

          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: `${rate}%` }]} />
          </View>
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
      </ScrollView>
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
  },
  progressBackground: {
    marginTop: 14,
    height: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 999,
    overflow: 'hidden'
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#4ade80',
    borderRadius: 999
  },
});