using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace {{PROJECT_NAMESPACE}}.Middleware;

/// <summary>
/// Custom JWT Authentication Middleware with enhanced security features
/// Supports multiple JWT providers (Supabase, Auth0, Custom, etc.)
/// </summary>
public class JwtAuthenticationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<JwtAuthenticationMiddleware> _logger;
    private readonly JwtSecurityTokenHandler _tokenHandler;
    private readonly JwtAuthenticationOptions _options;

    public JwtAuthenticationMiddleware(
        RequestDelegate next,
        ILogger<JwtAuthenticationMiddleware> logger,
        IOptions<JwtAuthenticationOptions> options)
    {
        _next = next;
        _logger = logger;
        _tokenHandler = new JwtSecurityTokenHandler();
        _options = options.Value;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var token = ExtractTokenFromRequest(context.Request);

        if (!string.IsNullOrEmpty(token))
        {
            await ValidateAndSetUserAsync(context, token);
        }

        await _next(context);
    }

    private string? ExtractTokenFromRequest(HttpRequest request)
    {
        // Check Authorization header
        if (request.Headers.TryGetValue("Authorization", out var authHeader))
        {
            var authValue = authHeader.ToString();
            if (authValue.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                return authValue[7..]; // Remove "Bearer " prefix
            }
        }

        // Check for token in cookies (for web apps)
        if (request.Cookies.TryGetValue(_options.CookieName, out var cookieToken))
        {
            return cookieToken;
        }

        // Check query parameter (less secure, only for specific scenarios)
        if (_options.AllowQueryParameter && request.Query.TryGetValue("token", out var queryToken))
        {
            return queryToken.ToString();
        }

        return null;
    }

    private async Task ValidateAndSetUserAsync(HttpContext context, string token)
    {
        try
        {
            // Validate token format
            if (!_tokenHandler.CanReadToken(token))
            {
                _logger.LogWarning("Invalid JWT token format from IP: {RemoteIpAddress}", 
                    context.Connection.RemoteIpAddress);
                return;
            }

            var validationParameters = await GetTokenValidationParametersAsync();
            
            // Validate the token
            var principal = _tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
            
            // Additional custom validations
            if (!await ValidateCustomClaimsAsync(principal, validatedToken))
            {
                _logger.LogWarning("Custom token validation failed for user: {UserId}", 
                    principal.FindFirst("sub")?.Value);
                return;
            }

            // Set the user context
            context.User = principal;
            
            // Optional: Add user info to request context
            await EnrichUserContextAsync(context, principal);

            _logger.LogDebug("Successfully authenticated user: {UserId}", 
                principal.FindFirst("sub")?.Value);
        }
        catch (SecurityTokenValidationException ex)
        {
            _logger.LogWarning(ex, "JWT token validation failed from IP: {RemoteIpAddress}", 
                context.Connection.RemoteIpAddress);
        }
        catch (SecurityTokenException ex)
        {
            _logger.LogWarning(ex, "JWT token security exception from IP: {RemoteIpAddress}", 
                context.Connection.RemoteIpAddress);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during JWT validation from IP: {RemoteIpAddress}", 
                context.Connection.RemoteIpAddress);
        }
    }

    private async Task<TokenValidationParameters> GetTokenValidationParametersAsync()
    {
        var parameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            ValidateIssuer = _options.ValidateIssuer,
            ValidateAudience = _options.ValidateAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(_options.ClockSkewMinutes),
            RequireExpirationTime = true,
            RequireSignedTokens = true
        };

        // Configure based on provider type
        switch (_options.Provider)
        {
            case JwtProvider.Supabase:
                parameters.IssuerSigningKey = await GetSupabaseSigningKeyAsync();
                parameters.ValidIssuer = _options.Supabase.Issuer;
                parameters.ValidAudiences = _options.Supabase.ValidAudiences;
                break;

            case JwtProvider.Auth0:
                parameters.IssuerSigningKey = await GetAuth0SigningKeyAsync();
                parameters.ValidIssuer = _options.Auth0.Domain;
                parameters.ValidAudiences = _options.Auth0.ValidAudiences;
                break;

            case JwtProvider.Custom:
                var key = Encoding.UTF8.GetBytes(_options.Custom.SecretKey);
                parameters.IssuerSigningKey = new SymmetricSecurityKey(key);
                parameters.ValidIssuer = _options.Custom.Issuer;
                parameters.ValidAudiences = _options.Custom.ValidAudiences;
                break;

            default:
                throw new NotSupportedException($"JWT Provider '{_options.Provider}' is not supported");
        }

        return parameters;
    }

    private async Task<SecurityKey> GetSupabaseSigningKeyAsync()
    {
        // For Supabase, we typically get the JWT secret from configuration
        // In production, this should be retrieved securely from environment variables
        var secret = _options.Supabase.JwtSecret;
        if (string.IsNullOrEmpty(secret))
        {
            throw new InvalidOperationException("Supabase JWT secret is not configured");
        }

        return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
    }

    private async Task<SecurityKey> GetAuth0SigningKeyAsync()
    {
        // For Auth0, we need to fetch the public key from the JWKS endpoint
        // This implementation would cache the keys and refresh them periodically
        var httpClient = new HttpClient();
        var jwksUri = $"{_options.Auth0.Domain}.well-known/jwks.json";
        
        try
        {
            var jwksResponse = await httpClient.GetStringAsync(jwksUri);
            var jwks = JsonSerializer.Deserialize<JsonWebKeySet>(jwksResponse);
            
            // Return the first key for simplicity (in production, match by kid)
            return jwks.Keys.First();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve Auth0 JWKS from {JwksUri}", jwksUri);
            throw;
        }
    }

    private async Task<bool> ValidateCustomClaimsAsync(ClaimsPrincipal principal, SecurityToken validatedToken)
    {
        // Custom validation logic based on your requirements
        
        // Example: Validate user is active
        var userId = principal.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return false;
        }

        // Example: Check if user exists in database and is active
        // This would typically use a user service or repository
        {{#VALIDATE_USER_EXISTS}}
        var userService = context.RequestServices.GetRequiredService<IUserService>();
        var user = await userService.GetUserByIdAsync(userId);
        
        if (user == null || !user.IsActive)
        {
            _logger.LogWarning("Authentication failed: User {UserId} not found or inactive", userId);
            return false;
        }
        {{/VALIDATE_USER_EXISTS}}

        // Example: Validate custom claims
        var role = principal.FindFirst("role")?.Value;
        if (!_options.AllowedRoles.Contains(role))
        {
            _logger.LogWarning("Authentication failed: User {UserId} has invalid role {Role}", userId, role);
            return false;
        }

        return true;
    }

    private async Task EnrichUserContextAsync(HttpContext context, ClaimsPrincipal principal)
    {
        // Add additional user information to the context
        var userId = principal.FindFirst("sub")?.Value;
        var email = principal.FindFirst("email")?.Value;
        var role = principal.FindFirst("role")?.Value;

        // Store user info in HttpContext.Items for easy access in controllers
        context.Items["UserId"] = userId;
        context.Items["UserEmail"] = email;
        context.Items["UserRole"] = role;

        // Optional: Load additional user data from database
        {{#ENRICH_USER_CONTEXT}}
        var userService = context.RequestServices.GetRequiredService<IUserService>();
        var userProfile = await userService.GetUserProfileAsync(userId);
        context.Items["UserProfile"] = userProfile;
        {{/ENRICH_USER_CONTEXT}}
    }
}

/// <summary>
/// Configuration options for JWT Authentication Middleware
/// </summary>
public class JwtAuthenticationOptions
{
    public const string SectionName = "JwtAuthentication";

    public JwtProvider Provider { get; set; } = JwtProvider.Custom;
    public bool ValidateIssuer { get; set; } = true;
    public bool ValidateAudience { get; set; } = true;
    public int ClockSkewMinutes { get; set; } = 5;
    public string CookieName { get; set; } = "auth-token";
    public bool AllowQueryParameter { get; set; } = false;
    public string[] AllowedRoles { get; set; } = Array.Empty<string>();

    public SupabaseOptions Supabase { get; set; } = new();
    public Auth0Options Auth0 { get; set; } = new();
    public CustomJwtOptions Custom { get; set; } = new();

    public class SupabaseOptions
    {
        public string Issuer { get; set; } = string.Empty;
        public string JwtSecret { get; set; } = string.Empty;
        public string[] ValidAudiences { get; set; } = Array.Empty<string>();
    }

    public class Auth0Options
    {
        public string Domain { get; set; } = string.Empty;
        public string[] ValidAudiences { get; set; } = Array.Empty<string>();
    }

    public class CustomJwtOptions
    {
        public string SecretKey { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public string[] ValidAudiences { get; set; } = Array.Empty<string>();
    }
}

public enum JwtProvider
{
    Custom,
    Supabase,
    Auth0
}

/// <summary>
/// Extension methods for JWT Authentication Middleware registration
/// </summary>
public static class JwtAuthenticationExtensions
{
    public static IServiceCollection AddJwtAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<JwtAuthenticationOptions>(
            configuration.GetSection(JwtAuthenticationOptions.SectionName));

        return services;
    }

    public static IApplicationBuilder UseJwtAuthentication(this IApplicationBuilder app)
    {
        return app.UseMiddleware<JwtAuthenticationMiddleware>();
    }
}

/// <summary>
/// Extension methods for easy access to user information in controllers
/// </summary>
public static class HttpContextExtensions
{
    public static string? GetUserId(this HttpContext context)
        => context.Items["UserId"]?.ToString();

    public static string? GetUserEmail(this HttpContext context)
        => context.Items["UserEmail"]?.ToString();

    public static string? GetUserRole(this HttpContext context)
        => context.Items["UserRole"]?.ToString();

    {{#ENRICH_USER_CONTEXT}}
    public static T? GetUserProfile<T>(this HttpContext context) where T : class
        => context.Items["UserProfile"] as T;
    {{/ENRICH_USER_CONTEXT}}
}

/// <summary>
/// Extension methods for ClaimsPrincipal
/// </summary>
public static class ClaimsPrincipalExtensions
{
    public static string? GetUserId(this ClaimsPrincipal principal)
        => principal.FindFirst("sub")?.Value ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    public static string? GetEmail(this ClaimsPrincipal principal)
        => principal.FindFirst("email")?.Value ?? principal.FindFirst(ClaimTypes.Email)?.Value;

    public static string? GetRole(this ClaimsPrincipal principal)
        => principal.FindFirst("role")?.Value ?? principal.FindFirst(ClaimTypes.Role)?.Value;
}