using MBTIMatch.Models;

namespace MBTIMatch.Services;

public interface IMbtiMatchingService
{
    decimal CalculateCompatibility(User userA, User userB);
    Task<IEnumerable<User>> FindMatchesAsync(Guid userId, int maxResults = 5);
}
