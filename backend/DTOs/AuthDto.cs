namespace MBTIMatch.DTOs;

public class RegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime? BirthDate { get; set; }
    public string Gender { get; set; } = string.Empty; // Male, Female, Other
    public string? ProfilePhotoDataUrl { get; set; }
    public string City { get; set; } = string.Empty;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public bool TermsAccepted { get; set; }
    public bool AllowChat { get; set; }
    public bool AllowMeetInPerson { get; set; }
    public bool AllowCallVerification { get; set; }
    public string? InterestedMBTIs { get; set; }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public Guid UserId { get; set; }
}

public class UserProfileResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime? BirthDate { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? MBTIType { get; set; }
    public bool TermsAccepted { get; set; }
    public bool AllowChat { get; set; }
    public bool AllowMeetInPerson { get; set; }
    public bool AllowCallVerification { get; set; }
    public string? InterestedMBTIs { get; set; }
    public string? ProfilePhotoPath { get; set; }
}
