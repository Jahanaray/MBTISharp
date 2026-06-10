using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MBTIMatch.Data;
using MBTIMatch.DTOs;
using MBTIMatch.Models;

namespace MBTIMatch.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MatchController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<MatchController> _logger;

    public MatchController(ApplicationDbContext context, ILogger<MatchController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateMatch([FromBody] CreateMatchRequest request)
    {
        var availableUsers = await _context.Users
            .Where(u => u.Id != request.UserId && u.PhoneVerified && u.MBTIType != null)
            .OrderBy(_ => Guid.NewGuid())
            .Take(1)
            .ToListAsync();

        if (!availableUsers.Any())
            return NotFound(new { message = "No available matches found" });

        var match = new Match
        {
            Id = Guid.NewGuid(),
            UserAId = request.UserId,
            UserBId = availableUsers[0].Id,
            Status = "active",
            MatchedAt = DateTime.UtcNow
        };

        _context.Matches.Add(match);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Match created: {UserAId} - {UserBId}", request.UserId, availableUsers[0].Id);

        return Ok(new MatchResponse
        {
            MatchId = match.Id,
            UserAId = match.UserAId,
            UserBId = match.UserBId,
            Status = match.Status,
            MatchedAt = match.MatchedAt
        });
    }

    [HttpGet("me/{userId}")]
    public async Task<IActionResult> GetMyMatch(Guid userId)
    {
        var match = await _context.Matches
            .FirstOrDefaultAsync(m => m.UserAId == userId || m.UserBId == userId);

        if (match == null)
            return NotFound(new { message = "No active match found" });

        return Ok(new MatchResponse
        {
            MatchId = match.Id,
            UserAId = match.UserAId,
            UserBId = match.UserBId,
            Status = match.Status,
            MatchedAt = match.MatchedAt
        });
    }
}
