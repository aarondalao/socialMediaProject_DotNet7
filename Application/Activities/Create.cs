/*
    CQRS (Command Query Responsibility Segregation ) : Command
    * Does something
    * modifies state
    * Should NOT return a value
*/ 
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest{
            public Activity Activity {get; set;}
        }

        public class Handler : IRequestHandler<Command>
        {
        private readonly DataContext _context;
            public Handler(DataContext context)
            {
            _context = context;

            }

            // method to create a new activity
            // TODO: error checking and validation for bad inputs
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // add the data in memory
                _context.Activities.Add(request.Activity);

                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}