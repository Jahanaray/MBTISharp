using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MBTIMatch.Data;
using MBTIMatch.DTOs;
using MBTIMatch.Models;

namespace MBTIMatch.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuizController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<QuizController> _logger;

    public QuizController(ApplicationDbContext context, ILogger<QuizController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitQuiz([FromBody] SubmitQuizRequest request)
    {
        var answers = request.Answers.Select(a => new Answer
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            QuestionId = a.QuestionId,
            SelectedOption = a.SelectedOption,
            CreatedAt = DateTime.UtcNow
        }).ToList();

        _context.Answers.AddRange(answers);
        await _context.SaveChangesAsync();

        var result = CalculateMBTI(request.UserId);

        return Ok(result);
    }

    [HttpGet("questions")]
    public async Task<IActionResult> GetQuestions()
    {
        var questions = await _context.Questions.ToListAsync();
        return Ok(questions);
    }

    [HttpGet("result/{userId}")]
    public async Task<IActionResult> GetResult(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
            return NotFound(new { message = "User not found" });

        return Ok(new { MBTIType = user.MBTIType ?? "Not completed" });
    }

    private QuizResult CalculateMBTI(Guid userId)
    {
        var answers = _context.Answers.Where(a => a.UserId == userId).ToList();
        var questions = _context.Questions.ToList();

        var scores = new Dictionary<string, int>
        {
            { "E", 0 }, { "I", 0 },
            { "S", 0 }, { "N", 0 },
            { "T", 0 }, { "F", 0 },
            { "C", 0 }, { "P", 0 }
        };

        foreach (var answer in answers)
        {
            var question = questions.FirstOrDefault(q => q.Id == answer.QuestionId);
            if (question != null)
            {
                if (answer.SelectedOption == question.OptionA)
                    scores[question.Dimension.Substring(0, 1)] += question.WeightA;
                else
                    scores[question.Dimension.Substring(1, 1)] += question.WeightB;
            }
        }

        var mbti = new string[]
        {
            scores["E"] >= scores["I"] ? "E" : "I",
            scores["S"] >= scores["N"] ? "S" : "N",
            scores["T"] >= scores["F"] ? "T" : "F",
            scores["C"] >= scores["P"] ? "C" : "P"
        };

        var result = new QuizResult
        {
            MBTIType = string.Join("", mbti),
            Scores = scores
        };

        return result;
    }
}
