# B.TECH FINAL YEAR PROJECT: COMPREHENSIVE DESIGN SPECIFICATION REPORT
## PROJECT TITLE: HEALTHCARE APPOINTMENT AND PATIENT MANAGEMENT SYSTEM

---

**Academic Session:** 2025-26
**Subject:** Final Year Project Design Document
**Technology Stack:**
- **Frontend:** Angular 19 (Single Page Application)
- **Backend:** ASP.NET Core 9.0 Web API
- **Database:** MySQL 8.0 (Relational Storage)
- **Authentication:** JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)

---

## 1. MAIN SCREEN / LANDING PAGE DESIGN

The main screen is the primary interface for authenticated users, featuring a responsive and professional "Admin-LTE" style layout optimized for healthcare workflows.

### 1.1 UI Layout Components
-   **Header:**
    -   *Hospital Logo & Branding:* "Healthcare HMS" prominently displayed.
    -   *Global Search:* Context-aware search for patients or medical records.
    -   *Notification Center:* Real-time alerts for new appointments or status changes.
    -   *User Profile:* Displays logged-in user's name and role (e.g., Dr. Smith - Cardiologist).
-   **Sidebar Menu (Navigation Panel):**
    -   Role-based dynamic navigation links.
    -   Collapsible state to maximize workspace on smaller screens.
-   **Main content area:**
    -   Where individual module screens are rendered via Angular router-outlet.

### 1.2 Navigation Menu Structure (Role-Based)
| Menu Item | Access Role | Link / Route |
| :--- | :--- | :--- |
| Dashboard | All Roles | `/dashboard` |
| Patient Management | Admin, Doctor | `/patients` |
| Doctor Management | Admin | `/doctors` |
| Appointment Book | Patient | `/appointments/book` |
| My Appointments | All Roles | `/appointments/list` |
| Prescription List | Doctor, Patient | `/prescriptions` |
| Analytics & Reports| Admin | `/reports` |
| Logout | All Roles | `/logout` |

---

## 2. ROLE-BASED SCREEN DESIGN

### 2.1 Admin Screens
1.  **Admin Dashboard:** Overview of hospital performance. Includes widgets for "Active Doctors", "Patients Admitted", and "Daily Appointments Graph".
2.  **Manage Patients:** A comprehensive list of all registered patients with CRUD (Create, Read, Update, Delete) capabilities.
3.  **Manage Doctors:** Interface to add medical staff, update their specialization, and assign them to clinical departments.
4.  **Manage Appointments:** Administrative view to reschedule or cancel any appointment across the hospital.
5.  **Reports & Analytics:** Financial and operational reports (e.g., appointments per department per month).

### 2.2 Doctor Screens
1.  **Doctor Dashboard:** Focuses on the current day's schedule. Includes a "Next Patient" alert widget.
2.  **Today’s Appointments:** A focused list showing only the appointments assigned to the logged-in doctor for the current date.
3.  **Patient Details & History:** In-depth view of a specific patient's demographic data and chronological medical history.
4.  **Add Prescription:** Screen triggered after a consultation to record diagnosis and prescribed medications.

### 2.3 Patient Screens
1.  **Patient Dashboard:** Displays upcoming appointment reminders and quick links to download recent prescriptions.
2.  **Book Appointment Wizard:** Step-by-step interface for selecting a doctor and an available slot.
3.  **My Profile:** Self-service portal to update contact information, medical allergies, and profile picture.
4.  **View Prescription:** Professional Rx view optimized for mobile viewing and PDF printing.

---

## 3. APPOINTMENT SCREEN DESIGN

### 3.1 Book Appointment Screen
-   **Purpose:** Allow patients to reserve a consultation slot.
-   **Key Elements:**
    -   Specialty/Department filter.
    -   Doctor profile cards with "Book Now" buttons.
    -   Interactive calendar for date selection.
    -   Time-slot grid (15/30 min intervals) with "Occupied" states.
    -   Brief "Reason for Visit" text area.

### 3.2 Appointment Management Screens
-   **Appointment List Screen:** Tabular view with columns for Date, Time, Doctor/Patient Name, and Status.
-   **Status Display:** Color-coded badges: **Pending** (Yellow), **Confirmed** (Blue), **Completed** (Green), **Cancelled** (Red).
-   **Confirmation Screen:** Displays a success message with a Booking Reference ID and the option to "Add to Google Calendar".

---

## 4. PATIENT MODULE SCREEN DESIGN

### 4.1 Patient List & CRUD
-   **Patient List Page:** Searchable grid view using Angular Material Table with server-side pagination.
-   **Add/Edit Patient Page:** Validation-heavy forms for capturing DOB, Gender, Blood Group, and Contact Details.
-   **View Patient Details:** 360-degree view of the patient, including a timeline of all past medical interactions.

### 4.2 Search & History
-   **Advanced Search:** Filter by Patient ID, Phone Number, or Name.
-   **Medical History Screen:** Chronological list of all previous prescriptions and appointment notes.

---

## 5. DOCTOR MODULE SCREEN DESIGN

### 5.1 Doctor Management
-   **Doctor List Page:** Public view (for patients) and Administrative view (for Admin).
-   **Add/Edit Doctor Page:** Captures qualifications, years of experience, and bio.
-   **Department Assignment:** Dropdown to link a doctor to one of the hospital's clinical departments (e.g., Orthopedics).

