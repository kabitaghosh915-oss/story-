// Convert English numerals to Bengali numerals
export function toBengaliNumber(num: number | string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

// Format timestamp to Bengali friendly date
export function formatBengaliDate(timestamp: number): string {
  const date = new Date(timestamp);
  const bengaliMonths = [
    'জানুয়ারি',
    'ফেব্রুয়ারি',
    'মার্চ',
    'এপ্রিল',
    'মে',
    'জুন',
    'জুলাই',
    'আগস্ট',
    'সেপ্টেম্বর',
    'অক্টোবর',
    'নভেম্বর',
    'ডিসেম্বর',
  ];

  const day = toBengaliNumber(date.getDate());
  const month = bengaliMonths[date.getMonth()];
  const year = toBengaliNumber(date.getFullYear());

  return `${day} ${month}, ${year}`;
}

// Calculate Bengali words and reading time
export function calculateStoryStats(text: string) {
  if (!text || text.trim() === '') {
    return { wordCount: 0, readTimeMinutes: 1 };
  }

  // Count words separated by whitespace
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Average reading speed ~150-180 words per minute for Bengali prose
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 160));

  return { wordCount, readTimeMinutes };
}
