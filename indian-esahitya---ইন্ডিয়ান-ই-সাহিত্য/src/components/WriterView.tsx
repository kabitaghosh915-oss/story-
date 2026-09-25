import React, { useState, useEffect } from 'react';
import {
  Save,
  Trash2,
  Eye,
  Edit3,
  Quote,
  Bold,
  Italic,
  Sparkles,
  Clock,
  FileText,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Story, StoryCategory } from '../types';
import { calculateStoryStats, toBengaliNumber } from '../utils/bengali';
import { Storage } from '../utils/storage';

interface WriterViewProps {
  editingStory: Story | null;
  onSaveStory: (storyData: {
    id?: string | null;
    title: string;
    content: string;
    category: Exclude<StoryCategory, 'সব'>;
    author: string;
  }) => void;
  onDeleteStory?: (id: string) => void;
  onCancel: () => void;
  defaultAuthor: string;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const CATEGORIES: Exclude<StoryCategory, 'সব'>[] = [
  'রোমাঞ্চ',
  'রহস্য',
  'ভৌতিক',
  'রূপকথা',
  'বিজ্ঞান কল্পকাহিনী',
  'সামাজিক',
  'অনুপ্রেরণা',
  'স্মৃতিকথা',
];

export const WriterView: React.FC<WriterViewProps> = ({
  editingStory,
  onSaveStory,
  onDeleteStory,
  onCancel,
  defaultAuthor,
  onShowToast,
}) => {
  const [title, setTitle] = useState(editingStory ? editingStory.title : '');
  const [content, setContent] = useState(editingStory ? editingStory.content : '');
  const [category, setCategory] = useState<Exclude<StoryCategory, 'সব'>>(
    editingStory ? editingStory.category : 'সামাজিক'
  );
  const [author, setAuthor] = useState(
    editingStory ? editingStory.author : defaultAuthor || 'লেখক'
  );
  const [isPreview, setIsPreview] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Restore saved draft if not editing an existing story
  useEffect(() => {
    if (!editingStory) {
      const draft = Storage.getDraft();
      if (draft && (draft.title || draft.content)) {
        setTitle(draft.title || '');
        setContent(draft.content || '');
        if (draft.category && CATEGORIES.includes(draft.category as any)) {
          setCategory(draft.category as any);
        }
      }
    }
  }, [editingStory]);

  // Auto-save draft when fields change (if not editing existing)
  useEffect(() => {
    if (editingStory) return;

    const timer = setTimeout(() => {
      if (title.trim() || content.trim()) {
        Storage.saveDraft({ title, content, category });
        setIsDraftSaved(true);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [title, content, category, editingStory]);

  // Calculate live stats
  const stats = calculateStoryStats(content);
  const charCount = content.length;

  // Insert formatting snippet at textarea cursor position
  const handleInsertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('story-content-input') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = before + (selected || 'লেখা') + after;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + replacement.length - after.length);
    }, 50);
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      onShowToast('দয়া করে গল্পের একটি শিরোনাম অথবা বিষয়বস্তু লিখুন।', 'error');
      return;
    }

    onSaveStory({
      id: editingStory ? editingStory.id : null,
      title: title.trim() || 'শিরোনামহীন গল্প',
      content: content.trim(),
      category,
      author: author.trim() || defaultAuthor || 'লেখক',
    });

    if (!editingStory) {
      Storage.clearDraft();
    }
  };

