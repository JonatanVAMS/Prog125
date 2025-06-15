using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CofreDigitalSeguro.Api.Data;
using CofreDigitalSeguro.Api.Models;

namespace CofreDigitalSeguro.Api.Controllers
{
    // CONTROLE DE ACESSO: O atributo [Authorize] tranca este controller inteiro.
    // Ninguém pode acessar nenhuma rota aqui sem um token JWT válido e não expirado.
    [Authorize]
    [ApiController]
    [Route("api/[controller]")] // URL será /api/Vault
    public class VaultController : ControllerBase
    {
        private readonly DataContext _context;

        public VaultController(DataContext context)
        {
            _context = context;
        }

        
        public record VaultItemDto(string EncryptedData);
        public record VaultItemResponse(int Id, string EncryptedData);


        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!); 


        [HttpGet]
        public async Task<IActionResult> GetItems()
        {
            var userId = GetUserId();
            var items = await _context.VaultItems
                .Where(item => item.UserId == userId) 
                .Select(item => new VaultItemResponse(item.Id, item.EncryptedData))
                .ToListAsync();

            return Ok(items);
        }

        
        [HttpPost]
        public async Task<IActionResult> AddItem(VaultItemDto dto)
        {
            var newItem = new VaultItem
            {
                EncryptedData = dto.EncryptedData,
                UserId = GetUserId() 
            };

            _context.VaultItems.Add(newItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetItems), new { id = newItem.Id }, new VaultItemResponse(newItem.Id, newItem.EncryptedData));
        }

       
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var userId = GetUserId();
         
            var item = await _context.VaultItems.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

            if (item == null)
            {
                return NotFound(); 
            }

            _context.VaultItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent(); 
        }
    }
}