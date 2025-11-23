using System;
using FluentValidation;
using SportPlanner.Application.DTOs;

namespace SportPlanner.Application.Validators;

public class CreateSubscriptionValidator : AbstractValidator<CreateSubscriptionDto>
{
    public CreateSubscriptionValidator()
    {
        RuleFor(x => x.PlanId).GreaterThan(0);
        RuleFor(x => x.SportId).GreaterThan(0);
        RuleFor(x => x.OrganizationId).GreaterThanOrEqualTo(0).When(x => x.OrganizationId.HasValue);
        RuleFor(x => x.EndDate)
            .GreaterThan(x => x.StartDate)
            .When(x => x.EndDate.HasValue);
        RuleFor(x => x.UserSupabaseId).MaximumLength(128).When(x => !string.IsNullOrEmpty(x.UserSupabaseId));
        // Note: XOR check (UserSupabaseId != null XOR OrganizationId != null) best done in controller
    }
}
