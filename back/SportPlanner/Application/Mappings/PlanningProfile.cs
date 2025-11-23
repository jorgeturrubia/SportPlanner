using AutoMapper;
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
            CreateMap<PlanConcept, PlanConceptDto>().ReverseMap();
        }
    }
}
