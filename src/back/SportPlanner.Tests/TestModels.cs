// Modelos temporales para tests hasta que se implementen los reales
using SportPlanner.Api.Dtos;

namespace SportPlanner.Tests;

public class RegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Sport { get; set; } = string.Empty;
}

public class LoginRequest  
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}