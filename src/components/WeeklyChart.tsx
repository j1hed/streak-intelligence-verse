import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface WeeklyChartProps {
  data: Array<{
    date: string;
    day: string;
    completed: number;
    total: number;
    rate: number;
  }>;
}

export const WeeklyChart = ({ data }: WeeklyChartProps) => {
  const getBarColor = (rate: number) => {
    if (rate >= 80) return 'hsl(142 76% 36%)'; // success green
    if (rate >= 60) return 'hsl(38 92% 50%)'; // warning yellow
    if (rate >= 40) return 'hsl(25 95% 53%)'; // orange
    return 'hsl(0 84% 60%)'; // destructive red
  };

  return (
    <Card className="bg-gradient-card border-border/50 p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Progress</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(240 5% 64.9%)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(240 5% 64.9%)', fontSize: 12 }}
              domain={[0, 100]}
            />
            <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.rate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-muted-foreground text-center">
        Completion percentage by day
      </div>
    </Card>
  );
};