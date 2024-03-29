/*
    Token Authentication using JWT

    TODO: reseach about asymmetric security keys and implement it here to support HTTPS

    resource:
    https://learn.microsoft.com/en-us/aspnet/core/security/enforcing-ssl?view=aspnetcore-7.0&tabs=visual-studio%2Clinux-ubuntu
    https://learn.microsoft.com/en-us/dotnet/standard/security/generating-keys-for-encryption-and-decryption
    https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-7.0&tabs=linux


    NOTES:
    
    development key: check appsettings.development.json
    NEVER USE THAT PHRASE ON appsettings.development.json EVER AGAIN

*/
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Domain;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        private readonly IConfiguration _config;
        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
            };

            // symmetric security key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"]));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(5),
                SigningCredentials = credentials,
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public RefreshToken GenerateRefreshToken()
        {
            // assign a new variable randomNumber as a byte with a length of 32
            var randomNumber = new byte[32];
            
            // create a new instance of RandomNumberGenerator
            using var randNumGen = RandomNumberGenerator.Create();

            // fill the randomNumber with generated cryptographically random alphanumeric values
            randNumGen.GetBytes(randomNumber);
            
            // return a new refresh token with a token converted into base 64 string
            return new RefreshToken{
                Token = Convert.ToBase64String(randomNumber)
            };
        }
    }
}