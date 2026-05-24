# B.TECH FINAL YEAR PROJECT: DESIGN SPECIFICATION REPORT
## PROJECT TITLE: HEALTHCARE APPOINTMENT AND PATIENT MANAGEMENT SYSTEM

---

**Academic Year:** 2025-26
**Technology Stack:**
- **Frontend:** Angular 19 (SPA Architecture)
- **Backend:** ASP.NET Core 9.0 Web API
- **Database:** MySQL 8.0 (Relational Storage)
- **Security:** JWT (JSON Web Tokens) & RBAC (Role-Based Access Control)

---

## 1. MAIN SCREEN / LANDING PAGE DESIGN

The Landing Page serves as the primary entry point for all users. It is designed to be informative, professional, and accessible.

### 1.1 Layout Components
- **Header:** Features the hospital logo, "Healthcare HMS" title, and a "Login/Register" button for unauthenticated users. For logged-in users, it displays the profile icon and a logout option.
- **Top Navigation Bar:** Includes breadcrumbs to track the current module and a quick-action search bar.
- **Sidebar Menu:** A collapsable navigation panel containing links to:
    - **Dashboard:** Unified metrics view.
    - **Doctor Management:** (Admin only).
    - **Patient Management:** (Admin/Doctor).
    - **Appointment Management:** (All roles).
    - **Prescription Management:** (Doctor/Patient).
    - **Reports:** (Admin only).
- **Footer:** Contains copyright information and quick contact links.

### 1.2 Navigation Structure
- **Public Access:** Home, About Us, Login, Register.
- **Authenticated Access:** Dynamic Sidebar menu items appearing based on the `user_role` claim in the JWT token.

---

## 2. ROLE-BASED SCREEN DESIGN

### 2.1 Admin Screens
- **Admin Dashboard:** Visual cards displaying total counts of doctors, patients, and today’s revenue.
- **Manage Patients:** A master list with search, filter, edit, and delete capabilities.
- **Manage Doctors:** Screen for adding new medical staff and assigning them to departments.
- **Manage Appointments:** High-level view of all hospital bookings with administrative override capabilities.
- **Reports:** Tabular and graphical view of hospital occupancy and booking statistics.

### 2.2 Doctor Screens
- **Doctor Dashboard:** Focuses on the "Workday at a glance"—listing confirmed appointments for the current session.
- **Today’s Appointments:** Optimized list showing patient name, age, gender, and appointment time.
- **Patient List:** Directory of all patients under the doctor's care.
- **Patient Details:** In-depth view including personal info and full medical history.
- **Add Prescription:** Form-based screen for entry of medical findings and medicines.

### 2.3 Patient Screens
- **Patient Dashboard:** Displays status of upcoming bookings and recent prescriptions.
- **Book Appointment:** Multi-step wizard for selecting specialty, doctor, and time slot.
- **View My Appointments:** History and status (Confirmed/Pending/Cancelled) of personal bookings.
- **My Profile:** Account settings to update contact info and profile picture.

---

## 3. APPOINTMENT MODULE DESIGN

### 3.1 Screens and UI Elements
- **Book Appointment Screen:**
    - *Elements:* Dropdown for Specialty, Doctor search bar, Interactive Calendar for Date selection, Time Slot Grid, "Reason for Visit" text area.
- **Appointment List Screen:**
    - *Elements:* Sortable table columns (Date, Doctor, Status), Filter by Status, "Cancel" button.
- **Appointment Details Screen:**
    - *Elements:* Detailed view of the booking including symptoms provided and doctor remarks.
- **Confirmation Screen:**
    - *Elements:* Success message, Reference ID, "Add to Calendar" link.

---

## 4. PATIENT MODULE DESIGN

- **Patient List Page:** Searchable grid view for Admin/Doctor.
- **Add/Edit Patient Page:** Validation-rich forms for PII (Personally Identifiable Information).
- **View Patient Details Page:** Tabbed interface for "Personal Info", "Past Appointments", and "Prescription History".
- **Search Patient Screen:** Advanced filtering by ID, Mobile Number, or DOB.

---

## 5. DOCTOR MODULE DESIGN

- **Doctor List Page:** Publicly accessible view for patients to browse specialties.
- **Add Doctor Page:** Form for Admin to input Qualification, Specialization, and Department.
- **Doctor Availability Screen:** Interface for doctors to set their weekly time slots and holiday dates.
- **Department Assignment Screen:** Mapping doctors to one or more clinical departments (e.g., ENT, Cardiology).

---

## 6. PRESCRIPTION MODULE DESIGN

