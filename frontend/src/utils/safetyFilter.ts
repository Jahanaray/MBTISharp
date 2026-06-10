// Client-side safety filter for content validation

const englishBlockedWords = [
  'fuck', 'shit', 'damn', 'bitch', 'ass', 'dick', 'pussy', 'cunt', 'whore',
  'slut', 'nigger', 'faggot', 'bastard', 'crap', 'wtf', 'stfu',
  'porn', 'sex', 'nude', 'naked', 'erotic', 'sexual'
]

const persianBlockedWords = [
  'خجالت', 'زشت', 'بد', 'فحش', 'لعنت', 'گاو', 'سگ', 'مردار',
  'بچه گاو', 'کلنگ', 'کله پوک', 'احمق', 'دیوونه', 'خر'
]

const blockedWords = [...englishBlockedWords, ...persianBlockedWords]

/**
 * Check if content contains any blocked words
 */
export function isContentSafe(content: string): boolean {
  if (!content) return true
  
  const lowerContent = content.toLowerCase()
  return !blockedWords.some(word => lowerContent.includes(word.toLowerCase()))
}

/**
 * Get the list of blocked words found in content
 */
export function getBlockedWordsInContent(content: string): string[] {
  if (!content) return []
  
  const lowerContent = content.toLowerCase()
  return blockedWords.filter(word => lowerContent.includes(word.toLowerCase()))
}

/**
 * Filter out blocked words from content (replace with asterisks)
 */
export function filterContent(content: string): string {
  if (!content) return content
  
  let filtered = content
  for (const word of blockedWords) {
    const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    filtered = filtered.replace(regex, '*'.repeat(word.length))
  }
  return filtered
}

/**
 * Validate registration form data and return errors
 */
export function validateRegistrationData(data: { fullName?: string; city?: string; [key: string]: unknown }): string[] {
  const errors: string[] = []
  
  if (data.fullName && !isContentSafe(data.fullName)) {
    errors.push('fullName')
  }
  
  if (data.city && !isContentSafe(data.city)) {
    errors.push('city')
  }
  
  return errors
}
