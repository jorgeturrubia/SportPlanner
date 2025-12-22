using AutoMapper;
using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings;

public class EntrenamientosProfile : Profile
{
    public EntrenamientosProfile()
    {
        CreateMap<Exercise, ExerciseDto>()
            .ForMember(dest => dest.ConceptIds, opt => opt.MapFrom(src => src.Concepts.Select(c => c.Id)));

        CreateMap<TrainingSession, TrainingSessionDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

        CreateMap<TrainingSessionConcept, TrainingSessionConceptDto>()
            .ForMember(dest => dest.ConceptName, opt => opt.MapFrom(src => src.SportConcept != null ? src.SportConcept.Name : null))
            .ForMember(dest => dest.ConceptDescription, opt => opt.MapFrom(src => src.SportConcept != null ? src.SportConcept.Description : null))
            .ForMember(dest => dest.ConceptCategoryName, opt => opt.MapFrom(src => src.SportConcept != null && src.SportConcept.ConceptCategory != null ? src.SportConcept.ConceptCategory.Name : null));

        CreateMap<TrainingSessionExercise, TrainingSessionExerciseDto>()
            .ForMember(dest => dest.ExerciseName, opt => opt.MapFrom(src => src.Exercise != null ? src.Exercise.Name : null))
            .ForMember(dest => dest.SportConceptName, opt => opt.MapFrom(src => src.SportConcept != null ? src.SportConcept.Name : null));
    }
}
