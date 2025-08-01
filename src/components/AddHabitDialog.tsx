import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HabitCategory } from '@/types/habit';

interface AddHabitDialogProps {
  onAddHabit: (habit: {
    name: string;
    category: string;
    color: string;
    icon: string;
    targetFrequency: 'daily' | 'weekly';
  }) => void;
}

const categories: Array<{ value: HabitCategory; label: string; color: string }> = [
  { value: 'health', label: '🩺 Health', color: 'green' },
  { value: 'fitness', label: '💪 Fitness', color: 'red' },
  { value: 'productivity', label: '⚡ Productivity', color: 'blue' },
  { value: 'learning', label: '📚 Learning', color: 'purple' },
  { value: 'social', label: '👥 Social', color: 'pink' },
  { value: 'mindfulness', label: '🧘 Mindfulness', color: 'teal' },
  { value: 'creativity', label: '🎨 Creativity', color: 'orange' },
  { value: 'other', label: '📋 Other', color: 'gray' },
];

export const AddHabitDialog = ({ onAddHabit }: AddHabitDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [targetFrequency, setTargetFrequency] = useState<'daily' | 'weekly'>('daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedCategory = categories.find(c => c.value === category);
    
    onAddHabit({
      name: name.trim(),
      category,
      color: selectedCategory?.color || 'gray',
      icon: selectedCategory?.label.split(' ')[0] || '📋',
      targetFrequency,
    });

    setName('');
    setCategory('health');
    setTargetFrequency('daily');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary border-none shadow-glow hover:shadow-elevated transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Add New Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Habit Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Drink 8 glasses of water"
              className="bg-background border-border text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">Category</Label>
            <Select value={category} onValueChange={(value: HabitCategory) => setCategory(value)}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="text-foreground">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-foreground">Frequency</Label>
            <Select value={targetFrequency} onValueChange={(value: 'daily' | 'weekly') => setTargetFrequency(value)}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="daily" className="text-foreground">Daily</SelectItem>
                <SelectItem value="weekly" className="text-foreground">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary border-none">
              Create Habit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};