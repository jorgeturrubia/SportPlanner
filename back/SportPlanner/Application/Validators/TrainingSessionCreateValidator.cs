using FluentValidation;
using SportPlanner.Application.DTOs;

namespace SportPlanner.Application.Validators;

public class CreateTrainingSessionValidator : AbstractValidator<CreateTrainingSessionDto>
{
    public CreateTrainingSessionValidator()
    {
        RuleFor(x => x.TeamId).GreaterThan(0);
        RuleFor(x => x.Date).NotEmpty();
        RuleFor(x => x.Duration).GreaterThan(TimeSpan.Zero).When(x => x.Duration.HasValue);

        When(x => x.SessionConcepts != null && x.SessionConcepts.Count > 0, () =>
        {
            RuleForEach(x => x.SessionConcepts).SetValidator(new CreateTrainingSessionConceptValidator());
        });

        When(x => x.SessionExercises != null && x.SessionExercises.Count > 0, () =>
        {
            RuleForEach(x => x.SessionExercises).SetValidator(new CreateTrainingSessionExerciseValidator());
        });
    }
}

public class CreateTrainingSessionConceptValidator : AbstractValidator<CreateTrainingSessionConceptDto>
{
    public CreateTrainingSessionConceptValidator()
    {
        RuleFor(x => x.SportConceptId).GreaterThan(0);
        RuleFor(x => x.Order).GreaterThanOrEqualTo(0);
    }
}

public class CreateTrainingSessionExerciseValidator : AbstractValidator<CreateTrainingSessionExerciseDto>
{
    public CreateTrainingSessionExerciseValidator()
    {
        RuleFor(x => x.Order).GreaterThanOrEqualTo(0);
        RuleFor(x => x.DurationMinutes).GreaterThan(0).When(x => x.DurationMinutes.HasValue);
    }
}
