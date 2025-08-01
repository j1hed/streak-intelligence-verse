import { Check, Flame, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Habit, HabitNote } from '@/types/habit';
import { HabitNotes } from './HabitNotes';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  streak: number;
  notes: HabitNote[];
  onToggle: () => void;
  onDelete: () => void;
  onSaveNote: (habitId: string, date: string, note: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const HabitCard = ({ 
  habit, 
  isCompleted, 
  streak, 
  notes,
  onToggle, 
  onDelete,
  onSaveNote,
  onDeleteNote
}: HabitCardProps) => {
  const today = new Date().toISOString().split('T')[0];
  const todayNote = notes.find(n => n.habitId === habit.id && n.date === today);

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-elevated group",
      "bg-gradient-card border-border/50",
      isCompleted && "animate-pulse-glow"
    )}>
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div 
              className={cn(
                "w-3 h-3 rounded-full flex-shrink-0",
                `bg-${habit.color}-500`
              )}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{habit.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-xs">
                  {habit.category}
                </span>
                {streak > 0 && (
                  <div className="flex items-center gap-1 text-orange-400">
                    <Flame className="w-3 h-3" />
                    <span className="font-medium text-xs">{streak}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Today's note preview */}
        {todayNote && (
          <div className="mb-4 p-3 bg-muted/20 rounded-lg border border-border/30">
            <p className="text-sm text-muted-foreground line-clamp-2">
              "{todayNote.note}"
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <HabitNotes
            habitId={habit.id}
            habitName={habit.name}
            notes={notes}
            onSaveNote={onSaveNote}
            onDeleteNote={onDeleteNote}
          />

          <Button
            variant={isCompleted ? "default" : "outline"}
            size="sm"
            onClick={onToggle}
            className={cn(
              "transition-all duration-200 flex-shrink-0",
              isCompleted && "bg-gradient-success border-none shadow-glow animate-bounce-in"
            )}
          >
            <Check className={cn(
              "w-4 h-4 transition-transform duration-200 mr-1 sm:mr-2",
              isCompleted && "scale-110"
            )} />
            <span className="hidden sm:inline">
              {isCompleted ? "Done!" : "Mark Done"}
            </span>
            <span className="sm:hidden">
              {isCompleted ? "✓" : "Do"}
            </span>
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