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
    public async Task<IActionResult> Register([FromForm] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PhoneNumber) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.FullName))
            return BadRequest(new { message = "Phone number, password, and full name are required" });

        if (!request.TermsAccepted)
            return BadRequest(new { message = "You must accept the terms and rules" });

        if (!_safetyFilter.IsContentSafe(request.FullName))
            return BadRequest(new { message = "Invalid content detected in your name" });
        
        if (!_safetyFilter.IsContentSafe(request.City))
            return BadRequest(new { message = "Invalid content detected in your city" });

        var existingByPhone = await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == request.PhoneNumber);
        if (existingByPhone != null)
            return Conflict(new { message = "Phone number already registered" });

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            var existingByEmail = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingByEmail != null)
                return Conflict(new { message = "Email already registered" });
        }

        var passwordHash = HashPassword(request.Password);

        string? photoPath = null;
        var photoFile = Request.Form.Files.FirstOrDefault(f => f.Name == "photo");
        if (photoFile != null && photoFile.Length > 0)
        {
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/jpg", "image/webp" };
            if (!allowedTypes.Contains(photoFile.ContentType))
                return BadRequest(new { message = "Only JPEG, PNG, and WebP images are allowed" });

            if (photoFile.Length > 5 * 1024 * 1024)
                return BadRequest(new { message = "Photo size must be less than 5MB" });

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(photoFile.FileName)}";
            photoPath = Path.Combine(_uploadFolder, fileName);
            
            using var stream = new FileStream(photoPath, FileMode.Create);
            await photoFile.CopyToAsync(stream);
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            PhoneNumber = request.PhoneNumber,
            Email = request.Email ?? string.Empty,
            PasswordHash = passwordHash,
            EmailVerified = !string.IsNullOrWhiteSpace(request.Email),
            FullName = _safetyFilter.FilterContent(request.FullName),
            City = _safetyFilter.FilterContent(request.City),
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

        _logger.LogInformation("User registered: {PhoneNumber}", request.PhoneNumber);

        return Ok(new { message = "Registration successful" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Email and password are required" });

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password" });

        var token = GenerateJwtToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
            RefreshToken = GenerateRefreshToken(),
            ExpiresAt = DateTime.UtcNow.AddHours(1)
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
            PhoneNumber = user.PhoneNumber,
            Email = user.Email,
            FullName = user.FullName,
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
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "DefaultSecretKeyMustBe32Chars!");
        var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
    }
}
