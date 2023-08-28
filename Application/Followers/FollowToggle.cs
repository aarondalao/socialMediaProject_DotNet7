using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                var target = await _context.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUsername);

                if (target == null) return null;

                var followingUser = await _context.UserFollowings.FindAsync(observer.Id, target.Id);

                if (followingUser == null)
                {
                    followingUser = new UserFollowings
                    {
                        Observer = observer,
                        Target = target
                    };
                    _context.UserFollowings.Add(followingUser);
                }
                else{
                    _context.UserFollowings.Remove(followingUser);
                }

                var success =  await _context.SaveChangesAsync() > 0;

                if(success) {
                    return Result<Unit>.Success(Unit.Value);
                }

                return Result<Unit>.Failure("Updating the following has failed. please contact the devs.");
            }
        }
    }
}