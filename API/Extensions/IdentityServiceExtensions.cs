/*
    services like transient and singleton. need to research about this

    NOTES:
    
    development key: check appsettings.development.json
    NEVER USE THAT PHRASE ON appsettings.development.json EVER AGAIN
*/

using System.Text;
using API.Services;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Persistence;


namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {

            // add necessary requirements on account creation here
            services.AddIdentityCore<AppUser>(options =>
            {
                options.Password.RequireNonAlphanumeric = false;
                options.User.RequireUniqueEmail = true;

                // this option will make ALL of our test accounts invalid
                options.SignIn.RequireConfirmedEmail = true;
            })
            .AddEntityFrameworkStores<DataContext>()
            .AddSignInManager<SignInManager<AppUser>>()
            .AddDefaultTokenProviders();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                // added this 18/08/2023 -> authentication for SignalR
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context => 
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;

                        if(!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chat"))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

            // added 28/06/23
            services.AddAuthorization(options =>
            {
                options.AddPolicy("IsActivityHost", policy =>
                {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });

            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();

            // created 22/06/23 
            services.AddScoped<TokenService>();

            return services;
        }
    }
}