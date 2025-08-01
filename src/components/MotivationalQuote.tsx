import { useState, useEffect } from 'react';
import { RefreshCw, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const motivationalQuotes = [
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Progress, not perfection, is what we should strive for.", author: "Unknown" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
];

export const MotivationalQuote = () => {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getNewQuote = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[randomIndex]);
      setIsRefreshing(false);
    }, 300);
  };

  useEffect(() => {
    // Set a random quote on component mount
    getNewQuote();
  }, []);

  return (
    <Card className="bg-gradient-card border-border/50 p-6 mb-8">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Quote className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
          <div className="space-y-2">
            <blockquote className="text-lg text-foreground italic leading-relaxed">
              "{currentQuote.text}"
            </blockquote>
            <cite className="text-sm text-muted-foreground font-medium">
              — {currentQuote.author}
            </cite>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={getNewQuote}
          disabled={isRefreshing}
          className="ml-4 text-muted-foreground hover:text-primary"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </Card>
  );
};