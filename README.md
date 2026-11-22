# 🏥 MediQueue

<div align="center">

**A Smart Hospital Management and Appointment Scheduling Platform**

A full-stack clinic management system designed to simplify patient administration, doctor scheduling, appointment tracking, and billing.

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

</div>

---

## ✨ Overview

**MediQueue** is a full-stack hospital and clinic management application built to streamline everyday healthcare administration. It provides a centralized platform for managing patient records, doctors, appointments, scheduling, and billing through a modern web interface.

The application combines a Spring Boot REST API with a React and TypeScript frontend, backed by PostgreSQL.

## 🚀 Key Features

- **Patient Management:** Register, view, and update patient records.
- **Doctor Management:** Maintain doctor profiles, specializations, consultation fees, and availability.
- **Smart Appointment Scheduling:** Validate doctor availability, working hours, and overlapping appointments.
- **Appointment Tracking:** Manage scheduled, completed, and cancelled appointments.
- **Dashboard Analytics:** Visualize patient statistics, appointment activity, and appointment status distribution.
- **Billing & Payments:** Generate patient bills, calculate consultation fees, apply discounts, and track additional charges.
- **Payment Tracking:** Support partial and full payments with automatic payment status updates.
- **Printable Invoices:** Generate individual, professionally formatted patient invoices.
- **JWT Authentication:** Secure access using token-based authentication.
- **Role-Based Authorization:** Separate ADMIN and RECEPTIONIST permissions.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, CSS |
| Backend | Java 21, Spring Boot, Spring Security |
| Database | PostgreSQL 18 |
| Authentication | JWT, Role-Based Access Control |
| Build Tool | Maven |
| Charts | Recharts |
| Version Control | Git & GitHub |

## 📂 Project Structure

```text
MEDIQUEUE/
├── backend/
│   ├── src/main/java/com/mediqueue/
│   │   ├── controller/
│   │   ├── entity/
│   │   ├── repository/
│   │   └── service/
│   ├── src/main/resources/
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   └── App.css
│   └── package.json
│
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

- Java 21
- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/harshiig-12/Mediqueue
cd MediQueue
```

### 2. Configure the Database

Create a PostgreSQL database for MediQueue.

Configure the database connection in the backend's `application.properties` file and provide the required environment variables securely.

Required environment variables:

- `DB_PASSWORD`
- `JWT_KEYSTORE_PASSWORD`

The JWT keystore should be stored outside the Git repository.

### 3. Run the Backend

Open a terminal inside the `backend` directory:

```bash
.\mvnw.cmd spring-boot:run
```

Backend runs on:

`http://localhost:8080`

### 4. Run the Frontend

Open another terminal inside the `frontend` directory:

```bash
npm install
npm run dev
```

Frontend runs on:

`http://localhost:5173`

## 🔐 Security

MediQueue implements JWT-based authentication and role-based authorization to protect application resources and restrict administrative operations.

Sensitive credentials and cryptographic keystore files should never be committed to the repository.

## 📈 Project Goals

MediQueue is being developed as a scalable clinic management platform, with a focus on simplifying administrative workflows, improving appointment organization, and providing a better patient management experience.

---

<div align="center">

**Built with ❤️ using Java, Spring Boot, React & PostgreSQL**

*MediQueue — Smarter Clinic Management.*

</div>
