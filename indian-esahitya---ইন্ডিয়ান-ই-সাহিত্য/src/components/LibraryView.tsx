import React, { useState, useMemo } from 'react';
import {
  Search,
  Clock,
  Heart,
  Bookmark,
  Sparkles,
  ArrowRight,
  BookOpen,
  Filter,
  X,
  Flame,
} from 'lucide-react';
import { Story, StoryCategory } from '../types';
import { toBengaliNumber, formatBengaliDate } from '../utils/bengali';

interface LibraryViewProps {
  stories: Story[];
  bookmarkedIds: string[];
  onSelectStory: (story: Story) => void;
  onToggleBookmark: (storyId: string) => void;
  onLikeStory: (storyId: string) => void;
  onNewStory: () => void;
}

const CATEGORIES: StoryCategory[] = [
  'সব',
  'রোমাঞ্চ',
  'রহস্য',
  'ভৌতিক',
  'রূপকথা',
  'বিজ্ঞান কল্পকাহিনী',
  'সামাজিক',
  'অনুপ্রেরণা',
];

export const LibraryView: React.FC<LibraryViewProps> = ({
  stories,
  bookmarkedIds,
  onSelectStory,
  onToggleBookmark,
  onLikeStory,
  onNewStory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory>('সব');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'length'>('latest');

  // Filter and sort stories
  const filteredStories = useMemo(() => {
    return stories
      .filter((story) => {
        const matchesCategory =
          selectedCategory === 'সব' || story.category === selectedCategory;
        const matchesSearch =
          searchQuery === '' ||
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return (b.likes || 0) - (a.likes || 0);
        }
        if (sortBy === 'length') {
          return b.wordCount - a.wordCount;
        }
        return b.updatedAt - a.updatedAt;
      });
  }, [stories, selectedCategory, searchQuery, sortBy]);

  // Featured story (first story if no search)
  const featuredStory = useMemo(() => {
    if (searchQuery || selectedCategory !== 'সব' || stories.length === 0) return null;
    return stories[0];
  }, [stories, searchQuery, selectedCategory]);

  const listStories = featuredStory
    ? filteredStories.filter((s) => s.id !== featuredStory.id)
    : filteredStories;

  return (
    <div className="space-y-6 pb-6">
      {/* Hero Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium text-purple-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>বাংলা গল্পের মুগ্ধকর ভুবন</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 leading-tight">
            হৃদয়ছোঁয়া বাংলা গল্পের সংগ্রহ
          </h2>
          <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed mb-5">
            অনলাইন কিংবা অফলাইনে পড়ুন সেরা বাংলা সাহিত্য, রোমাঞ্চকর রহস্য কিংবা নিজের জীবনের গল্প লিখে প্রকাশ করুন।
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNewStory}
              className="px-4 py-2 rounded-xl bg-white text-slate-950 text-sm font-semibold hover:bg-purple-50 transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <span>নতুন গল্প লিখুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-xs text-purple-200">
              মোট {toBengaliNumber(stories.length)} টি গল্প উপলব্ধ
            </div>
          </div>
        </div>

        {/* Decorative ambient elements */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-6 opacity-10 hidden sm:block pointer-events-none">
          <BookOpen className="w-48 h-48 text-white" />
        </div>
      </div>

      {/* Search Bar & Filter Options */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="গল্পের শিরোনাম, বিষয়বস্তু বা লেখক খুঁজুন..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> ক্রমানুসার:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
            >
              <option value="latest">নতুনতম (সর্বশেষ)</option>
              <option value="popular">জনপ্রিয় (লাইক)</option>
              <option value="length">দীর্ঘতম গল্প</option>
            </select>
          </div>
        </div>

        {/* Categories Horizontal Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none py-1">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Story Showcase (if active on all categories and no search query) */}
      {featuredStory && (
        <div className="border border-purple-200/80 dark:border-purple-900/40 rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-purple-50/70 via-indigo-50/40 to-white dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 shadow-sm transition-all hover:border-purple-300 dark:hover:border-purple-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 dark:text-purple-400">
              <Flame className="w-4 h-4 fill-purple-500 text-purple-500" />
              <span>নির্বাচিত গল্প · {featuredStory.category}</span>
            </div>
            <button
              onClick={() => onToggleBookmark(featuredStory.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              title="বুকমার্ক করুন"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  bookmarkedIds.includes(featuredStory.id)
                    ? 'fill-purple-600 text-purple-600 dark:fill-purple-400 dark:text-purple-400'
                    : ''
                }`}
              />
            </button>
          </div>

          <h3
            onClick={() => onSelectStory(featuredStory)}
            className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors mb-2 leading-snug font-serif"
          >
            {featuredStory.title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
            {featuredStory.content.substring(0, 220)}...
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-purple-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            {/* Clean unboxed metadata per Zero-Pill discipline */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {featuredStory.author}
              </span>
              <span aria-hidden="true">·</span>
              <span>{formatBengaliDate(featuredStory.updatedAt)}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {toBengaliNumber(featuredStory.readTimeMinutes)} মিনিট
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onLikeStory(featuredStory.id)}
                className="flex items-center gap-1 text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                title="ভালো লেগেছে"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    (featuredStory.likes || 0) > 0 ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
                <span>{toBengaliNumber(featuredStory.likes || 0)}</span>
              </button>

              <button
                onClick={() => onSelectStory(featuredStory)}
                className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium inline-flex items-center gap-1.5 transition-colors"
              >
                <span>পড়ুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stories Grid / List */}
      {filteredStories.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
            কোনো গল্প পাওয়া যায়নি
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-4">
            {searchQuery
              ? 'আপনার অনুসন্ধানের সাথে মেলে এমন কোনো গল্প নেই। ভিন্ন শব্দ দিয়ে চেষ্টা করুন।'
              : 'এই বিভাগে এখনও কোনো গল্প যুক্ত করা হয়নি। আপনিই প্রথম লিখুন!'}
          </p>
          <button
            onClick={onNewStory}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm transition-colors"
          >
            <span>নতুন গল্প লিখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listStories.map((story) => {
            const isBookmarked = bookmarkedIds.includes(story.id);

            return (
              <article
                key={story.id}
                className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200"
              >
                <div>
                  {/* Top metadata row without pill boxes */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2.5">
                    <div className="flex items-center gap-1.5 font-medium text-purple-600 dark:text-purple-400">
                      <span>{story.category}</span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {toBengaliNumber(story.wordCount)} শব্দ
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleBookmark(story.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        title={isBookmarked ? 'বুকমার্ক সরান' : 'বুকমার্ক করুন'}
                        aria-label="Bookmark"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            isBookmarked
                              ? 'fill-purple-600 text-purple-600 dark:fill-purple-400 dark:text-purple-400'
                              : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onSelectStory(story)}
                    className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 cursor-pointer transition-colors mb-2 line-clamp-1 font-serif"
                  >
                    {story.title}
                  </h3>

                  {/* Snippet */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
                    {story.content.substring(0, 150)}...
                  </p>
                </div>

                {/* Card Footer with clean unboxed metadata */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {story.author}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {toBengaliNumber(story.readTimeMinutes)} মি.
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onLikeStory(story.id)}
                      className="flex items-center gap-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                      title="লাইক দিন"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          (story.likes || 0) > 0 ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                      <span className="text-[11px]">{toBengaliNumber(story.likes || 0)}</span>
                    </button>

                    <button
                      onClick={() => onSelectStory(story)}
                      className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 inline-flex items-center gap-1 transition-colors"
                    >
                      <span>পড়ুন</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
