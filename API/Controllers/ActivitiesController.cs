using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        // api/activities
        // get the list of Activities 
        [HttpGet] 
        public async Task<ActionResult<List<Activity>>> GetActivities(){
            return await Mediator.Send(new List.Query());
        }

         // api/activities/{id}
         // get an activity
        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid id){
            return await Mediator.Send(new Details.Query{Id = id});
        }

        // api/activities/
        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity){
            return Ok(await Mediator.Send(new Create.Command{Activity = activity}));
        }
        
        // api/activities/{id}
        [HttpPut("{id}")]

        public async Task<IActionResult> EditActivity(Guid Id, Activity activity){
            activity.Id  = Id;

            return Ok(await Mediator.Send(new Edit.Command{Activity = activity}));
        }

        // api/activities/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id){
            return Ok(await Mediator.Send(new Delete.Command{Id = id}));
        }
    }
}