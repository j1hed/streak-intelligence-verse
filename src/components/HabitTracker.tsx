import { useState, useEffect } from 'react';
import { Brain, Sparkles, Trophy, Filter } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { HabitCard } from './HabitCard';
import { StatsCard } from './StatsCard';
import { WeeklyChart } from './WeeklyChart';
import { AddHabitDialog } from './AddHabitDialog';
import { MotivationalQuote } from './MotivationalQuote';
import { HabitFilters } from './HabitFilters';
import { HabitCalendar } from './HabitCalendar';
import { AchievementCard, achievements } from './Achievement';
import { HabitCategory } from '@/types/habit';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export const HabitTracker = () => {
  const {
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
  } = useHabits();

  const { toast } = useToast();
  const [insights, setInsights] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<HabitCategory[]>([]);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);

  const today = new Date().toISOString().split('T')[0];
  const todayStats = getTodayStats();
  const weeklyData = getWeeklyData();
  const globalStats = getGlobalStats();

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

  const filteredHabits = selectedCategories.length > 0 
    ? habits.filter(h => selectedCategories.includes(h.category as HabitCategory))
    : habits;

  // Check for new achievements
  useEffect(() => {
    const checkAchievements = () => {
      const newAchievements = achievements.map(achievement => {
        const isUnlocked = achievement.requirement({
          totalHabits: habits.length,
          perfectDays: globalStats.perfectDays,
          maxStreak: globalStats.maxStreak,
          totalCompletions: globalStats.totalCompletions,
          weeklyAverage: globalStats.weeklyAverage,
        });

        const existingAchievement = userAchievements.find(a => a.id === achievement.id);
        
        return {
          ...achievement,
          unlocked: isUnlocked,
          unlockedAt: existingAchievement?.unlockedAt || (isUnlocked ? new Date() : undefined),
        };
      });

      // Show toast for new achievements
      newAchievements.forEach(achievement => {
        const existing = userAchievements.find(a => a.id === achievement.id);
        if (achievement.unlocked && (!existing || !existing.unlocked)) {
          toast({
            title: "Achievement Unlocked! 🏆",
            description: achievement.title,
          });
        }
      });

      setUserAchievements(newAchievements);
    };

    checkAchievements();
  }, [habits, globalStats, toast]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 sm:p-3 rounded-xl bg-gradient-primary shadow-glow">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              Streak Intelligence
            </h1>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
            Build lasting habits with smart insights and beautiful progress tracking
          </p>
        </div>

        {/* Mobile-optimized layout */}
        <div className="space-y-6">
          {/* Motivational Quote */}
          <MotivationalQuote />

          {/* Stats Overview */}
          <StatsCard stats={todayStats} weeklyData={weeklyData} />

          {/* Smart Insights */}
          {insights.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Smart Insights</h2>
              </div>
              <div className="grid gap-3">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 rounded-lg bg-gradient-card border-border/50 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <p className="text-sm sm:text-base text-foreground">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements - Mobile Sheet */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Achievements</h2>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trophy className="w-4 h-4 mr-2" />
                  View All ({userAchievements.filter(a => a.unlocked).length}/{userAchievements.length})
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="bg-card border-border max-h-[80vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-foreground">Your Achievements</SheetTitle>
                </SheetHeader>
                <div className="grid gap-3 mt-6">
                  {userAchievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Habits List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Today's Habits</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <AddHabitDialog onAddHabit={addHabit} />
                </div>
              </div>

              {/* Filters */}
              {habits.length > 0 && (
                <HabitFilters
                  selectedCategories={selectedCategories}
                  onCategoryToggle={(category) => {
                    setSelectedCategories(prev =>
                      prev.includes(category)
                        ? prev.filter(c => c !== category)
                        : [...prev, category]
                    );
                  }}
                  onClearFilters={() => setSelectedCategories([])}
                />
              )}

              {filteredHabits.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="p-4 rounded-full bg-muted/50 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center">
                    <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                    {habits.length === 0 ? 'No habits yet' : 'No habits match your filters'}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    {habits.length === 0 
                      ? 'Start your journey by creating your first habit!'
                      : 'Try adjusting your filters or create a new habit.'
                    }
                  </p>
                  <AddHabitDialog onAddHabit={addHabit} />
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {filteredHabits.map((habit) => (
                    <div key={habit.id} className="group">
                      <HabitCard
                        habit={habit}
                        isCompleted={isHabitCompleted(habit.id, today)}
                        streak={getHabitStreak(habit.id)}
                        notes={notes}
                        onToggle={() => handleToggleHabit(habit.id)}
                        onDelete={() => handleDeleteHabit(habit.id)}
                        onSaveNote={saveNote}
                        onDeleteNote={deleteNote}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Panel - Weekly Chart and Calendar */}
            <div className="lg:col-span-1 space-y-6">
              <WeeklyChart data={weeklyData} />
              <HabitCalendar 
                completions={completions.map(c => ({ date: c.date, habitId: c.habitId }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};