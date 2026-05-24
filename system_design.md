# System Design: Healthcare Appointment and Patient Management System

## 1. System Architecture Description
The Healthcare Appointment and Patient Management System follows a classic **3-Tier Architecture** to ensure scalability, maintainability, and security.

### 1.1 Client-Side (Frontend): Angular Application
The frontend is developed using Angular, a robust TypeScript-based framework. It serves as the Presentation Layer where users (Admin, Doctor, Patient) interact with the system.
- **Single Page Application (SPA):** Provides a seamless user experience without full page reloads.
- **Component-Based Architecture:** Reusable UI components for dashboards, forms, and tables.
- **Routing & Guards:** Role-based navigation and route protection to ensure only authorized users access specific pages.
- **Services:** Responsible for making HTTP calls to the backend API using Angular’s `HttpClient`.

### 1.2 Server-Side (Backend): ASP.NET Core Web API
The backend is built with ASP.NET Core Web API, acting as the Logic Layer.
- **RESTful Endpoints:** Exposes JSON-based APIs for the frontend.
- **Entity Framework Core (EF Core):** Acts as the Object-Relational Mapper (ORM) to interact with the MySQL database.
- **Dependency Injection:** Built-in DI for managing service lifetimes (e.g., Database Context, Repository patterns).
- **Middleware:** Handles authentication, logging, and exception handling.

### 1.3 Database Layer: MySQL
MySQL is used as the Relational Database Management System (RDBMS) for the Data Layer.
- **Normalized Schema:** Data is organized into tables to reduce redundancy.
- **Relationships:** Uses Primary Keys and Foreign Keys to maintain data integrity.
- **Stored Procedures/Indexed Queries:** Optimized for dashboard statistics and report generation.

### 1.4 Role-Based Access Control (RBAC)
Security is implemented using **JWT (JSON Web Tokens)**.
- **Authentication:** Users log in with credentials; the server issues a JWT.
- **Authorization:** The backend validates the JWT and checks the user's role (Admin, Doctor, or Patient) before allowing access to specific API endpoints.

---

## 2. Use Case Explanation
The system caters to three primary actors:

1.  **Admin:**
    - Manage Doctor profiles (Create, Read, Update, Delete).
    - Manage Patient profiles.
    - View system-wide dashboard statistics.
    - Manage Departments.
2.  **Doctor:**
    - View scheduled appointments.
    - Access Patient medical history.
    - Issue Prescriptions for completed appointments.
    - Update profile and availability status.
3.  **Patient:**
    - Register and manage personal profile.
    - Search for doctors and book appointments.
    - View personal appointment history.
    - Download/View issued prescriptions.

---

## 3. Workflow Explanation

### 3.1 Admin Workflow
1. Log in to the Admin Dashboard.
2. Add new departments (e.g., Cardiology, Orthopedics).
3. Create Doctor accounts and assign them to departments.
4. Monitor total appointments and patient registrations via the dashboard.

### 3.2 Patient Workflow
1. Register on the platform.
2. Log in and browse available doctors by department.
3. Select a doctor and a preferred time slot to book an appointment.
4. View the status of the appointment (Pending/Approved/Cancelled).
5. After the consultation, view the digital prescription provided by the doctor.

### 3.3 Doctor Workflow
1. Log in to the Doctor Portal.
2. View the list of today's appointments.
3. During a consultation, view the patient's past history.
4. Add a prescription (medicines, dosage, instructions).
5. Mark the appointment as "Completed".

---

## 4. High-Level Process Flow
1. **Request:** The user performs an action on the Angular UI (e.g., Booking an appointment).
2. **API Call:** The Angular Service sends an asynchronous HTTP POST request with a JWT in the header to the ASP.NET Core API.
3. **Validation & Logic:** The API controller validates the token, processes the business logic, and uses EF Core to update the MySQL database.
4. **Response:** The database returns the result to the API, which then sends a JSON response (e.g., 200 OK) back to the frontend.
5. **UI Update:** The Angular application receives the data and updates the view dynamically.

---

## 5. Suggested Diagrams for Report
*For the final report, the following diagrams should be included based on the design above:*
- **Architecture Diagram:** Showing the flow from User Browser -> Angular -> Web API -> MySQL.
- **Use Case Diagram:** Mapping Admin, Doctor, and Patient to their respective functions.
- **Flowchart:** Illustrating the Appointment Booking process.
- **ER Diagram:** Showing the logical connection between Users, Doctors, Patients, Appointments, and Prescriptions.
