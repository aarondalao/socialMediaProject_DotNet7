/*
    AppUser = the user registered int o the database
    Expires - the time that the refresh token expires
    Token - the refresh token
    Revoked - The time when the refresh token is invalid or cancelled
*/ 
namespace Domain
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public AppUser AppUser { get; set; }
        public string Token { get; set; }
        public DateTime Expires { get; set; } = DateTime.UtcNow.AddDays(7);
        public bool IsExpired { get; set; }
        public DateTime? Revoked { get; set; }
        public bool IsActive => Revoked == null && !IsExpired;
    }
}