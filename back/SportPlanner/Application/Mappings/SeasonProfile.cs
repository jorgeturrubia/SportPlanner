using AutoMapper;
using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings;

public class SeasonProfile : Profile
{
    public SeasonProfile()
    {
        CreateMap<Season, SeasonDto>();
        CreateMap<CreateSeasonDto, Season>();
        CreateMap<UpdateSeasonDto, Season>();
    }
}
