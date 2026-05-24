# ER Diagram Explanation & Module Workflow

## 1. ER Diagram Explanation
The Entity-Relationship (ER) Diagram represents the logical structure of the database. Below is a mapping of the key relationships:

1.  **Users and Roles (One-to-Many):** Each user is assigned exactly one role (Admin, Doctor, or Patient). One role can be shared by multiple users.
2.  **Users, Doctors, and Patients (One-to-One):**
    - A `User` record exists for every account.
    - If the user is a `Doctor`, they have an entry in the `doctors` table linked by `user_id`.
    - If the user is a `Patient`, they have an entry in the `patients` table linked by `user_id`.
3.  **Departments and Doctors (One-to-Many):** One department (e.g., Cardiology) can have many doctors, but each doctor belongs to one department.
4.  **Doctors, Patients, and Appointments (Many-to-Many relationship resolved by Appointments):**
    - A Patient can book many appointments with various Doctors.
    - A Doctor can have many appointments with various Patients.
    - The `appointments` table acts as the bridge, containing the date, time, and status.
5.  **Appointments and Prescriptions (One-to-One):** Each appointment results in exactly one prescription (after completion).
6.  **Patients and Patient History (One-to-Many):** A single patient can have multiple historical entries representing their medical journey over time.

---

## 2. Module Workflow (Step-by-Step)

### 2.1 User Registration and Login
- **Process:** New patients use the Registration form (Angular).
- **Backend:** The API hashes the password and creates a record in `users` with the 'Patient' role ID, then creates a linked record in `patients`.
- **Login:** Users enter credentials; the backend verifies the hash and returns a JWT containing the user ID and role.

### 2.2 Admin Managing Doctors and Patients
- **Process:** Admin logs in and navigates to "Manage Doctors".
- **Action:** Admin adds a new doctor. The system creates a `user` account first, then adds the `doctor` specific details (Specialization, Dept).
- **Result:** The new doctor can now log in using the credentials set by the admin.

### 2.3 Patient Booking Appointment
- **Process:** Patient selects "Book Appointment" from the dashboard.
- **Selection:** Patient chooses a Department -> Doctor -> Date -> Time Slot.
- **Save:** A new record is inserted into the `appointments` table with a status of `Pending`.
- **Notification:** The appointment appears on the specific doctor's dashboard.

### 2.4 Doctor Viewing and Managing Appointments
- **Process:** Doctor logs in and sees a list of "Today's Appointments".
- **Action:** The doctor can "Confirm" or "Cancel" a pending appointment.
- **Consultation:** Once the doctor meets the patient, they click on "Complete" and are redirected to the prescription form.

### 2.5 Doctor Adding Prescription
- **Process:** After the consultation, the doctor fills in `Diagnosis`, `Medicines`, and `Instructions`.
- **Save:** Data is saved to the `prescriptions` table, linked to the `appointment_id`.
- **History Update:** The system may also add a summary to the `patient_history` table.

### 2.6 Patient Viewing Prescription
- **Process:** Patient logs in and goes to "My Appointments" or "Medical History".
- **View:** They click on a completed appointment to see the digital prescription details provided by the doctor.
- **Download:** (Optional/Future) The patient can print or save the prescription as a PDF.
