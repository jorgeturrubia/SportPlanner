using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Application.DTOs.Team;
using SportPlanner.Application.DTOs.Proposal;
using SportPlanner.Data;
using SportPlanner.Enums;
using SportPlanner.Models;

namespace SportPlanner.Services;

/// <summary>
/// Service that generates intelligent concept proposals based on team characteristics
/// </summary>
public class ConceptProposalService : IConceptProposalService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    // Base weights (remaining after age-based tech/tac weights)
    private const decimal DevelopmentLevelWeight = 0.10m;
    private const decimal TeamLevelWeight = 0.05m;

    // Bonus for pure technical concepts for young teams
    private const decimal PureTechnicalBonus = 0.15m;

    // Score thresholds
    private const decimal SuggestedThreshold = 0.70m;
    private const decimal OptionalThreshold = 0.40m;

    public ConceptProposalService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ConceptProposalResponseDto> GenerateProposalsAsync(ConceptProposalRequestDto request)
    {
        // 1. Get team with related data
        var team = await _context.Teams
            .Include(t => t.TeamSeasons).ThenInclude(ts => ts.TeamLevel)
            .Include(t => t.TeamSeasons).ThenInclude(ts => ts.TeamCategory)
            .FirstOrDefaultAsync(t => t.Id == request.TeamId);

        if (team == null)
        {
            throw new ArgumentException($"Team with ID {request.TeamId} not found");
        }

        var teamSeason = team.TeamSeasons.FirstOrDefault(ts => ts.SeasonId == request.SeasonId);
        int technicalLevel = teamSeason?.TechnicalLevel ?? 0;
        int tacticalLevel = teamSeason?.TacticalLevel ?? 0;

        // 2. Get all active concepts with categories
        var conceptsQuery = _context.SportConcepts
            .Include(sc => sc.ConceptCategory)
                .ThenInclude(cc => cc!.Parent)
            .Where(sc => sc.IsActive);

        // Apply section filter if specified
        if (!string.IsNullOrEmpty(request.SectionFocus))
        {
            conceptsQuery = conceptsQuery.Where(sc =>
                sc.ConceptCategory != null &&
                (sc.ConceptCategory.Name == request.SectionFocus ||
                 (sc.ConceptCategory.Parent != null && sc.ConceptCategory.Parent.Name == request.SectionFocus) ||
                 (sc.ConceptCategory.Parent != null && sc.ConceptCategory.Parent.Parent != null &&
                  sc.ConceptCategory.Parent.Parent.Name == request.SectionFocus)));
        }

        // Exclude specific categories
        if (request.ExcludeCategoryIds?.Any() == true)
        {
            conceptsQuery = conceptsQuery.Where(sc =>
                sc.ConceptCategoryId == null ||
                !request.ExcludeCategoryIds.Contains(sc.ConceptCategoryId.Value));
        }

        var concepts = await conceptsQuery.ToListAsync();

        // 3. Calculate expected development level and level window
        int expectedDevelopmentLevel;
        if (request.PlanningTemplateId.HasValue)
        {
            var template = await _context.PlanningTemplates.FindAsync(request.PlanningTemplateId.Value);
            expectedDevelopmentLevel = template?.Level ?? CalculateExpectedDevelopmentLevel(teamSeason?.TeamCategory);
        }
        else
        {
            expectedDevelopmentLevel = CalculateExpectedDevelopmentLevel(teamSeason?.TeamCategory);
        }

        var (minLevel, maxLevel) = CalculateLevelWindow(team, expectedDevelopmentLevel, technicalLevel, tacticalLevel, request.LevelOffset);

        // 4. Filter concepts by development level window
        var filteredConcepts = concepts.Where(c =>
        {
            if (!c.DevelopmentLevel.HasValue)
                return true; // Include concepts without level
            return c.DevelopmentLevel.Value >= minLevel && c.DevelopmentLevel.Value <= maxLevel;
        }).ToList();

        // 5. Score each concept
        var scoredConcepts = filteredConcepts.Select(concept => new
        {
            Concept = concept,
            Score = CalculateConceptScore(concept, team, request, technicalLevel, tacticalLevel, teamSeason),
            Reason = GenerateScoreReason(concept, technicalLevel, tacticalLevel, expectedDevelopmentLevel)
        }).ToList();

        // 5. Separate into suggested and optional
        var suggested = scoredConcepts
            .Where(sc => sc.Score >= SuggestedThreshold)
            .OrderByDescending(sc => sc.Score)
            .ToList();

        var optional = scoredConcepts
            .Where(sc => sc.Score >= OptionalThreshold && sc.Score < SuggestedThreshold)
            .OrderByDescending(sc => sc.Score)
            .ToList();

        // 6. Apply max concepts limit if specified
        if (request.MaxConcepts.HasValue)
        {
            suggested = suggested.Take(request.MaxConcepts.Value).ToList();
        }

        // 7. Group by category
        var suggestedGroups = GroupConceptsByCategory(suggested.Select(s => new ScoredConceptDto
        {
            Concept = _mapper.Map<SportConceptDto>(s.Concept),
            Score = s.Score,
            ScoreReason = s.Reason,
            Priority = DeterminePriority(s.Score, s.Concept, technicalLevel, tacticalLevel, expectedDevelopmentLevel),
            Tag = DetermineConceptTag(s.Concept, expectedDevelopmentLevel, technicalLevel, tacticalLevel)
        }).ToList());

        var optionalGroups = GroupConceptsByCategory(optional.Select(s => new ScoredConceptDto
        {
            Concept = _mapper.Map<SportConceptDto>(s.Concept),
            Score = s.Score,
            ScoreReason = s.Reason,
            Priority = ProposalPriority.Optional,
            Tag = DetermineConceptTag(s.Concept, expectedDevelopmentLevel, technicalLevel, tacticalLevel)
        }).ToList());

        // 9. Build response
        return new ConceptProposalResponseDto
        {
            Team = _mapper.Map<TeamDto>(team),
            SuggestedGroups = suggestedGroups,
            OptionalGroups = optionalGroups,
            Metadata = new ProposalMetadataDto
            {
                TotalAvailableConcepts = concepts.Count,
                SuggestedCount = suggested.Count,
                OptionalCount = optional.Count,
                AverageTeamMatchScore = scoredConcepts.Any()
                    ? scoredConcepts.Average(sc => sc.Score)
                    : 0,
                ExpectedDevelopmentLevel = expectedDevelopmentLevel,
                MinLevelWindow = minLevel,
                MaxLevelWindow = maxLevel,
                FilteredConceptsCount = filteredConcepts.Count
            }
        };
    }

    public async Task<ConceptProposalResponseDto?> GetProposalsForTeamAsync(int teamId, int seasonId, int? durationDays = null)
    {
        var team = await _context.Teams.FindAsync(teamId);
        if (team == null) return null;

        var request = new ConceptProposalRequestDto
        {
            TeamId = teamId,
            SeasonId = seasonId,
            DurationDays = durationDays
        };

        return await GenerateProposalsAsync(request);
    }

    /// <summary>
    /// Calculate a match score (0.0 - 1.0) for a concept based on team characteristics
    /// </summary>
    /// <summary>
    /// Calculate a match score (0.0 - 1.0) for a concept based on team characteristics
    /// </summary>
    private decimal CalculateConceptScore(SportConcept concept, Team team, ConceptProposalRequestDto request, int technicalLevel, int tacticalLevel, TeamSeason? teamSeason)
    {
        decimal score = 0;

        // Get dynamic weights based on team age (methodological progression)
        var (techWeight, tacWeight) = GetWeightsByAge(teamSeason?.TeamCategory?.MinAge);

        // Technical score: Compare concept difficulty vs team technical level
        decimal technicalScore = CalculateLevelMatchScore(
            concept.TechnicalDifficulty,
            technicalLevel);
        score += technicalScore * techWeight;

        // Tactical score: Compare concept complexity vs team tactical level
        // For purely technical concepts (TacticalComplexity = 0), give full tactical score
        decimal tacticalScore;
        if (concept.TacticalComplexity == 0)
        {
            // Pure technical concept - no tactical barrier, give bonus instead
            tacticalScore = 1.0m;
        }
        else
        {
            tacticalScore = CalculateLevelMatchScore(
                concept.TacticalComplexity,
                tacticalLevel);
        }
        score += tacticalScore * tacWeight;

        // Development level score: Compare concept level vs expected team level
        if (concept.DevelopmentLevel.HasValue)
        {
            decimal developmentScore = CalculateLevelMatchScore(concept.DevelopmentLevel.Value, request.PlanningTemplateId.HasValue ? request.PlanningTemplateId.Value : CalculateExpectedDevelopmentLevel(teamSeason?.TeamCategory));
            score += developmentScore * DevelopmentLevelWeight;
        }
        else
        {
            // If no development level, use neutral score
            score += 0.5m * DevelopmentLevelWeight;
        }

        // Team level bonus (higher ranked teams can handle slightly harder concepts)
        // Team level bonus (higher ranked teams can handle slightly harder concepts)
        if (teamSeason?.TeamLevel != null)
        {
            decimal levelBonus = (teamSeason.TeamLevel.Rank - 1) * 0.02m; // 2% bonus per rank above 1
            score += Math.Min(levelBonus, TeamLevelWeight);
        }
        else
        {
            score += 0.5m * TeamLevelWeight;
        }

        // Bonus for pure technical concepts for young teams (≤12 years)
        if (teamSeason?.TeamCategory?.MinAge <= 12 && concept.TacticalComplexity == 0)
        {
            score += PureTechnicalBonus;
        }

        return Math.Clamp(score, 0m, 1m);
    }

    /// <summary>
    /// Get dynamic technical/tactical weights based on team age (methodological progression)
    /// Young teams focus on technique, older teams balance with tactics
    /// </summary>
    private (decimal techWeight, decimal tacWeight) GetWeightsByAge(int? minAge)
    {
        return minAge switch
        {
            null => (0.50m, 0.35m),   // Default: balanced
            <= 8 => (0.80m, 0.05m),   // Escuela: 80% técnico, 5% táctico
            <= 10 => (0.75m, 0.10m),  // Pre-Mini: 75% técnico
            <= 12 => (0.65m, 0.20m),  // Alevín: 65% técnico
            <= 14 => (0.50m, 0.35m),  // Infantil: balanced
            <= 16 => (0.40m, 0.45m),  // Cadete: más táctico
            _ => (0.35m, 0.50m)       // Junior/Senior: enfoque táctico
        };
    }

    /// <summary>
    /// Calculate the window of development levels to include based on team age and coach evaluation.
    /// Uses the coach's CurrentTechnicalLevel and CurrentTacticalLevel to adjust the window.
    /// </summary>
    private (int minLevel, int maxLevel) CalculateLevelWindow(Team team, int baseLevel, int technicalLevel, int tacticalLevel, int offset = 0)
    {
        // Calculate average team proficiency level (1-10 scale)
        decimal avgTeamLevel = (technicalLevel + tacticalLevel) / 2.0m;

        // Adjustment: each 2.5 points above/below neutral (5) shifts the window by 1 level
        decimal adjustment = ((avgTeamLevel - 5) / 2.5m) + offset;

        // Calculate window bounds
        int minLevel, maxLevel;

        if (adjustment >= 0)
        {
            // Good team: include levels up to base + adjustment, keep lower bound at base - 1
            minLevel = Math.Max(1, baseLevel - 1);
            maxLevel = Math.Min(6, baseLevel + (int)Math.Ceiling(adjustment) + 1);
        }
        else
        {
            // Weaker team: include more lower levels, cap upper
            minLevel = Math.Max(1, baseLevel + (int)Math.Floor(adjustment) - 1);
            maxLevel = baseLevel;
        }

        // Ensure at least 2 levels in the window
        if (maxLevel - minLevel < 1)
        {
            maxLevel = Math.Min(6, minLevel + 1);
        }

        return (minLevel, maxLevel);
    }

    /// <summary>
    /// Calculate match score between required level and current level
    /// </summary>
    private decimal CalculateLevelMatchScore(int requiredLevel, int currentLevel)
    {
        int difference = requiredLevel - currentLevel;

        return difference switch
        {
            // Concept is easier than current level
            < -3 => 0.3m,   // Too easy, not challenging
            -3 => 0.5m,     // Easy
            -2 => 0.7m,     // Comfortable
            -1 => 0.85m,    // Good foundation

            // Perfect match
            0 => 1.0m,

            // Concept is harder than current level (progressive challenge)
            1 => 0.95m,     // Optimal challenge (bonus!)
            2 => 0.75m,     // Achievable stretch
            3 => 0.5m,      // Challenging
            _ => 0.2m       // > 3: Too difficult
        };
    }

    /// <summary>
    /// Map TeamCategory to expected development level (1-6)
    /// </summary>
    private int CalculateExpectedDevelopmentLevel(TeamCategory? category)
    {
        if (category == null) return 3; // Default middle level

        // Map based on age range
        if (category.MinAge.HasValue)
        {
            return category.MinAge.Value switch
            {
                <= 8 => 1,   // Niveles más básicos (Escuela)
                <= 10 => 2,  // U10 - Nivel 2
                <= 12 => 3,  // U12 - Nivel 3
                <= 14 => 4,  // U14 - Nivel 4
                <= 16 => 5,  // U16 - Nivel 5
                _ => 6       // Junior/Senior - Nivel 6
            };
        }

        // Fallback based on category name patterns
        return category.Name?.ToLowerInvariant() switch
        {
            var n when n?.Contains("mini") == true || n?.Contains("escuela") == true => 1,
            var n when n?.Contains("u10") == true || n?.Contains("pre") == true => 2,
            var n when n?.Contains("u12") == true || n?.Contains("alevin") == true => 3,
            var n when n?.Contains("u14") == true || n?.Contains("infantil") == true => 4,
            var n when n?.Contains("u16") == true || n?.Contains("cadete") == true => 5,
            var n when n?.Contains("junior") == true || n?.Contains("senior") == true => 6,
            _ => 3
        };
    }

    /// <summary>
    /// Generate human-readable reason for the score
    /// </summary>
    private string GenerateScoreReason(SportConcept concept, int technicalLevel, int tacticalLevel, int expectedDevelopmentLevel)
    {
        // Technical check
        // if (Math.Abs(concept.TechnicalDifficulty - technicalLevel) > 3) return "Dificultad técnica excesiva";
        // Tactical check
        // if (Math.Abs(concept.TacticalComplexity - tacticalLevel) > 3) return "Complejidad táctica excesiva";

        // Technical match
        int techDiff = concept.TechnicalDifficulty - technicalLevel;
        // Tactical match
        int tacDiff = concept.TacticalComplexity - tacticalLevel;

        var reasons = new List<string>();

        // Technical assessment
        if (techDiff >= -1 && techDiff <= 1)
            reasons.Add("Nivel técnico adecuado");
        else if (techDiff < -1)
            reasons.Add("Técnicamente dominado");
        else if (techDiff == 2)
            reasons.Add("Desafío técnico progresivo");
        else if (techDiff > 2)
            reasons.Add("Técnicamente avanzado");

        // Tactical assessment
        if (tacDiff >= -1 && tacDiff <= 1)
            reasons.Add("complejidad táctica apropiada");
        else if (tacDiff < -1)
            reasons.Add("tácticamente consolidado");
        else if (tacDiff == 2)
            reasons.Add("reto táctico alcanzable");
        else if (tacDiff > 2)
            reasons.Add("tácticamente complejo");

        // Development level assessment
        if (concept.DevelopmentLevel.HasValue)
        {
            int devDiff = concept.DevelopmentLevel.Value - expectedDevelopmentLevel;
            if (devDiff == 0)
                reasons.Add("etapa de desarrollo ideal");
            else if (devDiff == 1)
                reasons.Add("siguiente etapa natural");
        }

        return reasons.Any()
            ? string.Join(", ", reasons).CapitalizeFirst()
            : "Evaluación general";
    }

    /// <summary>
    /// Determine priority based on score and characteristics
    /// </summary>
    private ProposalPriority DeterminePriority(decimal score, SportConcept concept, int technicalLevel, int tacticalLevel, int expectedDevelopmentLevel)
    {
        // Check if it's a base concept (level 1-2, low complexity)
        if (concept.TechnicalDifficulty <= 2 && concept.TacticalComplexity <= 2)
        {
            if (concept.DevelopmentLevel.HasValue && concept.DevelopmentLevel.Value <= expectedDevelopmentLevel)
                return ProposalPriority.Essential;
        }

        if (score >= 0.9m)
            return ProposalPriority.Recommended;

        // Check if it's a progressive challenge (slightly above level)
        int techDiff = concept.TechnicalDifficulty - technicalLevel;
        int tacDiff = concept.TacticalComplexity - tacticalLevel;

        if ((techDiff == 1 || techDiff == 2) || (tacDiff == 1 || tacDiff == 2))
            return ProposalPriority.Progressive;

        return ProposalPriority.Recommended;
    }

    /// <summary>
    /// Determine the tag for a concept based on its relationship to the team's itinerary.
    /// Own = concept level matches team's expected level
    /// Inherited = concept is from a previous stage (should be consolidated)
    /// Reinforcement = inherited but team needs extra work (low level team)
    /// Aspirational = concept is from a higher stage (for advanced teams)
    /// </summary>
    private ConceptTag DetermineConceptTag(SportConcept concept, int expectedDevelopmentLevel, int technicalLevel, int tacticalLevel)
    {
        if (!concept.DevelopmentLevel.HasValue)
        {
            return ConceptTag.Own; // Default if no level specified
        }

        int levelDiff = concept.DevelopmentLevel.Value - expectedDevelopmentLevel;

        // Calculate if team is "low level" based on coach evaluation
        // Uses the coach's TechnicalLevel and TacticalLevel to adjust the window.
        // Calculate average team level
        // (This is a simplification, could be weighted)
        // Using local variables instead of team properties
        decimal avgTeamLevel = (technicalLevel + tacticalLevel) / 2.0m;
        bool isLowLevelTeam = avgTeamLevel < 4;

        return levelDiff switch
        {
            0 => ConceptTag.Own,           // Exact match with team's level
            < 0 when isLowLevelTeam => ConceptTag.Reinforcement, // Lower level + needs work
            < 0 => ConceptTag.Inherited,   // Lower level, should be consolidated
            > 0 => ConceptTag.Aspirational // Higher level, for advanced teams
        };
    }

    /// <summary>
    /// Group scored concepts by their category hierarchy
    /// </summary>
    private List<ConceptProposalGroupDto> GroupConceptsByCategory(List<ScoredConceptDto> scoredConcepts)
    {
        return scoredConcepts
            .GroupBy(sc => new
            {
                CategoryId = sc.Concept.ConceptCategoryId ?? 0,
                CategoryName = GetFullCategoryPath(sc.Concept),
                Section = GetSectionName(sc.Concept)
            })
            .Select(g => new ConceptProposalGroupDto
            {
                CategoryId = g.Key.CategoryId,
                CategoryName = g.Key.CategoryName,
                Section = g.Key.Section,
                Concepts = g.OrderByDescending(c => c.Score).ToList()
            })
            .OrderBy(g => g.Section)
            .ThenBy(g => g.CategoryName)
            .ToList();
    }

    private string GetFullCategoryPath(SportConceptDto concept)
    {
        if (concept.ConceptCategory == null)
            return "Sin categoría";

        var parts = new List<string>();
        var current = concept.ConceptCategory;

        // Build path from current up to root (limited depth)
        while (current != null && parts.Count < 3)
        {
            parts.Insert(0, current.Name);
            current = current.Parent;
        }

        return string.Join(" > ", parts);
    }

    private string GetSectionName(SportConceptDto concept)
    {
        if (concept.ConceptCategory == null)
            return "General";

        // Traverse up to find root section (Ataque/Defensa)
        var current = concept.ConceptCategory;
        while (current?.Parent != null)
        {
            current = current.Parent;
        }

        return current?.Name ?? "General";
    }
}

/// <summary>
/// String extension methods
/// </summary>
public static class StringExtensions
{
    public static string CapitalizeFirst(this string input)
    {
        if (string.IsNullOrEmpty(input)) return input;
        return char.ToUpper(input[0]) + input[1..];
    }
}
