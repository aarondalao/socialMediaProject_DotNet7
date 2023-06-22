/*
    Token Authentication using JWT

    TODO: QqMtQ[Si~ABcz55l23 reseach about asymmetric security keys and implement it here to support HTTPS

    resource:
    https://learn.microsoft.com/en-us/aspnet/core/security/enforcing-ssl?view=aspnetcore-7.0&tabs=visual-studio%2Clinux-ubuntu
    https://learn.microsoft.com/en-us/dotnet/standard/security/generating-keys-for-encryption-and-decryption


    NOTES:
    error 
    {
    "statusCode": 500,
    "message": "IDX10720: Unable to create KeyedHashAlgorithm for algorithm 'http://www.w3.org/2001/04/xmldsig-more#hmac-sha512', the key size must be greater than: '512' bits, key has '144' bits. (Parameter 'keyBytes')",
    "details": "   at Microsoft.IdentityModel.Tokens.CryptoProviderFactory.ValidateKeySize(Byte[] keyBytes, String algorithm, Int32 expectedNumberOfBytes)\r\n   at Microsoft.IdentityModel.Tokens.CryptoProviderFactory.CreateKeyedHashAlgorithm(Byte[] keyBytes, String algorithm)\r\n   at Microsoft.IdentityModel.Tokens.SymmetricSignatureProvider.CreateKeyedHashAlgorithm()\r\n   at Microsoft.IdentityModel.Tokens.DisposableObjectPool`1.CreateInstance()\r\n   at Microsoft.IdentityModel.Tokens.DisposableObjectPool`1.Allocate()\r\n   at Microsoft.IdentityModel.Tokens.SymmetricSignatureProvider.GetKeyedHashAlgorithm(Byte[] keyBytes, String algorithm)\r\n   at Microsoft.IdentityModel.Tokens.SymmetricSignatureProvider.Sign(Byte[] input)\r\n   at Microsoft.IdentityModel.JsonWebTokens.JwtTokenUtilities.CreateEncodedSignature(String input, SigningCredentials signingCredentials)\r\n   at System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler.CreateJwtSecurityTokenPrivate(String issuer, String audience, ClaimsIdentity subject, Nullable`1 notBefore, Nullable`1 expires, Nullable`1 issuedAt, SigningCredentials signingCredentials, EncryptingCredentials encryptingCredentials, IDictionary`2 claimCollection, String tokenType, IDictionary`2 additionalHeaderClaims, IDictionary`2 additionalInnerHeaderClaims)\r\n   at System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler.CreateToken(SecurityTokenDescriptor tokenDescriptor)\r\n   at API.Services.TokenService.CreateToken(AppUser user) in C:\\Users\\Test\\test\\socialMediaProject_DotNet7\\API\\Services\\TokenService.cs:line 41\r\n   at API.Controllers.AccountController.Login(LoginDto loginDto) in C:\\Users\\Test\\test\\socialMediaProject_DotNet7\\API\\Controllers\\AccountController.cs:line 34\r\n   at lambda_method18(Closure, Object)\r\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ActionMethodExecutor.AwaitableObjectResultExecutor.Execute(ActionContext actionContext, IActionResultTypeMapper mapper, ObjectMethodExecutor executor, Object controller, Object[] arguments)\r\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeActionMethodAsync>g__Awaited|12_0(ControllerActionInvoker invoker, ValueTask`1 actionResultValueTask)\r\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeNextActionFilterAsync>g__Awaited|10_0(ControllerActionInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)\r\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Rethrow(ActionExecutedContextSealed context)\r\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Next(State& next, Scope& scope, Object& state, Boolean& isCompleted)\r\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.InvokeInnerFilterAsync()\r\n--- End of stack trace from previous location ---\r\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)\r\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Logged|17_1(ResourceInvoker invoker)\r\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Logged|17_1(ResourceInvoker invoker)\r\n   at Microsoft.AspNetCore.Routing.EndpointMiddleware.<Invoke>g__AwaitRequestTask|6_0(Endpoint endpoint, Task requestTask, ILogger logger)\r\n   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)\r\n   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)\r\n   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)\r\n   at API.Middleware.ExceptionMiddleware.InvokeAsync(HttpContext context) in C:\\Users\\Test\\test\\socialMediaProject_DotNet7\\API\\Middleware\\ExceptionMiddleware.cs:line 29"
}
*/
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
            };
            // TODO: error code 500. please refer to comment at the top
            // symmetric security key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("QqMtQ[Si~ABcz55l23"));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor{
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = credentials,
                            };

            var tokenHandler = new JwtSecurityTokenHandler();
            
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}