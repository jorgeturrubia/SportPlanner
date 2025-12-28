using AutoMapper;
using SportPlanner.Application.DTOs;
using SportPlanner.Application.DTOs.Team;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings;

public class LookupProfile : Profile
{
    public LookupProfile()
    {
        CreateMap<TeamLevel, TeamLevelDto>();
        CreateMap<TeamCategory, TeamCategoryDto>();
        CreateMap<Sport, SportDto>();
        CreateMap<CreateSportDto, Sport>();
        CreateMap<UpdateSportDto, Sport>();
        // Explicitly map nested concept here to ensure it's available
        CreateMap<SportConcept, SportConceptDto>()
            .ForMember(d => d.ConceptCategory, opt => opt.Ignore());

        CreateMap<ConceptCategory, ConceptCategoryDto>()
             .ForMember(dest => dest.Concepts, opt => opt.MapFrom(src => src.SportConcepts));
    }
}
