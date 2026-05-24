# B.TECH FINAL YEAR PROJECT: COMPREHENSIVE DESIGN SPECIFICATION
## PROJECT TITLE: HEALTHCARE APPOINTMENT AND PATIENT MANAGEMENT SYSTEM

---

**Academic Session:** 2025-2026
**Department:** Computer Science & Engineering
**Technology Stack:** Angular 19, ASP.NET Core 9.0, MySQL 8.0
**Document Type:** Full System Design & Technical Specification

---

## 1. EXECUTIVE SUMMARY
The **Healthcare Appointment and Patient Management System (HAPMS)** is a professional-grade digital health platform designed to automate clinical workflows. The system facilitates seamless interaction between patients, doctors, and administrators, focusing on core healthcare modules: Appointment Scheduling, Electronic Prescriptions, and Patient Medical Records. Built with a modern 3-tier architecture, it ensures security, scalability, and a superior user experience suitable for university-level project submission.

---

## 2. MAIN SCREEN / LANDING PAGE DESIGN

The application features a modern, responsive dashboard interface inspired by clinical ERP systems. It serves as the primary entry point for all users.

### 2.1 Layout Components
- **Header:**
    - *Branding:* Hospital Logo and "Healthcare HMS" title.
    - *Role Badge:* Distinctive badge indicating the logged-in role (Admin/Doctor/Patient).
    - *Profile Section:* Displays user name and a dropdown menu with "My Profile" and "Logout".
- **Top Navigation Bar:**
    - *Breadcrumbs:* Dynamic navigation trail (e.g., Dashboard > Appointments > Book).
    - *Search Bar:* Global search for patient records (for Admin/Doctor) or Doctors (for Patients).
    - *Notifications:* Bell icon for appointment alerts and status updates.
- **Sidebar Menu (Role-Based Access):**
    - **Dashboard Link:** Unified metrics view for all roles.
    - **Admin Menu:** Manage Patients, Manage Doctors, Manage Appointments, Reports, Department Settings.
    - **Doctor Menu:** Today’s Appointments, Patient Registry, My Profile, Consultation History.
    - **Patient Menu:** Book Appointment, My Bookings, My Prescriptions, Profile Settings.

---

## 3. ROLE-BASED SCREEN DESIGN

### 3.1 Admin Screens
- **Admin Dashboard:** Visual cards displaying total counts for Doctors, Patients, and Today’s Appointments. Includes a graphical chart showing monthly booking trends.
- **Manage Patients:** A master list with search, filter, and "Add Patient" capability. Admins can view and edit any patient's demographic data.
- **Manage Doctors:** Screen for adding medical staff, specifying their specialization, and assigning them to clinical departments.
- **Manage Appointments:** Administrative override screen to reschedule or cancel any hospital appointment if required by the facility.
- **Reports:** Tabular and graphical representation of hospital stats, such as appointment completion rates and department-wise patient distribution.

### 3.2 Doctor Screens
- **Doctor Dashboard:** Focuses on the current session, showing "Next Patient" alerts and a progress bar for daily slots.
- **Today’s Appointments:** Sorted list showing patient names, appointment times, and a "Start Consultation" button.
- **Patient List:** Directory of all patients that have ever visited this doctor.
- **Patient Details:** Tabbed view for Demographics, Medical History, and past prescriptions.
- **Add Prescription:** Form-based screen to input diagnosis, select medicines from a master list, and set dosage.

### 3.3 Patient Screens
- **Patient Dashboard:** Displays upcoming appointment reminders, health tips, and quick links to recent prescriptions.
- **Book Appointment:** Multi-step wizard (Select Specialty -> Choose Doctor -> Pick Slot -> Confirm).
- **View My Appointments:** History and status of personal bookings with a "Cancel" action for pending slots.
- **My Profile:** Account settings to update contact information, address, and profile picture.

---

## 4. APPOINTMENT SCREEN DESIGN & WORKFLOW

### 4.1 Detailed Screens
- **Book Appointment Screen:** Features a responsive calendar and a grid of 15-minute time slots. Available slots are Green; Occupied/Past are Greyed out.
- **Appointment List Screen:** Sortable table with columns for Date, Time, Doctor/Patient Name, and Status.
- **Appointment Details Screen:** Shows symptoms provided by the patient, doctor's confirmed time, and eventually, the link to the prescription.
- **Cancel Appointment Action:** A confirmation modal that allows users to provide a reason for cancellation.
- **Status Display:**
    - `Pending`: Awaiting doctor/admin confirmation.
    - `Confirmed`: Slot reserved and patient notified.
    - `Completed`: Consultation finished and Rx issued.
    - `Cancelled`: Slot released by patient or hospital.

### 4.2 Workflow
1. Patient selects Department -> Doctor.
2. System fetches Doctor’s availability for the selected date.
3. Patient selects an empty Slot and enters "Reason for Visit".
4. System validates the slot and creates a 'Pending' record.
5. Doctor confirms, and the status updates to 'Confirmed'.

