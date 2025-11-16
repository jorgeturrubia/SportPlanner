using FluentValidation;
using SportPlanner.Application.DTOs;

namespace SportPlanner.Application.Validators;

public class ConceptInterpretationCreateValidator : AbstractValidator<ConceptInterpretationCreateDto>
{
    public ConceptInterpretationCreateValidator()
    {
        RuleFor(x => x.SportConceptId).GreaterThan(0);
        RuleFor(x => x.DurationMultiplier).GreaterThan(0.0m);
        RuleFor(x => x.PriorityMultiplier).GreaterThan(0.0m);
        // At least one of TeamId, TeamCategoryId, TeamLevelId must be set for a specific override
        RuleFor(x => x).Must(x => x.TeamId.HasValue || x.TeamCategoryId.HasValue || x.TeamLevelId.HasValue)
            .WithMessage("At least one of TeamId, TeamCategoryId or TeamLevelId should be provided for a specific interpretation.");
    }
}
