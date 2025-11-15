using AutoMapper;
using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings;

public class WeatherForecastProfile : Profile
{
    public WeatherForecastProfile()
    {
        CreateMap<WeatherForecast, WeatherForecastDto>().ReverseMap();
    }
}
