import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CategoryChip from '../components/CategoryChip';
import MonthlyCalendar from '../components/MonthlyCalendar';
import PixelCard from '../components/PixelCard';
import TaskSection from '../components/TaskSection';
import DailyTaskSection from '../components/DailyTaskSection';
import { mockCategories, mockSummary, mockTasks } from '../api/mock';
import { colors } from '../theme/colors';
import { STORAGE_KEYS } from '../constants/storage';

export default function HomeScreen() {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const loadUsername = async () => {
            const savedUsername = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
            if (savedUsername) {
                setUsername(savedUsername);
            }
        };

        loadUsername();
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>{username ? `${username}님, 오늘도 한 칸 전진` : '오늘도 한 칸 전진'}</Text>
            <Text style={styles.subtitle}>{mockSummary.streak}일째 루틴 이어가는 중</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                {mockCategories.map((category) => (
                    <CategoryChip key={category.id} category={category} />
                ))}
            </ScrollView>

            <PixelCard message={mockSummary.message} />
            <MonthlyCalendar />
                    <TaskSection
            title="Study (ex. 코딩테스트 풀기)"
            color={colors.pink}
            tasks={studyTasks}
        />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 64,
        paddingBottom: 120,
    },
    title: {
        color: colors.text,
        fontSize: 28,
        fontWeight: '900',
    },
    subtitle: {
        color: colors.muted,
        marginTop: 6,
        fontSize: 15,
    },
    chipRow: {
        marginTop: 18,
    },
});