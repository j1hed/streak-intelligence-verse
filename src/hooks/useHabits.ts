import { useState, useEffect } from 'react';
import { Habit, HabitCompletion, DailyStats } from '@/types/habit';

const HABITS_STORAGE_KEY = 'habit-tracker-habits';
const COMPLETIONS_STORAGE_KEY = 'habit-tracker-completions';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
    const savedCompletions = localStorage.getItem(COMPLETIONS_STORAGE_KEY);

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
    if (savedCompletions) {
      setCompletions(JSON.parse(savedCompletions));
    }
  }, []);

  // Save habits to localStorage
  useEffect(() => {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  // Save completions to localStorage
  useEffect(() => {
    localStorage.setItem(COMPLETIONS_STORAGE_KEY, JSON.stringify(completions));
  }, [completions]);

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    setCompletions(prev => prev.filter(c => c.habitId !== habitId));
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    const existingCompletion = completions.find(
      c => c.habitId === habitId && c.date === date
    );

    if (existingCompletion) {
      // Remove completion
      setCompletions(prev => prev.filter(c => c.id !== existingCompletion.id));
    } else {
      // Add completion
      const newCompletion: HabitCompletion = {
        id: crypto.randomUUID(),
        habitId,
        completedAt: new Date(),
        date,
      };
      setCompletions(prev => [...prev, newCompletion]);
    }
  };

  const isHabitCompleted = (habitId: string, date: string): boolean => {
    return completions.some(c => c.habitId === habitId && c.date === date);
  };

  const getHabitStreak = (habitId: string): number => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (isHabitCompleted(habitId, dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const getTodayStats = (): DailyStats => {
    const today = new Date().toISOString().split('T')[0];
    const todayCompletions = completions.filter(c => c.date === today);
    const totalHabits = habits.length;
    const completedHabits = todayCompletions.length;
    
    return {
      date: today,
      totalHabits,
      completedHabits,
      completionRate: totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0,
      streak: 0, // Calculate overall streak if needed
    };
  };

  const getWeeklyData = () => {
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayCompletions = completions.filter(c => c.date === dateStr);
      
      weekData.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: dayCompletions.length,
        total: habits.length,
        rate: habits.length > 0 ? (dayCompletions.length / habits.length) * 100 : 0,
      });
    }
    return weekData;
  };

  return {
    habits,
    completions,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    isHabitCompleted,
    getHabitStreak,
    getTodayStats,
    getWeeklyData,
  };
};