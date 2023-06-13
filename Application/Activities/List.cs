/*
    CQRS (Command Query Responsibility Segregation ) : Query
    * answers a question/request
    * does not modify state
    * Should always return value

*/
using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {


        public class Query : IRequest<Result<List<Activity>>> { }

        public class Handler : IRequestHandler<Query, Result<List<Activity>>>
        {

            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }
            
            // CancellationToken is used to handle cancelled request from a user either because the request is taking its time.
            // CancellationToken is provided by default when creating the request handler 
            // this is helpful if the data being fetched will take a long time for the user to receive or a fail-safe action 
            // when internal connection error is occured. 
            public async Task<Result<List<Activity>>> Handle(Query request,CancellationToken cancellationToken)
            {
                return Result<List<Activity>>.Success(await _context.Activities.ToListAsync());
            }
        }
    }
}