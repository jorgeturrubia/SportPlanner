using FluentValidation;
using SportPlanner.Application.DTOs;

namespace SportPlanner.Application.Validators;

public class TrainingSessionCreateValidator : AbstractValidator<TrainingSessionCreateDto>
{
    public TrainingSessionCreateValidator()
    {
        RuleFor(x => x.StartAt).NotEmpty();
        RuleFor(x => x.Duration).GreaterThan(TimeSpan.Zero);
        When(x => x.SessionConcepts != null && x.SessionConcepts.Count > 0, () => {
            RuleForEach(x => x.SessionConcepts).SetValidator(new SessionConceptDtoValidator());
        });
    }
}

public class SessionConceptDtoValidator : AbstractValidator<SessionConceptDto>
{
    public SessionConceptDtoValidator()
    {
        RuleFor(x => x.SportConceptId).GreaterThan(0);
        RuleFor(x => x.Order).GreaterThan(0);
        RuleFor(x => x.PlannedDurationMinutes).GreaterThan(0).When(x => x.PlannedDurationMinutes.HasValue);
    }
}
