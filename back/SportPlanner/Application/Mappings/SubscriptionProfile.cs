using AutoMapper;
using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings;

public class SubscriptionProfile : Profile
{
    public SubscriptionProfile()
    {
        CreateMap<CreateSubscriptionDto, Subscription>();
        CreateMap<Subscription, SubscriptionDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.Plan, opt => opt.MapFrom(src => src.Plan))
            .ForMember(dest => dest.Sport, opt => opt.MapFrom(src => src.Sport));
        CreateMap<SubscriptionPlan, PlanDto>();
        CreateMap<Sport, SportDto>();
        // Map the Plan and Sport navigation properties (already included above)
    }
}
