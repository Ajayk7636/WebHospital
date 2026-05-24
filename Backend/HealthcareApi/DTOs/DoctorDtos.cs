namespace HealthcareApi.DTOs
{
    public class DoctorCreateDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int DeptId { get; set; }
        public string Specialization { get; set; } = string.Empty;
        public string? Qualification { get; set; }
        public int Experience { get; set; }
    }
}
