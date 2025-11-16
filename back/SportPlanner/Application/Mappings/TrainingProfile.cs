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

        CreateMap<TrainingScheduleCreateDto, TrainingSchedule>()
            .ForMember(dest => dest.PlanConcepts, opt => opt.Ignore())
            .ForMember(dest => dest.ScheduleDays, opt => opt.Ignore());
        CreateMap<TrainingSchedule, TrainingScheduleDto>();
        CreateMap<PlanConcept, PlanConceptDto>();
        CreateMap<ConceptInterpretation, ConceptInterpretationDto>();
        CreateMap<TrainingScheduleDay, TrainingScheduleDayDto>()
            .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTime.ToString()))
            .ForMember(dest => dest.EndTime, opt => opt.MapFrom(src => src.EndTime.HasValue ? src.EndTime.Value.ToString() : null));
        CreateMap<TrainingScheduleDayCreateDto, TrainingScheduleDay>()
            .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => TimeSpan.Parse(src.StartTime)))
            .ForMember(dest => dest.EndTime, opt => opt.MapFrom(src => string.IsNullOrEmpty(src.EndTime) ? (TimeSpan?)null : TimeSpan.Parse(src.EndTime)));

        CreateMap<TrainingSession, TrainingSessionDto>();
        CreateMap<SessionConcept, SessionConceptDto>();
        CreateMap<TrainingSessionCreateDto, TrainingSession>()
            .ForMember(dest => dest.SessionConcepts, opt => opt.Ignore());
        CreateMap<SessionConcept, SessionConceptDto>();
        CreateMap<SessionConceptDto, SessionConcept>();
    }
}
