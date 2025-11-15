using Microsoft.AspNetCore.Mvc;
using SportPlanner.Models;
using AutoMapper;
using SportPlanner.Application.DTOs;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;
    private readonly IMapper _mapper;

    public WeatherForecastController(ILogger<WeatherForecastController> logger, IMapper mapper)
    {
        _logger = logger;
        _mapper = mapper;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecastDto> Get()
    {
        var entities = Enumerable.Range(1, 5).Select(index => new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            Summaries[Random.Shared.Next(Summaries.Length)]
        ));

        // Map to DTOs for API responses
        return _mapper.Map<IEnumerable<WeatherForecastDto>>(entities);
    }
}
