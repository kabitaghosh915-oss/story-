export type StoryCategory =
  | 'সব'
  | 'রোমাঞ্চ'
  | 'রহস্য'
  | 'ভৌতিক'
  | 'রূপকথা'
  | 'বিজ্ঞান কল্পকাহিনী'
  | 'সামাজিক'
  | 'স্মৃতিকথা'
  | 'অনুপ্রেরণা';

export interface Story {
  id: string;
  title: string;
  content: string;
  author: string;
  category: Exclude<StoryCategory, 'সব'>;
  createdAt: number;
  updatedAt: number;
  readTimeMinutes: number;
  wordCount: number;
  likes?: number;
  isCustom?: boolean;
}

export interface UserProfile {
  name: string;
  penName: string;
  bio: string;
  avatar: string;
  joinedDate: number;
}

export type TabType = 'library' | 'writer' | 'reader' | 'bookmarks' | 'profile';

export interface ReaderSettings {
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  fontFamily: 'sans' | 'serif';
  theme: 'light' | 'sepia' | 'dark';
}
