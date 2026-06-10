namespace MBTIMatch.DTOs;

public class CreateMatchRequest
{
    public Guid UserId { get; set; }
}

public class MatchResponse
{
    public Guid MatchId { get; set; }
    public Guid UserAId { get; set; }
    public Guid UserBId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime MatchedAt { get; set; }
}
