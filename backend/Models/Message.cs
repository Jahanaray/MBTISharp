namespace MBTIMatch.Models;

public class Message
{
    public Guid Id { get; set; }
    public Guid MatchId { get; set; }
    public Guid SenderId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
}
