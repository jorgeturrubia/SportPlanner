using AutoMapper;
using SportPlanner.Application.DTOs;
using SportPlanner.Application.DTOs.Planning;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings
{
    public class PlanningProfile : Profile
    {
        public PlanningProfile()
        {
            CreateMap<Planning, PlanningDto>().ReverseMap();
            CreateMap<Planning, CreatePlanningDto>().ReverseMap();
            CreateMap<Planning, UpdatePlanningDto>().ReverseMap();
            CreateMap<PlanConcept, SportPlanner.Application.DTOs.Planning.PlanConceptDto>().ReverseMap();

            CreateMap<MethodologicalItinerary, MethodologicalItineraryDto>()
                .ForMember(dest => dest.SportName, opt => opt.MapFrom(src => src.Sport != null ? src.Sport.Name : null));

            CreateMap<PlanningTemplate, PlanningTemplateSimpleDto>()
                .ForMember(dest => dest.TeamCategoryName, opt => opt.MapFrom(src => src.TeamCategory != null ? src.TeamCategory.Name : null));
        }
    }
}

