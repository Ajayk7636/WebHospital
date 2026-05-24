# API Design: Healthcare Appointment and Patient Management System

This document outlines the RESTful API endpoints for the system. All endpoints are prefixed with `/api/v1`. Authentication is handled via Bearer JWT tokens.

---

## 1. Authentication & User Management
| API Name | Method | Endpoint | Purpose | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Login** | POST | `/auth/login` | Authenticate user and return JWT | `{ email, password }` | `{ token, role, userId }` |
| **Register** | POST | `/auth/register` | Register a new patient account | `{ firstName, lastName, email, password, phone }` | `{ message, userId }` |

**Status Codes:** 200 OK, 401 Unauthorized, 400 Bad Request.

---

## 2. Doctor Management (Admin Only)
| API Name | Method | Endpoint | Purpose | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Get All Doctors** | GET | `/doctors` | List all doctors | None | `[{ id, name, specialty, deptId }]` |
| **Get Doctor by ID**| GET | `/doctors/{id}` | Get specific doctor details | None | `{ doctor details }` |
| **Add Doctor** | POST | `/doctors` | Create a new doctor profile | `{ name, email, deptId, specialization, qualification }` | `{ id, message }` |
| **Update Doctor** | PUT | `/doctors/{id}` | Update doctor information | `{ updated fields }` | `{ message }` |
| **Delete Doctor** | DELETE | `/doctors/{id}` | Remove a doctor | None | `{ message }` |

**Status Codes:** 200 OK, 201 Created, 403 Forbidden (if not Admin).

---

## 3. Patient Management
| API Name | Method | Endpoint | Purpose | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Get All Patients**| GET | `/patients` | List all registered patients | None | `[{ id, name, email }]` |
| **Get Patient Profile**| GET | `/patients/{id}` | Get specific patient profile | None | `{ profile data }` |
| **Update Profile** | PUT | `/patients/{id}` | Patient updates their own info | `{ phone, address, dob }` | `{ message }` |

---

## 4. Appointment Management
| API Name | Method | Endpoint | Purpose | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Book Appointment**| POST | `/appointments` | Patient books a slot | `{ doctorId, patientId, date, timeSlot, reason }` | `{ id, status }` |
| **Get Appointments**| GET | `/appointments` | View appointments (Filtered by role) | Query Params: `?userId=123&role=Doctor` | `[{ appointment details }]` |
| **Update Status** | PATCH | `/appointments/{id}/status`| Admin/Doctor updates status | `{ status: "Confirmed" / "Cancelled" / "Completed" }` | `{ message }` |
| **Cancel Appointment**| DELETE | `/appointments/{id}` | Patient cancels appointment | None | `{ message }` |

---

## 5. Prescription Management
| API Name | Method | Endpoint | Purpose | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Add Prescription** | POST | `/prescriptions` | Doctor adds prescription | `{ appointmentId, diagnosis, medicines: [], instructions }` | `{ id, message }` |
| **Get Prescription** | GET | `/prescriptions/appointment/{id}` | View prescription for an appt | None | `{ prescription details }` |
| **Patient History** | GET | `/patients/{id}/history` | Get all past prescriptions | None | `[{ past prescriptions }]` |

---

## 6. Dashboard & Reports
| API Name | Method | Endpoint | Purpose | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin Stats** | GET | `/dashboard/admin` | Total counts for dashboard | None | `{ totalDoctors, totalPatients, appointmentsToday }` |
| **Doctor Stats** | GET | `/dashboard/doctor/{id}`| Daily stats for doctor | None | `{ pendingAppointments, completedToday }` |

---

## Standard Response Format
For error handling, the API will return a standard structure:
```json
{
  "success": false,
  "message": "Error description here",
  "errors": ["List of validation errors"]
}
```
For success:
```json
{
  "success": true,
  "data": { ... }
}
```
