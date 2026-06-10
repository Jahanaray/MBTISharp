namespace MBTIMatch.Models;

public class Question
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public string Dimension { get; set; } = string.Empty;
    public string OptionA { get; set; } = string.Empty;
    public string OptionB { get; set; } = string.Empty;
    public int WeightA { get; set; }
    public int WeightB { get; set; }
}
