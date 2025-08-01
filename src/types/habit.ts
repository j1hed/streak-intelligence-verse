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

export interface DailyStats {
  date: string;
  totalHabits: number;
  completedHabits: number;
  completionRate: number;
  streak: number;
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