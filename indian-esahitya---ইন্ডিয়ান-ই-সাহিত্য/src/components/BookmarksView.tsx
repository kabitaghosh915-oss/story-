import React from 'react';
import { Bookmark, Clock, ArrowRight, BookOpen, Trash2, Heart } from 'lucide-react';
import { Story } from '../types';
import { toBengaliNumber, formatBengaliDate } from '../utils/bengali';

interface BookmarksViewProps {
  stories: Story[];
  bookmarkedIds: string[];
  onSelectStory: (story: Story) => void;
  onRemoveBookmark: (storyId: string) => void;
  onExploreLibrary: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  stories,
  bookmarkedIds,
  onSelectStory,
  onRemoveBookmark,
  onExploreLibrary,
}) => {
  const bookmarkedStories = stories.filter((story) =>
    bookmarkedIds.includes(story.id)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400" />
            <span>সংরক্ষিত গল্পের তালিকা</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            আপনার প্রিয় এবং পরবর্তীতে পড়ার জন্য রেখে দেওয়া গল্পগুলো এখানে সংরক্ষিত থাকে।
          </p>
        </div>

        <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 self-start sm:self-auto">
          মোট {toBengaliNumber(bookmarkedStories.length)} টি সংরক্ষিত গল্প
        </div>
      </div>

      {bookmarkedStories.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50">
          <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
            আপনার বুকমার্কে কোনো গল্প নেই
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-4">
            লাইব্রেরিতে গিয়ে আপনার পছন্দের গল্পের বুকমার্ক আইকনে ক্লিক করে সংরক্ষণ করুন।
          </p>
          <button
            onClick={onExploreLibrary}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm transition-colors"
          >
            <span>লাইব্রেরির গল্প দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarkedStories.map((story) => (
            <article
              key={story.id}
              className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-800 shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {story.category}
                  </span>
                  <button
                    onClick={() => onRemoveBookmark(story.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                    title="বুকমার্ক থেকে মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3
                  onClick={() => onSelectStory(story)}
                  className="text-lg font-bold text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer font-serif mb-2 line-clamp-1 transition-colors"
                >
                  {story.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {story.content.substring(0, 140)}...
                </p>
              </div>

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

                <button
                  onClick={() => onSelectStory(story)}
                  className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 inline-flex items-center gap-1 transition-colors"
                >
                  <span>পড়ুন</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
