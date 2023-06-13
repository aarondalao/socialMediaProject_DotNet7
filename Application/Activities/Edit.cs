using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        // validation class
        public class CommandValidator : AbstractValidator<Command>{
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public IMapper _Mapper { get; }
            public Handler(DataContext context, IMapper mapper)
            {
                _Mapper = mapper;
                _context = context;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Activity.Id);
                
                // this can be repeated, but it will get tedious once
                // activity.Title = request.Activity.Title ?? activity.Title;
                // activity.Date = request.Activity.Date;
                // activity.Description = request.Activity.Description ?? activity.Description;
                // activity.Category = request.Activity.Category ?? activity.Category;
                // activity.City = request.Activity.City ?? activity.City;
                // activity.Venue = request.Activity.Venue ?? activity.Venue;

                _Mapper.Map(request.Activity, activity);

                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}