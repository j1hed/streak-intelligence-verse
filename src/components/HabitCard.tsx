import { Check, Flame, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Habit } from '@/types/habit';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  streak: number;
  onToggle: () => void;
  onDelete: () => void;
}

export const HabitCard = ({ 
  habit, 
  isCompleted, 
  streak, 
  onToggle, 
  onDelete 
}: HabitCardProps) => {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-elevated",
      "bg-gradient-card border-border/50",
      isCompleted && "animate-pulse-glow"
    )}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className={cn(
                "w-3 h-3 rounded-full",
                `bg-${habit.color}-500`
              )}
            />
            <h3 className="font-semibold text-foreground">{habit.name}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-2 py-1 rounded-full bg-secondary/50 text-secondary-foreground">
              {habit.category}
            </span>
            {streak > 0 && (
              <div className="flex items-center gap-1 text-orange-400">
                <Flame className="w-4 h-4" />
                <span className="font-medium">{streak}</span>
              </div>
            )}
          </div>

          <Button
            variant={isCompleted ? "default" : "outline"}
            size="sm"
            onClick={onToggle}
            className={cn(
              "transition-all duration-200",
              isCompleted && "bg-gradient-success border-none shadow-glow animate-bounce-in"
            )}
          >
            <Check className={cn(
              "w-4 h-4 transition-transform duration-200",
              isCompleted && "scale-110"
            )} />
            {isCompleted ? "Done!" : "Mark Done"}
          </Button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className={cn(
        "absolute bottom-0 left-0 h-1 bg-gradient-primary transition-all duration-500",
        isCompleted ? "w-full" : "w-0"
      )} />
    </Card>
  );
};