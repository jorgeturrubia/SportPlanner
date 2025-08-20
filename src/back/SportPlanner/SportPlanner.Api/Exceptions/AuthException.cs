using System;

namespace SportPlanner.Api.Exceptions
{
    public class AuthException : Exception
    {
        public string ErrorCode { get; }
        public string UserMessage { get; }

        public AuthException(string errorCode, string message, string userMessage) : base(message)
        {
            ErrorCode = errorCode;
            UserMessage = userMessage;
        }

        public AuthException(string errorCode, string message, string userMessage, Exception innerException) : base(message, innerException)
        {
            ErrorCode = errorCode;
            UserMessage = userMessage;
        }
    }

    public class InvalidCredentialsException : AuthException
    {
        public InvalidCredentialsException() : base("INVALID_CREDENTIALS", "Invalid email or password", "Credenciales incorrectas")
        {
        }
    }

    public class UserAlreadyExistsException : AuthException
    {
        public UserAlreadyExistsException(string email) : base("USER_EXISTS", $"User with email {email} already exists", "Ya existe una cuenta con este email")
        {
        }
    }

    public class InvalidTokenException : AuthException
    {
        public InvalidTokenException() : base("INVALID_TOKEN", "Invalid or expired token", "Token inválido o expirado")
        {
        }
    }

    public class WeakPasswordException : AuthException
    {
        public WeakPasswordException() : base("WEAK_PASSWORD", "Password does not meet requirements", "La contraseña no cumple con los requisitos de seguridad")
        {
        }
    }

    public class EmailNotVerifiedException : AuthException
    {
        public EmailNotVerifiedException() : base("EMAIL_NOT_VERIFIED", "Email not verified", "Email no verificado")
        {
        }
    }
}