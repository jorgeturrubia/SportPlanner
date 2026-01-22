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

            CreateMap<MethodologicalItinerary, MarketplaceItemDto>()
                .ForMember(dest => dest.ItemType, opt => opt.MapFrom(_ => "itinerary"))
                .ForMember(dest => dest.SportName, opt => opt.MapFrom(src => src.Sport != null ? src.Sport.Name : null))
                .ForMember(dest => dest.ElementCount, opt => opt.MapFrom(src => src.PlanningTemplates.Count));

            CreateMap<PlanningTemplate, MarketplaceItemDto>()
                .ForMember(dest => dest.ItemType, opt => opt.MapFrom(_ => "template"))
                .ForMember(dest => dest.SportName, opt => opt.MapFrom(src => src.TeamCategory != null && src.TeamCategory.Sport != null ? src.TeamCategory.Sport.Name : null))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.TeamCategory != null ? src.TeamCategory.Name : null))
                .ForMember(dest => dest.ElementCount, opt => opt.MapFrom(src => src.TemplateConcepts.Count));

            CreateMap<SportConcept, MarketplaceItemDto>()
                .ForMember(dest => dest.ItemType, opt => opt.MapFrom(_ => "concept"))
                .ForMember(dest => dest.SportName, opt => opt.MapFrom(src => src.Sport != null ? src.Sport.Name : null))
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.ConceptCategoryId))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.ConceptCategory != null ? src.ConceptCategory.Name : null))
                .ForMember(dest => dest.ParentCategoryId, opt => opt.MapFrom(src => src.ConceptCategory != null ? src.ConceptCategory.ParentId : null))
                .ForMember(dest => dest.ElementCount, opt => opt.MapFrom(src => src.Exercises.Count));

            CreateMap<Exercise, MarketplaceItemDto>()
                .ForMember(dest => dest.ItemType, opt => opt.MapFrom(_ => "exercise"))
                .ForMember(dest => dest.SportName, opt => opt.MapFrom(src => src.Sport != null ? src.Sport.Name : null))
                .ForMember(dest => dest.ElementCount, opt => opt.MapFrom(src => src.Concepts.Count));

            CreateMap<MethodologicalItinerary, ItineraryDetailDto>()
                .ForMember(dest => dest.SportName, opt => opt.MapFrom(src => src.Sport != null ? src.Sport.Name : null))
                .ForMember(dest => dest.Templates, opt => opt.MapFrom(src => src.PlanningTemplates.OrderBy(t => t.Id)))
                .ForMember(dest => dest.UniqueConcepts, opt => opt.MapFrom(src => 
                    src.PlanningTemplates
                        .SelectMany(t => t.TemplateConcepts)
                        .Select(tc => tc.SportConcept != null ? tc.SportConcept.Name : null)
                        .Where(name => name != null)
                        .Distinct()
                        .OrderBy(name => name)
                        .ToList()));

            CreateMap<PlanningTemplate, TemplateDetailDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.TeamCategory != null ? src.TeamCategory.Name : null))
                .ForMember(dest => dest.Concepts, opt => opt.MapFrom(src => src.TemplateConcepts.Select(tc => tc.SportConcept != null ? tc.SportConcept.Name : null).Where(n => n != null)));
        }
    }
}

