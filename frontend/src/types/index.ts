export type GoalCategory = {
  id: number;
  name: string;
  colorHex: string;
  emoji: string;
};

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  currentLevel: number;
  message?: string;
  messageType?: string;
};

export type DashboardSummary = {
  streak: number;
  completedCount: number;
  totalCount: number;
  message: string;
};
