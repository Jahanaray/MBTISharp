namespace MBTIMatch.Models;

public class Match
{
    public Guid Id { get; set; }
    public Guid UserAId { get; set; }
    public Guid UserBId { get; set; }
    public string Status { get; set; } = "pending";
    public DateTime MatchedAt { get; set; }
}
