using AutoMapper;
using SportPlanner.Application.DTOs.ConceptTemplate;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings;

public class ConceptTemplateProfile : Profile
{
    public ConceptTemplateProfile()
    {
        CreateMap<ConceptTemplate, ConceptTemplateResponseDto>()
            .ForMember(dest => dest.ConceptCategoryName, 
                opt => opt.MapFrom(src => src.ConceptCategory != null ? src.ConceptCategory.Name : null))
            .ForMember(dest => dest.SportName, 
                opt => opt.MapFrom(src => src.Sport != null ? src.Sport.Name : null));

        CreateMap<ConceptTemplateCreateDto, ConceptTemplate>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Sport, opt => opt.Ignore())
            .ForMember(dest => dest.ConceptCategory, opt => opt.Ignore())
            .ForMember(dest => dest.Concepts, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

        CreateMap<ConceptTemplateUpdateDto, ConceptTemplate>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
