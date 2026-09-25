import React from 'react';
import { Moon, Sun, BookOpen, PenTool, Smartphone, Monitor, Code2 } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  onNewStory: () => void;
  onOpenSourceCode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  isDarkMode,
  onToggleTheme,
  isMobileFrame,
  onToggleFrame,
  onNewStory,
  onOpenSourceCode,
}) => {
  const getPageTitle = () => {
    switch (currentTab) {
      case 'library':
        return 'গল্প লাইব্রেরি';
      case 'writer':
        return 'গল্প রচনা';
      case 'reader':
        return 'গল্প পাঠ';
      case 'bookmarks':
        return 'সংরক্ষিত গল্প';
      case 'profile':
        return 'লেখক প্রোফাইল';
      default:
        return 'আমার গল্প';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('library')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                  আমার গল্প
                </h1>
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                {getPageTitle()}
              </p>
            </div>
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* New Story shortcut if not in writer */}
          {currentTab !== 'writer' && (
            <button
              onClick={onNewStory}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>লিখুন</span>
            </button>
          )}

          {/* Source Code Modal */}
          {onOpenSourceCode && (
            <button
              onClick={onOpenSourceCode}
              title="প্রজেক্ট ফাইলসমূহ ও সোর্স কোড"
              aria-label="View Project Source Code"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Toggle View Layout (Mobile container vs Fullscreen) */}
          <button
            onClick={onToggleFrame}
            title={isMobileFrame ? 'ফুলস্ক্রিন ভিউ করুন' : 'মোবাইল ফ্রেম ভিউ করুন'}
            aria-label="Toggle frame layout"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isMobileFrame ? (
              <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
            ) : (
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            title={isDarkMode ? 'লাইট মোড অন করুন' : 'ডার্ক মোড অন করুন'}
            aria-label="Toggle Dark Mode"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
