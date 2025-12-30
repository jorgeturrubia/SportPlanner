using System.Text.Json;
using SportPlanner.Models;

namespace SportPlanner.Services;

/// <summary>
/// Implementación del servicio de administración de Supabase.
/// Utiliza HttpClient para llamar a la API de Admin de Supabase.
/// </summary>
public class SupabaseAdminService : ISupabaseAdminService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<SupabaseAdminService> _logger;

    public SupabaseAdminService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<SupabaseAdminService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Actualiza el rol del usuario en app_metadata de Supabase.
    /// Endpoint: POST https://{project-ref}.supabase.co/auth/v1/admin/users/{userId}
    /// </summary>
    public async Task<bool> UpdateUserRoleAsync(string userId, string role)
    {
        try
        {
            var supabaseUrl = _configuration.GetValue<string>("Supabase:Url");
            var serviceRoleKey = _configuration.GetValue<string>("Supabase:ServiceRoleKey");

            if (string.IsNullOrEmpty(supabaseUrl) || string.IsNullOrEmpty(serviceRoleKey))
            {
                _logger.LogError("Supabase URL or ServiceRoleKey not configured");
                return false;
            }

            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning("Cannot update role: userId is null or empty");
                return false;
            }

            // Validar que el rol es válido
            var validRoles = new[] { UserRoles.AdminOwner, UserRoles.Coach, UserRoles.NoRole };
            if (!validRoles.Contains(role))
            {
                _logger.LogWarning("Invalid role specified: {Role}", role);
                return false;
            }

            // Construir URL del endpoint de admin
            var adminUrl = $"{supabaseUrl.TrimEnd('/')}/auth/v1/admin/users/{userId}";

            // Configurar header de autorización con SERVICE_ROLE_KEY
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {serviceRoleKey}");
            _httpClient.DefaultRequestHeaders.Add("apikey", serviceRoleKey);

            // Construir payload con app_metadata
            var payload = new
            {
                app_metadata = new
                {
                    role = role
                }
            };

            var jsonContent = JsonSerializer.Serialize(payload);
            var content = new StringContent(jsonContent, System.Text.Encoding.UTF8, "application/json");

            // Realizar la llamada PUT
            var response = await _httpClient.PutAsync(adminUrl, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                _logger.LogError(
                    "Failed to update user role in Supabase. Status: {StatusCode}, Body: {ErrorBody}",
                    response.StatusCode,
                    errorBody);
                return false;
            }

            _logger.LogInformation("Successfully updated role for user {UserId} to {Role}", userId, role);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception occurred while updating user role for {UserId}", userId);
            return false;
        }
    }
}
