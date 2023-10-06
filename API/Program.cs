/*
    TODO: remove CSP REPORT ONLY!!!!
*/ 

using API.Extensions;
using API.Middleware;
using Persistence;
using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using API.SignalR;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


// edited 23/06/23
// effectively this means every single endpoint in the API now Requires authentication EXCEPT AccountController
builder.Services.AddControllers(opt => {
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});

// extension for the third party dependencies
// refactored this 3/6/23
builder.Services.AddApplicationservices(builder.Configuration);

// added 19/06/23
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
// AKA THE MIDDLEWARE

// custom exception handler 
app.UseMiddleware<ExceptionMiddleware>();

// additional headers for security. added 21/09/2023
app.UseXContentTypeOptions();
app.UseReferrerPolicy( options => options.NoReferrer());
app.UseXXssProtection(options => options.EnabledWithBlockMode());
app.UseXfo(options => options.Deny());
app.UseCsp(options => options
    .BlockAllMixedContent()
    .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com"))
    .FontSources(s =>s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
    .FrameAncestors(s => s.Self())
    .ImageSources(s => s.Self().CustomSources("blob:", "https://res.cloudinary.com"))
    .ScriptSources(s => s.Self())
);

// modified 21/09/2023
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else{

    app.Use(async (context, next) => {
    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
    await next.Invoke();
  });
}


app.UseCors("CorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.UseDefaultFiles();

app.UseStaticFiles();

app.MapFallbackToController("Index", "Fallback");

app.MapControllers();

app.MapHub<ChatHub>("/chat");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager);
}
catch (Exception e)
{
    var logger = services.GetRequiredService<ILogger<Program>>();

    logger.LogError(e, "An error occured during migration");
    
}

app.Run();
//