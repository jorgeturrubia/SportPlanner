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
        CreateMap<ConceptCategory, ConceptCategoryDto>()
            .ForMember(dest => dest.Concepts, opt => opt.MapFrom(src => src.SportConcepts));
    }
}
