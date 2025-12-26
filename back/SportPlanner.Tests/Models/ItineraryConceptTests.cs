using Xunit;
using SportPlanner.Models;

namespace SportPlanner.Tests.Models;

public class ItineraryConceptTests
{
    [Fact]
    public void ItineraryConcept_CanStoreCustomizations()
    {
        var link = new ItineraryConcept();
        
        link.ItineraryId = 10;
        link.SportConceptId = 20;
        link.CustomDescription = "My custom note";
        
        Assert.Equal(10, link.ItineraryId);
        Assert.Equal(20, link.SportConceptId);
        Assert.Equal("My custom note", link.CustomDescription);
    }
}
