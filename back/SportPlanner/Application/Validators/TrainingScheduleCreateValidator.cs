using FluentValidation;
using SportPlanner.Application.DTOs;

namespace SportPlanner.Application.Validators;

public class TrainingScheduleCreateValidator : AbstractValidator<TrainingScheduleCreateDto>
{
    public TrainingScheduleCreateValidator()
    {
        RuleFor(x => x.StartDate).LessThanOrEqualTo(x => x.EndDate);
        RuleFor(x => x.StartDate).NotEmpty();
        RuleFor(x => x.EndDate).NotEmpty();
        RuleFor(x => x.ScheduleDays).Must(sd => sd != null && sd.Count > 0).WithMessage("At least one ScheduleDay is required.");
        RuleForEach(x => x.ScheduleDays).SetValidator(new TrainingScheduleDayCreateValidator());
    }
}

public class TrainingScheduleDayCreateValidator : AbstractValidator<TrainingScheduleDayCreateDto>
{
    public TrainingScheduleDayCreateValidator()
    {
        RuleFor(x => x.DayOfWeek).NotEmpty();
        RuleFor(x => x.StartTime).NotEmpty().Matches(@"^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$");
        RuleFor(x => x.EndTime).Matches(@"^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$");
    }
}
