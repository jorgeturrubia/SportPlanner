using FluentValidation;
using SportPlanner.Api.Controllers;
using System.Text.RegularExpressions;

namespace SportPlanner.Api.Validators
{
    public class RegisterRequestValidator : AbstractValidator<AuthController.RegisterRequest>
    {
        public RegisterRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("El email es obligatorio")
                .EmailAddress().WithMessage("El formato del email no es válido")
                .MaximumLength(255).WithMessage("El email no puede exceder los 255 caracteres");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("La contraseña es obligatoria")
                .MinimumLength(8).WithMessage("La contraseña debe tener al menos 8 caracteres")
                .Must(BeAValidPassword).WithMessage("La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial");

            RuleFor(x => x.ConfirmPassword)
                .NotEmpty().WithMessage("La confirmación de contraseña es obligatoria")
                .Equal(x => x.Password).WithMessage("Las contraseñas no coinciden");

            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("El nombre completo es obligatorio")
                .MinimumLength(2).WithMessage("El nombre debe tener al menos 2 caracteres")
                .MaximumLength(100).WithMessage("El nombre no puede exceder los 100 caracteres")
                .Matches(@"^[a-zA-ZÀ-ÿ\s\-']+$").WithMessage("El nombre solo puede contener letras, espacios, guiones y apóstrofes");

            RuleFor(x => x.Sport)
                .NotEmpty().WithMessage("El deporte es obligatorio")
                .MaximumLength(50).WithMessage("El deporte no puede exceder los 50 caracteres");

            RuleFor(x => x.AcceptTerms)
                .Must(x => x == true).WithMessage("Debes aceptar los términos y condiciones");
        }

        private bool BeAValidPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
                return false;

            // At least one uppercase, one lowercase, one digit, and one special character
            var hasUpperCase = Regex.IsMatch(password, @"[A-Z]");
            var hasLowerCase = Regex.IsMatch(password, @"[a-z]");
            var hasDigit = Regex.IsMatch(password, @"[0-9]");
            var hasSpecialChar = Regex.IsMatch(password, @"[@$!%*?&]");

            return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
        }
    }
}
