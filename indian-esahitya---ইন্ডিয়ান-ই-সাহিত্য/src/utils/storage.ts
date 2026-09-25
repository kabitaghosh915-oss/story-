import { Story, UserProfile } from '../types';
import { calculateStoryStats } from './bengali';
import { INITIAL_STORIES } from './initialStories';

const STORAGE_KEYS = {
  STORIES: 'my_story_app_stories',
  BOOKMARKS: 'my_story_app_bookmarks',
  PROFILE: 'my_story_app_profile',
  THEME: 'my_story_app_theme',
  DRAFT: 'my_story_app_draft',
  READER_SETTINGS: 'my_story_app_reader_settings',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'কবিতা ঘোষ',
  penName: 'নীরব কবি',
  bio: 'গল্প পড়তে এবং লিখতে ভীষণ ভালোবাসি। জীবনের টুকরো কথাগুলো গল্পে বুনে রাখি।',
  avatar: '✍️',
  joinedDate: Date.now() - 1000 * 60 * 60 * 24 * 60,
};

export const Storage = {
  getAllStories: (): Story[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STORIES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(INITIAL_STORIES));
        return INITIAL_STORIES;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(INITIAL_STORIES));
        return INITIAL_STORIES;
      }
      return parsed.sort((a: Story, b: Story) => b.updatedAt - a.updatedAt);
    } catch {
      return INITIAL_STORIES;
    }
  },

  getStory: (id: string): Story | undefined => {
    const stories = Storage.getAllStories();
    return stories.find((s) => s.id === id);
  },

  saveStory: (storyData: {
    id?: string | null;
    title: string;
    content: string;
    category?: Story['category'];
    author?: string;
  }): Story => {
    const stories = Storage.getAllStories();
    const stats = calculateStoryStats(storyData.content);
    const now = Date.now();

    let savedStory: Story;

    if (storyData.id) {
      const index = stories.findIndex((s) => s.id === storyData.id);
      if (index !== -1) {
        savedStory = {
          ...stories[index],
          title: storyData.title.trim() || 'শিরোনামহীন গল্প',
          content: storyData.content.trim(),
          category: storyData.category || stories[index].category || 'সামাজিক',
          author: storyData.author?.trim() || stories[index].author || 'অজ্ঞাতনামা লেখক',
          wordCount: stats.wordCount,
          readTimeMinutes: stats.readTimeMinutes,
          updatedAt: now,
          isCustom: true,
        };
        stories[index] = savedStory;
      } else {
        savedStory = {
          id: storyData.id,
          title: storyData.title.trim() || 'শিরোনামহীন গল্প',
          content: storyData.content.trim(),
          category: storyData.category || 'সামাজিক',
          author: storyData.author?.trim() || 'কবিতা ঘোষ',
          wordCount: stats.wordCount,
          readTimeMinutes: stats.readTimeMinutes,
          createdAt: now,
          updatedAt: now,
          likes: 0,
          isCustom: true,
        };
        stories.unshift(savedStory);
      }
    } else {
      savedStory = {
        id: 'story_' + now + '_' + Math.random().toString(36).substring(2, 7),
        title: storyData.title.trim() || 'শিরোনামহীন গল্প',
        content: storyData.content.trim(),
        category: storyData.category || 'সামাজিক',
        author: storyData.author?.trim() || 'কবিতা ঘোষ',
        wordCount: stats.wordCount,
        readTimeMinutes: stats.readTimeMinutes,
        createdAt: now,
        updatedAt: now,
        likes: 0,
        isCustom: true,
      };
      stories.unshift(savedStory);
    }

    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
    return savedStory;
  },

  deleteStory: (id: string): boolean => {
    const stories = Storage.getAllStories();
    const filtered = stories.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(filtered));

    // Also remove from bookmarks if present
    const bookmarks = Storage.getBookmarks();
    const updatedBookmarks = bookmarks.filter((bId) => bId !== id);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updatedBookmarks));
    return true;
  },

  likeStory: (id: string): number => {
    const stories = Storage.getAllStories();
    const story = stories.find((s) => s.id === id);
    if (story) {
      story.likes = (story.likes || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
      return story.likes;
    }
    return 0;
  },

  getBookmarks: (): string[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark: (id: string): boolean => {
    const bookmarks = Storage.getBookmarks();
    const isBookmarked = bookmarks.includes(id);
    let updated: string[];
    if (isBookmarked) {
      updated = bookmarks.filter((bId) => bId !== id);
    } else {
      updated = [...bookmarks, id];
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return !isBookmarked;
  },

  isBookmarked: (id: string): boolean => {
    const bookmarks = Storage.getBookmarks();
    return bookmarks.includes(id);
  },

  getProfile: (): UserProfile => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile: (profile: UserProfile): void => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  saveDraft: (draft: { title: string; content: string; category: string }): void => {
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draft));
  },

  getDraft: (): { title: string; content: string; category: string } | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DRAFT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  clearDraft: (): void => {
    localStorage.removeItem(STORAGE_KEYS.DRAFT);
  },

  resetDefaults: (): void => {
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(INITIAL_STORIES));
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
    localStorage.removeItem(STORAGE_KEYS.DRAFT);
  },

  exportBackup: (): string => {
    const payload = {
      stories: Storage.getAllStories(),
      bookmarks: Storage.getBookmarks(),
      profile: Storage.getProfile(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(payload, null, 2);
  },

  importBackup: (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.stories && Array.isArray(parsed.stories)) {
        localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(parsed.stories));
      }
      if (parsed.bookmarks && Array.isArray(parsed.bookmarks)) {
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(parsed.bookmarks));
      }
      if (parsed.profile) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed.profile));
      }
      return true;
    } catch {
      return false;
    }
  },
};
