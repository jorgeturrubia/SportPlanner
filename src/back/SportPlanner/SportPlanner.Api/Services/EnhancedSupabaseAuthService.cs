using Microsoft.Extensions.Logging;
using SportPlanner.Api.Controllers;
using SportPlanner.Api.Dtos;
using SportPlanner.Api.Exceptions;
using Supabase;
using Supabase.Gotrue;
using System.Security.Claims;

namespace SportPlanner.Api.Services
{
    /// <summary>
    /// Enhanced Supabase Authentication Service with improved JWT validation and token management
    /// </summary>
    public class EnhancedSupabaseAuthService : IAuthService
    {
        private readonly ILogger<EnhancedSupabaseAuthService> _logger;
        private readonly Supabase.Client _supabaseClient;
        private readonly IJwtValidationService _jwtValidationService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public EnhancedSupabaseAuthService(
            ILogger<EnhancedSupabaseAuthService> logger,
            Supabase.Client supabaseClient,
            IJwtValidationService jwtValidationService,
            IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _supabaseClient = supabaseClient;
            _jwtValidationService = jwtValidationService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<AuthResponseDto?> LoginAsync(AuthController.LoginRequest request)
        {
            _logger.LogInformation("Enhanced login attempt for {Email}", request.Email);
            try
            {
                var session = await _supabaseClient.Auth.SignIn(request.Email, request.Password);
                if (session?.User == null || session.AccessToken == null)
                {
                    _logger.LogWarning("Login failed for {Email} - invalid credentials", request.Email);
                    throw new InvalidCredentialsException();
                }

                // Validate the received token
                var isTokenValid = await _jwtValidationService.ValidateTokenAsync(session.AccessToken);
                if (isTokenValid == null)
                {
                    _logger.LogError("Login failed for {Email} - received invalid token from Supabase", request.Email);
                    throw new AuthException("INVALID_TOKEN", "Invalid authentication token", "Token de autenticación inválido");
                }

                // Extract enhanced user information from token claims
                var tokenClaims = _jwtValidationService.GetTokenClaims(session.AccessToken);
                var userMetadata = GetUserMetadataFromClaims(tokenClaims);

                var response = new AuthResponseDto
                {
                    AccessToken = session.AccessToken,
                    RefreshToken = session.RefreshToken ?? string.Empty,
                    ExpiresIn = (int)session.ExpiresIn,
                    User = new UserDto
                    {
                        Id = session.User.Id,
                        Email = session.User.Email ?? string.Empty,
                        FullName = ExtractFullNameFromMetadata(userMetadata, session.User),
                        Role = ExtractRoleFromClaims(tokenClaims),
                        OrganizationId = ExtractOrganizationIdFromClaims(tokenClaims),
                        EmailConfirmed = session.User.EmailConfirmedAt.HasValue,
                        Metadata = userMetadata
                    }
                };

                _logger.LogInformation("Enhanced login successful for {Email} with token validation", request.Email);
                return response;
            }
            catch (InvalidCredentialsException)
            {
                throw;
            }
            catch (Supabase.Gotrue.Exceptions.GotrueException ex) when (ex.Message.Contains("Invalid login credentials"))
            {
                _logger.LogWarning("Invalid login credentials for {Email}", request.Email);
                throw new InvalidCredentialsException();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during enhanced login for user {Email}", request.Email);
                throw new AuthException("LOGIN_ERROR", "Error during login", "Error al iniciar sesión");
            }
        }

        public async Task<AuthResponseDto?> RegisterAsync(AuthController.RegisterRequest request)
        {
            _logger.LogInformation("Enhanced register attempt for {Email}", request.Email);
            try
            {
                // Enhanced user metadata for registration
                var userMetadata = new Dictionary<string, object>
                {
                    { "full_name", request.FullName },
                    { "sport", request.Sport },
                    { "registration_date", DateTime.UtcNow.ToString("O") },
                    { "terms_accepted", request.AcceptTerms },
                    { "subscription_tier", "free" } // Default to free tier
                };

                var session = await _supabaseClient.Auth.SignUp(request.Email, request.Password, new SignUpOptions
                {
                    Data = userMetadata
                });

                if (session?.User == null || session.AccessToken == null)
                {
                    _logger.LogWarning("Registration failed for {Email} - user or access token null", request.Email);
                    throw new AuthException("REGISTRATION_FAILED", "Registration failed", "Error en el registro");
                }

                // Validate the received token
                var isTokenValid = await _jwtValidationService.ValidateTokenAsync(session.AccessToken);
                if (isTokenValid == null)
                {
                    _logger.LogError("Registration failed for {Email} - received invalid token from Supabase", request.Email);
                    throw new AuthException("INVALID_TOKEN", "Invalid authentication token", "Token de autenticación inválido");
                }

                var tokenClaims = _jwtValidationService.GetTokenClaims(session.AccessToken);

                var response = new AuthResponseDto
                {
                    AccessToken = session.AccessToken,
                    RefreshToken = session.RefreshToken ?? string.Empty,
                    ExpiresIn = (int)session.ExpiresIn,
                    User = new UserDto
                    {
                        Id = session.User.Id,
                        Email = session.User.Email ?? string.Empty,
                        FullName = request.FullName,
                        Role = "user", // Default role for new registrations
                        OrganizationId = string.Empty,
                        EmailConfirmed = session.User.EmailConfirmedAt.HasValue,
                        Metadata = userMetadata
                    }
                };

                _logger.LogInformation("Enhanced registration successful for {Email} with sport {Sport}", request.Email, request.Sport);
                return response;
            }
            catch (Supabase.Gotrue.Exceptions.GotrueException ex) when (ex.Message.Contains("User already registered"))
            {
                _logger.LogWarning("User already exists: {Email}", request.Email);
                throw new UserAlreadyExistsException(request.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during enhanced registration for user {Email}", request.Email);
                throw new AuthException("REGISTRATION_ERROR", "Error during registration", "Error en el registro");
            }
        }

        public async Task<AuthResponseDto?> RefreshAsync(AuthController.RefreshRequest request)
        {
            _logger.LogInformation("Enhanced refresh attempt");
            try
            {
                // Validate the current refresh token format before attempting refresh
                if (!_jwtValidationService.IsTokenFormatValid(request.RefreshToken))
                {
                    _logger.LogWarning("Refresh failed - invalid token format");
                    return null;
                }

                var session = await _supabaseClient.Auth.RefreshSession();
                if (session?.User == null || session.AccessToken == null)
                {
                    _logger.LogWarning("Refresh failed - invalid session after refresh");
                    return null;
                }

                // Validate the new token
                var isTokenValid = await _jwtValidationService.ValidateTokenAsync(session.AccessToken);
                if (isTokenValid == null)
                {
                    _logger.LogError("Refresh failed - received invalid token from Supabase");
                    return null;
                }

                var tokenClaims = _jwtValidationService.GetTokenClaims(session.AccessToken);
                var userMetadata = GetUserMetadataFromClaims(tokenClaims);

                var response = new AuthResponseDto
                {
                    AccessToken = session.AccessToken,
                    RefreshToken = session.RefreshToken ?? string.Empty,
                    ExpiresIn = (int)session.ExpiresIn,
                    User = new UserDto
                    {
                        Id = session.User.Id,
                        Email = session.User.Email ?? string.Empty,
                        FullName = ExtractFullNameFromMetadata(userMetadata, session.User),
                        Role = ExtractRoleFromClaims(tokenClaims),
                        OrganizationId = ExtractOrganizationIdFromClaims(tokenClaims),
                        EmailConfirmed = session.User.EmailConfirmedAt.HasValue,
                        Metadata = userMetadata
                    }
                };

                _logger.LogInformation("Enhanced token refresh successful");
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during enhanced token refresh");
                return null;
            }
        }

        public async Task LogoutAsync(AuthController.LogoutRequest request)
        {
            _logger.LogInformation("Enhanced logout attempt");
            try
            {
                await _supabaseClient.Auth.SignOut();
                _logger.LogInformation("Enhanced logout successful");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during enhanced logout");
            }
        }

        public async Task<ProfileDto?> GetProfileAsync()
        {
            _logger.LogInformation("Enhanced get profile attempt");
            try
            {
                // Get current user from JWT token in request
                var currentUserId = await GetCurrentUserIdFromRequest();
                if (string.IsNullOrEmpty(currentUserId))
                {
                    _logger.LogWarning("Get profile failed - no valid user in request");
                    return null;
                }

                var session = _supabaseClient.Auth.CurrentSession;
                if (session?.User == null)
                {
                    _logger.LogWarning("Get profile failed - no current session");
                    return null;
                }

                var tokenClaims = _jwtValidationService.GetTokenClaims(session.AccessToken ?? string.Empty);
                var userMetadata = GetUserMetadataFromClaims(tokenClaims);

                return new ProfileDto
                {
                    Id = session.User.Id,
                    Email = session.User.Email ?? string.Empty,
                    FullName = ExtractFullNameFromMetadata(userMetadata, session.User),
                    Role = ExtractRoleFromClaims(tokenClaims),
                    OrganizationId = ExtractOrganizationIdFromClaims(tokenClaims),
                    EmailConfirmed = session.User.EmailConfirmedAt.HasValue,
                    Metadata = userMetadata
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during enhanced get profile");
                return null;
            }
        }

        // Helper methods for extracting information from tokens and metadata
        private async Task<string?> GetCurrentUserIdFromRequest()
        {
            var authHeader = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrEmpty(authHeader))
                return null;

            return await _jwtValidationService.GetUserIdFromTokenAsync(authHeader);
        }

        private static object GetUserMetadataFromClaims(Dictionary<string, object> claims)
        {
            if (claims.TryGetValue("user_metadata", out var metadata))
                return metadata;

            // Fallback to constructing metadata from individual claims
            var fallbackMetadata = new Dictionary<string, object>();
            foreach (var claim in claims.Where(c => c.Key.StartsWith("metadata_") || c.Key == "sport" || c.Key == "subscription_tier"))
            {
                fallbackMetadata[claim.Key] = claim.Value;
            }

            return fallbackMetadata;
        }

        private static string ExtractFullNameFromMetadata(object? metadata, User user)
        {
            if (metadata is Dictionary<string, object> metadataDict && metadataDict.TryGetValue("full_name", out var fullName))
                return fullName?.ToString() ?? string.Empty;

            return user.UserMetadata?.ContainsKey("full_name") == true 
                ? user.UserMetadata["full_name"]?.ToString() ?? string.Empty 
                : string.Empty;
        }

        private static string ExtractRoleFromClaims(Dictionary<string, object> claims)
        {
            if (claims.TryGetValue("role", out var role))
                return role?.ToString() ?? "user";

            return "user"; // Default role
        }

        private static string ExtractOrganizationIdFromClaims(Dictionary<string, object> claims)
        {
            if (claims.TryGetValue("organization_id", out var orgId))
                return orgId?.ToString() ?? string.Empty;

            if (claims.TryGetValue("org_id", out var altOrgId))
                return altOrgId?.ToString() ?? string.Empty;

            return string.Empty;
        }

        // Original interface methods delegation
        public Task<bool> ForgotPasswordAsync(string email) => throw new NotImplementedException("Use original SupabaseAuthService for this method");
        public Task<bool> ResetPasswordAsync(string token, string newPassword) => throw new NotImplementedException("Use original SupabaseAuthService for this method");
        public Task<bool> SendEmailVerificationAsync() => throw new NotImplementedException("Use original SupabaseAuthService for this method");
        public Task<bool> VerifyEmailAsync(string token) => throw new NotImplementedException("Use original SupabaseAuthService for this method");
        public Task<ProfileDto?> UpdateProfileAsync(UpdateProfileDto profile) => throw new NotImplementedException("Use original SupabaseAuthService for this method");
        public Task<bool> ChangePasswordAsync(ChangePasswordDto changePassword) => throw new NotImplementedException("Use original SupabaseAuthService for this method");
    }
}