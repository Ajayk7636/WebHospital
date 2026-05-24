# Project Documentation: Healthcare Appointment and Patient Management System

**Project Title:** Healthcare Appointment and Patient Management System
**Academic Level:** B.Tech Final Year Project
**Tech Stack:** Angular (Frontend), ASP.NET Core Web API (Backend), MySQL (Database)

---

## 1. System Design

### 1.1 System Architecture Description
The system follows a classic **3-Tier Architecture** to ensure scalability, maintainability, and security.

*   **Client-Side (Frontend): Angular Application**
    The frontend is developed using Angular, a robust TypeScript-based framework. It serves as the Presentation Layer. It uses a Single Page Application (SPA) approach, role-based routing guards, and Angular Services for API communication.
*   **Server-Side (Backend): ASP.NET Core Web API**
    The backend is built with ASP.NET Core Web API, acting as the Logic Layer. It exposes RESTful endpoints, uses Entity Framework Core (EF Core) as an ORM, and manages business logic and security.
*   **Database Layer: MySQL**
    MySQL is used as the Relational Database Management System (RDBMS) for the Data Layer. The schema is normalized to ensure data integrity and optimized performance.

### 1.2 Role-Based Access Control (RBAC)
Security is implemented using **JWT (JSON Web Tokens)**.
- **Authentication:** Users log in with credentials; the server issues a JWT.
- **Authorization:** The backend validates the JWT and checks the user's role (Admin, Doctor, or Patient) before allowing access to specific API endpoints.

### 1.3 Use Case Explanation
- **Admin:** Manages doctors, patients, departments, and views overall system statistics.
- **Doctor:** Views their specific schedule, accesses patient medical history, and issues digital prescriptions.
- **Patient:** Registers/logs in, searches for doctors by specialty, books appointments, and views their own prescriptions.

---

## 2. API Design

All endpoints are prefixed with `/api/v1`. Authentication is handled via Bearer JWT tokens.

### 2.1 Authentication
| API Name | Method | Endpoint | Purpose | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| **Login** | POST | `/auth/login` | Authenticate user & return JWT | `{ email, password }` |
| **Register** | POST | `/auth/register` | Register a new patient | `{ first_name, last_name, email, password }` |

### 2.2 Doctor & Patient Management
| API Name | Method | Endpoint | Role Required |
| :--- | :--- | :--- | :--- |
| **Get Doctors** | GET | `/doctors` | Any |
| **Add Doctor** | POST | `/doctors` | Admin |
| **Get Patient Profile** | GET | `/patients/{id}` | Admin / Specific Patient |
| **Update Profile** | PUT | `/patients/{id}` | Specific User |

### 2.3 Appointment & Prescription Management
| API Name | Method | Endpoint | Purpose |
| :--- | :--- | :--- | :--- |
| **Book Appointment** | POST | `/appointments` | Patient books a slot |
| **Update Status** | PATCH | `/appointments/{id}/status` | Confirm/Cancel/Complete |
| **Add Prescription** | POST | `/prescriptions` | Doctor adds medical notes |
| **Get History** | GET | `/patients/{id}/history` | View past medical records |

### 2.4 Dashboard
| API Name | Method | Endpoint | Purpose |
| :--- | :--- | :--- | :--- |
| **Admin Stats** | GET | `/dashboard/admin` | Total counts for hospital metrics |
| **Doctor Stats** | GET | `/dashboard/doctor/{id}` | Daily schedule summary |

---

## 3. MySQL Database Design

### 3.1 Table Structure (Simplified)
- **roles:** `id, role_name`
- **users:** `id, role_id, first_name, last_name, email, password, phone`
- **departments:** `id, dept_name, description`
- **doctors:** `id, user_id, dept_id, specialization, qualification, experience`
- **patients:** `id, user_id, dob, gender, address`
- **appointments:** `id, patient_id, doctor_id, app_date, app_time, status, reason`
- **prescriptions:** `id, appointment_id, diagnosis, medicines, instructions`
- **patient_history:** `id, patient_id, entry_date, description`

### 3.2 SQL Create Scripts
```sql
CREATE DATABASE healthcare_db;
USE healthcare_db;

CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE doctors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    specialization VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    doctor_id INT,
    app_date DATE NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);
```

---

## 4. ER Diagram Explanation
The Entity-Relationship (ER) model highlights the following connections:
- **1:N (One-to-Many):** One Department can have many Doctors.
- **1:N (One-to-Many):** One Doctor/Patient can have many Appointments.
- **1:1 (One-to-One):** Each Appointment relates to one unique Prescription record.
- **Self-Contained Auth:** The `users` table acts as the central hub for all roles, ensuring a unified login system while keeping role-specific data separate in `doctors` and `patients` tables.

---

## 5. Module Workflow

1.  **Registration:** Patient signs up; record created in `users` (Role=Patient) and `patients`.
2.  **Booking:** Patient searches for a doctor and picks a slot; record added to `appointments` (Status=Pending).
3.  **Approval:** Doctor/Admin confirms the appointment (Status=Confirmed).
4.  **Consultation:** Doctor meets patient, marks appointment as 'Completed', and fills out the `prescriptions` form.
5.  **Review:** Patient logs in, visits "My History", and views the issued prescription details.

---

## 6. Conclusion
The "Healthcare Appointment and Patient Management System" provides a streamlined digital solution for managing medical consultations. By utilizing a modern tech stack (Angular and ASP.NET Core), the system ensures a responsive UI and a secure, scalable backend. This project serves as a foundational model for hospital digitization, focusing on core workflows like booking and digital prescriptions.