  const handleClearDraft = () => {
    setTitle('');
    setContent('');
    setCategory('সামাজিক');
    Storage.clearDraft();
    setIsDraftSaved(false);
    onShowToast('ড্রাফট খালি করা হয়েছে।', 'info');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {editingStory ? 'গল্প সম্পাদনা' : 'নতুন গল্প লিখুন'}
            </h2>
            {!editingStory && isDraftSaved && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                ড্রাফট সংরক্ষিত
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            আপনার মনের ভাবকে বাংলা শব্দের শৈল্পিক আল্পনায় সাজিয়ে তুলুন।
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`px-3 py-2 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition-colors border ${
              isPreview
                ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isPreview ? 'এডিটর মোড' : 'প্রিভিউ দেখুন'}</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-sm shadow-purple-500/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{editingStory ? 'আপডেট করুন' : 'সেভ করুন'}</span>
          </button>
        </div>
      </div>

      {isPreview ? (
        /* Live Preview Mode */
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
              {category} · {toBengaliNumber(stats.wordCount)} শব্দ
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white mt-2">
              {title || 'শিরোনামহীন গল্প'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              লেখক: {author || 'লেখক'} · আনুমানিক {toBengaliNumber(stats.readTimeMinutes)} মিনিট পাঠ
            </p>
          </div>

          <div className="space-y-4 font-serif text-slate-800 dark:text-slate-200 leading-relaxed text-base sm:text-lg">
            {content ? (
              content
                .split(/\n\s*\n/)
                .filter(Boolean)
                .map((p, idx) => (
                  <p key={idx} className="text-justify">
                    {p}
                  </p>
                ))
            ) : (
              <p className="text-slate-400 italic text-center py-8">
                গল্পের কোনো লেখা এখনও যুক্ত করা হয়নি। এডিটরে ফিরে গিয়ে লিখুন।
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Editor Mode */
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="story-title-input"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              গল্পের শিরোনাম
            </label>
            <input
              id="story-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="যেমন: নীল জোছনার রাত..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Category & Author Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="story-category-input"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                বিভাগ (Category)
              </label>
              <select
                id="story-category-input"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="story-author-input"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                লেখকের নাম / ছদ্মনাম
              </label>
              <input
                id="story-author-input"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="আপনার নাম"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Formatting Helpers Bar */}
          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-1">
              ফরম্যাট:
            </span>
            <button
              type="button"
              onClick={() => handleInsertText('**', '**')}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="বোল্ড"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleInsertText('*', '*')}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="ইতালিক"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleInsertText('\n\n"— ', ' "\n\n')}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="সংলাপ / উক্তি"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleInsertText('\n\n***\n\n')}
              className="px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="অধ্যায় বিভাজক"
            >
              বিভাজক (***)
            </button>
            <button
              type="button"
              onClick={() => handleInsertText('\n\n')}
              className="px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              title="নতুন অনুচ্ছেদ"
            >
              অনুচ্ছেদ
            </button>
          </div>

          {/* Story Textarea */}
          <div className="space-y-1.5">
            <label
              htmlFor="story-content-input"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              গল্পের মূল কথা
            </label>
            <textarea
              id="story-content-input"
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="আপনার গল্প এখানে সুন্দরভাবে লিখুন... (অনুচ্ছেদ আলাদা করতে দুইবার Enter চাপুন)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors font-serif resize-y"
            />
          </div>

          {/* Stats Bar and Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
            {/* Live statistics */}
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {toBengaliNumber(stats.wordCount)} শব্দ
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {toBengaliNumber(stats.readTimeMinutes)} মিনিট পড়ার সময়
              </span>
              <span aria-hidden="true">·</span>
              <span>{toBengaliNumber(charCount)} বর্ণ</span>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {!editingStory ? (
                <button
                  type="button"
                  onClick={handleClearDraft}
                  className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  খালি করুন
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 inline-flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>মুছে ফেলুন</span>
                </button>
              )}

              <button
                type="button"
                onClick={onCancel}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                বাতিল
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold inline-flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{editingStory ? 'আপডেট করুন' : 'সেভ করুন'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && editingStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                আপনি কি নিশ্চিত?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                "{editingStory.title}" গল্পটি মুছে ফেললে তা আর ফিরিয়ে আনা সম্ভব হবে না।
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                না, রাখুন
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  if (onDeleteStory) {
                    onDeleteStory(editingStory.id);
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
