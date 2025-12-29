using SportPlanner.Models;
using Xunit;

namespace SportPlanner.Tests.Models;

public class SportConceptTests
{
    [Fact]
    public void SportConcept_ShouldHaveOwnerIdProperty()
    {
        // Arrange
        var concept = new SportConcept();
        
        // Act & Assert
        // We use reflection to verify the property exists before it's added to the class definition
        // to avoid compilation errors that stop the build.
        var property = typeof(SportConcept).GetProperty("OwnerId");
        
        Assert.NotNull(property);
        Assert.Equal(typeof(string), property.PropertyType);
    }

    [Fact]
    public void SportConceptDto_ShouldHaveOwnershipProperties()
    {
        var isSystem = typeof(SportPlanner.Application.DTOs.SportConceptDto).GetProperty("IsSystem");
        var ownerId = typeof(SportPlanner.Application.DTOs.SportConceptDto).GetProperty("OwnerId");

        Assert.NotNull(isSystem);
        Assert.Equal(typeof(bool), isSystem.PropertyType);
        
        Assert.NotNull(ownerId);
        Assert.Equal(typeof(string), ownerId.PropertyType);
    }
}
