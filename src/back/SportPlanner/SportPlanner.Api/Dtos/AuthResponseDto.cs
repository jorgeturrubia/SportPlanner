namespace SportPlanner.Api.Dtos
{
    public class AuthResponseDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public int ExpiresIn { get; set; } 
        public string TokenType { get; set; } = "Bearer";
        public UserDto? User { get; set; }
    }

    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string OrganizationId { get; set; } = string.Empty;
        public bool EmailConfirmed { get; set; }
        public object? Metadata { get; set; }
    }
}
