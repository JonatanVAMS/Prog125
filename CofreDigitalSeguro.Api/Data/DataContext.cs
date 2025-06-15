using Microsoft.EntityFrameworkCore;
using CofreDigitalSeguro.Api.Models;

namespace CofreDigitalSeguro.Api.Data
{
   
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<VaultItem> VaultItems { get; set; }
    }
}