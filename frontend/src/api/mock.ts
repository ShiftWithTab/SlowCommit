import { DashboardSummary, GoalCategory, Task } from '../types';

export const mockCategories: GoalCategory[] = [
  { id: 1, name: 'Water', colorHex: '#d8c2ff', emoji: '🥚' },
  { id: 2, name: 'Study', colorHex: '#f7d0ef', emoji: '👶' },
  { id: 3, name: 'Job Change', colorHex: '#d7f7a0', emoji: '🧑‍🎓' }
];

export const mockTasks: Task[] = [
  { id: 1, title: '백준 알고리즘 19222번 풀기', categoryId: 2, completed: false },
  { id: 2, title: '백준 알고리즘 20392번 작성', categoryId: 2, completed: false },
  { id: 3, title: '리트코드 Medium 2문제 풀기', categoryId: 2, completed: true },
  { id: 4, title: 'CJ 지원서 제출', categoryId: 3, completed: true },
  { id: 5, title: '네이버 자소서 3번 문항 수정', categoryId: 3, completed: false }
];

export const mockSummary: DashboardSummary = {
  streak: 49,
  completedCount: 12,
  totalCount: 18,
  message: '네이버, 카카오 가즈아!'
};
