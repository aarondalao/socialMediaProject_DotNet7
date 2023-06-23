using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; }        

        [Required]
        public string Username { get; set; }

         
        [Required]
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4-12}$", ErrorMessage = "Password must be 4-12 characters long, must has uppercase and lowercase")]
        public string Password { get; set; }


    }
}