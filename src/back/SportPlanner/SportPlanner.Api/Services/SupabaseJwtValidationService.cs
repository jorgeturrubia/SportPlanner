using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace SportPlanner.Api.Services
{
    public class SupabaseJwtValidationService : IJwtValidationService
    {
        private readonly ILogger<SupabaseJwtValidationService> _logger;
        private readonly IConfiguration _configuration;
        private readonly JwtSecurityTokenHandler _tokenHandler;
        private readonly TokenValidationParameters _validationParameters;

        public SupabaseJwtValidationService(
            ILogger<SupabaseJwtValidationService> logger,
            IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
            _tokenHandler = new JwtSecurityTokenHandler();
            
            // Configure token validation parameters for Supabase
            _validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"],
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(_configuration["Supabase:JwtSecret"] 
                        ?? throw new InvalidOperationException("Supabase JWT Secret not configured"))),
                ClockSkew = TimeSpan.FromMinutes(1),
                RequireExpirationTime = true,
                RequireSignedTokens = true
            };
        }

        public async Task<ClaimsPrincipal?> ValidateTokenAsync(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                _logger.LogWarning("Token validation failed: token is null or empty");
                return null;
            }

            try
            {
                // Remove Bearer prefix if present
                if (token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    token = token.Substring(7);
                }

                // Validate the token
                var principal = _tokenHandler.ValidateToken(token, _validationParameters, out SecurityToken validatedToken);
                
                // Additional Supabase-specific validations
                if (validatedToken is JwtSecurityToken jwtToken)
                {
                    // Verify it's a JWT token
                    if (!jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                    {
                        _logger.LogWarning("Token validation failed: invalid algorithm {Algorithm}", jwtToken.Header.Alg);
                        return null;
                    }

                    // Verify Supabase-specific claims
                    var roleClaim = principal.FindFirst("role")?.Value;
                    if (string.IsNullOrEmpty(roleClaim))
                    {
                        _logger.LogWarning("Token validation failed: missing role claim");
                        return null;
                    }

                    _logger.LogDebug("Token validated successfully for user {UserId} with role {Role}", 
                        principal.FindFirst("sub")?.Value, roleClaim);
                }

                return await Task.FromResult(principal);
            }
            catch (SecurityTokenExpiredException ex)
            {
                _logger.LogWarning("Token validation failed: token expired - {Message}", ex.Message);
                return null;
            }
            catch (SecurityTokenInvalidSignatureException ex)
            {
                _logger.LogWarning("Token validation failed: invalid signature - {Message}", ex.Message);
                return null;
            }
            catch (SecurityTokenException ex)
            {
                _logger.LogWarning("Token validation failed: {Message}", ex.Message);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during token validation");
                return null;
            }
        }

        public async Task<string?> GetUserIdFromTokenAsync(string token)
        {
            var principal = await ValidateTokenAsync(token);
            return principal?.FindFirst("sub")?.Value ?? principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        public bool IsTokenExpired(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return true;

            try
            {
                // Remove Bearer prefix if present
                if (token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    token = token.Substring(7);
                }

                var jwtToken = _tokenHandler.ReadJwtToken(token);
                return jwtToken.ValidTo <= DateTime.UtcNow;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error checking token expiration");
                return true;
            }
        }

        public bool IsTokenFormatValid(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return false;

            try
            {
                // Remove Bearer prefix if present
                if (token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    token = token.Substring(7);
                }

                // Check if it's a valid JWT format (header.payload.signature)
                var parts = token.Split('.');
                if (parts.Length != 3)
                    return false;

                // Try to read the token (this validates format and signature)
                var jwtToken = _tokenHandler.ReadJwtToken(token);
                return jwtToken != null;
            }
            catch (Exception ex)
            {
                _logger.LogDebug(ex, "Token format validation failed");
                return false;
            }
        }

        public Dictionary<string, object> GetTokenClaims(string token)
        {
            var claims = new Dictionary<string, object>();

            if (string.IsNullOrWhiteSpace(token))
                return claims;

            try
            {
                // Remove Bearer prefix if present
                if (token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    token = token.Substring(7);
                }

                var jwtToken = _tokenHandler.ReadJwtToken(token);
                
                foreach (var claim in jwtToken.Claims)
                {
                    // Handle special claim types
                    if (claim.Type == "exp" || claim.Type == "iat" || claim.Type == "nbf")
                    {
                        if (long.TryParse(claim.Value, out long timestamp))
                        {
                            claims[claim.Type] = DateTimeOffset.FromUnixTimeSeconds(timestamp).DateTime;
                        }
                    }
                    else if (claim.Type == "user_metadata" || claim.Type == "app_metadata")
                    {
                        // Try to parse JSON metadata
                        try
                        {
                            var metadata = JsonSerializer.Deserialize<Dictionary<string, object>>(claim.Value);
                            claims[claim.Type] = metadata ?? new Dictionary<string, object>();
                        }
                        catch
                        {
                            claims[claim.Type] = claim.Value;
                        }
                    }
                    else
                    {
                        claims[claim.Type] = claim.Value;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error extracting token claims");
            }

            return claims;
        }
    }
}