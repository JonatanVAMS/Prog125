namespace CofreDigitalSeguro.Api.Models
{
    public class VaultItem
    {
        public int Id { get; set; }
        public string EncryptedData { get; set; } = string.Empty; // Correção: Inicializado como string vazia
        public int UserId { get; set; }

        // Correção: A propriedade de navegação pode ser nula, então adicionamos '?'
        public User? User { get; set; }
    }
}