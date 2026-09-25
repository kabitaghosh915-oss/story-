import React, { useState, useRef } from 'react';
import {
  User,
  Edit2,
  BookOpen,
  Feather,
  Bookmark,
  Download,
  Upload,
  RotateCcw,
  FileDown,
  Trash2,
  Edit3,
  Check,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Story, UserProfile } from '../types';
import { toBengaliNumber, formatBengaliDate } from '../utils/bengali';
import { Storage } from '../utils/storage';

interface ProfileViewProps {
  profile: UserProfile;
  stories: Story[];
  bookmarkedIds: string[];
  onUpdateProfile: (updated: UserProfile) => void;
  onSelectStory: (story: Story) => void;
  onEditStory: (story: Story) => void;
  onDeleteStory: (id: string) => void;
  onResetDefaults: () => void;
  onOpenSourceCode?: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AVATAR_OPTIONS = ['✍️', '📖', '🖋️', '🎭', '📜', '☕', '🌸', '✨'];

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  stories,
  bookmarkedIds,
  onUpdateProfile,
  onSelectStory,
  onEditStory,
  onDeleteStory,
  onResetDefaults,
  onOpenSourceCode,
  onShowToast,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(profile.name);
  const [penName, setPenName] = useState(profile.penName);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter custom user-written stories
  const userStories = stories.filter(
    (s) => s.isCustom || s.author === profile.name || s.author === profile.penName
  );

