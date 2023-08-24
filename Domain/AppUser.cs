using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public ICollection<ActivityAttendee> Activities { get; set; }
        public ICollection<Photo> Photos { get; set; }

        public ICollection<UserFollowings> Followers { get; set; }
        public ICollection<UserFollowings> Followings { get; set; }
    }
}