---

## 5. PATIENT MODULE DESIGN

- **Patient List Page:** Searchable grid view for hospital staff.
- **Add Patient Page:** Form to register a patient manually (usually for walk-ins by Admin).
- **Edit Patient Page:** Interface to update demographic or contact details.
- **View Patient Details Page:** Comprehensive view of the patient’s journey.
- **Patient Medical History Screen:** A chronological timeline of all consultations, providing a holistic view of the patient’s health.
- **Search Patient Screen:** Advanced filtering by Unique Patient ID or Mobile Number.

---

## 6. DOCTOR MODULE DESIGN

- **Doctor List Page:** Publicly accessible view for patients to browse medical staff.
- **Add Doctor Page:** Form for Admin to input Qualification, Specialization, and registration numbers.
- **Edit Doctor Page:** Interface for updating doctor professional details or department.
- **Doctor Profile Page:** Professional CV view including Qualifications and Experience.
- **Doctor Availability Screen:** Interface for doctors to set their "OPD Hours" (e.g., 09:00 AM to 05:00 PM) and "Off Days".
- **Department Assignment Screen:** Mapping doctors to units like Cardiology, ENT, or General Medicine.

---

## 7. PRESCRIPTION MODULE DESIGN

- **Add Prescription Screen (Doctor):**
    - Diagnosis (Rich-text).
    - Medicine Selection (Autocomplete search).
    - Dosage (e.g., 1-0-1) and Duration (e.g., 5 days).
    - Follow-up date picker.
- **Prescription Details Screen:** Professional digital Rx format with hospital header, doctor's registration info, and a "Print/PDF" option.
- **View Prescription Screen:** Read-only view for patients to access their medical advice.
- **Prescription History Screen:** Searchable archive of all past medical advice given to a specific patient.

---

## 8. SYSTEM DESIGN & ARCHITECTURE

The system implements a **3-Tier Separation of Concerns** architecture.

1.  **Presentation Layer (Angular 19):** Handles UI rendering and state management. Implements RBAC using `AuthGuard`.
2.  **Logic Layer (ASP.NET Core 9.0):** RESTful Web API following a Controller-Repository pattern. Uses JWT for stateless security.
3.  **Data Layer (MySQL 8.0):** Persistent storage using a normalized relational schema.

### 8.1 Data Flow Logic
`Angular UI (Action) -> Web API (Auth & Validation) -> EF Core (ORM) -> MySQL (Data) -> API (JSON) -> Angular (Dynamic Update)`.

---

## 9. API DESIGN SPECIFICATION

All endpoints are prefixed with `/api/v1`. Authentication requires a Bearer JWT Token.

| API Name | Method | Endpoint | Request Body | Response Body | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Login** | POST | `/auth/login` | `{email, password}` | `{token, role, userId}` | 200, 401 |
| **Register** | POST | `/auth/register` | `{firstName, email...}`| `{message, userId}` | 201, 400 |
| **Get Doctors** | GET | `/doctors` | None | `[{id, name, spec...}]`| 200 |
| **Add Doctor** | POST | `/doctors` | `{name, deptId, spec}`| `{id, message}` | 201, 403 |
| **Update Doctor** | PUT | `/doctors/{id}` | `{specialization...}` | `{message}` | 200, 404 |
| **Delete Doctor** | DELETE | `/doctors/{id}` | None | `{message}` | 204, 404 |
| **Get Patients** | GET | `/patients` | None | `[{id, name, email}]` | 200 |
| **Add Patient** | POST | `/patients` | `{firstName, email...}`| `{id, message}` | 201 |
| **Update Patient**| PUT | `/patients/{id}` | `{address, phone}` | `{message}` | 200, 404 |
| **Delete Patient**| DELETE | `/patients/{id}` | None | `{message}` | 204 |
| **Book Appt** | POST | `/appointments` | `{doctorId, date, slot}`| `{id, status}` | 201, 409 |
| **Update Appt** | PATCH | `/appointments/{id}` | `{status: "Confirmed"}` | `{message}` | 200 |
| **Cancel Appt** | DELETE | `/appointments/{id}` | None | `{message}` | 200 |
| **Add Rx** | POST | `/prescriptions` | `{apptId, meds[]}` | `{id, message}` | 201 |
| **Get Rx** | GET | `/prescriptions/{id}` | None | `{rx details}` | 200, 404 |
| **Dashboard** | GET | `/dashboard/stats`| None | `{counts: {...}}` | 200 |

---

## 10. MYSQL DATABASE DESIGN

