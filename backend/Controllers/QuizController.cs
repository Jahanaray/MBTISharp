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
        if (request.Answers == null || !request.Answers.Any())
            return BadRequest(new { message = "No answers provided" });

        var userId = Guid.TryParse(request.UserId, out var parsedUserId)
            ? parsedUserId
            : Guid.NewGuid();

        var existingUser = await _context.Users.FindAsync(userId);

        if (existingUser != null)
        {
            var previousAnswers = _context.Answers.Where(a => a.UserId == userId);
            _context.Answers.RemoveRange(previousAnswers);

            var answers = request.Answers.Select(a => new Answer
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                QuestionId = a.QuestionId,
                SelectedOption = a.SelectedOption,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            _context.Answers.AddRange(answers);
            await _context.SaveChangesAsync();
        }

        var result = CalculateMBTI(request.Answers);

        // Save the MBTI type to the user's record if user exists
        if (existingUser != null)
        {
            existingUser.MBTIType = result.MBTIType;
            await _context.SaveChangesAsync();
        }

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

        // If user has no MBTI type yet, calculate it from answers
        if (string.IsNullOrEmpty(user.MBTIType))
        {
            var result = CalculateMBTI(userId);
            if (!string.IsNullOrEmpty(result.MBTIType) && result.MBTIType != "Not completed")
            {
                user.MBTIType = result.MBTIType;
                await _context.SaveChangesAsync();
                return Ok(new { MBTIType = result.MBTIType });
            }
        }

        return Ok(new { MBTIType = user.MBTIType ?? "Not completed" });
    }

    private QuizResult CalculateMBTI(Guid userId)
    {
        var answers = _context.Answers.Where(a => a.UserId == userId).ToList();
        if (!answers.Any())
            return new QuizResult { MBTIType = "Not completed", Scores = new Dictionary<string, int>() };

        return CalculateMBTI(answers.Select(a => new SubmitAnswerRequest
        {
            QuestionId = a.QuestionId,
            SelectedOption = a.SelectedOption
        }).ToList());
    }

    private QuizResult CalculateMBTI(List<SubmitAnswerRequest> answers)
    {
        if (!answers.Any())
            return new QuizResult { MBTIType = "Not completed", Scores = new Dictionary<string, int>() };

        var questions = _context.Questions.ToList();

        var scores = new Dictionary<string, int>
        {
            { "E", 0 }, { "I", 0 },
            { "S", 0 }, { "N", 0 },
            { "T", 0 }, { "F", 0 },
            { "J", 0 }, { "P", 0 }
        };

        foreach (var answer in answers)
        {
            var question = questions.FirstOrDefault(q => q.Id == answer.QuestionId);
            if (question != null)
            {
                if (answer.SelectedOption == question.OptionA)
                    scores[question.Dimension.Substring(0, 1)] += question.WeightA;
                else if (answer.SelectedOption == question.OptionB)
                    scores[question.Dimension.Substring(1, 1)] += question.WeightB;
            }
        }

        var mbti = new string[]
        {
            scores["E"] >= scores["I"] ? "E" : "I",
            scores["S"] >= scores["N"] ? "S" : "N",
            scores["T"] >= scores["F"] ? "T" : "F",
            scores["J"] >= scores["P"] ? "J" : "P"
        };

        var result = new QuizResult
        {
            MBTIType = string.Join("", mbti),
            Scores = scores
        };

        return result;
    }
}
