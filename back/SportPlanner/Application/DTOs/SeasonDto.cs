namespace SportPlanner.Application.DTOs;

public class SeasonDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
    public int? OrganizationId { get; set; }
    public string? OwnerId { get; set; }
    public bool IsSystem { get; set; }
}

public class CreateSeasonDto
{
    public string Name { get; set; } = null!;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int? OrganizationId { get; set; }
}

public class UpdateSeasonDto
{
    public string Name { get; set; } = null!;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
}
