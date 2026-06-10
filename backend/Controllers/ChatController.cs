using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MBTIMatch.Data;
using MBTIMatch.DTOs;
using MBTIMatch.Models;

namespace MBTIMatch.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ChatController> _logger;

    public ChatController(ApplicationDbContext context, ILogger<ChatController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
    {
        var match = await _context.Matches.FindAsync(request.MatchId);

        if (match == null || match.Status != "active")
            return NotFound(new { message = "Match not found or inactive" });

        if (request.SenderId != match.UserAId && request.SenderId != match.UserBId)
            return Forbid();

        var message = new Message
        {
            Id = Guid.NewGuid(),
            MatchId = request.MatchId,
            SenderId = request.SenderId,
            Content = request.Content,
            SentAt = DateTime.UtcNow
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return Ok(new MessageResponse
        {
            MessageId = message.Id,
            MatchId = message.MatchId,
            SenderId = message.SenderId,
            Content = message.Content,
            SentAt = message.SentAt
        });
    }

    [HttpGet("history/{matchId}")]
    public async Task<IActionResult> GetHistory(Guid matchId)
    {
        var messages = await _context.Messages
            .Where(m => m.MatchId == matchId)
            .OrderBy(m => m.SentAt)
            .ToListAsync();

        var response = messages.Select(m => new MessageResponse
        {
            MessageId = m.Id,
            MatchId = m.MatchId,
            SenderId = m.SenderId,
            Content = m.Content,
            SentAt = m.SentAt
        });

        return Ok(response);
    }
}
