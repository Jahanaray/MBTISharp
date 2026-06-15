using Microsoft.EntityFrameworkCore;
using MBTIMatch.Data;
using MBTIMatch.Models;

namespace MBTIMatch.Services;

public class MbtiMatchingService : IMbtiMatchingService
{
    private readonly ApplicationDbContext _context;
    // Compatibility scores between MBTI types (0.0 to 1.0)
    // Based on established MBTI compatibility theory
    private static readonly Dictionary<string, Dictionary<string, decimal>> CompatibilityMatrix = new()
    {
        // INTJ compatible with: ENTP, ENTJ
        ["INTJ"] = new() { ["ENTP"] = 0.95m, ["ENTJ"] = 0.90m, ["INFJ"] = 0.85m, ["INFP"] = 0.80m },
        // INTP compatible with: ENFP, ENTJ
        ["INTP"] = new() { ["ENFP"] = 0.95m, ["ENTJ"] = 0.90m, ["INTJ"] = 0.85m, ["ENTP"] = 0.80m },
        // ENTJ compatible with: INTJ, INTP
        ["ENTJ"] = new() { ["INTJ"] = 0.95m, ["INTP"] = 0.90m, ["ENTP"] = 0.85m, ["INFJ"] = 0.80m },
        // ENTP compatible with: INTJ, INFP
        ["ENTP"] = new() { ["INTJ"] = 0.95m, ["INFP"] = 0.90m, ["INTP"] = 0.85m, ["ENTJ"] = 0.80m },
        // INFJ compatible with: ENFP, INTJ
        ["INFJ"] = new() { ["ENFP"] = 0.95m, ["INTJ"] = 0.90m, ["INFP"] = 0.85m, ["ENTJ"] = 0.80m },
        // INFP compatible with: ENFJ, INTJ
        ["INFP"] = new() { ["ENFJ"] = 0.95m, ["INTJ"] = 0.90m, ["INFJ"] = 0.85m, ["ENTP"] = 0.80m },
        // ENFJ compatible with: INFP, INFJ
        ["ENFJ"] = new() { ["INFP"] = 0.95m, ["INFJ"] = 0.90m, ["ENFP"] = 0.85m, ["INTP"] = 0.80m },
        // ENFP compatible with: INFJ, INTP
        ["ENFP"] = new() { ["INFJ"] = 0.95m, ["INTP"] = 0.90m, ["ENFJ"] = 0.85m, ["ENTJ"] = 0.80m },
        // ISTJ compatible with: ESFP, ISFJ
        ["ISTJ"] = new() { ["ESFP"] = 0.90m, ["ISFJ"] = 0.85m, ["ESTJ"] = 0.80m, ["ISTP"] = 0.75m },
        // ISFJ compatible with: ESFP, ISTP
        ["ISFJ"] = new() { ["ESFP"] = 0.90m, ["ISTP"] = 0.85m, ["ISTJ"] = 0.85m, ["ESTJ"] = 0.80m },
        // ESFJ compatible with: ISTP, ISFP
        ["ESFJ"] = new() { ["ISTP"] = 0.90m, ["ISFP"] = 0.85m, ["ESTJ"] = 0.80m, ["ESFP"] = 0.75m },
        // ESTJ compatible with: ISFP, ISTJ
        ["ESTJ"] = new() { ["ISFP"] = 0.90m, ["ISTJ"] = 0.85m, ["ESFJ"] = 0.80m, ["ISTP"] = 0.75m },
        // ISTP compatible with: ESFJ, ISFJ
        ["ISTP"] = new() { ["ESFJ"] = 0.90m, ["ISFJ"] = 0.85m, ["ISTJ"] = 0.80m, ["ESTJ"] = 0.75m },
        // ISFP compatible with: ESTJ, ESFJ
        ["ISFP"] = new() { ["ESTJ"] = 0.90m, ["ESFJ"] = 0.85m, ["ISTP"] = 0.80m, ["ESFP"] = 0.75m },
        // ESFP compatible with: ISTJ, ISFJ
        ["ESFP"] = new() { ["ISTJ"] = 0.90m, ["ISFJ"] = 0.85m, ["ISFP"] = 0.80m, ["ESTJ"] = 0.75m },
        // ESTP compatible with: INFJ, INFP
        ["ESTP"] = new() { ["INFJ"] = 0.90m, ["INFP"] = 0.85m, ["ISTP"] = 0.80m, ["ENTP"] = 0.75m },
    };

    public MbtiMatchingService(ApplicationDbContext context)
    {
        _context = context;
    }

    public decimal CalculateCompatibility(User userA, User userB)
    {
        if (string.IsNullOrEmpty(userA.MBTIType) || string.IsNullOrEmpty(userB.MBTIType))
            return 0.5m; // Neutral score if MBTI unknown

        var typeA = userA.MBTIType.ToUpper();
        var typeB = userB.MBTIType.ToUpper();

        // Same type gets moderate compatibility (some pairs work well, others don't)
        if (typeA == typeB)
            return 0.70m;

        if (CompatibilityMatrix.TryGetValue(typeA, out var compatMap) &&
            compatMap.TryGetValue(typeB, out var score))
            return score;

        // Default compatibility for unlisted pairs
        return 0.50m;
    }

    public async Task<IEnumerable<User>> FindMatchesAsync(Guid userId, int maxResults = 5)
    {
        var currentUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (currentUser == null || string.IsNullOrEmpty(currentUser.MBTIType))
            return [];

        // Get all potential matches who are verified and have completed the quiz
        var candidates = await _context.Users
            .Where(u =>
                u.Id != userId &&
                u.PhoneVerified &&
                u.MBTIType != null &&
                u.MBTIType != string.Empty)
            .ToListAsync();

        // Calculate compatibility scores and sort
        var scoredMatches = candidates
            .Select(u => new { User = u, Score = CalculateCompatibility(currentUser, u) })
            .OrderByDescending(m => m.Score)
            .Take(maxResults)
            .Select(m => m.User);

        return scoredMatches;
    }
}
