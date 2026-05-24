using HealthcareApi.Data;
using HealthcareApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthcareApi.Controllers
{
    [Route("api/v1/patients")]
    [ApiController]
    [Authorize]
    public class PatientsController : ControllerBase
    {
        private readonly HealthcareContext _context;

        public PatientsController(HealthcareContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPatients()
        {
            var patients = await _context.Patients
                .Include(p => p.User)
                .Select(p => new {
                    p.Id,
                    FullName = p.User!.FirstName + " " + p.User.LastName,
                    p.User.Email,
                    p.User.Phone,
                    p.DateOfBirth,
                    p.Gender
                }).ToListAsync();
            return Ok(patients);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatient(int id)
        {
            var patient = await _context.Patients
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (patient == null) return NotFound();
            return Ok(patient);
        }
    }
}
