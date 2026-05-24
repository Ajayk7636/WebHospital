# PROJECT DESIGN REPORT: Healthcare Appointment and Patient Management System

---

**Project Title:** Healthcare Appointment and Patient Management System
**Course Code:** B.Tech Final Year Project (CS/IT)
**Document Type:** System Architecture & Design Specification
**Version:** 1.0
**Tech Stack:** Angular 19, ASP.NET Core 9.0 Web API, MySQL 8.0

---

## 1. EXECUTIVE SUMMARY
The Healthcare Appointment and Patient Management System is a centralized digital solution designed to streamline the interaction between patients, doctors, and hospital administrators. This report details the UI/UX design, system architecture, API specifications, and database schema required to build a scalable and professional healthcare platform.

---

## 2. MAIN SCREEN / LANDING PAGE DESIGN

The application features a modern, clean, and responsive user interface designed using Angular and Material Design principles. The layout is divided into three primary sections: Header, Sidebar, and Main Content Area.

### 1.1 Layout Components
-   **Header (Top Navigation Bar):**
    -   **Logo & App Name:** "Healthcare HMS" (Left-aligned).
    -   **Global Search:** To quickly find patients or doctors (Admin/Doctor only).
    -   **User Profile:** Shows the name and role of the logged-in user.
    -   **Logout Action:** A quick-access button to end the session.
-   **Sidebar (Role-Based Menu):**
    -   The sidebar dynamically updates based on the user's role (Admin, Doctor, or Patient).
    -   **Menu Items:** Dashboard, Patients, Doctors, Appointments, Prescriptions, Reports.
-   **Main Content Area:**
    -   A central container where different modules (screens) are loaded using Angular Routing.

### 1.2 Navigation Structure
1.  **Public:** Login and Register pages.
2.  **Private (After Login):**
    -   **Dashboard:** Default landing page after login.
    -   **Module Selection:** Clicking a sidebar item loads the corresponding module.
    -   **Breadcrumbs:** To help users keep track of their location within the system.

---

## 3. ROLE-BASED SCREEN DESIGN

### 2.1 Admin Screens
*   **Admin Dashboard:** High-level summary cards showing "Total Doctors", "Total Patients", "Appointments Today", and "Revenue Overview".
*   **Manage Doctors:** A searchable table to list all doctors with buttons to "Add New Doctor", "Edit Profile", or "Deactivate".
*   **Manage Patients:** A comprehensive list of registered patients with access to their medical history summaries.
*   **Reports Section:** Tabular and graphical representation of monthly appointment trends.

### 2.2 Doctor Screens
*   **Doctor Dashboard:** Shows a calendar view of the current day and a list of "Next Up" appointments.
*   **Today’s Appointments:** A dedicated list showing patient names, appointment times, and status (Pending/Confirmed/Completed).
*   **Add Prescription Screen:** A form triggered after an appointment is marked "Completed", allowing the doctor to enter diagnosis and medicines.

### 2.3 Patient Screens
*   **Patient Dashboard:** Quick links to "Book an Appointment" and "View My History". Shows the status of the most recent booking.
*   **My Profile:** An editable form for the patient to update their contact details, address, and date of birth.
*   **View Prescription:** A clean, printable modal view showing medical advice given by the doctor.

---

## 4. APPOINTMENT SCREEN DESIGN

### 3.1 Book Appointment Screen
-   **Step 1: Department Selection:** A dropdown to choose the medical department (e.g., Cardiology).
-   **Step 2: Doctor Selection:** A filtered list of doctors based on the selected department.
-   **Step 3: Date & Slot Selection:** A date picker followed by a grid of available time slots (e.g., 10:00 AM, 10:30 AM).
-   **Confirmation:** A summary of the selection with a "Confirm Booking" button.

### 3.2 Appointment List & Details
-   **Table View:** Shows ID, Date, Time, Doctor/Patient name, and Status (colored badges).
-   **Actions:** "Cancel" button for pending appointments; "View Details" to see the reason for the visit.

---

## 5. PATIENT MODULE SCREEN DESIGN

-   **Patient List Page:** Includes a search bar (search by Name, Email, or Phone).
-   **Add/Edit Patient Page:** A multi-column form for personal details, gender, and contact info.
-   **Medical History Screen:** A chronological timeline showing past appointments, diagnoses, and prescriptions issued to the patient.

---

## 6. DOCTOR MODULE SCREEN DESIGN

-   **Doctor List Page:** Filterable by department and specialization.
-   **Doctor Profile Page:** Displays qualification, experience years, and specialization details.
-   **Availability Screen:** A weekly grid where the admin can define the start and end times for the doctor's shift.

---

## 7. PRESCRIPTION SCREEN DESIGN

-   **Add Prescription Screen:**
    -   **Fields:** Diagnosis (TextArea), Medicines (Table/List with Dosage), Instructions (TextArea).
    -   **Action:** "Save and Complete Appointment".
-   **View Prescription Screen:**
    -   A formal layout designed to look like a medical slip, including Doctor's details, Patient's details, Date, and the Rx list.

---

## 8. SYSTEM DESIGN

### 7.1 Architecture Overview
The system uses a **3-Tier Architecture**:
1.  **Presentation Layer (Angular):** Handles user interaction and UI rendering. Communicates with the backend via HTTP.
2.  **Application Layer (ASP.NET Core):** Contains the business logic, JWT-based authentication middleware, and RESTful controllers.
3.  **Data Layer (MySQL):** Stores relational data for users, appointments, and medical records.

