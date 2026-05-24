# Healthcare Appointment and Patient Management System

This is a complete B.Tech final year project codebase featuring an Angular frontend and an ASP.NET Core Web API backend.

## Tech Stack
- **Frontend:** Angular 19+
- **Backend:** ASP.NET Core 9.0 Web API
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens) with BCrypt password hashing.

---

## Project Structure
- `/Backend`: ASP.NET Core Web API project.
- `/Frontend`: Angular application.
- `setup_db.sql`: Database schema and seed data script.
- `final_project_document.md`: Comprehensive system and API design documentation.

---

## Setup Instructions

### 1. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench or Command Line).
2. Execute the `setup_db.sql` script to create the `healthcare_db` database and its tables.
3. Update the connection string in `Backend/HealthcareApi/appsettings.json` if your MySQL credentials differ from the default.

### 2. Backend Setup
1. Navigate to the `Backend/HealthcareApi` directory.
2. Restore dependencies:
   ```bash
   dotnet restore
   ```
3. Run the application:
   ```bash
   dotnet run
   ```
4. The API will be available at `http://localhost:5000` (or as specified in `launchSettings.json`).
5. You can view the Swagger UI at `http://localhost:5000/swagger`.

### 3. Frontend Setup
1. Navigate to the `Frontend/HealthcareWeb` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm start
   ```
4. Open your browser at `http://localhost:4200`.

---

## Core Features
- **User Authentication:** Registration and Login for Admin, Doctor, and Patient.
- **Appointment Booking:** Patients can browse doctors and book appointments.
- **Dashboard:** Role-based dashboards showing relevant stats and schedules.
- **Prescription Management:** Doctors can issue prescriptions after consultation.
- **Data Integrity:** Fully relational database with proper foreign keys and normalization.

---

## Academic Documentation
For the full system design, API specifications, and ER diagrams suitable for project report inclusion, please refer to:
- `final_project_document.md`
- `system_design.md`
- `api_design.md`
- `database_design.md`
- `workflow_er.md`
