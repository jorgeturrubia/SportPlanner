using AutoMapper;
using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings
{
    public class SportConceptProfile : Profile
    {
        public SportConceptProfile()
        {
            CreateMap<SportConcept, SportConceptDto>();
            CreateMap<SportConcept, SportConceptWithSuggestionDto>();
            CreateMap<DifficultyLevel, DifficultyLevelDto>();
        }
    }
}
