import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Copy,
  Heart,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Edit3,
  Type,
  Sun,
  Palette,
  Check,
  Clock,
  User,
  Calendar,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { Story, ReaderSettings } from '../types';
import { toBengaliNumber, formatBengaliDate } from '../utils/bengali';

interface ReaderViewProps {
  story: Story;
  isBookmarked: boolean;
  onBack: () => void;
  onToggleBookmark: () => void;
  onLikeStory: () => void;
  onEditStory: () => void;
  onNextStory?: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  story,
  isBookmarked,
  onBack,
  onToggleBookmark,
  onLikeStory,
  onEditStory,
  onNextStory,
  onShowToast,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    try {
      const saved = localStorage.getItem('my_story_app_reader_settings');
      return saved
        ? JSON.parse(saved)
        : { fontSize: 'md', fontFamily: 'serif', theme: 'light' };
    } catch {
      return { fontSize: 'md', fontFamily: 'serif', theme: 'light' };
    }
  });

  // Audio Speech state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Save reader settings
  const updateSettings = (partial: Partial<ReaderSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    localStorage.setItem('my_story_app_reader_settings', JSON.stringify(updated));
  };

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [story.id]);

  // Handle Speech narration
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      onShowToast('আপনার ব্রাউজারে অডিও রিডার সুবিধাটি সমর্থিত নয়।', 'error');
      return;
    }

    if (isPlayingAudio) {
      if (isAudioPaused) {
        window.speechSynthesis.resume();
        setIsAudioPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsAudioPaused(true);
      }
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(story.title + '। ' + story.content);
      
      // Attempt to find Bengali voice
      const voices = window.speechSynthesis.getVoices();
      const bengaliVoice = voices.find(
        (v) => v.lang.startsWith('bn') || v.lang.includes('Bengali')
      );
      if (bengaliVoice) {
        utterance.voice = bengaliVoice;
      }
      utterance.lang = 'bn-BD';
      utterance.rate = 0.95;

      utterance.onend = () => {
        setIsPlayingAudio(false);
        setIsAudioPaused(false);
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setIsAudioPaused(false);
      };

      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
      setIsAudioPaused(false);
      onShowToast('গল্প পাঠ শুরু হয়েছে', 'info');
    }
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsAudioPaused(false);
  };

  // Copy story text
  const handleCopyStory = () => {
    navigator.clipboard.writeText(`${story.title}\nলেখক: ${story.author}\n\n${story.content}`);
    onShowToast('সম্পূর্ণ গল্পটি কপি করা হয়েছে!', 'success');
  };

  // Share story
  const handleShareStory = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: `${story.title} - ${story.author}\nআমার গল্প অ্যাপে পড়ুন।`,
          url: window.location.href,
        });
      } catch {
        handleCopyStory();
      }
    } else {
      handleCopyStory();
    }
  };

  // Typography styling classes
  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'sm':
        return 'text-base sm:text-lg leading-relaxed';
      case 'lg':
        return 'text-xl sm:text-2xl leading-loose';
      case 'xl':
        return 'text-2xl sm:text-3xl leading-loose';
      case 'md':
      default:
        return 'text-lg sm:text-xl leading-relaxed';
    }
  };

  const getThemeClass = () => {
    switch (settings.theme) {
      case 'sepia':
        return 'bg-[#fbf0d9] text-[#433422] border-[#ebd7be]';
      case 'dark':
        return 'bg-[#18181b] text-[#e4e4e7] border-[#27272a]';
      case 'light':
      default:
        return 'bg-white text-slate-800 border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800';
    }
  };

  // Split into paragraphs
  const paragraphs = story.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="relative pb-16">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reader Control Header */}
      <div className="sticky top-16 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2.5 px-4 mb-6 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between gap-2">
          {/* Back button */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">ফিরে যান</span>
          </button>

          {/* Quick Reader Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Audio Reader */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
              <button
                onClick={handleToggleSpeech}
                title={
                  isPlayingAudio
                    ? isAudioPaused
                      ? 'অডিও চালু করুন'
                      : 'অডিও থামান'
                    : 'গল্পটি শুনুন (পাঠক)'
                }
                className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                  isPlayingAudio
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isPlayingAudio ? (
                  isAudioPaused ? (
                    <Play className="w-3.5 h-3.5" />
                  ) : (
                    <Pause className="w-3.5 h-3.5" />
                  )
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
                <span className="text-[11px] font-medium hidden md:inline">
                  {isPlayingAudio ? (isAudioPaused ? 'চালু' : 'বিরতি') : 'শুনুন'}
                </span>
              </button>

              {isPlayingAudio && (
                <button
                  onClick={handleStopSpeech}
                  title="বন্ধ করুন"
                  className="p-1.5 rounded-md text-slate-500 hover:text-rose-500 transition-colors"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Typography / Reading Settings toggle */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg text-xs transition-colors ${
                showSettings
                  ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="পড়ার স্টাইল ও ফন্ট সেটিংস"
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Bookmark button */}
            <button
              onClick={onToggleBookmark}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isBookmarked ? 'বুকমার্ক সরান' : 'বুকমার্ক করুন'}
            >
              <Bookmark
                className={`w-4 h-4 ${
                  isBookmarked
                    ? 'fill-purple-600 text-purple-600 dark:fill-purple-400 dark:text-purple-400'
                    : ''
                }`}
              />
            </button>

            {/* Share / Copy */}
            <button
              onClick={handleShareStory}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="শেয়ার করুন"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Edit button if custom story */}
            <button
              onClick={onEditStory}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="সম্পাদনা করুন"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reader Customization Panel Dropdown */}
        {showSettings && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-1 text-xs">
            {/* Font Size */}
            <div className="space-y-1">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                অক্ষরের মাপ (Font Size)
              </span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSettings({ fontSize: size })}
                    className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
                      settings.fontSize === size
                        ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {size === 'sm' && 'ছোট'}
                    {size === 'md' && 'মাঝারি'}
                    {size === 'lg' && 'বড়'}
                    {size === 'xl' && 'বিশাল'}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-1">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                ফন্ট স্টাইল
              </span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => updateSettings({ fontFamily: 'sans' })}
                  className={`flex-1 py-1 rounded text-center font-sans font-medium transition-colors ${
                    settings.fontFamily === 'sans'
                      ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  শিলিগুড়ি (Sans)
                </button>
                <button
                  onClick={() => updateSettings({ fontFamily: 'serif' })}
                  className={`flex-1 py-1 rounded text-center font-serif font-semibold transition-colors ${
                    settings.fontFamily === 'serif'
                      ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  সেরিফ (Serif)
                </button>
              </div>
            </div>

            {/* Reading Background Theme */}
            <div className="space-y-1">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                পড়ার ব্যাকগ্রাউন্ড
              </span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => updateSettings({ theme: 'light' })}
                  className={`flex-1 py-1 rounded text-center transition-colors ${
                    settings.theme === 'light'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  সাদা
                </button>
                <button
                  onClick={() => updateSettings({ theme: 'sepia' })}
                  className={`flex-1 py-1 rounded text-center transition-colors ${
                    settings.theme === 'sepia'
                      ? 'bg-[#edd9bf] text-[#433422] shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  সেপিয়া
                </button>
                <button
                  onClick={() => updateSettings({ theme: 'dark' })}
                  className={`flex-1 py-1 rounded text-center transition-colors ${
                    settings.theme === 'dark'
                      ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  ডার্ক
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Story Container */}
      <article
        className={`max-w-3xl mx-auto rounded-3xl p-6 sm:p-10 shadow-sm border transition-colors ${getThemeClass()} ${
          settings.fontFamily === 'serif' ? 'font-serif' : 'font-sans'
        }`}
      >
        {/* Story Header */}
        <header className="mb-8 border-b border-slate-200/70 dark:border-slate-800 pb-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-3 tracking-wide">
            <span>{story.category}</span>
            <span aria-hidden="true">·</span>
            <span>{toBengaliNumber(story.wordCount)} শব্দ</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 leading-tight">
            {story.title}
          </h1>

          {/* Clean unboxed metadata per Zero-Pill discipline */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs opacity-75">
            <span className="font-medium flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {story.author}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatBengaliDate(story.updatedAt)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              আনুমানিক {toBengaliNumber(story.readTimeMinutes)} মিনিট পাঠ
            </span>
          </div>
        </header>

        {/* Story Body Paragraphs */}
        <div className={`space-y-6 ${getFontSizeClass()}`}>
          {paragraphs.map((paragraph, index) => {
            const isFirst = index === 0;

            return (
              <p
                key={index}
                className={`text-justify tracking-normal ${
                  isFirst
                    ? 'first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:text-purple-600 dark:first-letter:text-purple-400'
                    : ''
                }`}
              >
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Story Footer & Interactive Feedback */}
        <div className="mt-12 pt-8 border-t border-slate-200/70 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Likes button */}
            <div className="flex items-center gap-3">
              <button
                onClick={onLikeStory}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 font-medium text-xs transition-colors shadow-sm"
              >
                <Heart
                  className={`w-4 h-4 ${
                    (story.likes || 0) > 0 ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
                <span>গল্পটি ভালো লেগেছে ({toBengaliNumber(story.likes || 0)})</span>
              </button>

              <button
                onClick={handleCopyStory}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="টেক্সট কপি করুন"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation options */}
            <div className="flex items-center gap-2">
              {onNextStory && (
                <button
                  onClick={onNextStory}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs inline-flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>পরবর্তী গল্প</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={onBack}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs transition-colors"
              >
                লাইব্রেরিতে ফিরুন
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
