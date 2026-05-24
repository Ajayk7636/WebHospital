-- Final Database creation script for Healthcare Appointment and Patient Management System
CREATE DATABASE IF NOT EXISTS healthcare_db;
USE healthcare_db;

-- Roles table
CREATE TABLE IF NOT EXISTS Roles (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    RoleName VARCHAR(20) NOT NULL UNIQUE
);

-- Users table
CREATE TABLE IF NOT EXISTS Users (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    RoleId INT,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Phone VARCHAR(15),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);

-- Departments table
CREATE TABLE IF NOT EXISTS Departments (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    DeptName VARCHAR(50) NOT NULL,
    Description TEXT
);

-- Doctors table
CREATE TABLE IF NOT EXISTS Doctors (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT,
    DeptId INT,
    Specialization VARCHAR(100) NOT NULL,
    Qualification VARCHAR(100),
    Experience INT,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (DeptId) REFERENCES Departments(Id)
);

-- Patients table
CREATE TABLE IF NOT EXISTS Patients (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT,
    DateOfBirth DATE,
    Gender VARCHAR(10),
    Address TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Appointments table
CREATE TABLE IF NOT EXISTS Appointments (
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

-- Prescriptions table
CREATE TABLE IF NOT EXISTS Prescriptions (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    AppointmentId INT,
    Diagnosis TEXT NOT NULL,
    Medicines TEXT,
    Instructions TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (AppointmentId) REFERENCES Appointments(Id)
);

-- Seed Initial Data
INSERT IGNORE INTO Roles (Id, RoleName) VALUES (1, 'Admin'), (2, 'Doctor'), (3, 'Patient');

INSERT IGNORE INTO Departments (Id, DeptName, Description) VALUES
(1, 'Cardiology', 'Heart and cardiovascular system'),
(2, 'Pediatrics', 'Child healthcare'),
(3, 'General Medicine', 'Primary healthcare services');
