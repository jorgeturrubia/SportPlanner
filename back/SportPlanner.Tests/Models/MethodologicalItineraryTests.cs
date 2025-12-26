using Xunit;
using SportPlanner.Models;

namespace SportPlanner.Tests.Models;

public class MethodologicalItineraryTests
{
    [Fact]
    public void MethodologicalItinerary_HasNewMarketplaceProperties()
    {
        // Arrange & Act
        var itinerary = new MethodologicalItinerary();

        // Assert
        // These properties are required by the spec for Marketplace & Shadowing
        
        // 1. IsSystem: Identifies if it's a "System/Pro" itinerary
        itinerary.IsSystem = true;
        Assert.True(itinerary.IsSystem);

        // 2. OwnerId: The creator (FK to User)
        itinerary.OwnerId = "test-user-id";
        Assert.Equal("test-user-id", itinerary.OwnerId);

        // 3. Version: For strict versioning
        itinerary.Version = 1;
        Assert.Equal(1, itinerary.Version);

        // 4. SystemSourceId: Reference to original itinerary if this is a user copy/shadow
        itinerary.SystemSourceId = 123;
        Assert.Equal(123, itinerary.SystemSourceId);

        // 5. AverageRating: For marketplace ranking
        itinerary.AverageRating = 4.5;
        Assert.Equal(4.5, itinerary.AverageRating);

        // 6. RatingCount: To calculate average
        itinerary.RatingCount = 10;
        Assert.Equal(10, itinerary.RatingCount);
    }
}
