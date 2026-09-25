import React, { useState, useEffect } from 'react';
import { TabType, Story, UserProfile, StoryCategory } from './types';
import { Storage } from './utils/storage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LibraryView } from './components/LibraryView';
import { ReaderView } from './components/ReaderView';
import { WriterView } from './components/WriterView';
import { BookmarksView } from './components/BookmarksView';
import { ProfileView } from './components/ProfileView';
import { ToastContainer, ToastMessage } from './components/Toast';
import { SourceCodeModal } from './components/SourceCodeModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('library');
  const [stories, setStories] = useState<Story[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [profile, setProfile] = useState<UserProfile>(Storage.getProfile());
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('my_story_app_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Sync dark mode class with HTML document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('my_story_app_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  // Load initial data from Storage
  useEffect(() => {
    const loadedStories = Storage.getAllStories();
    setStories(loadedStories);
    setBookmarkedIds(Storage.getBookmarks());
    setProfile(Storage.getProfile());
  }, []);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Story Interactions
  const handleSelectStory = (story: Story) => {
    setSelectedStory(story);
    setCurrentTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBookmark = (storyId: string) => {
    const isNowBookmarked = Storage.toggleBookmark(storyId);
    setBookmarkedIds(Storage.getBookmarks());
    if (isNowBookmarked) {
      showToast('গল্পটি বুকমার্কে যুক্ত করা হয়েছে।', 'success');
    } else {
      showToast('গল্পটি বুকমার্ক থেকে সরানো হয়েছে।', 'info');
    }
  };

  const handleLikeStory = (storyId: string) => {
    const newLikes = Storage.likeStory(storyId);
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, likes: newLikes } : s))
    );
    if (selectedStory && selectedStory.id === storyId) {
      setSelectedStory((prev) => (prev ? { ...prev, likes: newLikes } : null));
    }
    showToast('গল্পটি পছন্দ করার জন্য ধন্যবাদ!', 'success');
  };

  const handleSaveStory = (storyData: {
    id?: string | null;
    title: string;
    content: string;
    category: Exclude<StoryCategory, 'সব'>;
    author: string;
  }) => {
    const saved = Storage.saveStory(storyData);
    setStories(Storage.getAllStories());
    setEditingStory(null);
    setSelectedStory(saved);
    setCurrentTab('reader');
    showToast('গল্পটি সফলভাবে প্রকাশিত হয়েছে!', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteStory = (storyId: string) => {
    Storage.deleteStory(storyId);
    setStories(Storage.getAllStories());
    setBookmarkedIds(Storage.getBookmarks());
    if (selectedStory && selectedStory.id === storyId) {
      setSelectedStory(null);
    }
    setEditingStory(null);
    setCurrentTab('library');
    showToast('গল্পটি মুছে ফেলা হয়েছে।', 'info');
  };

  const handleEditStory = (story: Story) => {
    setEditingStory(story);
    setCurrentTab('writer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewStory = () => {
    setEditingStory(null);
    setCurrentTab('writer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStory = () => {
    if (!selectedStory) return;
    const currentIndex = stories.findIndex((s) => s.id === selectedStory.id);
    if (currentIndex !== -1 && currentIndex < stories.length - 1) {
      handleSelectStory(stories[currentIndex + 1]);
    } else if (stories.length > 0) {
      handleSelectStory(stories[0]);
    }
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    Storage.saveProfile(updated);
    setProfile(updated);
  };

  const handleResetDefaults = () => {
    Storage.resetDefaults();
    setStories(Storage.getAllStories());
    setBookmarkedIds([]);
    setProfile(Storage.getProfile());
    showToast('সকল গল্প এবং সেটিংস ডিফল্টে রিসেট করা হয়েছে।', 'info');
  };

  return (
    <div
      className={`min-h-screen font-sans bg-[#f8f9fa] dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors duration-200 ${
        isMobileFrame ? 'py-0 sm:py-8 flex justify-center items-center' : ''
      }`}
    >
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div
        className={`w-full transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-[480px] min-h-[92vh] sm:min-h-[850px] sm:max-h-[92vh] sm:border sm:border-slate-300 sm:dark:border-slate-800 sm:rounded-[36px] sm:shadow-2xl overflow-hidden flex flex-col bg-white dark:bg-slate-950 relative'
            : 'max-w-5xl mx-auto flex flex-col min-h-screen'
        }`}
      >
        {/* Header */}
        <Header
          currentTab={currentTab}
          onNavigate={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          isMobileFrame={isMobileFrame}
          onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
          onNewStory={handleNewStory}
          onOpenSourceCode={() => setIsSourceModalOpen(true)}
        />

        {/* Main Content Area */}
        <main
          className={`flex-1 px-4 sm:px-6 pt-5 pb-20 overflow-y-auto ${
            isMobileFrame ? 'scrollbar-thin' : ''
          }`}
        >
          {currentTab === 'library' && (
            <LibraryView
              stories={stories}
              bookmarkedIds={bookmarkedIds}
              onSelectStory={handleSelectStory}
              onToggleBookmark={handleToggleBookmark}
              onLikeStory={handleLikeStory}
              onNewStory={handleNewStory}
            />
          )}

          {currentTab === 'reader' && selectedStory && (
            <ReaderView
              story={selectedStory}
              isBookmarked={bookmarkedIds.includes(selectedStory.id)}
              onBack={() => setCurrentTab('library')}
              onToggleBookmark={() => handleToggleBookmark(selectedStory.id)}
              onLikeStory={() => handleLikeStory(selectedStory.id)}
              onEditStory={() => handleEditStory(selectedStory)}
              onNextStory={stories.length > 1 ? handleNextStory : undefined}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'writer' && (
            <WriterView
              editingStory={editingStory}
              onSaveStory={handleSaveStory}
              onDeleteStory={editingStory ? handleDeleteStory : undefined}
              onCancel={() => {
                setEditingStory(null);
                setCurrentTab('library');
              }}
              defaultAuthor={profile.penName || profile.name}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'bookmarks' && (
            <BookmarksView
              stories={stories}
              bookmarkedIds={bookmarkedIds}
              onSelectStory={handleSelectStory}
              onRemoveBookmark={handleToggleBookmark}
              onExploreLibrary={() => setCurrentTab('library')}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              profile={profile}
              stories={stories}
              bookmarkedIds={bookmarkedIds}
              onUpdateProfile={handleUpdateProfile}
              onSelectStory={handleSelectStory}
              onEditStory={handleEditStory}
              onDeleteStory={handleDeleteStory}
              onResetDefaults={handleResetDefaults}
              onOpenSourceCode={() => setIsSourceModalOpen(true)}
              onShowToast={showToast}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onNavigate={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          bookmarkCount={bookmarkedIds.length}
        />
      </div>

      {/* Source Code Viewer Modal */}
      <SourceCodeModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        onShowToast={showToast}
      />
    </div>
  );
}
