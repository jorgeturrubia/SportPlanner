using FluentValidation;
using SportPlanner.Application.DTOs.ConceptTemplate;

namespace SportPlanner.Application.Validators;

public class ConceptTemplateCreateValidator : AbstractValidator<ConceptTemplateCreateDto>
{
    public ConceptTemplateCreateValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Template name is required")
            .MaximumLength(200)
            .WithMessage("Template name cannot exceed 200 characters");

        RuleFor(x => x.TechnicalComplexity)
            .InclusiveBetween(1, 10)
            .WithMessage("Technical complexity must be between 1 and 10");

        RuleFor(x => x.TacticalComplexity)
            .InclusiveBetween(0, 10)
            .WithMessage("Tactical complexity must be between 0 and 10");

        RuleFor(x => x.SportId)
            .GreaterThan(0)
            .WithMessage("Sport ID is required");

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .WithMessage("Description cannot exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));
    }
}

public class ConceptTemplateUpdateValidator : AbstractValidator<ConceptTemplateUpdateDto>
{
    public ConceptTemplateUpdateValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(200)
            .WithMessage("Template name cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.Name));

        RuleFor(x => x.TechnicalComplexity)
            .InclusiveBetween(1, 10)
            .WithMessage("Technical complexity must be between 1 and 10")
            .When(x => x.TechnicalComplexity.HasValue);

        RuleFor(x => x.TacticalComplexity)
            .InclusiveBetween(0, 10)
            .WithMessage("Tactical complexity must be between 0 and 10")
            .When(x => x.TacticalComplexity.HasValue);

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .WithMessage("Description cannot exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));
    }
}
