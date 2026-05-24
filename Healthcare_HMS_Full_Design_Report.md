# B.TECH FINAL YEAR PROJECT: COMPREHENSIVE DESIGN SPECIFICATION
## PROJECT TITLE: HEALTHCARE APPOINTMENT AND PATIENT MANAGEMENT SYSTEM

---

**Academic Session:** 2025-2026
**Department:** Computer Science & Information Technology
**Document Type:** Final System Design Report
**Tech Stack:** Angular 19, ASP.NET Core 9.0 Web API, MySQL 8.0

---

## 1. EXECUTIVE SUMMARY
The **Healthcare Appointment and Patient Management System** is a robust, digital-first healthcare platform designed to streamline clinical workflows and patient engagement. This document serves as the primary design specification, detailing the UI/UX architecture, system engineering, API contracts, and database schema required for a professional-grade medical application.

---

## 2. MAIN SCREEN / LANDING PAGE DESIGN

The Landing Page is the central hub for navigation, employing a modern dashboard-style layout (Admin-LTE inspired) for efficient access.

### 2.1 UI Layout Components
- **Header:**
    - *Hospital Branding:* Logo and "Healthcare HMS" title.
    - *Role Badge:* Distinctive badge indicating the logged-in role (Admin/Doctor/Patient).
    - *Profile Menu:* Dropdown containing "My Profile" and "Logout".
- **Top Navigation Bar:**
    - *Breadcrumbs:* Dynamic trail of current navigation (e.g., Home > Appointments > Book).
    - *Quick Action Search:* Global search for records or doctors.
- **Sidebar Menu (Role-Based):**
    - *Admin:* Dashboard, Manage Doctors, Manage Patients, All Appointments, Analytics.
    - *Doctor:* Dashboard, Today’s List, Patient Registry, My Consultations.
    - *Patient:* Dashboard, Search Doctors, My Bookings, Prescriptions, Profile.

### 2.2 Purpose & Navigation Flow
- **Purpose:** To provide a unified entry point and consistent navigation across all modules.
- **Navigation Flow:** Sidebar interaction triggers Angular dynamic routing, loading components into the main workspace without page refresh.

---

## 3. ROLE-BASED SCREEN DESIGN

### 3.1 Admin Module Screens
| Screen Name | Purpose | Key UI Elements |
| :--- | :--- | :--- |
| **Admin Dashboard** | High-level metrics | Stats Cards (Doctors/Patients), Appointment Trend Chart, Recent Activity Log. |
| **Manage Patients** | Clinical registry | Data Grid with search/filter, "Add Patient" button, Row-level Edit/View history. |
| **Manage Doctors** | Staff management | Doctor Cards, Specialty filters, "Assign Department" dropdown, Edit Profile form. |
| **Manage Appointments**| Administrative override | Global calendar view, Reschedule Modal, Status change dropdowns. |
| **Reports & Analytics** | Strategic insights | Graphical representation of monthly bookings, Dept-wise patient distribution. |

### 3.2 Doctor Module Screens
| Screen Name | Purpose | Key UI Elements |
| :--- | :--- | :--- |
| **Doctor Dashboard** | Session summary | "Next Patient" alert, Progress bar for daily slots, Pending prescriptions list. |
| **Today’s Appointments**| Daily schedule | Sorted list by time, Patient vitals preview, "Start Consultation" button. |
| **Patient Details** | Clinical deep-dive | Tabbed view for Demographics, Allergies, Chronic conditions, Past records. |
| **Add Prescription** | Medical advice entry | Rich-text Diagnosis input, Medicine autocomplete, Dosage grid, Follow-up date. |

### 3.3 Patient Module Screens
| Screen Name | Purpose | Key UI Elements |
| :--- | :--- | :--- |
| **Patient Dashboard** | Self-care portal | Upcoming appointment countdown, Link to latest Rx, Health tips widget. |
| **Book Appointment** | Reservation wizard | Step-by-step Wizard: Select Specialty -> Choose Doctor -> Pick Slot -> Confirm. |
| **View My Appointments**| Personal history | Booking timeline, "Cancel Appointment" button for pending slots. |
| **View Prescription** | Rx Retrieval | Formal Rx layout with Print/PDF download, Clinical notes display. |

---

## 4. APPOINTMENT SCREEN DESIGN & WORKFLOW

