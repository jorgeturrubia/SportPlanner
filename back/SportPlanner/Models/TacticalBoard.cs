using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SportPlanner.Models;

public class TacticalBoard
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    // Relationship with Exercise (optional - can be standalone or linked to exercise)
    public int? ExerciseId { get; set; }
    public Exercise? Exercise { get; set; }

    // Canvas data stored as JSON
    [Required]
    [Column(TypeName = "jsonb")]
    public string BoardData { get; set; } = "{}";

    // Type of tactical board
    public TacticalBoardType Type { get; set; } = TacticalBoardType.Static;

    // For animated boards
    public int? FrameCount { get; set; }
    public int? FrameDuration { get; set; } // milliseconds per frame

    // Generated URLs (stored in cloud storage like Supabase Storage)
    public string? ThumbnailUrl { get; set; } // PNG thumbnail preview
    public string? ExportedImageUrl { get; set; } // PNG full resolution export
    public string? ExportedGifUrl { get; set; } // GIF animation export

    // Field configuration
    public FieldType FieldType { get; set; } = FieldType.Basketball;

    // Ownership & Sharing
    public string? OwnerId { get; set; } // Supabase user ID
    public bool IsPublic { get; set; } = false;
    public bool IsActive { get; set; } = true;

    // Metadata
    public List<string> Tags { get; set; } = new();

    [Column(TypeName = "timestamp with time zone")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column(TypeName = "timestamp with time zone")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum TacticalBoardType
{
    Static = 0,
    Animated = 1
}

public enum FieldType
{
    Basketball = 0,
    Football = 1,
    Handball = 2,
    Futsal = 3,
    Volleyball = 4,
    Generic = 5
}
