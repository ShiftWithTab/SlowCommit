import { useCallback, useState } from 'react';
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { api } from '../api/client';
import { colors } from '../theme/colors';
import { STORAGE_KEYS } from '../constants/storage';
import { CONFIG } from '../constants/config';
import {mockCategories} from "../api/mock";
import CategoryChip from "../components/CategoryChip";

export default function StatsScreen() {
  const [stats, setStats] = useState({
    completedCount: 0,
    totalCount: 0,
    streak: 0,
    currentLevel: 1,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(null);

  useFocusEffect(
      useCallback(() => {
        fetchAll();
      }, [])
  );

  const fetchAll = async () => {
    await Promise.all([fetchStats(), fetchCharacter()]);
  };

  const fetchStats = async () => {
    try {
      const userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
      if (!userId) return;

      const res = await api.get(`/stats/${userId}`);
      setStats(res.data);
    } catch (err) {
    }
  };

  const fetchCharacter = async () => {
    try {
      const userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
      if (!userId) return;

      const res = await api.get(`/characters/current?userId=${userId}`);
      const path = res.data.imageUrl;
      const fullUrl = path?.startsWith('http') ? path : `${CONFIG.IMAGE_BASE_URL}${path}`;

      setCharacterImageUrl(fullUrl);
    } catch (err) {
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  };

  const rate =
      stats.totalCount === 0
          ? 0
          : Math.round((stats.completedCount / stats.totalCount) * 100);

  return (
      <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
      >
        <Text style={styles.title}>Stats</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {mockCategories.map((category) => (
              <CategoryChip key={category.id} category={category} />
          ))}
        </ScrollView>
        <View style={styles.card}>
          <Text style={styles.label}>현재 캐릭터</Text>
          <Text style={styles.value}>Lv.{stats.currentLevel}</Text>
          {characterImageUrl && (
              <Image
                  source={{ uri: characterImageUrl }}
                  style={styles.character}
                  resizeMode="contain"
              />
          )}
        </View>
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
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 64,
    paddingHorizontal: 20,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 8,
  },
  value: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
  },
  character: {
    width: 100,
    height: 100,
    marginTop: 0,
    alignSelf: 'center',
  },
  chipRow: {
    marginBottom: 15,
  },
});