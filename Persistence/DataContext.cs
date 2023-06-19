using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        // constructor of the class "DataContext" that is linked to "DbContext"
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        // database set that will represent as the tables
        public DbSet<Activity> Activities { get; set; }

    }
}