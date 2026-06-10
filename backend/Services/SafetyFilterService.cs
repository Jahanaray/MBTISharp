using System.Text;
using System.Text.RegularExpressions;

namespace MBTIMatch.Services;

public interface ISafetyFilterService
{
    bool IsContentSafe(string content);
    string FilterContent(string content);
    List<string> GetBlockedWords();
}

public class SafetyFilterService : ISafetyFilterService
{
    private readonly HashSet<string> _blockedWords;

    public SafetyFilterService()
    {
        _blockedWords = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        
        // English blocked words (adult/inappropriate content)
        var englishBlockedWords = new[]
        {
            "fuck", "shit", "damn", "bitch", "ass", "dick", "pussy", "cunt", "whore",
            "slut", "nigger", "faggot", "bastard", "crap", "wtf", "stfu",
            "porn", "sex", "nude", "naked", "erotic", "sexual"
        };

        // Persian blocked words (adult/inappropriate content)
        var persianBlockedWords = new[]
        {
            "خجالت", "زشت", "بد", "فحش", "لعنت", "گاو", "سگ", "مردار",
            "بچه گاو", "کلنگ", "کله پوک", "احمق", "دیوونه", "خر"
        };

        foreach (var word in englishBlockedWords) _blockedWords.Add(word);
        foreach (var word in persianBlockedWords) _blockedWords.Add(word);
    }

    public bool IsContentSafe(string content)
    {
        if (string.IsNullOrWhiteSpace(content)) return true;

        var lowerContent = content.ToLower();
        foreach (var word in _blockedWords)
        {
            if (lowerContent.Contains(word.ToLower()))
                return false;
        }
        return true;
    }

    public string FilterContent(string content)
    {
        if (string.IsNullOrWhiteSpace(content)) return content;

        var filtered = content;
        foreach (var word in _blockedWords)
        {
            var regexPattern = $@"\b{Regex.Escape(word)}\b";
            filtered = Regex.Replace(filtered, regexPattern, "***", RegexOptions.IgnoreCase);
        }
        return filtered;
    }

    public List<string> GetBlockedWords()
    {
        return _blockedWords.ToList();
    }
}
