using AutoMapper;
using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings;

public class TrainingProfile : Profile
{
    public TrainingProfile()
    {
        CreateMap<CreateSportConceptDto, SportConcept>();
        CreateMap<SportConcept, SportConceptDto>();

        CreateMap<Team, TeamDto>();
        CreateMap<TeamCategory, TeamCategoryDto>();
        CreateMap<TeamLevel, TeamLevelDto>();
        CreateMap<DifficultyLevel, DifficultyLevelDto>();
        CreateMap<ConceptCategory, ConceptCategoryDto>();

        CreateMap<TrainingScheduleCreateDto, Planning>()
            .ForMember(dest => dest.PlanConcepts, opt => opt.Ignore())
            .ForMember(dest => dest.ScheduleDays, opt => opt.Ignore());
        CreateMap<Planning, TrainingScheduleDto>();
        CreateMap<PlanConcept, PlanConceptDto>();
        CreateMap<PlaningScheduleDay, TrainingScheduleDayDto>()
            .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTime.ToString()))
            .ForMember(dest => dest.EndTime, opt => opt.MapFrom(src => src.EndTime.HasValue ? src.EndTime.Value.ToString() : null));
        CreateMap<TrainingScheduleDayCreateDto, PlaningScheduleDay>()
            .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => TimeSpan.Parse(src.StartTime)))
            .ForMember(dest => dest.EndTime, opt => opt.MapFrom(src => string.IsNullOrEmpty(src.EndTime) ? (TimeSpan?)null : TimeSpan.Parse(src.EndTime)));

    }
}
