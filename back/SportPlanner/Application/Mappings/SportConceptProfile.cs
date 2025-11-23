using AutoMapper;
using SportPlanner.Application.DTOs.SportConcept;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings
{
    public class SportConceptProfile : Profile
    {
        public SportConceptProfile()
        {
            CreateMap<SportConcept, SportConceptDto>();
            CreateMap<DifficultyLevel, DifficultyLevelDto>();
        }
    }
}
