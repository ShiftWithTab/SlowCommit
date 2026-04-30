import { useCallback, useEffect, useState } from 'react';
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
// import { colors } from '../theme/colors';
import { STORAGE_KEYS } from '../constants/storage';
import { CONFIG } from '../constants/config';
import CategoryChip from "../components/CategoryChip";
import { GoalCategory } from "../types";

import { useTheme } from '../theme/ThemeContext';

export default function StatsScreen() {
  const [stats, setStats] = useState({
    completedCount: 0,
    totalCount: 0,
    streak: 0,
    currentLevel: 1,
  });

  const theme = useTheme();
  const styles = createStyles(theme);
  const [refreshing, setRefreshing] = useState(false);
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<GoalCategory[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const [goalPlanId, setGoalPlanId] = useState<number | null>(null);

  useFocusEffect(
      useCallback(() => {
        void loadCategories();
      }, [])
  );

  useEffect(() => {
    if (goalPlanId) {
      void fetchCharacter();
      void fetchStats();
    }
  }, [goalPlanId]);

  const fetchStats = async () => {
    try {
      if (!goalPlanId) return;

      const res = await api.get('/stats', {
        params: { goalPlanId }
      });

      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCategories = async () => {
    try {
      const userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
      if (!userId) return;

      const goalRes = await api.get(`/goals/users/${userId}`);

      const getPastelColor = () => {
        const h = Math.floor(Math.random() * 360);
        const s = 55;
        const l = 80;
        return `hsl(${h}, ${s}%, ${l}%)`;
      };

      const mapped: GoalCategory[] = goalRes.data
          .sort((a: any, b: any) => b.id - a.id)
          .map((goal: any) => ({
            id: goal.id,
            name: goal.title,
            emoji: goal.emoji,
            active: goal.active,
            motto: goal.motto,
            colorHex: getPastelColor(),
          }));

      setCategories(mapped);

      // 👉 최초 1번만 설정
      if (mapped.length > 0) {
        const active = mapped.find(c => c.active) || mapped[0];

        setSelectedGoalId(active.id);
        setGoalPlanId(active.id);
      }

    } catch (e) {
      console.log(e);
    }
  };

  const fetchCharacter = async () => {
    try {
      if (!goalPlanId) return;

      const res = await api.get(`/characters/current?goalPlanId=${goalPlanId}`);
      const path = res.data.imageUrl;
      const fullUrl = path?.startsWith('http')
          ? path
          : `${CONFIG.IMAGE_BASE_URL}${path}`;

      setCharacterImageUrl(fullUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectCategory = async (goalId: number) => {
    try {
      setSelectedGoalId(goalId);
      setGoalPlanId(goalId);
    } catch (e) {
      console.log(e);
    }
  };

  const onRefresh = async () => {
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
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
      >
        <Text style={styles.title}>Stats</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {categories.map((category) => (
              <CategoryChip
                  key={category.id}
                  category={category}
                  isSelected={category.id === selectedGoalId}
                  onPress={() => handleSelectCategory(category.id)}
              />
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

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingTop: 64,
    paddingHorizontal: 20,
  },
  title: {
    color: theme.text,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 10,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  label: {
    color: theme.muted,
    fontSize: 14,
    marginBottom: 8,
  },
  value: {
    color: theme.text,
    fontSize: 32,
    fontWeight: '900',
  },
  character: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  chipRow: {
    marginBottom: 15, paddingLeft: 5
  },
});