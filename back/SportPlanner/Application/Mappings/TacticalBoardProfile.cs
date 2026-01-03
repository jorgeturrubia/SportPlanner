using AutoMapper;
using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings
{
    public class TacticalBoardProfile : Profile
    {
        public TacticalBoardProfile()
        {
            CreateMap<TacticalBoard, TacticalBoardDto>();
            CreateMap<CreateTacticalBoardDto, TacticalBoard>();
            CreateMap<UpdateTacticalBoardDto, TacticalBoard>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