### 4.1 Detailed Screens
- **Book Appointment Screen:** Features a 2nd generation DatePicker and a responsive Grid of 15-minute time slots. Available slots are Green; Occupied are Grayed out.
- **Appointment Status Display:**
    - `Pending`: Grey badge, awaiting doctor confirmation.
    - `Confirmed`: Blue badge, slot reserved.
    - `Completed`: Green badge, prescription issued.
    - `Cancelled`: Red badge, slot released.

### 4.2 Workflow
`Search Doctor -> Select Date -> Select Slot -> Enter Symptoms -> Confirmation Modal -> Success Receipt`.

---

## 5. PATIENT MODULE DESIGN

- **Patient List Page:** Search by Name/ID/Mobile.
- **Patient Medical History Screen:** A chronological timeline of all consultations, providing a holistic view of the patient’s health journey.
- **Add/Edit Patient Page:** Data-entry forms with real-time validation for Age, Mobile (10 digits), and Email.

---

## 6. DOCTOR MODULE DESIGN

- **Doctor Availability Screen:** Interface for doctors to set "On-Call" and "OPD" hours.
- **Department Assignment:** Interface for mapping medical staff to hospital units (e.g., Cardiology, ENT, General).
- **Doctor Profile Page:** Professional CV view including Qualifications, Registration Number, and Bio.

---

## 7. PRESCRIPTION MODULE DESIGN

- **Add Prescription Screen:** Unified interface where the doctor selects medicines from a master list and specifies frequency (e.g., 1-0-1).
- **Prescription History Screen:** Searchable archive of all past medical advice, ensuring continuity of care.

---

## 8. SYSTEM DESIGN & ARCHITECTURE

The system implements a **3-Tier Separation of Concerns** architecture.

1. **Frontend (Angular 19):** Handles UI rendering and state management using Standalone Components. Implements RBAC using `AuthGuard` for route protection.
2. **Backend (ASP.NET Core 9.0):** RESTful Web API following a Controller-Repository pattern. Uses JWT (stateless) for security.
3. **Database (MySQL 8.0):** Persistent storage layer using a normalized relational schema for data integrity.

### 8.1 Data Flow Diagram
`Angular UI (Action) -> Web API (Auth & Logic) -> EF Core (ORM) -> MySQL (Data) -> API (JSON) -> Angular (Render)`.

---

## 9. API DESIGN CONTRACTS

| API Name | Method | Endpoint | Request Body | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Login** | POST | `/api/v1/auth/login` | `{email, password}` | JWT Issuance |
| **Add Doctor** | POST | `/api/v1/doctors` | `{firstName, specialization...}`| Create Doctor profile |
| **Book Appointment**| POST | `/api/v1/appointments`| `{patientId, doctorId, date, time}` | Reserve a slot |
| **Issue Prescription**| POST | `/api/v1/prescriptions`| `{apptId, diagnosis, meds}` | Complete checkup |
| **Dashboard Stats** | GET | `/api/v1/dashboard` | None | Get metrics |

---

## 10. MYSQL DATABASE DESIGN

### 10.1 Table Definitions
- **Users:** Hub for authentication (`id, email, password_hash, role_id`).
- **Doctors/Patients:** Extensions of `Users` for role-specific attributes.
- **Appointments:** Central transaction table connecting provider and patient.
- **Prescriptions:** Clinical records linked 1:1 to appointments.

### 10.2 Normalization (3NF)
The schema is designed to eliminate data redundancy, ensuring that patient demographics are separate from transactional appointment data.

---

## 11. DIAGRAM EXPLANATIONS

### 11.1 Use Case Explanation
Defines the functional scope. *Patients* "Request Appointment"; *Doctors* "Review Request" and "Perform Consultation"; *Admins* "Manage Staff" and "Audit Records".

### 11.2 Flowchart Explanation
Represents the system logic from `Landing -> Login -> Dashboard -> Action -> DB Save -> Success Notification`.

### 11.3 ER Diagram Explanation
Visually maps the relationships. Key link is the **One-to-Many** relationship between `Doctors` and `Appointments`, and **One-to-One** between `Appointments` and `Prescriptions`.

---

## 12. CONCLUSION
The **Healthcare Appointment and Patient Management System** fulfills all B.Tech project requirements by providing a comprehensive, realistic, and professional digital ecosystem. It balances technical complexity with user-friendly design, ensuring a high-quality academic submission.