### 5.2 Doctor Availability
-   **Availability Screen:** A weekly scheduler where the doctor/admin defines "Working Hours" (e.g., Mon-Fri: 10 AM - 4 PM).

---

## 6. PRESCRIPTION MODULE SCREEN DESIGN

-   **Add Prescription Screen (Doctor Only):**
    -   *Fields:* Diagnosis, Medicines (Name, Dosage, Frequency), and Clinical Notes.
    -   *Action:* "Submit & Mark Appointment as Completed".
-   **Prescription View Screen:**
    -   Formal "Rx" letterhead layout.
    -   Includes hospital contact info, doctor's registration number, and date.
-   **Prescription History:** List view searchable by date for both doctor and patient.

---

## 7. SYSTEM DESIGN & ARCHITECTURE

### 7.1 Overview
The system is built on a **3-Tier Architecture** ensuring scalability, security, and separation of concerns.

1.  **Frontend (Angular):**
    -   Uses Standalone Components and Signals for efficient state management.
    -   Role-based Route Guards to prevent unauthorized access to Admin/Doctor pages.
2.  **Backend (ASP.NET Core Web API):**
    -   Follows the Controller-Service-Repository pattern.
    -   Implements JWT-based authentication for stateless secure communication.
3.  **Database (MySQL):**
    -   Fully normalized RDBMS storing all persistent data.

### 7.2 Data Flow Process
1.  User performs an action (e.g., clicks "Save Patient") on the UI.
2.  Angular Service sends an HTTP request with a Bearer Token to the Web API.
3.  Backend Middleware validates the JWT and checks role permissions.
4.  Controller invokes the business logic and uses Entity Framework Core to update MySQL.
5.  Database returns confirmation; API returns a JSON response to the Frontend.
6.  Angular UI updates via data binding to show the result.

---

## 8. API DESIGN

All endpoints are RESTful and return JSON data.

| API Name | Method | Endpoint | Request Body | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **User Login** | POST | `/api/v1/auth/login` | `{email, password}` | Auth & JWT Token issuance |
| **Add Doctor** | POST | `/api/v1/doctors` | `{name, specialization...}`| Admin creates doctor profile |
| **List Patients** | GET | `/api/v1/patients` | Query Params (page, search)| Get searchable patient list |
| **Book Appointment**| POST | `/api/v1/appointments`| `{doctorId, date, time}` | Reserve a booking slot |
| **Update Appt** | PATCH | `/api/v1/appointments/{id}`| `{status: "Confirmed"}` | Update booking status |
| **Save Prescription**| POST | `/api/v1/prescriptions`| `{apptId, diagnosis...}` | Issue medical advice |
| **Stats Overview** | GET | `/api/v1/dashboard/stats` | None | Dashboard metrics |

---

## 9. MYSQL DATABASE DESIGN

### 9.1 Database Schema Table Definitions
-   **Users:** Centeral account table (`id, email, password_hash, role_id`).
-   **Roles:** Lookup table for `Admin`, `Doctor`, `Patient`.
-   **Departments:** Hospital units (`id, name, description`).
-   **Doctors:** Extended doctor data linked to `Users` via `user_id`.
-   **Patients:** Extended patient data linked to `Users` via `user_id`.
-   **Appointments:** Linking table for bookings (`id, patient_id, doctor_id, date, time, status`).
-   **Prescriptions:** Medical records linked to `Appointments`.

### 9.2 Relationship Mapping
-   **1:N Relationship:** One Role has many Users.
-   **1:1 Relationship:** Each Doctor/Patient has one unique User account.
-   **N:M Relationship:** Patients and Doctors are linked through the `Appointments` junction table.
-   **1:1 Relationship:** Each Appointment can have at most one Prescription record.

---

## 10. SCREEN NAVIGATION FLOW

### 10.1 Typical User Journey
1.  **Authentication:** User arrives at `/login`, enters credentials.
2.  **Redirection:** Backend returns JWT + Role; Angular redirects to `/{role}/dashboard`.
3.  **Module Access:** User clicks "Manage Appointments" from the Sidebar.
4.  **Data Retrieval:** The `AppointmentListComponent` initializes, calling the API to load data.
5.  **Action Execution:** User clicks "Confirm" or "Reschedule".
6.  **Persistence:** API updates MySQL; Frontend shows a success "Toast" notification.

---

## 11. DIAGRAM EXPLANATIONS

### 11.1 Use Case Explanation
The **Use Case Diagram** defines the interaction between roles and features. For instance, the "Book Appointment" use case is initiated by the Patient but viewed by both the Doctor and Admin.

### 11.2 Flowchart Explanation
The **System Flowchart** represents the logical steps for a patient:
`Start -> Login -> Search Doctor -> Check Availability -> Select Slot -> Pay/Confirm -> Appointment Booked -> End`.

### 11.3 ER Diagram Explanation
The **ER Diagram** shows the structural dependency. The `Users` table is the hub for authentication, while `Appointments` is the operational hub connecting healthcare providers with patients.

---

## 12. CONCLUSION
This project design fulfills the academic requirements for a B.Tech final year submission. It provides a realistic, scalable, and professional framework for hospital management, focusing on clean architecture and role-based security.
