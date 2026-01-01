using AutoMapper;
using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings
{
    public class ExerciseProfile : Profile
    {
        public ExerciseProfile()
        {
            CreateMap<Exercise, ExerciseDto>()
                .ForMember(dest => dest.ConceptIds, opt => opt.MapFrom(src => src.Concepts.Select(c => c.Id).ToList()));
            CreateMap<CreateExerciseDto, Exercise>();
        }
    }
}
