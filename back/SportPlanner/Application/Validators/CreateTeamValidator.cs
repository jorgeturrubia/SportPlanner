using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Data;

namespace SportPlanner.Application.Validators;

public class CreateTeamValidator : AbstractValidator<CreateTeamDto>
{
    private readonly AppDbContext _db;
    public CreateTeamValidator(AppDbContext db)
    {
        _db = db;
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.SportId).GreaterThan(0);
        RuleFor(x => x.CurrentTechnicalLevel).InclusiveBetween(0, 10);
        RuleFor(x => x.CurrentTacticalLevel).InclusiveBetween(0, 10);
        RuleFor(x => x).CustomAsync(ValidatePlanLimitsAsync);
    }

    private async Task ValidatePlanLimitsAsync(CreateTeamDto dto, ValidationContext<CreateTeamDto> ctx, CancellationToken ct)
    {
        // Skip validation if neither owner nor org is provided (controller will set owner from claims)
        if (string.IsNullOrEmpty(dto.OwnerUserSupabaseId) && !dto.OrganizationId.HasValue)
        {
            return;
        }
        
        // find active subscription for user or org and sport
        var subQuery = _db.Subscriptions.AsQueryable();
        if (!string.IsNullOrEmpty(dto.OwnerUserSupabaseId))
            subQuery = subQuery.Where(s => s.UserSupabaseId == dto.OwnerUserSupabaseId && s.SportId == dto.SportId && s.IsActive);
        else
            subQuery = subQuery.Where(s => s.OrganizationId == dto.OrganizationId && s.SportId == dto.SportId && s.IsActive);
        var sub = await subQuery.Include(s => s.Plan).FirstOrDefaultAsync(ct);
        if (sub == null)
        {
            ctx.AddFailure("No active subscription found for owner/organization and sport");
            return;
        }
        var maxTeams = sub.Plan?.MaxTeams;
        if (maxTeams.HasValue)
        {
            // Count existing teams for owner or org
            var teamsQuery = _db.Teams.AsQueryable();
            if (!string.IsNullOrEmpty(dto.OwnerUserSupabaseId))
                teamsQuery = teamsQuery.Where(t => t.OwnerUserSupabaseId == dto.OwnerUserSupabaseId);
            else
                teamsQuery = teamsQuery.Where(t => t.OrganizationId == dto.OrganizationId);
            var count = await teamsQuery.CountAsync(ct);
            if (count >= maxTeams.Value)
                ctx.AddFailure($"Max teams per plan reached ({maxTeams.Value})");
        }
    }
}
