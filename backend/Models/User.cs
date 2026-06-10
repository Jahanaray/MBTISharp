namespace MBTIMatch.Models;

public class User
{
    public Guid Id { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool EmailVerified { get; set; }
    public bool PhoneVerified { get; set; }
    public string? MBTIType { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Enhanced registration fields
    public string FullName { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? ProfilePhotoPath { get; set; }
    public bool TermsAccepted { get; set; }
    public bool AllowChat { get; set; }
    public bool AllowMeetInPerson { get; set; }
    public bool AllowCallVerification { get; set; }
    public string? InterestedMBTIs { get; set; }
}
