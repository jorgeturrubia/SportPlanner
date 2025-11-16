using AutoMapper;
using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings;

public class ConceptProfile : Profile
{
    public ConceptProfile()
    {
        CreateMap<ConceptInterpretationCreateDto, ConceptInterpretation>();
        CreateMap<ConceptInterpretation, ConceptInterpretationDto>();
    }
}
