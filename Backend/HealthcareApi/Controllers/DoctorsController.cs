using HealthcareApi.Data;
using HealthcareApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthcareApi.Controllers
{
    [Route("api/v1/doctors")]
    [ApiController]
    [Authorize]
    public class DoctorsController : ControllerBase
    {
        private readonly HealthcareContext _context;

        public DoctorsController(HealthcareContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDoctors()
        {
            var doctors = await _context.Doctors
                .Include(d => d.User)
                .Include(d => d.Department)
                .Select(d => new {
                    d.Id,
                    FullName = d.User!.FirstName + " " + d.User.LastName,
                    d.Specialization,
                    Department = d.Department!.DeptName,
                    d.Experience
                }).ToListAsync();
            return Ok(doctors);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddDoctor(Doctor doctor)
        {
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();
            return Ok(new { id = doctor.Id, message = "Doctor added successfully" });
        }
    }
}
