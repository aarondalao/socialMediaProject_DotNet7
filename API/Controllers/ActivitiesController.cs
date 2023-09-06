using Application.Activities;
using Application.Core;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        // api/activities
        // get the list of Activities 
        [HttpGet] 

        // updated :5/9/2023
        // need to take these parameters from the query string and when we're receiving the query string parameters 
        // inside the object, we need to give our API controller a hint on where to find these parameters. so add
        // the FromQuery attribute with the PagingParams class
        public async Task<IActionResult> GetActivities([FromQuery]PagingParams parameter){
            return HandlePagedResult( await Mediator.Send(new List.Query{Params = parameter})); 
        }

         // api/activities/{id}
         // get an activity
        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivity(Guid id){    
            return HandleResult(await Mediator.Send(new Details.Query{Id = id}));
        }

        // api/activities/
        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity){
            return HandleResult(await Mediator.Send(new Create.Command{Activity = activity}));
        }
        
        // api/activities/{id}
        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid Id, Activity activity){
            activity.Id  = Id;

            return HandleResult(await Mediator.Send(new Edit.Command{Activity = activity}));
        }

        // api/activities/{id}
        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id){
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }

        // api/{id}/attend
        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id){
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command{Id = id}));
        }
    }
}