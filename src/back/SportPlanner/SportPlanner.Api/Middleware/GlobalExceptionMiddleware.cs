using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using SportPlanner.Api.Exceptions;

namespace SportPlanner.Api.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            // Set default error response
            var response = new ErrorResponse
            {
                Message = "An unexpected error occurred",
                Code = "INTERNAL_ERROR"
            };

            // Set default status code
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            // Handle specific exception types
            switch (exception)
            {
                case AuthException authEx:
                    response.Message = authEx.UserMessage;
                    response.Code = authEx.ErrorCode;
                    context.Response.StatusCode = GetStatusCodeForAuthException(authEx);
                    _logger.LogWarning("AuthException: {Code} - {Message}", authEx.ErrorCode, authEx.UserMessage);
                    break;

                case ArgumentException argEx:
                    response.Message = argEx.Message;
                    response.Code = "INVALID_ARGUMENT";
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    _logger.LogWarning("ArgumentException: {Message}", argEx.Message);
                    break;

                case InvalidOperationException invalidOpEx:
                    response.Message = invalidOpEx.Message;
                    response.Code = "INVALID_OPERATION";
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    _logger.LogWarning("InvalidOperationException: {Message}", invalidOpEx.Message);
                    break;

                default:
                    response.Message = "An unexpected error occurred";
                    response.Code = "INTERNAL_ERROR";
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
                    break;
            }

            // Serialize response
            var jsonResponse = JsonSerializer.Serialize(response);
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(jsonResponse);
        }

        private int GetStatusCodeForAuthException(AuthException exception)
        {
            // Map specific auth exceptions to HTTP status codes
            switch (exception)
            {
                case InvalidCredentialsException:
                    return (int)HttpStatusCode.Unauthorized;
                case UserAlreadyExistsException:
                    return (int)HttpStatusCode.BadRequest;
                case InvalidTokenException:
                    return (int)HttpStatusCode.BadRequest;
                case WeakPasswordException:
                    return (int)HttpStatusCode.BadRequest;
                case EmailNotVerifiedException:
                    return (int)HttpStatusCode.Forbidden;
                default:
                    return (int)HttpStatusCode.BadRequest;
            }
        }
    }

    public class ErrorResponse
    {
        public string Message { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public object? Details { get; set; }
    }
}