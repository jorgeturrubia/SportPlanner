using Microsoft.AspNetCore.Authorization;
using SportPlanner.Api.Services;
using System.Text.Json;

namespace SportPlanner.Api.Middleware
{
    /// <summary>
    /// Middleware for JWT token validation and user context enrichment
    /// </summary>
    public class JwtValidationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<JwtValidationMiddleware> _logger;

        public JwtValidationMiddleware(RequestDelegate next, ILogger<JwtValidationMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, IJwtValidationService jwtValidationService)
        {
            // Skip validation for certain paths
            if (ShouldSkipValidation(context.Request.Path))
            {
                await _next(context);
                return;
            }

            // Check if endpoint requires authorization
            var endpoint = context.GetEndpoint();
            var requiresAuth = endpoint?.Metadata?.GetMetadata<AuthorizeAttribute>() != null;

            if (!requiresAuth)
            {
                await _next(context);
                return;
            }

            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrEmpty(authHeader))
            {
                _logger.LogWarning("Missing Authorization header for protected endpoint {Path}", context.Request.Path);
                await WriteUnauthorizedResponse(context, "Missing Authorization header");
                return;
            }

            var token = ExtractTokenFromHeader(authHeader);
            if (string.IsNullOrEmpty(token))
            {
                _logger.LogWarning("Invalid Authorization header format for endpoint {Path}", context.Request.Path);
                await WriteUnauthorizedResponse(context, "Invalid Authorization header format");
                return;
            }

            // Check token format first (fast check)
            if (!jwtValidationService.IsTokenFormatValid(token))
            {
                _logger.LogWarning("Invalid token format for endpoint {Path}", context.Request.Path);
                await WriteUnauthorizedResponse(context, "Invalid token format");
                return;
            }

            // Check if token is expired (fast check)
            if (jwtValidationService.IsTokenExpired(token))
            {
                _logger.LogWarning("Expired token for endpoint {Path}", context.Request.Path);
                await WriteUnauthorizedResponse(context, "Token expired", addExpiredHeader: true);
                return;
            }

            // Full token validation
            var principal = await jwtValidationService.ValidateTokenAsync(token);
            if (principal == null)
            {
                _logger.LogWarning("Token validation failed for endpoint {Path}", context.Request.Path);
                await WriteUnauthorizedResponse(context, "Invalid token");
                return;
            }

            // Enrich the HttpContext with user information
            context.User = principal;
            
            // Add user claims to context items for easy access
            var userId = principal.FindFirst("sub")?.Value ?? principal.FindFirst("id")?.Value;
            var userEmail = principal.FindFirst("email")?.Value;
            var userRole = principal.FindFirst("role")?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                context.Items["UserId"] = userId;
                context.Items["UserEmail"] = userEmail;
                context.Items["UserRole"] = userRole;
            }

            _logger.LogDebug("JWT validation successful for user {UserId} on endpoint {Path}", userId, context.Request.Path);

            await _next(context);
        }

        private static bool ShouldSkipValidation(PathString path)
        {
            var pathValue = path.Value?.ToLowerInvariant();
            
            // Skip validation for public endpoints
            var publicPaths = new[]
            {
                "/api/auth/login",
                "/api/auth/register",
                "/api/auth/refresh",
                "/api/auth/forgot-password",
                "/api/auth/reset-password",
                "/api/auth/verify-email",
                "/swagger",
                "/health",
                "/metrics"
            };

            return pathValue != null && publicPaths.Any(pp => pathValue.StartsWith(pp));
        }

        private static string? ExtractTokenFromHeader(string authHeader)
        {
            if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                return authHeader.Substring(7);
            }

            return null;
        }

        private async Task WriteUnauthorizedResponse(HttpContext context, string message, bool addExpiredHeader = false)
        {
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";

            if (addExpiredHeader)
            {
                context.Response.Headers["Token-Expired"] = "true";
            }

            var response = new
            {
                success = false,
                message = message,
                timestamp = DateTime.UtcNow.ToString("O")
            };

            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(json);
        }
    }

    /// <summary>
    /// Extension methods for adding JWT validation middleware
    /// </summary>
    public static class JwtValidationMiddlewareExtensions
    {
        public static IApplicationBuilder UseJwtValidation(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<JwtValidationMiddleware>();
        }
    }
}