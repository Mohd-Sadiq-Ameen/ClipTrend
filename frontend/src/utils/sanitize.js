// Clean titles: remove HTML entities, emojis, hashtags, and extra spaces
export function cleanTitle(title) {
  if (!title) return '';
  
  // Decode HTML entities like &#39; -> '
  let cleaned = title.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  });
  
  // Remove emojis and special symbols (keep letters, numbers, spaces, basic punctuation)
  cleaned = cleaned.replace(/[^\w\s.,!?\-']/g, '');
  
  // Remove hashtags like #shorts, #viral
  cleaned = cleaned.replace(/#\w+\b/g, '');
  
  // Remove extra spaces and trim
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Fallback to original truncated if result is empty
  return cleaned || title.substring(0, 80);
}