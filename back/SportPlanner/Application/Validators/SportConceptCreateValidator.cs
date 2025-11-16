using FluentValidation;
using SportPlanner.Application.DTOs;

namespace SportPlanner.Application.Validators;

public class SportConceptCreateValidator : AbstractValidator<CreateSportConceptDto>
{
    public SportConceptCreateValidator()
    {
        RuleFor(x => x.Name).NotEmpty();
        RuleFor(x => x.ProgressWeight).InclusiveBetween(0, 100);
    }
}
