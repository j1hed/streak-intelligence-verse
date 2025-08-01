import { useState, useEffect } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { HabitCard } from './HabitCard';
import { StatsCard } from './StatsCard';
import { WeeklyChart } from './WeeklyChart';
import { AddHabitDialog } from './AddHabitDialog';
import { MotivationalQuote } from './MotivationalQuote';
import { useToast } from '@/hooks/use-toast';

export const HabitTracker = () => {
  const {
    habits,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    isHabitCompleted,
    getHabitStreak,
    getTodayStats,
    getWeeklyData,
  } = useHabits();

  const { toast } = useToast();
  const [insights, setInsights] = useState<string[]>([]);

  const today = new Date().toISOString().split('T')[0];
  const todayStats = getTodayStats();
  const weeklyData = getWeeklyData();

  // Generate smart insights
  useEffect(() => {
    const generateInsights = () => {
      const newInsights: string[] = [];
      
      if (weeklyData.length > 0) {
        const avgCompletion = weeklyData.reduce((acc, day) => acc + day.rate, 0) / weeklyData.length;
        const bestDay = weeklyData.reduce((best, day) => day.rate > best.rate ? day : best, weeklyData[0]);
        const worstDay = weeklyData.reduce((worst, day) => day.rate < worst.rate ? day : worst, weeklyData[0]);
        
        if (avgCompletion > 70) {
          newInsights.push(`🎉 Amazing! You're averaging ${Math.round(avgCompletion)}% completion this week!`);
        } else if (avgCompletion > 50) {
          newInsights.push(`💪 Good progress! You're at ${Math.round(avgCompletion)}% completion this week.`);
        }

        if (bestDay && bestDay.rate > 80) {
          newInsights.push(`⭐ ${bestDay.day}s are your strongest day at ${Math.round(bestDay.rate)}% completion!`);
        }

        if (worstDay && worstDay.rate < 40 && avgCompletion > 40) {
          newInsights.push(`🎯 Focus on improving ${worstDay.day}s - only ${Math.round(worstDay.rate)}% completion.`);
        }

        const streaks = habits.map(h => getHabitStreak(h.id)).filter(s => s > 0);
        const maxStreak = Math.max(...streaks, 0);
        if (maxStreak >= 7) {
          newInsights.push(`🔥 Incredible! Your longest streak is ${maxStreak} days!`);
        } else if (maxStreak >= 3) {
          newInsights.push(`🚀 Building momentum with a ${maxStreak}-day streak!`);
        }
      }

      if (todayStats.completionRate === 100 && todayStats.totalHabits > 0) {
        newInsights.push(`🎊 Perfect day! You've completed all ${todayStats.totalHabits} habits today!`);
      }

      setInsights(newInsights);
    };

    generateInsights();
  }, [habits, weeklyData, todayStats]);

  const handleToggleHabit = (habitId: string) => {
    const wasCompleted = isHabitCompleted(habitId, today);
    toggleHabitCompletion(habitId, today);
    
    if (!wasCompleted) {
      const habit = habits.find(h => h.id === habitId);
      const streak = getHabitStreak(habitId) + 1;
      
      toast({
        title: "Great job! 🎉",
        description: `${habit?.name} completed! ${streak > 1 ? `${streak} day streak!` : ''}`,
      });
    }
  };

  const handleDeleteHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    deleteHabit(habitId);
    toast({
      title: "Habit deleted",
      description: `"${habit?.name}" has been removed.`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-primary shadow-glow">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              Streak Intelligence
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Build lasting habits with smart insights and beautiful progress tracking
          </p>
        </div>

        {/* Motivational Quote */}
        <MotivationalQuote />

        {/* Stats Overview */}
        <StatsCard stats={todayStats} weeklyData={weeklyData} />

        {/* Smart Insights */}
        {insights.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Smart Insights</h2>
            </div>
            <div className="grid gap-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gradient-card border-border/50 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="text-foreground">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Habits List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Today's Habits</h2>
              <AddHabitDialog onAddHabit={addHabit} />
            </div>

            {habits.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No habits yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your journey by creating your first habit!
                </p>
                <AddHabitDialog onAddHabit={addHabit} />
              </div>
            ) : (
              <div className="space-y-4">
                {habits.map((habit) => (
                  <div key={habit.id} className="group">
                    <HabitCard
                      habit={habit}
                      isCompleted={isHabitCompleted(habit.id, today)}
                      streak={getHabitStreak(habit.id)}
                      onToggle={() => handleToggleHabit(habit.id)}
                      onDelete={() => handleDeleteHabit(habit.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weekly Chart */}
          <div className="lg:col-span-1">
            <WeeklyChart data={weeklyData} />
          </div>
        </div>
      </div>
    </div>
  );
};