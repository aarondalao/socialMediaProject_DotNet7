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
        public async Task<IActionResult> GetActivities([FromQuery]PagingParams parameters){
            return HandlePagedResult( await Mediator.Send(new List.Query{Params = parameters})); 
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