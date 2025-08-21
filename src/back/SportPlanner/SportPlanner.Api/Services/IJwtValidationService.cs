using System.Security.Claims;

namespace SportPlanner.Api.Services
{
    public interface IJwtValidationService
    {
        /// <summary>
        /// Validates a Supabase JWT token and extracts claims
        /// </summary>
        /// <param name="token">The JWT token to validate</param>
        /// <returns>Claims principal if valid, null if invalid</returns>
        Task<ClaimsPrincipal?> ValidateTokenAsync(string token);

        /// <summary>
        /// Validates token and extracts user ID
        /// </summary>
        /// <param name="token">The JWT token to validate</param>
        /// <returns>User ID if valid, null if invalid</returns>
        Task<string?> GetUserIdFromTokenAsync(string token);

        /// <summary>
        /// Checks if a token is expired
        /// </summary>
        /// <param name="token">The JWT token to check</param>
        /// <returns>True if expired, false if still valid</returns>
        bool IsTokenExpired(string token);

        /// <summary>
        /// Validates token format and signature without full validation
        /// </summary>
        /// <param name="token">The JWT token to validate</param>
        /// <returns>True if format and signature are valid</returns>
        bool IsTokenFormatValid(string token);

        /// <summary>
        /// Extracts claims from token without full validation
        /// </summary>
        /// <param name="token">The JWT token</param>
        /// <returns>Dictionary of claims</returns>
        Dictionary<string, object> GetTokenClaims(string token);
    }
}