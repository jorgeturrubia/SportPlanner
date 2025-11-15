using System;

namespace SportPlanner.Application.DTOs;

public class SportDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Slug { get; set; }
}
