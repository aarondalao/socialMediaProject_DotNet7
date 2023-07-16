using Application.Core;
using FluentValidation;
using MediatR;

namespace Application.Profiles
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Profile profile { get; set; }
        }

        // validation class 
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.profile).SetValidator(new ProfileValidator());
            }
        }
    }
}