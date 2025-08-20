using FluentValidation;
using SportPlanner.Api.Controllers;

namespace SportPlanner.Api.Validators
{
    public class LoginRequestValidator : AbstractValidator<AuthController.LoginRequest>
    {
        public LoginRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("El email es obligatorio")
                .EmailAddress().WithMessage("El formato del email no es válido")
                .MaximumLength(255).WithMessage("El email no puede exceder los 255 caracteres");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("La contraseña es obligatoria")
                .MinimumLength(8).WithMessage("La contraseña debe tener al menos 8 caracteres");
        }
    }
}
