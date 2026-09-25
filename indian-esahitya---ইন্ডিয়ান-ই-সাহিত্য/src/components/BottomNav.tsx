import React from 'react';
import { BookOpen, PenSquare, Bookmark, User } from 'lucide-react';
import { TabType } from '../types';
import { toBengaliNumber } from '../utils/bengali';

interface BottomNavProps {
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
  bookmarkCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onNavigate,
  bookmarkCount,
}) => {
  const navItems = [
    {
      id: 'library' as TabType,
      label: 'লাইব্রেরি',
      icon: BookOpen,
    },
    {
      id: 'writer' as TabType,
      label: 'লিখুন',
      icon: PenSquare,
    },
    {
      id: 'bookmarks' as TabType,
      label: 'বুকমার্ক',
      icon: Bookmark,
      badge: bookmarkCount > 0 ? toBengaliNumber(bookmarkCount) : null,
    },
    {
      id: 'profile' as TabType,
      label: 'প্রোফাইল',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-colors">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || (currentTab === 'reader' && item.id === 'library');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-200 ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-normal'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'scale-100 stroke-[1.8]'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3 min-w-[18px] h-[18px] px-1 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
