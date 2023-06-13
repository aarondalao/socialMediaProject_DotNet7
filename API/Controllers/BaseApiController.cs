using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        // added: 13/06/23  error response
        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (result.isSuccess && result.Value != null)
            {
                return Ok(result.Value);
            }
            if (result.isSuccess && result.Value == null)
            {
                return NotFound();
            }

            return BadRequest(result.Error);
        }
    }
}