- **Add Prescription Screen:**
    - *Elements:* Diagnosis input, Medicine autocomplete search, Dosage/Frequency dropdowns, Follow-up date picker.
- **Prescription Details Screen:**
    - *Elements:* Clean Rx format for printing, including hospital header and doctor digital signature.
- **Prescription History Screen:**
    - *Elements:* Chronological list of all prescriptions issued to a specific patient.

---

## 7. SYSTEM DESIGN & ARCHITECTURE

### 7.1 Architectural Overview
The system follows a **Separation of Concerns (SoC)** approach using a 3-Tier Architecture.
1. **Frontend (Angular):** The Presentation Layer handles routing, UI state management, and user input.
2. **Backend (ASP.NET Core Web API):** The Application Logic Layer manages authentication, business rules, and secure communication.
3. **Database (MySQL):** The Data Storage Layer persists all relational data using normalized tables.

### 7.2 Data Flow
- User interactions on the Angular frontend trigger asynchronous HTTP requests.
- The Backend validates the JWT token and processes the request.
- Entity Framework Core maps C# objects to MySQL queries.
- Data is returned as structured JSON for the frontend to render.

---

## 8. API DESIGN SPECIFICATION

| API Name | Method | Endpoint | Request Body | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **User Login** | POST | `/api/v1/auth/login` | `{email, password}` | Auth & JWT issuance |
| **Patient Registration**| POST | `/api/v1/auth/register`| `{firstName, lastName...}`| New patient signup |
| **Get Doctor List** | GET | `/api/v1/doctors` | Query Params | Search/Browse doctors |
| **Book Appointment** | POST | `/api/v1/appointments`| `{doctorId, date, time}` | Reserve a slot |
| **Add Prescription** | POST | `/api/v1/prescriptions`| `{apptId, diagnosis...}` | Save medical advice |
| **Dashboard Summary** | GET | `/api/v1/dashboard` | None | Get role-based stats |

---

## 9. MYSQL DATABASE DESIGN

### 9.1 Database Schema
- **Database Name:** `healthcare_db`
- **Roles:** `id, role_name` (Admin, Doctor, Patient)
- **Users:** `id, role_id, email, password_hash, first_name, last_name, phone`
- **Departments:** `id, name, description`
- **Doctors:** `id, user_id, dept_id, specialization, qualification, experience`
- **Patients:** `id, user_id, dob, gender, address`
- **Appointments:** `id, patient_id, doctor_id, date, time, status, reason`
- **Prescriptions:** `id, appointment_id, diagnosis, medicines, instructions`

### 9.2 Relationships & Normalization
- The database is designed in **3rd Normal Form (3NF)**.
- `Users` is the parent table for authentication. `Doctors` and `Patients` use 1:1 relationships with `Users`.
- `Appointments` acts as a bridging entity for the Many-to-Many relationship between Patients and Doctors.

---

## 10. SCREEN NAVIGATION FLOW

### 10.1 Typical User Workflow
1. **Entry:** User arrives at the login screen.
2. **Action:** User submits credentials; API returns a JWT.
3. **Redirection:** Frontend redirects to `/admin/dashboard` or `/doctor/dashboard` or `/patient/dashboard`.
4. **Navigation:** User clicks "Book Appointment" (Patient) or "View Today's List" (Doctor).
5. **Execution:** User performs a task (e.g., Fill Form -> Save).
6. **Persistence:** Backend saves data to MySQL; Frontend updates with a success toast notification.

---

## 11. DIAGRAM EXPLANATIONS

### 11.1 Use Case Explanation
The **Use Case Diagram** illustrates the interactions between actors (Admin, Doctor, Patient) and system features.
- *Patients* initiate the "Book Appointment" use case.
- *Doctors* execute the "Add Prescription" use case.
- *Admins* supervise the "Doctor Management" use case.

### 11.2 Flowchart Explanation
The **System Flowchart** depicts the logic of appointment booking:
1. Start -> Login -> Role Check.
2. If Patient: Select specialty -> Choose Doctor -> Select Slot -> Confirm.
3. If Doctor: View Appointments -> Conduct Consultation -> Save Prescription.
4. If Admin: Manage staff -> View Reports.

### 11.3 ER Diagram Explanation
The **ER Diagram** shows the logical entity mappings. The central `Appointments` table connects patients and doctors, while the `Prescriptions` table is linked 1:1 to successful consultations, ensuring clinical traceability.

---

## 12. CONCLUSION
The proposed design for the "Healthcare Appointment and Patient Management System" offers a realistic and technically sound blueprint for a B.Tech project. By utilizing modern frameworks and a secure role-based approach, it addresses the core operational needs of a hospital while remaining maintainable and easy to present.
