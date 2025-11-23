using AutoMapper;
using SportPlanner.Application.DTOs.Team;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings
{
    public class TeamProfile : Profile
    {
        public TeamProfile()
        {
            CreateMap<Team, TeamDto>();
            CreateMap<TeamCategory, TeamCategoryDto>();
        }
    }
}
