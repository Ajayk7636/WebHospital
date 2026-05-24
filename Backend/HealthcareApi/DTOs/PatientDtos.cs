namespace HealthcareApi.DTOs
{
    public class PatientCreateDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string DateOfBirth { get; set; } = string.Empty; // YYYY-MM-DD
        public string? Gender { get; set; }
        public string? Address { get; set; }
    }

    public class PatientUpdateDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string DateOfBirth { get; set; } = string.Empty; // YYYY-MM-DD
        public string? Gender { get; set; }
        public string? Address { get; set; }
    }
}
