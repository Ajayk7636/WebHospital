# MySQL Database Design: Healthcare Management System

## 1. Database Overview
- **Database Name:** `healthcare_db`
- **Engine:** InnoDB (for transaction support and foreign key constraints)
- **Character Set:** `utf8mb4`

---

## 2. Table Structures

### 2.1 Table: `roles`
Stores the different user roles in the system.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique ID |
| `role_name` | VARCHAR(20) | NOT NULL, UNIQUE | Admin, Doctor, Patient |

### 2.2 Table: `users`
Core table for authentication and basic profile info.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique ID |
| `role_id` | INT | FOREIGN KEY (roles.id) | Links to role |
| `first_name` | VARCHAR(50) | NOT NULL | |
| `last_name` | VARCHAR(50) | NOT NULL | |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE | Login credential |
| `password` | VARCHAR(255) | NOT NULL | Hashed password |
| `phone` | VARCHAR(15) | | |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

### 2.3 Table: `departments`
Medical departments (e.g., Cardiology).
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | |
| `dept_name` | VARCHAR(50) | NOT NULL | |
| `description` | TEXT | | |

### 2.4 Table: `doctors`
Extended information for doctor users.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | |
| `user_id` | INT | FOREIGN KEY (users.id) | Link to user account |
| `dept_id` | INT | FOREIGN KEY (departments.id) | Link to department |
| `specialization`| VARCHAR(100) | NOT NULL | |
| `qualification` | VARCHAR(100) | | |
| `experience` | INT | | Years of experience |

### 2.5 Table: `patients`
Extended information for patient users.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | |
| `user_id` | INT | FOREIGN KEY (users.id) | Link to user account |
| `dob` | DATE | | Date of Birth |
| `gender` | ENUM('M', 'F', 'O')| | |
| `address` | TEXT | | |

### 2.6 Table: `appointments`
Manages the booking of slots.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | |
| `patient_id` | INT | FOREIGN KEY (patients.id) | |
| `doctor_id` | INT | FOREIGN KEY (doctors.id) | |
| `app_date` | DATE | NOT NULL | |
| `app_time` | TIME | NOT NULL | |
| `status` | ENUM(...) | DEFAULT 'Pending' | Pending, Confirmed, Completed, Cancelled |
| `reason` | TEXT | | |

### 2.7 Table: `prescriptions`
Medical advice given after an appointment.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | |
| `appointment_id`| INT | FOREIGN KEY (appointments.id)| Link to specific appt |
| `diagnosis` | TEXT | NOT NULL | |
| `medicines` | TEXT | | List of medicines |
| `instructions` | TEXT | | Dosage instructions |

### 2.8 Table: `patient_history`
Chronological medical history or supplementary notes.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | |
| `patient_id` | INT | FOREIGN KEY (patients.id) | |
| `entry_date` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| `description` | TEXT | | Historical medical notes |

---

## 3. SQL CREATE Scripts

```sql
CREATE DATABASE healthcare_db;
USE healthcare_db;

CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE doctors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    dept_id INT,
    specialization VARCHAR(100) NOT NULL,
    qualification VARCHAR(100),
    experience INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dept_id) REFERENCES departments(id)
);

CREATE TABLE patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    dob DATE,
    gender ENUM('M', 'F', 'O'),
    address TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    doctor_id INT,
    app_date DATE NOT NULL,
    app_time TIME NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

CREATE TABLE prescriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT,
    diagnosis TEXT NOT NULL,
    medicines TEXT,
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

CREATE TABLE patient_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);
```

---

## 4. Sample Data for Testing

```sql
INSERT INTO roles (role_name) VALUES ('Admin'), ('Doctor'), ('Patient');

INSERT INTO departments (dept_name, description) VALUES ('Cardiology', 'Heart related issues'), ('General', 'Basic checkups');

-- Password is 'hashed_pwd' for demo
INSERT INTO users (role_id, first_name, last_name, email, password)
VALUES (1, 'System', 'Admin', 'admin@hms.com', 'hashed_pwd');

INSERT INTO users (role_id, first_name, last_name, email, password)
VALUES (2, 'John', 'Doe', 'dr.john@hms.com', 'hashed_pwd');

INSERT INTO doctors (user_id, dept_id, specialization, experience)
VALUES (2, 1, 'Cardiologist', 10);
```

---

## 5. Index Suggestions
- `idx_user_email` on `users(email)`: For faster login lookups.
- `idx_app_date` on `appointments(app_date)`: For filtering daily schedules.
- `idx_patient_id` on `appointments(patient_id)`: To quickly retrieve a patient's booking history.
- `idx_doctor_id` on `appointments(doctor_id)`: To quickly retrieve a doctor's schedule.
