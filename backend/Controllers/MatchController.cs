using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MBTIMatch.Data;
using MBTIMatch.DTOs;
using MBTIMatch.Models;
using MBTIMatch.Services;

namespace MBTIMatch.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MatchController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<MatchController> _logger;
    private readonly IMbtiMatchingService _matchingService;

    public MatchController(ApplicationDbContext context, ILogger<MatchController> logger, IMbtiMatchingService matchingService)
    {
        _context = context;
        _logger = logger;
        _matchingService = matchingService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateMatch([FromBody] CreateMatchRequest request)
    {
        Guid userId;
        try
        {
            userId = string.IsNullOrEmpty(request.UserId) ? Guid.NewGuid() : Guid.Parse(request.UserId);
        }
        catch
        {
            return BadRequest(new { message = "Invalid user ID format" });
        }

        // Get deterministic matches based on MBTI compatibility
        var potentialMatches = (await _matchingService.FindMatchesAsync(userId, maxResults: 10)).ToList();
        
        // Filter out users who already have an active match
        var availableUsers = new List<User>();
        foreach (var user in potentialMatches)
        {
            var hasActiveMatch = await _context.Matches.AnyAsync(m =>
                (m.UserAId == user.Id || m.UserBId == user.Id) && m.Status == "active");
            if (!hasActiveMatch)
            {
                availableUsers.Add(user);
            }
        }

        if (!availableUsers.Any())
        {
            // Fallback: try any verified user without active match
            var allVerifiedUsers = await _context.Users
                .Where(u =>
                    u.Id != userId &&
                    u.PhoneVerified &&
                    u.MBTIType != null)
                .ToListAsync();

            foreach (var user in allVerifiedUsers)
            {
                var hasActiveMatch = await _context.Matches.AnyAsync(m =>
                    (m.UserAId == user.Id || m.UserBId == user.Id) && m.Status == "active");
                if (!hasActiveMatch)
                {
                    availableUsers.Add(user);
                    break;
                }
            }
        }

        if (!availableUsers.Any())
            return NotFound(new { message = "No available matches found" });

        var match = new Match
        {
            Id = Guid.NewGuid(),
            UserAId = userId,
            UserBId = availableUsers[0].Id,
            Status = "active",
            MatchedAt = DateTime.UtcNow
        };

        _context.Matches.Add(match);
        await _context.SaveChangesAsync();

        var matchedUser = availableUsers[0];
        _logger.LogInformation("Match created: {UserAId} - {UserBId} (compatibility: {Score:F2})",
            userId, matchedUser.Id, _matchingService.CalculateCompatibility(
                await _context.Users.FindAsync(userId)!, matchedUser));

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
