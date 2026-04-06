import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { api } from '../api/client';

export default function DailyTaskSection({
                                             goalPlanId
                                         }: {
    goalPlanId: number;
}) {
    const [completed, setCompleted] = useState(false);
    const [dailyTaskId, setDailyTaskId] = useState<number | null>(null);
    const [taskTitle, setTaskTitle] = useState('');

    useEffect(() => {
        fetchTask();
    }, [goalPlanId]);

    const fetchTask = async () => {
        try {
            const res = await api.get(`/daily-tasks/active/${goalPlanId}`);
            console.log('응답:', res.data);

            setCompleted(res.data.completed);
            setDailyTaskId(res.data.id);
            setTaskTitle(res.data.title);

        } catch (err) {
            console.log('조회 실패:', err);
        }
    };

    const toggleTask = async () => {
        if (dailyTaskId === null) {
            console.log('dailyTaskId 없음');
            return;
        }

        try {
            const res = await api.patch(`/daily-tasks/${dailyTaskId}/toggle`);
            console.log('토글 응답:', res.data);

            setCompleted(res.data.completed);

        } catch (err) {
            console.log('토글 실패:', err);
        } finally {
            await fetchTask();
        }
    };

    return (
        <Pressable style={styles.taskRow} onPress={toggleTask}>
            <View style={[styles.checkbox, completed && styles.checkboxDone]}>
                {completed && <Text style={styles.check}>✓</Text>}
            </View>

            <Text style={[styles.taskText, completed && styles.doneText]}>
                {taskTitle}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#d7d7d7',
        borderRadius: 6,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkboxDone: {
        backgroundColor: '#7f7f7f',
        borderColor: '#7f7f7f'
    },
    check: {
        color: '#fff',
        fontWeight: '800'
    },
    taskText: {
        fontSize: 18,
        flex: 1,
        color: '#fff'
    },
    doneText: {
        textDecorationLine: 'line-through',
        color: '#7e7e7e'
    }
});