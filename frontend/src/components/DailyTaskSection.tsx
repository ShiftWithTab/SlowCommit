import { useEffect, useState } from 'react';
import { api } from '../api/client';
import TaskSection from './TaskSection';
import type { Task } from '../types';
import Toast from 'react-native-toast-message';
import LevelUpEffect from '../components/LevelUpEffect';
import TaskInputModal from '../components/TaskInputModal';

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

    const [modalVisible, setModalVisible] = useState(false);
    const [editTaskItem, setEditTaskItem] = useState<Task | null>(null);

    useEffect(() => {
        fetchTask();
    }, [goalPlanId, refreshKey]);

    const fetchTask = async () => {
        try {
            const res = await api.get(`/daily-tasks/active/${goalPlanId}`);

            const taskList = Array.isArray(res.data)
                ? res.data
                : [res.data];

            setTasks(taskList);

            if (taskList[0]?.currentLevel !== undefined) {
                onLevelChange?.(taskList[0].currentLevel);
            }
        } catch (err) {

        }
    };

    const handleSubmit = async (title: string) => {
        try {
            if (editTaskItem) {
                setTasks((prev) =>
                    prev.map((t) =>
                        t.id === editTaskItem.id ? { ...t, title } : t
                    )
                );

                await api.patch(`/daily-tasks/${editTaskItem.id}`, { title });

                Toast.show({
                    type: 'success',
                    text1: '수정 완료',
                    position: 'bottom',
                });

            } else {
                // ➕ 추가
                const res = await api.post(`/daily-tasks`, {
                    goalPlanId,
                    title,
                });

                setTasks((prev) => [...prev, res.data]);

                Toast.show({
                    type: 'success',
                    text1: '추가 완료',
                    position: 'bottom',
                });
            }

        } catch (e) {
            fetchTask();
        } finally {
            onLevelUp?.();
        }
    };

    const handleDelete = async () => {
        if (!editTaskItem) return;
        const id = editTaskItem.id;
        const prevTasks = tasks;
        setTasks((prev) => prev.filter((t) => t.id !== id));

        try {
            await api.delete(`/daily-tasks/${id}`);

            Toast.show({
                type: 'success',
                text1: '삭제 완료',
                position: 'bottom',
            });

        } catch (e) {
            setTasks(prevTasks);
            fetchTask();
        } finally {
            setModalVisible(false);
            setEditTaskItem(null);
            onLevelUp?.();
        }
    };

    const handleLongPress = (task: Task) => {
        setEditTaskItem(task);
        setModalVisible(true);
    };

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

            const { completed, currentLevel, message, messageType } = res.data;

            setTasks((prev) =>
                prev.map((task) =>
                    task.id === id
                        ? { ...task, completed, currentLevel }
                        : task
                )
            );

            onLevelChange?.(currentLevel);
            onLevelUp?.();

            if (messageType === 'LEVEL_UP') {
                setLevelUpTrigger(true);
            }

            Toast.show({
                type: 'success',
                text1: message,
                position: 'bottom',
            });

        } catch (err) {
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
                onAdd={() => {
                    setEditTaskItem(null); // ⭐ 추가 모드
                    setModalVisible(true);
                }}
                onLongPress={handleLongPress}
            />

            <TaskInputModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setEditTaskItem(null);
                }}
                onSubmit={handleSubmit}
                onDelete={editTaskItem ? handleDelete : undefined}
                initialValue={editTaskItem?.title}
                title={editTaskItem ? '목표 수정' : '새로운 목표'}
            />

            <LevelUpEffect trigger={levelUpTrigger} />
        </>
    );
}