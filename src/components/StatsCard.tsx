import { TrendingUp, Target, Zap, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { DailyStats } from '@/types/habit';

interface StatsCardProps {
  stats: DailyStats;
  weeklyData: Array<{
    date: string;
    day: string;
    completed: number;
    total: number;
    rate: number;
  }>;
}

export const StatsCard = ({ stats, weeklyData }: StatsCardProps) => {
  const avgCompletion = weeklyData.reduce((acc, day) => acc + day.rate, 0) / weeklyData.length;
  const bestDay = weeklyData.reduce((best, day) => day.rate > best.rate ? day : best, weeklyData[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-gradient-card border-border/50 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Target className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Today's Progress</p>
            <p className="text-2xl font-bold text-foreground">
              {stats.completedHabits}/{stats.totalHabits}
            </p>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-card border-border/50 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-success">
            <TrendingUp className="w-5 h-5 text-success-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            <p className="text-2xl font-bold text-foreground">
              {Math.round(stats.completionRate)}%
            </p>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-card border-border/50 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Weekly Average</p>
            <p className="text-2xl font-bold text-foreground">
              {Math.round(avgCompletion)}%
            </p>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-card border-border/50 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-info">
            <Calendar className="w-5 h-5 text-info-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Best Day</p>
            <p className="text-2xl font-bold text-foreground">
              {bestDay?.day || 'N/A'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};