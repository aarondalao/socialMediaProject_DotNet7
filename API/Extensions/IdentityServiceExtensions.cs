/*
    services like transient and singleton. need to research about this
*/

using API.Services;
using Domain;
using Persistence;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config){
            services.AddIdentityCore<AppUser>( options => 
            {
                options.Password.RequireNonAlphanumeric = false;
            })
            .AddEntityFrameworkStores<DataContext>();

            services.AddAuthentication();

            // created 22/06/23 
            services.AddScoped<TokenService>();

            return services;
        }
    }
}