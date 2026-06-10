namespace MBTIMatch.DTOs;

public class SubmitAnswerRequest
{
    public int QuestionId { get; set; }
    public string SelectedOption { get; set; } = string.Empty;
}

public class SubmitQuizRequest
{
    public Guid UserId { get; set; }
    public List<SubmitAnswerRequest> Answers { get; set; } = new();
}

public class QuizResult
{
    public string MBTIType { get; set; } = string.Empty;
    public Dictionary<string, int> Scores { get; set; } = new();
}