### 7.2 Data Flow
1.  **Frontend:** User fills a form (e.g., Booking an Appointment).
2.  **API:** Angular service sends a POST request with a JWT token to the ASP.NET Core backend.
3.  **Database:** The API validates the request and performs an INSERT/UPDATE in MySQL using Entity Framework Core.
4.  **Response:** The result is sent back as JSON, and the Angular UI updates dynamically.

---

## 9. API DESIGN

| API Name | Method | Endpoint | Request Body | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Login** | POST | `/auth/login` | `{email, password}` | User authentication |
| **Get Doctors** | GET | `/doctors` | None | List available doctors |
| **Book Appt** | POST | `/appointments`| `{patientId, doctorId, date, time}` | Book a new slot |
| **Add Prescription**| POST | `/prescriptions`| `{apptId, diagnosis, medicines}` | Save medical advice |
| **Dashboard Stats**| GET | `/dashboard/stats`| None | Admin/Doctor analytics |

---

## 10. MYSQL DATABASE DESIGN

### 9.1 Schema Design (Normalization: 3NF)
-   **Roles:** Stores role types (Admin, Doctor, Patient).
-   **Users:** Stores credentials and common profile data.
-   **Doctors / Patients:** Link to `Users` for role-specific information.
-   **Appointments:** Connects `Doctors` and `Patients` with a specific `Date` and `Time`.

### 9.2 Sample SQL (Simplified)
```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    RoleId INT,
    FirstName VARCHAR(50),
    Email VARCHAR(100) UNIQUE,
    PasswordHash VARCHAR(255),
    FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);

CREATE TABLE Appointments (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    PatientId INT,
    DoctorId INT,
    AppDate DATE,
    Status VARCHAR(20),
    FOREIGN KEY (PatientId) REFERENCES Patients(Id),
    FOREIGN KEY (DoctorId) REFERENCES Doctors(Id)
);
```

---

## 11. SCREEN NAVIGATION FLOW

The system follows a logical navigation path to ensure a smooth user experience. Below are the primary flows for each role:

### 10.1 Authentication & Initialization Flow
1.  **Landing:** User visits the web URL and is presented with the **Login Screen**.
2.  **Registration:** If the user is a new patient, they navigate to the **Register Screen**.
3.  **Authentication:** Upon providing valid credentials, the system validates the user and stores a **JWT Token**.
4.  **Role Routing:** Based on the user's role (Admin, Doctor, Patient), the Angular Router redirects the user to their specific **Dashboard**.

### 10.2 Patient Booking & History Flow
1.  **Dashboard:** Patient views their dashboard and clicks **"Book Appointment"**.
2.  **Doctor Selection:** Navigates to a searchable list of doctors.
3.  **Slot Booking:** Upon selecting a doctor, the **Booking Screen** opens.
4.  **Submission:** After picking a date and time, the patient clicks **"Confirm"**, which redirects them to **"My Appointments"**.
5.  **History:** Patient can navigate to the **Medical History Screen** at any time to view past prescriptions.

### 10.3 Doctor Consultation Flow
1.  **Dashboard:** Doctor logs in and sees **"Today's Appointments"**.
2.  **Engagement:** Doctor clicks on a specific appointment row to view **Patient Details** and medical history.
3.  **Prescription:** Once the checkup is done, the doctor clicks **"Add Prescription"**.
4.  **Completion:** After saving the prescription, the appointment status changes to **"Completed"**, and the flow returns to the dashboard.

### 10.4 Admin Management Flow
1.  **Management:** Admin clicks **"Manage Doctors"** or **"Manage Patients"** from the sidebar.
2.  **CRUD Actions:** From the list screen, the admin can navigate to **"Add New"** or **"Edit"** forms.
3.  **Reporting:** Admin navigates to the **Reports Module** to view system-wide analytics.

---

## 12. ER DIAGRAM & USE CASE EXPLANATION

### 11.1 ER Diagram Explanation
- **Entities:** Users, Roles, Doctors, Patients, Departments, Appointments, Prescriptions.
- **Relationships:**
    - **User-Role (N:1):** Multiple users can share the same role.
    - **Doctor-Department (N:1):** A doctor belongs to one department.
    - **Doctor-Appointment (1:N):** A doctor can have many appointments.
    - **Patient-Appointment (1:N):** A patient can book many appointments.
    - **Appointment-Prescription (1:1):** Every completed appointment results in one unique prescription.

### 11.2 Use Case Explanation
- **Manage Users:** Admin creates/updates doctor and patient profiles.
- **Search Doctor:** Patient filters doctors by department or name.
- **Book Slot:** Patient selects an available date and time for consultation.
- **Consultation:** Doctor records medical findings and prescribes medication.
- **Generate Report:** Admin views daily/monthly trends of hospital visits.

---

## 13. CONCLUSION

The "Healthcare Appointment and Patient Management System" is designed to provide a robust, user-friendly, and secure platform for managing hospital workflows. By focusing on core modules and a modern tech stack (Angular, ASP.NET Core, MySQL), the project ensures scalability and meets the high standards required for a B.Tech final year submission. The system effectively digitizes the healthcare experience for administrators, medical professionals, and patients alike.
