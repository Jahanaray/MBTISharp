using Xunit;

namespace MBTIMatch.Tests;

public class PasswordHashingTests
{
    [Fact]
    public void HashPassword_GivesSameHashForSameInput()
    {
        var hash1 = HashPassword("TestPassword123");
        var hash2 = HashPassword("TestPassword123");
        Assert.Equal(hash1, hash2);
    }

    [Fact]
    public void HashPassword_GivesDifferentHashForDifferentInput()
    {
        var hash1 = HashPassword("Password1");
        var hash2 = HashPassword("Password2");
        Assert.NotEqual(hash1, hash2);
    }

    [Fact]
    public void VerifyPassword_CorrectPassword_ReturnsTrue()
    {
        var password = "MySecureP@ssw0rd!";
        var hash = HashPassword(password);
        Assert.True(VerifyPassword(password, hash));
    }

    [Fact]
    public void VerifyPassword_WrongPassword_ReturnsFalse()
    {
        var hash = HashPassword("CorrectPassword");
        Assert.False(VerifyPassword("WrongPassword", hash));
    }

    [Fact]
    public void HashPassword_EmptyString_HashesSuccessfully()
    {
        var hash = HashPassword("");
        Assert.NotNull(hash);
        Assert.NotEmpty(hash);
    }

    private static byte[] HashPassword(string password)
    {
        var salt = new byte[] { 1, 2, 3, 4, 5, 6, 7, 8 };
        var pbkdf2 = new System.Security.Cryptography.Rfc2898DeriveBytes(password, salt, 10000, System.Security.Cryptography.HashAlgorithmName.SHA256);
        return pbkdf2.GetBytes(32);
    }

    private static bool VerifyPassword(string password, byte[] expectedHash)
    {
        return HashPassword(password).SequenceEqual(expectedHash);
    }
}
