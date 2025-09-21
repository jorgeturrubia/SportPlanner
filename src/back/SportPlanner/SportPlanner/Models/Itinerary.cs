using System.ComponentModel.DataAnnotations;
using SportPlanner.Models.Masters;

namespace SportPlanner.Models;

public class Itinerary
{
    public Guid Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Sport { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty; // Categoría por edad
    
    public int? LevelId { get; set; }
    
    public bool IsSystemItinerary { get; set; } = false; // true = itinerario del sistema, false = personalizado
    public Guid? CreatedByUserId { get; set; } // null si es itinerario del sistema
    
    // Para el marketplace
    public bool IsPublic { get; set; } = false;
    public decimal AverageRating { get; set; } = 0;
    public int RatingCount { get; set; } = 0;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    
    // Relaciones
    public Level? Level { get; set; }
    public User? CreatedBy { get; set; }
    public ICollection<ItineraryConcept> ItineraryConcepts { get; set; } = new List<ItineraryConcept>();
    public ICollection<Planning> Plannings { get; set; } = new List<Planning>();
    public ICollection<ItineraryRating> Ratings { get; set; } = new List<ItineraryRating>();
}

public class ItineraryConcept
{
    public Guid Id { get; set; }
    public Guid ItineraryId { get; set; }
    public Guid ConceptId { get; set; }
    
    public int Order { get; set; } // Orden del concepto en el itinerario
    public int WeeksToTrain { get; set; } // Semanas dedicadas a este concepto
    
    // Relaciones
    public Itinerary Itinerary { get; set; } = null!;
    public Concept Concept { get; set; } = null!;
}

public class ItineraryRating
{
    public Guid Id { get; set; }
    public Guid ItineraryId { get; set; }
    public Guid UserId { get; set; }
    
    public int Rating { get; set; } // 1-5 estrellas
    
    [MaxLength(500)]
    public string Comment { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Relaciones
    public Itinerary Itinerary { get; set; } = null!;
    public User User { get; set; } = null!;
}