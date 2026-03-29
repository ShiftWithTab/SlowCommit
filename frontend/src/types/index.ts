export type GoalCategory = {
  id: number;
  name: string;
  colorHex: string;
  emoji: string;
};

export type Task = {
  id: number;
  title: string;
  categoryId: number;
  completed: boolean;
  dueDate?: string;
};

export type DashboardSummary = {
  streak: number;
  completedCount: number;
  totalCount: number;
  message: string;
};
