namespace MBTIMatch.DTOs;

public class SendMessageRequest
{
    public Guid MatchId { get; set; }
    public Guid SenderId { get; set; }
    public string Content { get; set; } = string.Empty;
}

public class MessageResponse
{
    public Guid MessageId { get; set; }
    public Guid MatchId { get; set; }
    public Guid SenderId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
}