  // Total words authored by user
  const totalUserWords = userStories.reduce((acc, s) => acc + s.wordCount, 0);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      name: name.trim() || 'লেখক',
      penName: penName.trim() || 'ছদ্মনাম',
      bio: bio.trim(),
      avatar,
    };
    onUpdateProfile(updated);
    setIsEditingProfile(false);
    onShowToast('প্রোফাইল সফলভাবে আপডেট করা হয়েছে।', 'success');
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const dataStr = Storage.exportBackup();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amar-golpo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('গল্পের ব্যাকআপ ডাউনলোড সম্পন্ন হয়েছে।', 'success');
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = Storage.importBackup(content);
      if (success) {
        onShowToast('ব্যাকআপ সফলভাবে পুনরুদ্ধার করা হয়েছে!', 'success');
        window.location.reload();
      } else {
        onShowToast('ব্যাকআপ ফাইলটি সঠিক নয়।', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Download all stories as TXT
  const handleDownloadAllTxt = () => {
    let fullText = `=== আমার গল্প (My Story Collection) ===\n\n`;
    stories.forEach((s, idx) => {
      fullText += `[${idx + 1}] ${s.title}\n`;
      fullText += `বিভাগ: ${s.category} | লেখক: ${s.author}\n`;
      fullText += `তারিখ: ${formatBengaliDate(s.updatedAt)}\n`;
      fullText += `------------------------------------\n`;
      fullText += `${s.content}\n\n====================================\n\n`;
    });

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amar-golpo-all-stories.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('সকল গল্প টেক্সট ফাইল আকারে ডাউনলোড হয়েছে।', 'success');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar display */}
          <div className="w-20 h-20 rounded-2xl bg-purple-100 dark:bg-purple-950/70 border-2 border-purple-200 dark:border-purple-800 flex items-center justify-center text-4xl shadow-inner shrink-0">
            {profile.avatar}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {profile.name}
                </h2>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  ছদ্মনাম: {profile.penName}
                </p>
              </div>

              <button
                onClick={() => setIsEditingProfile(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium inline-flex items-center gap-1.5 self-center sm:self-auto transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>প্রোফাইল পরিবর্তন</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl pt-1">
              {profile.bio || 'কোনো জীবনী যুক্ত করা হয়নি।'}
            </p>

            <div className="pt-2 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center sm:justify-start gap-1">
              <Calendar className="w-3 h-3" />
              <span>যুক্ত হয়েছেন: {formatBengaliDate(profile.joinedDate)}</span>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal / Panel */}
        {isEditingProfile && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in"
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              প্রোফাইল সম্পাদনা করুন
            </h3>

            {/* Avatar Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                অবতার নির্বাচন করুন
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {AVATAR_OPTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setAvatar(item)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-transform ${
                      avatar === item
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 scale-105'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  আপনার নাম
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  সাহিত্যিক ছদ্মনাম
                </label>
                <input
                  type="text"
                  value={penName}
                  onChange={(e) => setPenName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                সংক্ষিপ্ত পরিচিতি (Bio)
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold"
              >
                আপডেট করুন
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Writing & Reading Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
          <Feather className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1.5" />
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {toBengaliNumber(userStories.length)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">রচিত গল্প</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mx-auto mb-1.5" />
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {toBengaliNumber(totalUserWords)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">সর্বমোট শব্দ</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
          <Bookmark className="w-5 h-5 text-amber-500 dark:text-amber-400 mx-auto mb-1.5" />
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {toBengaliNumber(bookmarkedIds.length)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">বুকমার্ককৃত</div>
        </div>
      </div>

      {/* My Authored Stories List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Feather className="w-4 h-4 text-purple-600" />
            <span>আমার রচিত গল্পসমূহ</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {toBengaliNumber(userStories.length)} টি
          </span>
        </div>

        {userStories.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-6">
            আপনি এখনও কোনো গল্প রচনা করেননি। 'লিখুন' ট্যাবে গিয়ে আপনার প্রথম গল্প লিখুন!
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {userStories.map((story) => (
              <div
                key={story.id}
                className="py-3 flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0 flex-1">
                  <h4
                    onClick={() => onSelectStory(story)}
                    className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 cursor-pointer truncate"
                  >
                    {story.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{story.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{toBengaliNumber(story.wordCount)} শব্দ</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatBengaliDate(story.updatedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditStory(story)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="সম্পাদনা"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteStory(story.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Backup and Data Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          ডেটা ব্যাকআপ ও সেটিংস
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
          >
            <Download className="w-4 h-4 text-purple-600 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                JSON ব্যাকআপ ডাউনলোড
              </div>
              <div className="text-[11px] text-slate-500">
                সকল গল্প ও বুকমার্ক নিরাপদে সংরক্ষণ করুন
              </div>
            </div>
          </button>

          {/* Import JSON */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
            >
              <Upload className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  JSON ব্যাকআপ রিস্টোর
                </div>
                <div className="text-[11px] text-slate-500">
                  আগের সংরক্ষিত ব্যাকআপ ফাইল আপলোড করুন
                </div>
              </div>
            </button>
          </div>

          {/* Download TXT */}
          <button
            onClick={handleDownloadAllTxt}
            className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
          >
            <FileDown className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                সকল গল্প টেক্সট (.txt) ফাইলে ডাউনলোড
              </div>
              <div className="text-[11px] text-slate-500">
                মুদ্রণ বা অন্য কোথাও পড়ার জন্য উপযোগী
              </div>
            </div>
          </button>

          {/* Source Code Modal Button */}
          {onOpenSourceCode && (
            <button
              onClick={onOpenSourceCode}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100/50 text-left transition-colors"
            >
              <FileDown className="w-4 h-4 text-purple-600 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-purple-900 dark:text-purple-300">
                  📁 প্রজেক্ট সোর্স কোড ও ফাইলসমূহ
                </div>
                <div className="text-[11px] text-purple-600 dark:text-purple-400">
                  এইচটিএমএল, সিএসএস ও জাভাস্ক্রিপ্ট ফাইল দেখুন বা কপি করুন
                </div>
              </div>
            </button>
          )}

          {/* Reset Defaults */}
          <button
            onClick={onResetDefaults}
            className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors group"
          >
            <RotateCcw className="w-4 h-4 text-rose-500 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                ডিফল্ট গল্পে ফেরত যান
              </div>
              <div className="text-[11px] text-slate-500">
                প্রাথমিক ডেমো গল্পগুলো আবার আনুন
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
