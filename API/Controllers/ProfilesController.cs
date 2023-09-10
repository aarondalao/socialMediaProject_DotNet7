using Microsoft.AspNetCore.Mvc;
using Application.Profiles;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {

        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }   
        [HttpPut]
        public async Task<IActionResult> EditProfileDisplayName(Edit.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }   
        
        // added 9/9/2023
        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetUserActivities(string username, string eventConditions)
        {
            return HandleResult(await Mediator
                .Send(new ListActivities.Query {Username = username, EventConditions = eventConditions}));

        }
    }
}