### 10.1 Database Schema (healthcare_db)
- **roles:** `id, role_name` (Admin, Doctor, Patient).
- **departments:** `id, dept_name, description`.
- **users:** `id, role_id, email, password_hash, first_name, last_name, phone`.
- **doctors:** `id, user_id, dept_id, specialization, qualification, experience`.
- **patients:** `id, user_id, dob, gender, address`.
- **appointments:** `id, patient_id, doctor_id, app_date, app_time, status, reason`.
- **prescriptions:** `id, appointment_id, diagnosis, medicines, instructions`.
- **patient_history:** `id, patient_id, entry_date, description`.

### 10.2 Normalization (3NF)
The database is designed in **3rd Normal Form (3NF)** to eliminate redundancy:
- **1NF:** All columns contain atomic values; there are no repeating groups.
- **2NF:** All non-key attributes are fully functional dependent on the primary key.
- **3NF:** No transitive dependencies exist (e.g., Department names are stored in `departments`, not duplicated in the `doctors` table).

### 10.3 Sample SQL Script
```sql
CREATE DATABASE healthcare_db;
USE healthcare_db;

-- 1. Roles Table
CREATE TABLE Roles (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    RoleName VARCHAR(20) NOT NULL UNIQUE
);

-- 2. Departments Table
CREATE TABLE Departments (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    DeptName VARCHAR(50) NOT NULL,
    Description TEXT
);

-- 3. Users Table (Core Auth)
CREATE TABLE Users (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    RoleId INT,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Phone VARCHAR(15),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);

-- 4. Doctors Table
CREATE TABLE Doctors (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT,
    DeptId INT,
    Specialization VARCHAR(100) NOT NULL,
    Qualification VARCHAR(100),
    Experience INT,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (DeptId) REFERENCES Departments(Id)
);

-- 5. Patients Table
CREATE TABLE Patients (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT,
    DateOfBirth DATE,
    Gender VARCHAR(10),
    Address TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- 6. Appointments Table
CREATE TABLE Appointments (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    PatientId INT,
    DoctorId INT,
    AppDate DATE NOT NULL,
    AppTime TIME NOT NULL,
    Status VARCHAR(20) DEFAULT 'Pending',
    Reason TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PatientId) REFERENCES Patients(Id),
    FOREIGN KEY (DoctorId) REFERENCES Doctors(Id)
);

-- 7. Prescriptions Table
CREATE TABLE Prescriptions (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    AppointmentId INT,
    Diagnosis TEXT NOT NULL,
    Medicines TEXT,
    Instructions TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (AppointmentId) REFERENCES Appointments(Id)
);

-- 8. Patient History Table
CREATE TABLE PatientHistory (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    PatientId INT,
    EntryDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Description TEXT,
    FOREIGN KEY (PatientId) REFERENCES Patients(Id)
);

-- Seed Initial Data
INSERT INTO Roles (RoleName) VALUES ('Admin'), ('Doctor'), ('Patient');
INSERT INTO Departments (DeptName) VALUES ('Cardiology'), ('General Medicine'), ('Pediatrics');
```

---

## 11. SCREEN NAVIGATION FLOW

1.  **Landing:** User arrives at the login screen.
2.  **Auth:** User submits credentials; API returns a JWT.
3.  **Role Routing:** Angular redirects to `/admin/dashboard`, `/doctor/dashboard`, or `/patient/dashboard` based on the JWT role claim.
4.  **Action:** Patient clicks "Book Appointment", selects a doctor, and confirms a slot.
5.  **Completion:** Doctor views the appointment in "Today's List", completes the checkup, and saves a prescription.
6.  **Persistence:** Changes are saved to MySQL via the API, and the UI shows a success notification.

---

## 12. DIAGRAM EXPLANATIONS

### 12.1 Use Case Explanation
The Use Case Diagram defines the functional boundaries. **Patients** interact with the system to "Register," "Book Appointments," and "View Prescriptions." **Doctors** use the system to "Manage Schedule" and "Add Prescriptions." **Admins** perform "User Management" and "Hospital Analytics."

### 12.2 Flowchart Explanation
The Flowchart depicts the logical progression:
- **Start** -> Login -> Role Verification.
- If **Patient**: Browse Doctors -> Check Availability -> Reserve Slot -> Success.
- If **Doctor**: View Today's List -> Conduct Consultation -> Fill Rx Form -> Update Appt Status to 'Completed'.

### 12.3 ER Diagram Explanation
The Entity-Relationship (ER) Diagram maps the logical data links. The **Users** table is the parent. **Doctors** and **Patients** have a 1:1 relationship with Users. **Appointments** act as the bridge (N:M) between Doctors and Patients. **Prescriptions** have a 1:1 link with completed Appointments to ensure clinical traceability. **Departments** link to Doctors in a 1:N relationship.

---

## 13. CONCLUSION
The **Healthcare Appointment and Patient Management System** fulfills all requirements for a B.Tech final year project. It provides a realistic, professional solution for hospital management, showcasing a clean separation of concerns and a secure, role-based user experience.
