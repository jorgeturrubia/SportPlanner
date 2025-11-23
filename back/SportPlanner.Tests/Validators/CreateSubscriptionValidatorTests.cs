using System;
using FluentValidation.TestHelper;
using SportPlanner.Application.DTOs;
using SportPlanner.Application.Validators;
using Xunit;

namespace SportPlanner.Tests.Validators;

public class CreateSubscriptionValidatorTests
{
    [Fact]
    public void Validate_EndDateBeforeStartDate_Fails()
    {
        var validator = new CreateSubscriptionValidator();
        var dto = new CreateSubscriptionDto
        {
            PlanId = 1,
            SportId = 1,
            StartDate = DateTime.UtcNow.AddDays(10),
            EndDate = DateTime.UtcNow.AddDays(1)
        };

        var result = validator.TestValidate(dto);
        result.ShouldHaveValidationErrorFor(x => x.EndDate);
    }

    [Fact]
    public void Validate_ValidDates_Passes()
    {
        var validator = new CreateSubscriptionValidator();
        var dto = new CreateSubscriptionDto
        {
            PlanId = 1,
            SportId = 1,
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddDays(30)
        };
        var result = validator.TestValidate(dto);
        result.ShouldNotHaveValidationErrorFor(x => x.EndDate);
    }
}
