import { Trophy, Star, Flame, Target, Calendar, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  unlockedAt?: Date;
  requirement: (stats: any) => boolean;
}

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard = ({ achievement }: AchievementCardProps) => {
  return (
    <Card className={`p-4 transition-all duration-300 ${
      achievement.unlocked 
        ? 'bg-gradient-card border-primary/50 shadow-glow animate-bounce-in' 
        : 'bg-muted/20 border-muted opacity-60'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${
          achievement.unlocked ? achievement.color : 'bg-muted'
        }`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm">{achievement.title}</h4>
            {achievement.unlocked && (
              <Badge variant="secondary" className="text-xs">
                Unlocked!
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{achievement.description}</p>
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-xs text-primary mt-1">
              Earned {achievement.unlockedAt.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export const achievements: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first_habit',
    title: 'Getting Started',
    description: 'Create your first habit',
    icon: <Star className="w-4 h-4 text-white" />,
    color: 'bg-blue-500',
    requirement: (stats) => stats.totalHabits >= 1,
  },
  {
    id: 'perfect_day',
    title: 'Perfect Day',
    description: 'Complete all habits in a single day',
    icon: <Trophy className="w-4 h-4 text-white" />,
    color: 'bg-yellow-500',
    requirement: (stats) => stats.perfectDays >= 1,
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Maintain a 7-day streak on any habit',
    icon: <Flame className="w-4 h-4 text-white" />,
    color: 'bg-orange-500',
    requirement: (stats) => stats.maxStreak >= 7,
  },
  {
    id: 'habit_collector',
    title: 'Habit Collector',
    description: 'Create 5 different habits',
    icon: <Target className="w-4 h-4 text-white" />,
    color: 'bg-green-500',
    requirement: (stats) => stats.totalHabits >= 5,
  },
  {
    id: 'consistency_king',
    title: 'Consistency Champion',
    description: 'Complete habits for 30 days total',
    icon: <Calendar className="w-4 h-4 text-white" />,
    color: 'bg-purple-500',
    requirement: (stats) => stats.totalCompletions >= 30,
  },
  {
    id: 'power_user',
    title: 'Power User',
    description: 'Maintain 80% completion rate for a week',
    icon: <Zap className="w-4 h-4 text-white" />,
    color: 'bg-pink-500',
    requirement: (stats) => stats.weeklyAverage >= 80,
  },
];