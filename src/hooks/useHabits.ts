import { useState, useEffect } from 'react';
import { Habit, HabitCompletion, HabitNote, DailyStats } from '@/types/habit';

const HABITS_STORAGE_KEY = 'habit-tracker-habits';
const COMPLETIONS_STORAGE_KEY = 'habit-tracker-completions';
const NOTES_STORAGE_KEY = 'habit-tracker-notes';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [notes, setNotes] = useState<HabitNote[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
    const savedCompletions = localStorage.getItem(COMPLETIONS_STORAGE_KEY);
    const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
    if (savedCompletions) {
      setCompletions(JSON.parse(savedCompletions));
    }
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(COMPLETIONS_STORAGE_KEY, JSON.stringify(completions));
  }, [completions]);

  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

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
    setNotes(prev => prev.filter(n => n.habitId !== habitId));
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    const existingCompletion = completions.find(
      c => c.habitId === habitId && c.date === date
    );

    if (existingCompletion) {
      setCompletions(prev => prev.filter(c => c.id !== existingCompletion.id));
    } else {
      const newCompletion: HabitCompletion = {
        id: crypto.randomUUID(),
        habitId,
        completedAt: new Date(),
        date,
      };
      setCompletions(prev => [...prev, newCompletion]);
    }
  };

  const saveNote = (habitId: string, date: string, noteText: string) => {
    const existingNote = notes.find(n => n.habitId === habitId && n.date === date);
    
    if (existingNote) {
      setNotes(prev => prev.map(n => 
        n.id === existingNote.id 
          ? { ...n, note: noteText }
          : n
      ));
    } else {
      const newNote: HabitNote = {
        id: crypto.randomUUID(),
        habitId,
        date,
        note: noteText,
        createdAt: new Date(),
      };
      setNotes(prev => [...prev, newNote]);
    }
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
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

  const getGlobalStats = () => {
    const weeklyData = getWeeklyData();
    const weeklyAverage = weeklyData.reduce((acc, day) => acc + day.rate, 0) / weeklyData.length;
    
    const allStreaks = habits.map(h => getHabitStreak(h.id));
    const maxStreak = Math.max(...allStreaks, 0);
    
    const totalCompletions = completions.length;
    
    // Count perfect days (days where all habits were completed)
    const dateCompletions = new Map<string, number>();
    completions.forEach(c => {
      dateCompletions.set(c.date, (dateCompletions.get(c.date) || 0) + 1);
    });
    
    let perfectDays = 0;
    dateCompletions.forEach((count, date) => {
      // Check if all habits that existed on that date were completed
      const dateObj = new Date(date);
      const habitsOnDate = habits.filter(h => new Date(h.createdAt) <= dateObj);
      if (count === habitsOnDate.length && habitsOnDate.length > 0) {
        perfectDays++;
      }
    });

    return {
      weeklyAverage,
      maxStreak,
      totalCompletions,
      perfectDays,
    };
  };

  const getTodayStats = (): DailyStats => {
    const today = new Date().toISOString().split('T')[0];
    const todayCompletions = completions.filter(c => c.date === today);
    const totalHabits = habits.length;
    const completedHabits = todayCompletions.length;
    const globalStats = getGlobalStats();
    
    return {
      date: today,
      totalHabits,
      completedHabits,
      completionRate: totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0,
      streak: 0,
      ...globalStats,
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
    notes,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    saveNote,
    deleteNote,
    isHabitCompleted,
    getHabitStreak,
    getTodayStats,
    getWeeklyData,
    getGlobalStats,
  };
};