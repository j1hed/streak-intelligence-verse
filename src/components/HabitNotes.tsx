import { useState } from 'react';
import { MessageSquare, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Card } from '@/components/ui/card';

interface HabitNote {
  id: string;
  habitId: string;
  date: string;
  note: string;
  createdAt: Date;
}

interface HabitNotesProps {
  habitId: string;
  habitName: string;
  notes: HabitNote[];
  onSaveNote: (habitId: string, date: string, note: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const HabitNotes = ({ 
  habitId, 
  habitName, 
  notes, 
  onSaveNote, 
  onDeleteNote 
}: HabitNotesProps) => {
  const [newNote, setNewNote] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  const todayNote = notes.find(n => n.habitId === habitId && n.date === today);
  const recentNotes = notes
    .filter(n => n.habitId === habitId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleSaveNote = () => {
    if (newNote.trim()) {
      onSaveNote(habitId, today, newNote.trim());
      setNewNote('');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <MessageSquare className="w-4 h-4" />
          {todayNote ? 'Edit Note' : 'Add Note'}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="bg-card border-border max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-foreground">Notes for {habitName}</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {/* Add/Edit Today's Note */}
          <Card className="p-4 bg-gradient-card border-border/50">
            <h4 className="font-medium text-foreground mb-2">Today's Reflection</h4>
            <Textarea
              value={newNote || todayNote?.note || ''}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="How did this habit go today? Any insights or challenges?"
              className="bg-background border-border text-foreground min-h-[80px] resize-none"
            />
            <div className="flex justify-end mt-3">
              <Button 
                onClick={handleSaveNote}
                size="sm"
                className="bg-gradient-primary border-none"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Note
              </Button>
            </div>
          </Card>

          {/* Recent Notes */}
          {recentNotes.length > 0 && (
            <div>
              <h4 className="font-medium text-foreground mb-3">Recent Notes</h4>
              <div className="space-y-3">
                {recentNotes.map((note) => (
                  <Card key={note.id} className="p-3 bg-muted/20 border-border/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {new Date(note.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteNote(note.id)}
                        className="text-muted-foreground hover:text-destructive h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{note.note}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};