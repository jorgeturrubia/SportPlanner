using SportPlanner.Models;

namespace SportPlanner.Application.DTOs;

public class TacticalBoardDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public int? ExerciseId { get; set; }
    public string BoardData { get; set; } = "{}";
    public TacticalBoardType Type { get; set; }
    public int? FrameCount { get; set; }
    public int? FrameDuration { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? ExportedImageUrl { get; set; }
    public string? ExportedGifUrl { get; set; }
    public FieldType FieldType { get; set; }
    public string? OwnerId { get; set; }
    public bool IsPublic { get; set; }
    public bool IsActive { get; set; }
    public List<string> Tags { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateTacticalBoardDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public int? ExerciseId { get; set; }
    public string BoardData { get; set; } = "{}";
    public TacticalBoardType Type { get; set; } = TacticalBoardType.Static;
    public int? FrameCount { get; set; }
    public int? FrameDuration { get; set; }
    public FieldType FieldType { get; set; } = FieldType.Basketball;
    public bool IsPublic { get; set; } = false;
    public List<string>? Tags { get; set; }

    // Set by controller
    public string? OwnerId { get; set; }
}

public class UpdateTacticalBoardDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int? ExerciseId { get; set; }
    public string? BoardData { get; set; }
    public TacticalBoardType? Type { get; set; }
    public int? FrameCount { get; set; }
    public int? FrameDuration { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? ExportedImageUrl { get; set; }
    public string? ExportedGifUrl { get; set; }
    public FieldType? FieldType { get; set; }
    public bool? IsPublic { get; set; }
    public bool? IsActive { get; set; }
    public List<string>? Tags { get; set; }
}
