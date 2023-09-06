/*
    CQRS (Command Query Responsibility Segregation ) : Query
    * answers a question/request
    * does not modify state
    * Should always return value

*/
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {


        public class Query : IRequest<Result<PagedList<ActivityDto>>>
        {
            public PagingParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
        {

            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }



            // CancellationToken is used to handle cancelled request from a user either because the request is taking its time.
            // CancellationToken is provided by default when creating the request handler 
            // this is helpful if the data being fetched will take a long time for the user to receive or a fail-safe action 
            // when internal connection error is occured. 
            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // .Include gets all data fields that has autocreated using EF migrations in a 
                // particular database, regardless whether it will be used or not.
                // unnecessary bloat

                // var activities = await _context.Activities
                // .Include(a => a.Attendees)
                // .ThenInclude(u => u.AppUser)
                // .ToListAsync();

                // ProjectTo method will get the necessary datafields that are specified in the mapping config
                // and use that to create a query.

                // updated 6/9/2023
                // made this as a queryable to defer the execution of this line
                var query = _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, 
                        new { currentUsername = _userAccessor.GetUsername() })
                    .AsQueryable();

                // not needed if using .ProjectTo()
                // var activitiesToReturn = _mapper.Map<List<ActivityDto>>(activities);

                return Result<PagedList<ActivityDto>>.Success(
                    await PagedList<ActivityDto>.CreateAsync(query, request.Params.PageNumber, 
                        request.Params.PageSize)
                );
            }
        }
    }
}