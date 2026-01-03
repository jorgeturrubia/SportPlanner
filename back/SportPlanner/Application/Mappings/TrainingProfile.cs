using AutoMapper;
using SportPlanner.Application.DTOs;
using SportPlanner.Application.DTOs.Team;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings;

public class TrainingProfile : Profile
{
    public TrainingProfile()
    {
        CreateMap<CreateSportConceptDto, SportConcept>();
        
        CreateMap<Team, TeamDto>();
        CreateMap<TeamCategory, TeamCategoryDto>();
        CreateMap<TeamLevel, TeamLevelDto>();
        CreateMap<DifficultyLevel, DifficultyLevelDto>();

        CreateMap<TrainingScheduleCreateDto, Planning>()
            .ForMember(dest => dest.PlanConcepts, opt => opt.Ignore())
            .ForMember(dest => dest.ScheduleDays, opt => opt.Ignore());
        CreateMap<TrainingSession, TrainingSessionDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.PlanningName, opt => opt.MapFrom(src => src.Planning != null ? src.Planning.Name : null));

        CreateMap<TrainingSessionConcept, TrainingSessionConceptDto>()
            .ForMember(dest => dest.ConceptName, opt => opt.MapFrom(src => src.SportConcept != null ? src.SportConcept.Name : null))
            .ForMember(dest => dest.ConceptDescription, opt => opt.MapFrom(src => src.OverrideDescription ?? (src.SportConcept != null ? src.SportConcept.Description : null)))
            .ForMember(dest => dest.ConceptCategoryName, opt => opt.MapFrom(src => src.SportConcept != null && src.SportConcept.ConceptCategory != null ? src.SportConcept.ConceptCategory.Name : null));

        CreateMap<TrainingSessionExercise, TrainingSessionExerciseDto>()
            .ForMember(dest => dest.ExerciseName, opt => opt.MapFrom(src => src.Exercise != null ? src.Exercise.Name : null))
            .ForMember(dest => dest.ExerciseDescription, opt => opt.MapFrom(src => src.Exercise != null ? src.Exercise.Description : null))
            .ForMember(dest => dest.ExerciseMediaUrl, opt => opt.MapFrom(src => src.Exercise != null ? src.Exercise.MediaUrl : null))
            .ForMember(dest => dest.SportConceptName, opt => opt.MapFrom(src => src.SportConcept != null ? src.SportConcept.Name : null));

        CreateMap<PlanConcept, PlanConceptDto>();
        CreateMap<PlaningScheduleDay, TrainingScheduleDayDto>()
            .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTime.ToString()))
            .ForMember(dest => dest.EndTime, opt => opt.MapFrom(src => src.EndTime.HasValue ? src.EndTime.Value.ToString() : null));
        CreateMap<TrainingScheduleDayCreateDto, PlaningScheduleDay>()
            .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => TimeSpan.Parse(src.StartTime)))
            .ForMember(dest => dest.EndTime, opt => opt.MapFrom(src => string.IsNullOrEmpty(src.EndTime) ? (TimeSpan?)null : TimeSpan.Parse(src.EndTime)));

    }
}
