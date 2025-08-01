export interface Habit {
  id: string;
  name: string;
  category: string;
  color: string;
  icon: string;
  createdAt: Date;
  targetFrequency: 'daily' | 'weekly';
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  completedAt: Date;
  date: string; // YYYY-MM-DD format
}

export interface HabitNote {
  id: string;
  habitId: string;
  date: string;
  note: string;
  createdAt: Date;
}

export interface DailyStats {
  date: string;
  totalHabits: number;
  completedHabits: number;
  completionRate: number;
  streak: number;
  perfectDays: number;
  totalCompletions: number;
  maxStreak: number;
  weeklyAverage: number;
}

export type HabitCategory = 
  | 'health'
  | 'fitness'
  | 'productivity'
  | 'learning'
  | 'social'
  | 'mindfulness'
  | 'creativity'
  | 'other';