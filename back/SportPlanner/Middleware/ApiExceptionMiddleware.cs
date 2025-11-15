using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace SportPlanner.Middleware
{
    public class ApiExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ApiExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ApiExceptionMiddleware(RequestDelegate next, ILogger<ApiExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);

                // Normalize some error status codes to a JSON payload if there is no content and response hasn't started
                if (context.Response.StatusCode >= 400 && context.Response.ContentLength == null && !context.Response.HasStarted)
                {
                    var code = context.Response.StatusCode;
                    var result = JsonSerializer.Serialize(new { success = false, status = code, error = new { message = ReasonPhrase(code) } });
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(result);
                }
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception caught by middleware");
                if (!context.Response.HasStarted)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "application/json";
                    var error = new
                    {
                        success = false,
                        status = context.Response.StatusCode,
                        error = new
                        {
                            message = "An unexpected error occurred.",
                            detail = _env.IsDevelopment() ? ex.ToString() : null
                        }
                    };
                    var result = JsonSerializer.Serialize(error, new JsonSerializerOptions { DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull });
                    await context.Response.WriteAsync(result);
                }
            }
        }

        private static string ReasonPhrase(int code)
        {
            return code switch
            {
                400 => "Bad Request",
                401 => "Unauthorized",
                403 => "Forbidden",
                404 => "Not Found",
                500 => "Internal Server Error",
                _ => "Error"
            };
        }
    }
}
