namespace CofreDigitalSeguro.Api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty; 
        public string PasswordHash { get; set; } = string.Empty; 
        public ICollection<VaultItem> VaultItems { get; set; } = new List<VaultItem>();
    }
}