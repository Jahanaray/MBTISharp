namespace MBTIMatch.Models;

public class Answer
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int QuestionId { get; set; }
    public string SelectedOption { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
