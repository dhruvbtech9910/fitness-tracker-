# 🏋️‍♂️ FitPulse - Online Fitness Tracking Web Application

A full-stack, enterprise-grade fitness tracking platform built with **React + Vite**, **Java Spring Boot**, and **Native JDBC (Java Database Connectivity)** communicating with a **MySQL** database.

FitPulse enables athletes and fitness enthusiasts to log training routines, track personal record (PR) lift milestones, set quantifiable fitness goals, participate in community challenges, and view real-time athletic telemetry.

---

## 🚀 Key Features

* **🔐 Authentication & Security**: Stateless JWT-based authentication with BCrypt password hashing, role-based access control (`ROLE_ADMIN` vs `ROLE_USER`), and CORS configuration.
* **⚡ JDBC Data Access Layer (DAO)**: Pure JDBC database connectivity using `PreparedStatement`, `ResultSet`, and atomic transactions (`commit` / `rollback`).
* **🏋️ Workout Logging**: Record training sessions with exercise sets, reps, weight, duration, calorie expenditure, and targeted muscle groups.
* **🎯 Fitness Goals**: Create custom milestones (e.g., strength PRs, body recomposition, endurance runs) with automated progress percentage calculations.
* **🏆 Trophy Case & PR Tracking**: Log personal record lifts with automatic milestone badges (Gold, Diamond, Silver).
* **🔥 Community Challenges**: Join multi-day fitness challenges and log daily check-ins with synchronized participant tracking.
* **🛠️ Admin Dashboard**: System administrators can monitor active athletes, curate fitness content, and manage system toggles.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React Icons |
| **Backend** | Java 17 / 26, Spring Boot 3.3.4, Spring Security, JWT (io.jsonwebtoken) |
| **Database Connectivity** | Native Java JDBC (`java.sql.*`), HikariCP Connection Pool |
| **Database** | MySQL 8.x (`fitness_tracker.sql` schema with 11 relational tables) |
| **Build & Tooling** | Maven Wrapper (`mvnw.cmd`), npm |

---

## 📂 Project Structure

```
fitness tracker/
├── database/
│   └── fitness_tracker.sql        # Complete MySQL database schema & demo seed data
├── backend/                       # Spring Boot Java REST Backend
│   ├── mvnw.cmd                   # Maven wrapper for Windows
│   ├── pom.xml                    # Project dependencies & build plugins
│   └── src/
│       ├── main/
│       │   ├── java/com/fitnesstracker/
│       │   │   ├── config/        # Data initialization & security beans
│       │   │   ├── controller/    # REST API endpoints (/api/workouts, /api/auth, etc.)
│       │   │   ├── dao/           # JDBC Data Access Objects (UserDao, WorkoutDao, etc.)
│       │   │   ├── dto/           # Data Transfer Objects (AuthRequest, RegisterRequest)
│       │   │   ├── entity/        # Domain model entities (User, Workout, Goal, etc.)
│       │   │   ├── exception/     # Global REST exception handling
│       │   │   ├── jdbc/          # DatabaseConnection.java (JDBC connection manager)
│       │   │   ├── security/      # JWT Filter, UserDetailsService, SecurityConfig
│       │   │   └── service/       # Business logic layer connecting controllers to DAOs
│       │   └── resources/
│       │       ├── application.properties      # MySQL datasource configuration
│       │       └── application-dev.properties  # Fallback in-memory profile
│       └── test/
│           └── java/com/fitnesstracker/
│               └── JdbcIntegrationTest.java    # Automated JDBC test suite
└── frontend/                      # React + Vite Frontend
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── components/            # UI components (Navbar, StatCard, WorkoutCard, etc.)
        ├── pages/                 # Views (Dashboard, Workouts, Goals, Progress, etc.)
        └── services/              # API clients communicating with the Java backend
```

---

## 🔌 JDBC Architecture Overview

Database operations are executed through a clean, decoupled Data Access Object (DAO) architecture:

1. **`DatabaseConnection.java`**: Reusable connection manager that acquires connections via Spring's pooled DataSource or fallback `DriverManager`, reading configuration dynamically from environment variables or properties.
2. **Parameterized Queries**: All queries use `PreparedStatement` with `?` markers to ensure 100% protection against SQL injection attacks.
3. **Atomic Transactions**: Multi-table operations (such as saving a Workout together with its individual `WorkoutExercise` sets, or joining a Challenge and inserting into `challenge_participants`) execute inside ACID transactions with automatic rollback on error:
   ```java
   conn.setAutoCommit(false);
   // Insert parent entity ...
   // Insert child entity records ...
   conn.commit();
   ```
4. **Clean Resource Management**: All `Connection`, `PreparedStatement`, and `ResultSet` instances are closed safely using try-with-resources blocks.

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed on your machine:
* **Java JDK**: 17 or higher (JDK 26 fully tested)
* **Node.js**: v18 or higher & npm
* **MySQL Server**: Running on port `3306` (or use the built-in development fallback profile)

---

## 🚀 Getting Started (Windows PowerShell)

### 1. Database Setup
1. Start your local MySQL service.
2. Import the database schema and demo seed data:
```powershell
mysql -u root -p < "database\fitness_tracker.sql"
```

### 2. Configure Database Credentials
Open `backend\src\main\resources\application.properties` and verify your credentials:
```properties
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/fitness_tracker?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:root}
```
*(You can also set environment variables `$env:DB_USERNAME` and `$env:DB_PASSWORD` in your terminal without modifying the file).*

### 3. Start the Java Backend
Open a PowerShell terminal in the `backend` directory:
```powershell
cd "backend"
.\mvnw.cmd spring-boot:run
```
The REST backend will start on **`http://localhost:8080`**.

> [!TIP]
> The backend automatically detects whether MySQL is running on port 3306. If MySQL is offline, it activates an in-memory MySQL-mode fallback so development can continue seamlessly without crashes!

### 4. Start the React Frontend
Open a separate PowerShell terminal in the `frontend` directory:
```powershell
cd "frontend"
npm install
npm run dev
```
Open your browser and navigate to **`http://localhost:5173`**.

---

## 🧪 Running Automated Tests

Run the backend test suite, including the native JDBC integration tests:
```powershell
cd "backend"
.\mvnw.cmd test
```

Tests verify:
* ✅ Acquisition of live JDBC Connections (`DatabaseConnection`).
* ✅ User registration, BCrypt password hashing, and login authentication.
* ✅ Workout CRUD with child exercise records inside atomic JDBC transactions.
* ✅ Fitness goal milestone creation and automatic progress calculations.
* ✅ Personal records (PR) logging and leaderboard aggregation.

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@fitpulse.pro` | `admin123` | Full dashboard access, content curation, user management |
| **Pro Athlete** | `alex.vance@fitpulse.pro` | `user123` | Interactive athlete account with seeded workouts & goals |
| **Standard User** | `user@example.com` | `user123` | General athlete account |

---

## 📄 License
This project is licensed under the MIT License.
