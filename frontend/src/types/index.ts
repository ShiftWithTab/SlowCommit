export type GoalCategory = {
  id: number;
  name: string;
  emoji: string;
  colorHex: string;
  active: boolean;
  motto?: string;
  endDate?: string; // 추가
};

export type Task = {
  routineId: boolean;
  id: number;
  title: string;
  completed: boolean;
  currentLevel: number;
  message?: string;
  messageType?: string;
  selectedDate: string;
};

export type DashboardSummary = {
  streak: number;
  completedCount: number;
  totalCount: number;
  message: string;
};
