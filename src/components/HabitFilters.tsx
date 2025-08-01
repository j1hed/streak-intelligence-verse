import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { HabitCategory } from '@/types/habit';

interface HabitFiltersProps {
  selectedCategories: HabitCategory[];
  onCategoryToggle: (category: HabitCategory) => void;
  onClearFilters: () => void;
}

const categories = [
  { value: 'health', label: '🩺 Health', color: 'bg-green-100 text-green-800' },
  { value: 'fitness', label: '💪 Fitness', color: 'bg-red-100 text-red-800' },
  { value: 'productivity', label: '⚡ Productivity', color: 'bg-blue-100 text-blue-800' },
  { value: 'learning', label: '📚 Learning', color: 'bg-purple-100 text-purple-800' },
  { value: 'social', label: '👥 Social', color: 'bg-pink-100 text-pink-800' },
  { value: 'mindfulness', label: '🧘 Mindfulness', color: 'bg-teal-100 text-teal-800' },
  { value: 'creativity', label: '🎨 Creativity', color: 'bg-orange-100 text-orange-800' },
  { value: 'other', label: '📋 Other', color: 'bg-gray-100 text-gray-800' },
] as const;

export const HabitFilters = ({ 
  selectedCategories, 
  onCategoryToggle, 
  onClearFilters 
}: HabitFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center mb-4">
      {/* Desktop Filter */}
      <div className="hidden sm:flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <Filter className="w-4 h-4" />
          Filter:
        </span>
        {categories.map((category) => (
          <Badge
            key={category.value}
            variant={selectedCategories.includes(category.value as HabitCategory) ? "default" : "outline"}
            className="cursor-pointer transition-all hover:scale-105"
            onClick={() => onCategoryToggle(category.value as HabitCategory)}
          >
            {category.label}
          </Badge>
        ))}
        {selectedCategories.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Mobile Filter Sheet */}
      <div className="sm:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter ({selectedCategories.length})
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-card border-border">
            <SheetHeader>
              <SheetTitle className="text-foreground">Filter Habits</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {categories.map((category) => (
                <Badge
                  key={category.value}
                  variant={selectedCategories.includes(category.value as HabitCategory) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105 justify-center p-3"
                  onClick={() => onCategoryToggle(category.value as HabitCategory)}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
            {selectedCategories.length > 0 && (
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={onClearFilters}
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};