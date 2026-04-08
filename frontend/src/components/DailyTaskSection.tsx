import { useEffect, useState } from 'react';
import { api } from '../api/client';
import TaskSection from './TaskSection';
import type { Task } from '../types';

export default function DailyTaskSection({
                                             goalPlanId,
                                             onLevelChange,
                                         }: {
    goalPlanId: number;
    onLevelChange?: (level: number) => void;
}) {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        fetchTask();
    }, [goalPlanId]);

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

    const toggleTask = async (id: number) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );

        try {
            const res = await api.patch(`/daily-tasks/${id}/toggle`);
            console.log('토글 goalPlanId :', res.data.goalPlanId);
            if (res.data.currentLevel !== undefined) {
                onLevelChange?.(res.data.currentLevel);
            }
        } catch (err) {
            console.log('토글 실패:', err);
            await fetchTask();
        }
    };

    return (
        <TaskSection
            title="오늘 목표"
            color="#bbf7d0"
            tasks={tasks}
            onToggle={toggleTask}
        />
    );
}