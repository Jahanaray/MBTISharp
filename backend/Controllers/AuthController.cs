using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MBTIMatch.Data;
using MBTIMatch.DTOs;
using MBTIMatch.Models;
using MBTIMatch.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace MBTIMatch.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AuthController> _logger;
    private readonly IConfiguration _configuration;
    private readonly ISafetyFilterService _safetyFilter;
    private readonly string _uploadFolder = "uploads/photos";

    public AuthController(ApplicationDbContext context, ILogger<AuthController> logger, IConfiguration configuration, ISafetyFilterService safetyFilter)
    {
        _context = context;
        _logger = logger;
        _configuration = configuration;
        _safetyFilter = safetyFilter;
        
        Directory.CreateDirectory(_uploadFolder);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var errors = new List<string>();

        // --- Email validation ---
        if (string.IsNullOrWhiteSpace(request.Email))
            errors.Add("Email is required");
        else
        {
            var emailRegex = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            if (!System.Text.RegularExpressions.Regex.IsMatch(request.Email, emailRegex))
                errors.Add("Invalid email format");
        }

        // --- Password validation ---
        if (string.IsNullOrWhiteSpace(request.Password))
            errors.Add("Password is required");
        else if (request.Password.Length < 6)
            errors.Add("Password must be at least 6 characters");

        // --- FullName validation ---
        if (string.IsNullOrWhiteSpace(request.FullName))
            errors.Add("Full name is required");

        // --- BirthDate validation (mandatory) ---
        if (request.BirthDate == null)
            errors.Add("Birthdate is required");
        else
        {
            var age = (DateTime.UtcNow - request.BirthDate.Value).Days / 365.25;
            if (age < 18)
                errors.Add("You must be at least 18 years old");
            if (age > 120)
                errors.Add("Invalid birthdate");
        }

        // --- Gender validation (mandatory) ---
        if (string.IsNullOrWhiteSpace(request.Gender))
            errors.Add("Gender is required");
        else if (!new[] { "Male", "Female", "Other" }.Contains(request.Gender))
            errors.Add("Gender must be Male, Female, or Other");

        // --- Terms acceptance (mandatory) ---
        if (!request.TermsAccepted)
            errors.Add("You must accept the terms and rules");

        // --- Safety filter on name ---
        if (!string.IsNullOrWhiteSpace(request.FullName))
        {
            if (!_safetyFilter.IsContentSafe(request.FullName))
                errors.Add("Invalid content detected in your name");
        }

        if (errors.Any())
            return BadRequest(new { message = "Validation failed", errors });

        // --- Duplicate email check ---
        var existingByEmail = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email.ToLower().Trim());
        if (existingByEmail != null)
            return Conflict(new { message = "Email already registered", errors = new[] { "Email" } });

        var passwordHash = HashPassword(request.Password);

        var photoPath = await SaveProfilePhotoAsync(request.ProfilePhotoDataUrl);
        if (photoPath == "invalid")
        {
            return BadRequest(new { message = "Only JPEG, PNG, and WebP images under 5MB are allowed" });
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email.ToLower().Trim(),
            PasswordHash = passwordHash,
            EmailVerified = true,
            FullName = _safetyFilter.FilterContent(request.FullName),
            BirthDate = request.BirthDate,
            Gender = request.Gender,
            City = string.IsNullOrWhiteSpace(request.City) ? "Unknown" : _safetyFilter.FilterContent(request.City),
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            ProfilePhotoPath = photoPath,
            TermsAccepted = request.TermsAccepted,
            AllowChat = request.AllowChat,
            AllowMeetInPerson = request.AllowMeetInPerson,
            AllowCallVerification = request.AllowCallVerification,
            InterestedMBTIs = request.InterestedMBTIs,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _logger.LogInformation("User registered: {Email}", request.Email);

        return Ok(new AuthResponse
        {
            Token = GenerateJwtToken(user),
            RefreshToken = GenerateRefreshToken(),
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            UserId = user.Id
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.Email))
            errors.Add("Email is required");
        
        if (string.IsNullOrWhiteSpace(request.Password))
            errors.Add("Password is required");

        if (errors.Any())
            return BadRequest(new { message = "Validation failed", errors });

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email.ToLower().Trim());

        if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password" });

        var token = GenerateJwtToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
            RefreshToken = GenerateRefreshToken(),
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            UserId = user.Id
        });
    }

    [HttpGet("profile/{userId}")]
    public async Task<IActionResult> GetProfile(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound(new { message = "User not found" });

        var profile = new UserProfileResponse
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            BirthDate = user.BirthDate,
            Gender = user.Gender,
            City = user.City,
            MBTIType = user.MBTIType,
            TermsAccepted = user.TermsAccepted,
            AllowChat = user.AllowChat,
            AllowMeetInPerson = user.AllowMeetInPerson,
            AllowCallVerification = user.AllowCallVerification,
            InterestedMBTIs = user.InterestedMBTIs,
            ProfilePhotoPath = user.ProfilePhotoPath
        };

        return Ok(profile);
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    private bool VerifyPassword(string password, string hash)
    {
        var hashedInput = HashPassword(password);
        return hashedInput == hash;
    }

    private string GenerateJwtToken(User user)
    {
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "YourSuperSecretKeyMustBeAtLeast32CharactersLong!");
        var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim("userId", user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"] ?? "MBTIMatch",
            audience: _configuration["Jwt:Audience"] ?? "MBTIMatchUsers",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
    }

    private async Task<string?> SaveProfilePhotoAsync(string? dataUrl)
    {
        if (string.IsNullOrWhiteSpace(dataUrl))
            return null;

        var commaIndex = dataUrl.IndexOf(',');
        if (!dataUrl.StartsWith("data:image/", StringComparison.OrdinalIgnoreCase) || commaIndex < 0)
            return "invalid";

        var header = dataUrl[..commaIndex].ToLowerInvariant();
        var extension = header switch
        {
            var h when h.Contains("image/jpeg") || h.Contains("image/jpg") => ".jpg",
            var h when h.Contains("image/png") => ".png",
            var h when h.Contains("image/webp") => ".webp",
            _ => string.Empty
        };

        if (string.IsNullOrEmpty(extension))
            return "invalid";

        byte[] bytes;
        try
        {
            bytes = Convert.FromBase64String(dataUrl[(commaIndex + 1)..]);
        }
        catch
        {
            return "invalid";
        }

        if (bytes.Length > 5 * 1024 * 1024)
            return "invalid";

        var fileName = $"{Guid.NewGuid()}{extension}";
        var photoPath = Path.Combine(_uploadFolder, fileName);
        await System.IO.File.WriteAllBytesAsync(photoPath, bytes);
        return photoPath;
    }
}
