using Xunit;
using SportPlanner.Models;

namespace SportPlanner.Tests.Models;

public class ItineraryRatingTests
{
    [Fact]
    public void ItineraryRating_Properties_WorkCorrectly()
    {
        var rating = new ItineraryRating();
        
        rating.ItineraryId = 1;
        rating.UserId = "user-123";
        rating.Rating = 5;
        rating.CreatedAt = System.DateTime.UtcNow;
        
        Assert.Equal(1, rating.ItineraryId);
        Assert.Equal("user-123", rating.UserId);
        Assert.Equal(5, rating.Rating);
        Assert.NotEqual(default, rating.CreatedAt);
    }
}
