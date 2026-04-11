import { useEffect, useState } from 'react';
import { api } from '../api/client';
import TaskSection from './TaskSection';
import type { Task } from '../types';
import Toast from 'react-native-toast-message';
import LevelUpEffect from '../components/LevelUpEffect';

export default function DailyTaskSection({
                                             goalPlanId,
                                             onLevelChange,
                                             refreshKey,
                                             onLevelUp,
                                         }: {
    goalPlanId: number;
    onLevelChange?: (level: number) => void;
    refreshKey?: number;
    onLevelUp?: () => void;
}) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [levelUpTrigger, setLevelUpTrigger] = useState(false);

    useEffect(() => {
        fetchTask();
    }, [goalPlanId, refreshKey]);

    /**
     * 오늘 task 조회
     */
    const fetchTask = async () => {
        try {
            const res = await api.get(`/daily-tasks/active/${goalPlanId}`);
            console.log('fetchTask 응답:', res.data);

            const taskList = Array.isArray(res.data)
                ? res.data
                : [res.data];

            setTasks(taskList);

            if (taskList[0]?.currentLevel !== undefined) {
                onLevelChange?.(taskList[0].currentLevel);
            }
        } catch (err) {
            console.log('조회 실패:', err);
        }
    };

    /**
     * 토스트
     */
    const handleMessage = (message?: string, type?: string) => {
        if (!message) return;

        switch (type) {
            case 'LEVEL_UP':
                Toast.show({
                    type: 'success',
                    text1: '🎉 레벨 업!',
                    text2: message,
                    position: 'bottom',
                    visibilityTime: 2000,
                });
                break;

            case 'NORMAL':
                Toast.show({
                    type: 'info',
                    text1: message,
                    position: 'bottom',
                });
                break;

            case 'UNDO':
                Toast.show({
                    type: 'error',
                    text1: message,
                    position: 'bottom',
                });
                break;
        }
    };

    /**
     * 🚀 핵심: Optimistic UI + 서버 보정
     */
    const toggleTask = async (id: number) => {
        const prevTasks = tasks;

        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );

        try {
            const res = await api.patch(`/daily-tasks/${id}/toggle`);
            console.log('토글 응답:', res.data);

            const {
                completed,
                currentLevel,
                message,
                messageType,
            } = res.data;

            setTasks((prev) =>
                prev.map((task) =>
                    task.id === id
                        ? {
                            ...task,
                            completed,
                            currentLevel,
                        }
                        : task
                )
            );

            if (currentLevel !== undefined) {
                onLevelChange?.(currentLevel);
            }
            onLevelUp?.();
            if (messageType === 'LEVEL_UP') {
                setLevelUpTrigger(true);
            }

            handleMessage(message, messageType);

        } catch (err) {
            console.log('토글 실패:', err);

            setTasks(prevTasks);
            await fetchTask();
        }
    };

    return (
        <>
            <TaskSection
                title="오늘 목표"
                color="#bbf7d0"
                tasks={tasks}
                onToggle={toggleTask}
            />

            <LevelUpEffect trigger={levelUpTrigger} />
        </>
    );
}