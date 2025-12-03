import React, { useState, useEffect } from 'react';
import { MoodSlider } from './components/MoodSlider';
import { DayRating } from './components/DayRating';
import { JournalPrompt } from './components/JournalPrompt';
import { ActivitySuggestions } from './components/ActivitySuggestions';
import { ActivityPhoto } from './components/ActivityPhoto';
import { Analytics } from './components/Analytics';
import { Memories } from './components/Memories';
import { FavoriteActivities } from './components/FavoriteActivities';
import { FAQ } from './components/FAQ';
import { Tutorial } from './components/Tutorial';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Menu } from 'lucide-react';

export default function App() {
  const [moodValue, setMoodValue] = useState<number | null>(null);
  const [dayRating, setDayRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<'mood-tracker' | 'journal' | 'activities' | 'photo' | 'analytics' | 'memories' | 'favorites' | 'faq'>('mood-tracker');
  const [selectedActivity, setSelectedActivity] = useState<{title: string; description: string; icon: string} | null>(null);
  const [journalEntry, setJournalEntry] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState<{title: string; description: string; icon: string; benefit: string}[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);

  // Check if user is new and should see tutorial
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('mindscape-tutorial-seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('mindscape-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mindscape-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleRecordDay = () => {
    // Only proceed if both mood and day rating are selected
    if (moodValue && dayRating) {
      setCurrentPage('journal');
    }
  };

  const handleReset = () => {
    setMoodValue(null);
    setDayRating(null);
  };

  const handleBackToMoodTracker = () => {
    setCurrentPage('mood-tracker');
  };

  const handleViewAnalytics = () => {
    setCurrentPage('analytics');
    setSidebarOpen(false);
  };

  const handleViewMemories = () => {
    setCurrentPage('memories');
    setSidebarOpen(false);
  };

  const handleViewFavorites = () => {
    setCurrentPage('favorites');
    setSidebarOpen(false);
  };

  const handleViewFAQ = () => {
    setCurrentPage('faq');
    setSidebarOpen(false);
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('mindscape-tutorial-seen', 'true');
  };

  const handleOpenTutorial = () => {
    setShowTutorial(true);
  };

  const handleToggleFavorite = (activity: {title: string; description: string; icon: string; benefit: string}) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.title === activity.title);
      if (isFavorite) {
        // Remove from favorites
        return prev.filter(fav => fav.title !== activity.title);
      } else {
        // Add to favorites
        return [...prev, activity];
      }
    });
  };

  const handleRemoveFavorite = (title: string) => {
    setFavorites(prev => prev.filter(fav => fav.title !== title));
  };

  const handleJournalComplete = (entry: string) => {
    // Save journal entry and move to activity suggestions
    setJournalEntry(entry);
    setCurrentPage('activities');
  };

  const handleJournalSkipToAnalytics = () => {
    // Skip journal activities and go directly to analytics
    setCurrentPage('analytics');
  };

  const handleActivitiesBack = () => {
    // Go back to journal from activities
    setCurrentPage('journal');
  };

  const handleActivitiesSkip = () => {
    // Skip activities and go directly to analytics
    setCurrentPage('analytics');
  };

  const handleActivitiesComplete = (activity: {title: string; description: string; icon: string}) => {
    // User selected an activity, go to photo upload
    setSelectedActivity(activity);
    setCurrentPage('photo');
  };

  const handlePhotoComplete = () => {
    // Go to analytics page after photo completion
    setCurrentPage('analytics');
  };

  const handleBackToHome = () => {
    // Reset everything and go back to mood tracker from analytics
    setMoodValue(null);
    setDayRating(null);
    setSelectedActivity(null);
    setJournalEntry('');
    setCurrentPage('mood-tracker');
  };

  // Show FAQ page
  if (currentPage === 'faq') {
    return (
      <FAQ 
        onBackToHome={handleBackToHome}
        onViewAnalytics={handleViewAnalytics}
        onViewMemories={handleViewMemories}
        onViewFavorites={handleViewFavorites}
      />
    );
  }

  // Show favorites page
  if (currentPage === 'favorites') {
    return (
      <FavoriteActivities 
        favorites={favorites}
        onRemoveFavorite={handleRemoveFavorite}
        onBackToHome={handleBackToHome}
        onViewAnalytics={handleViewAnalytics}
        onViewMemories={handleViewMemories}
        onViewFAQ={handleViewFAQ}
      />
    );
  }

  // Show memories page
  if (currentPage === 'memories') {
    return (
      <Memories 
        onBackToHome={handleBackToHome}
        onViewAnalytics={handleViewAnalytics}
        onViewFavorites={handleViewFavorites}
        onViewFAQ={handleViewFAQ}
      />
    );
  }

  // Show analytics page
  if (currentPage === 'analytics') {
    return (
      <Analytics 
        onBackToHome={handleBackToHome}
        onViewMemories={handleViewMemories}
        onViewFavorites={handleViewFavorites}
        onViewFAQ={handleViewFAQ}
      />
    );
  }

  // Show photo upload page
  if (currentPage === 'photo' && selectedActivity) {
    return (
      <ActivityPhoto 
        selectedActivity={selectedActivity}
        onComplete={handlePhotoComplete}
        onViewAnalytics={handleViewAnalytics}
        onViewMemories={handleViewMemories}
        onViewFavorites={handleViewFavorites}
        onViewFAQ={handleViewFAQ}
      />
    );
  }

  // Show activity suggestions page
  if (currentPage === 'activities' && moodValue && dayRating) {
    return (
      <ActivitySuggestions 
        moodValue={moodValue}
        dayRating={dayRating}
        onBack={handleActivitiesBack}
        onSkip={handleActivitiesSkip}
        onComplete={handleActivitiesComplete}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onViewAnalytics={handleViewAnalytics}
        onViewMemories={handleViewMemories}
        onViewFavorites={handleViewFavorites}
        onViewFAQ={handleViewFAQ}
      />
    );
  }

  // Show journal page if on journal
  if (currentPage === 'journal' && moodValue && dayRating) {
    return (
      <JournalPrompt 
        moodValue={moodValue}
        dayRating={dayRating}
        savedEntry={journalEntry}
        onBack={handleBackToMoodTracker}
        onComplete={handleJournalComplete}
        onSkipToAnalytics={handleJournalSkipToAnalytics}
        onViewAnalytics={handleViewAnalytics}
        onViewMemories={handleViewMemories}
        onViewFavorites={handleViewFavorites}
        onViewFAQ={handleViewFAQ}
      />
    );
  }

  // Show mood tracker page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        {/* Combined mood tracking and day rating card */}
        <div className="bg-card rounded-2xl shadow-lg border p-8 space-y-4 relative">
          {/* Hamburger Menu */}
          <div className="absolute top-4 right-4">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                  <Menu className={`h-5 w-5 transition-colors ${sidebarOpen ? 'text-green-600' : ''}`} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <VisuallyHidden>
                    <SheetTitle>Navigation Menu</SheetTitle>
                  </VisuallyHidden>
                  <VisuallyHidden>
                    <SheetDescription>Navigate to different sections of the MindScape app</SheetDescription>
                  </VisuallyHidden>
                </SheetHeader>
                <div className="mt-8">
                  <h3 className="text-center mb-6" style={{ fontFamily: 'cursive' }}>
                    MindScape Menu
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={handleViewAnalytics}
                      className="w-full text-center p-2 hover:opacity-70 transition-opacity text-lg"
                    >
                      View Analytics
                    </button>
                    <button
                      onClick={handleViewMemories}
                      className="w-full text-center p-2 hover:opacity-70 transition-opacity text-lg"
                    >
                      Memories
                    </button>
                    <button
                      onClick={handleViewFavorites}
                      className="w-full text-center p-2 hover:opacity-70 transition-opacity text-lg"
                    >
                      Saved Favourites
                    </button>
                    <button
                      onClick={handleViewFAQ}
                      className="w-full text-center p-2 hover:opacity-70 transition-opacity text-lg"
                    >
                      FAQ
                    </button>
                    <button
                      onClick={handleOpenTutorial}
                      className="w-full text-center p-2 hover:opacity-70 transition-opacity text-lg"
                    >
                      Tutorial
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Tutorial */}
          <Tutorial isOpen={showTutorial} onClose={handleCloseTutorial} />

          {/* App Name */}
          <div className="text-center mb-6">
            <h1 className="text-4xl text-primary" style={{ fontFamily: 'cursive', fontWeight: '400' }}>
              MindScape
            </h1>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl">How are you feeling today?</h2>
            <h3 className="text-sm text-muted-foreground">
              Move the slider to select your mood
            </h3>
          </div>

          {/* Mood section */}
          <div>
            <MoodSlider value={moodValue} onChange={setMoodValue} />
          </div>

          {/* Divider */}
          <div className="border-t"></div>

          {/* Day rating section */}
          <div>
            <DayRating value={dayRating} onChange={setDayRating} />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <button 
              className={`flex-1 py-3 px-6 rounded-lg transition-all ${
                moodValue && dayRating 
                  ? 'bg-primary text-primary-foreground hover:opacity-90' 
                  : 'bg-secondary text-secondary-foreground opacity-50 cursor-not-allowed'
              }`}
              onClick={handleRecordDay}
              disabled={!moodValue || !dayRating}
            >
              Record My Day
            </button>
            <button 
              className="flex-1 bg-secondary text-secondary-foreground py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>

          {/* Footer message */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {moodValue && dayRating 
                ? "Great! Now click 'Record My Day' to continue with journaling 💝"
                : "Taking a moment to check in with yourself is a great first step! 💝"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}