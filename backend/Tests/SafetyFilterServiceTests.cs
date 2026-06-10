using MBTIMatch.Services;
using Xunit;

namespace MBTIMatch.Tests;

public class SafetyFilterServiceTests
{
    private readonly SafetyFilterService _filter;

    public SafetyFilterServiceTests()
    {
        _filter = new SafetyFilterService();
    }

    [Fact]
    public void IsContentSafe_WithNull_ReturnsTrue()
    {
        Assert.True(_filter.IsContentSafe(null!));
        Assert.True(_filter.IsContentSafe(string.Empty));
        Assert.True(_filter.IsContentSafe("   "));
    }

    [Fact]
    public void IsContentSafe_WithCleanContent_ReturnsTrue()
    {
        Assert.True(_filter.IsContentSafe("Hello, world!"));
        Assert.True(_filter.IsContentSafe("This is a perfectly fine message"));
        Assert.True(_filter.IsContentSafe("سلام دنیا"));
    }

    [Fact]
    public void IsContentSafe_WithEnglishProfanity_ReturnsFalse()
    {
        Assert.False(_filter.IsContentSafe("You are a fucker"));
        Assert.False(_filter.IsContentSafe("That shit is cool"));
        Assert.False(_filter.IsContentSafe("Oh damn!"));
    }

    [Fact]
    public void IsContentSafe_WithPersianProfanity_ReturnsFalse()
    {
        Assert.False(_filter.IsContentSafe("این یک فحش است"));
        Assert.False(_filter.IsContentSafe("تو احمق هستی"));
    }

    [Fact]
    public void FilterContent_ReplacesEnglishProfanity()
    {
        var result = _filter.FilterContent("That is fucking shit");
        Assert.Contains("***", result);
    }

    [Fact]
    public void FilterContent_WithCleanContent_ReturnsOriginal()
    {
        const string clean = "Hello, world!";
        Assert.Equal(clean, _filter.FilterContent(clean));
    }

    [Fact]
    public void GetBlockedWords_ReturnsNonEmptyList()
    {
        var words = _filter.GetBlockedWords();
        Assert.NotEmpty(words);
        Assert.Contains("fuck", words);
        Assert.Contains("فحش", words);
    }
}
