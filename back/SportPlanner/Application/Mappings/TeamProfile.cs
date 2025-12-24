using AutoMapper;
using SportPlanner.Application.DTOs;
using SportPlanner.Application.DTOs.Team;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings
{
    public class TeamProfile : Profile
    {
        public TeamProfile()
        {
            CreateMap<Team, TeamDto>();
            CreateMap<TeamSeason, TeamDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Team!.Id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Team!.Name))
                .ForMember(dest => dest.TeamCategory, opt => opt.MapFrom(src => src.TeamCategory))
                .ForMember(dest => dest.TeamLevelId, opt => opt.MapFrom(src => src.TeamLevelId))
                .ForMember(dest => dest.TeamLevel, opt => opt.MapFrom(src => src.TeamLevel))
                .ForMember(dest => dest.CurrentTechnicalLevel, opt => opt.MapFrom(src => src.TechnicalLevel))
                .ForMember(dest => dest.CurrentTacticalLevel, opt => opt.MapFrom(src => src.TacticalLevel))
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.PhotoUrl));

            CreateMap<TeamCategory, TeamCategoryDto>();
        }
    }
}
