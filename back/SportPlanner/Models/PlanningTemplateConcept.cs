using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportPlanner.Models;

public class PlanningTemplateConcept
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int PlanningTemplateId { get; set; }
    [ForeignKey(nameof(PlanningTemplateId))]
    public PlanningTemplate PlanningTemplate { get; set; } = null!;

    [Required]
    public int SportConceptId { get; set; }
    [ForeignKey(nameof(SportConceptId))]
    public SportConcept SportConcept { get; set; } = null!;

    public string? CustomDescription { get; set; }
    
    public int Order { get; set; }
}
