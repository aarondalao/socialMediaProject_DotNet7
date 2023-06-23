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

         // regex expression for Minimum 7 characters Maximum of 15 characters, at least one letter, one number and one special character
        [Required]
        [RegularExpression("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{7,15}$", 
        ErrorMessage = "Password must be 7-15 characters long, must have one letter, one number, and one special character like @$!%*#?&")]
        public string Password { get; set; }


    }
}