# Fitness Tracker - Spring Boot REST Backend

A clean, beginner-friendly Spring Boot backend built for the **Fitness Tracker** web application. Designed with clear layered architecture, simple Java code, and standard Spring annotations—easy to understand and explain in college viva/interviews.

---

## 🏛️ Architecture Overview

The backend follows the classic **Layered Architecture**:

```
React (Frontend)
       ↓  (HTTP REST Requests with JWT)
Controller Layer (@RestController)
       ↓  (Delegates to business logic)
Service Layer (@Service)
       ↓  (Encapsulates rules, data transformations)
Repository Layer (@Repository - Spring Data JPA)
       ↓  (Generates SQL queries automatically)
JPA / Hibernate (ORM)
       ↓  (Object-Relational Mapping)
MySQL Database (`fitness_tracker`)
```

### Role of Each Layer:
1. **Controller (`controller/`)**: Receives HTTP requests from the React frontend, validates input, calls the appropriate service method, and returns HTTP responses (`200 OK`, `201 CREATED`, etc.) with JSON.
2. **Service (`service/`)**: Contains the core business logic (e.g., calculating completion percentage, computing calorie totals, hashing passwords with BCrypt).
3. **Repository (`repository/`)**: Interfaces extending `JpaRepository` that provide built-in CRUD operations (`save`, `findById`, `findAll`, `delete`) without writing manual SQL queries.
4. **Entity (`entity/`)**: Java classes mapped to database tables using JPA annotations (`@Entity`, `@Table`, `@Id`, `@Column`, `@ManyToOne`, `@OneToMany`).
5. **DTO (`dto/`)**: Data Transfer Objects used to receive structured request payloads (`AuthRequest`, `RegisterRequest`) and send customized responses (`AuthResponse`, `ProgressSummaryDto`).
6. **Security (`security/`)**: Spring Security 6 and JWT authentication filter, token generation, and password hashing (`BCryptPasswordEncoder`).

---

## 📁 Project Directory Structure

```
backend/
├── pom.xml                               # Maven project dependencies and build configuration
├── mvn.cmd                               # Local Maven launcher script
├── mvnw.cmd                              # Maven wrapper script
├── README.md                             # Complete documentation and viva guide
└── src/
    ├── main/
    │   ├── java/
    │   │   └── com/
    │   │       └── fitnesstracker/
    │   │           ├── FitnessTrackerApplication.java  # Main Spring Boot application entry point
    │   │           ├── config/
    │   │           │   └── DataInitializer.java        # Seeds starter users, workouts, goals, challenges
    │   │           ├── controller/
    │   │           │   ├── AuthController.java         # /api/auth/login & /api/auth/register
    │   │           │   ├── UserController.java         # /api/users/profile
    │   │           │   ├── WorkoutController.java      # /api/workouts CRUD & stats
    │   │           │   ├── GoalController.java         # /api/goals CRUD
    │   │           │   ├── ProgressController.java     # /api/progress & summary telemetry
    │   │           │   ├── ChallengeController.java    # /api/challenges, join, checkin
    │   │           │   ├── AdminController.java        # /api/admin/users, content, settings
    │   │           │   └── HealthController.java       # /api/health ping check
    │   │           ├── service/
    │   │           │   ├── AuthService.java
    │   │           │   ├── UserService.java
    │   │           │   ├── WorkoutService.java
    │   │           │   ├── GoalService.java
    │   │           │   ├── ProgressService.java
    │   │           │   ├── ChallengeService.java
    │   │           │   └── AdminService.java
    │   │           ├── repository/
    │   │           │   ├── UserRepository.java
    │   │           │   ├── RoleRepository.java
    │   │           │   ├── ExerciseRepository.java
    │   │           │   ├── WorkoutRepository.java
    │   │           │   ├── WorkoutExerciseRepository.java
    │   │           │   ├── FitnessGoalRepository.java
    │   │           │   ├── ProgressRepository.java
    │   │           │   ├── ChallengeRepository.java
    │   │           │   ├── ChallengeParticipantRepository.java
    │   │           │   ├── FitnessContentRepository.java
    │   │           │   └── SystemSettingRepository.java
    │   │           ├── entity/
    │   │           │   ├── User.java
    │   │           │   ├── Role.java
    │   │           │   ├── Exercise.java
    │   │           │   ├── Workout.java
    │   │           │   ├── WorkoutExercise.java
    │   │           │   ├── FitnessGoal.java
    │   │           │   ├── Progress.java
    │   │           │   ├── Challenge.java
    │   │           │   ├── ChallengeParticipant.java
    │   │           │   ├── FitnessContent.java
    │   │           │   └── SystemSetting.java
    │   │           ├── dto/
    │   │           │   ├── AuthRequest.java
    │   │           │   ├── AuthResponse.java
    │   │           │   ├── RegisterRequest.java
    │   │           │   └── ProgressSummaryDto.java
    │   │           ├── security/
    │   │           │   ├── JwtUtil.java                # Token generation, claims parsing, validation
    │   │           │   ├── CustomUserDetailsService.java # Loads user by email for Spring Security
    │   │           │   ├── JwtAuthenticationFilter.java  # Intercepts requests & validates Bearer tokens
    │   │           │   └── SecurityConfig.java         # CORS, CSRF disable, route authorization
    │   │           └── exception/
    │   │               ├── ResourceNotFoundException.java
    │   │               ├── BadRequestException.java
    │   │               └── GlobalExceptionHandler.java # Uniform JSON error messages
    │   └── resources/
    │       ├── application.properties                  # MySQL configuration (Port 8080, db: fitness_tracker)
    │       └── application-dev.properties              # Local offline testing profile (H2 in MySQL mode)
    └── test/
        └── java/com/fitnesstracker/
            └── FitnessTrackerApplicationTests.java     # Spring Boot context load test
```

---

## 🗄️ Database Entities

| Entity | Description | Key Fields |
|---|---|---|
| **User** | Athlete or Admin account | `id`, `name`, `email`, `password` (BCrypt), `role`, `weight`, `targetWeight`, `height`, `age`, `activeStreak`, `workoutsCompleted` |
| **Role** | Access permission level | `id`, `name` (`Athlete`, `System Admin`) |
| **Exercise** | Exercise catalogue | `id`, `name`, `category`, `targetMuscle`, `description` |
| **Workout** | Completed/scheduled routine | `id`, `title`, `category`, `duration`, `caloriesBurned`, `difficulty`, `date`, `exercises` |
| **WorkoutExercise** | Nested exercises in workout | `id`, `workout_id`, `name`, `sets`, `reps`, `weight`, `duration`, `completed` |
| **FitnessGoal** | User fitness milestone | `id`, `user_id`, `title`, `category`, `current`, `target`, `unit`, `progress`, `status` |
| **Progress** | Personal records (PRs) | `id`, `user_id`, `exercise`, `weight`, `reps`, `date`, `badge` |
| **Challenge** | Community fitness challenge | `id`, `title`, `category`, `reward`, `participants`, `durationDays`, `checkIns`, `progress` |
| **ChallengeParticipant** | User challenge registration | `id`, `challenge_id`, `user_id`, `checkIns`, `progress`, `completed` |
| **FitnessContent** | Curated workout articles | `id`, `title`, `category`, `level`, `status`, `description` |
| **SystemSetting** | Admin platform toggles | `id`, `settingKey`, `settingValue`, `description` |

---

## 🔐 Authentication & Security

1. **Passwords**: Stored using **BCrypt** hashing (`$2a$10$...`). Plain text passwords are NEVER stored in the database.
2. **Tokens**: Signed **JSON Web Tokens (JWT)** using `HMAC-SHA256`. Token contains the user's email as subject and expires after 7 days.
3. **Stateless Sessions**: Server creates no sessions in memory (`SessionCreationPolicy.STATELESS`). Every request passes the token in HTTP header:
   ```
   Authorization: Bearer <jwt_token>
   ```
4. **CORS Configuration**: Pre-configured to permit requests from the React frontend running on `http://localhost:5173` (Vite) and `http://localhost:3000` (Create React App).

---

## 🔑 Default Accounts (Seeded Automatically)

| Account Type | Email | Password | Role |
|---|---|---|---|
| **System Admin** | `admin@fitpulse.pro` | `admin123` | `System Admin` |
| **Athlete User** | `alex.vance@fitpulse.pro` | `user123` | `Athlete` |

---

## 🚀 How to Run the Backend

### Prerequisites:
- Java JDK 17 or higher (JDK 26 installed on this system)
- MySQL (Optional: app automatically uses the `dev` in-memory MySQL profile if MySQL service is not yet running)

### Running the Application:
In the `Backend` directory:

```bash
# Using the bundled Maven launcher:
.\mvn.cmd spring-boot:run
```

Or using standard Maven if added to PATH:
```bash
mvn spring-boot:run
```

### With MySQL Database:
1. Start MySQL on `localhost:3306`.
2. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS fitness_tracker;
   ```
3. Start the application. The backend will detect MySQL on port 3306 and connect automatically!
4. Default credentials in `application.properties`:
   - URL: `jdbc:mysql://localhost:3306/fitness_tracker`
   - Username: `root` (or set `DB_USERNAME` env variable)
   - Password: `root` (or set `DB_PASSWORD` env variable)

---

## 📡 REST API Reference

All endpoints are hosted at `http://localhost:8080/api`:

### 1. Health
- `GET /api/health` — Heartbeat verification check. Returns `{ "status": "UP" }`.

### 2. Authentication
- `POST /api/auth/register` — Register a new athlete account.
- `POST /api/auth/login` — Login with `{ "email": "...", "password": "..." }`. Returns `{ "token": "...", "user": { ... } }`.

### 3. User Profile
- `GET /api/users/profile` — Fetch current logged-in user profile.
- `PUT /api/users/profile` — Update user bio metrics (weight, goals, name, etc.).

### 4. Workouts
- `GET /api/workouts` — Get all logged workouts.
- `GET /api/workouts/{id}` — Get single workout by ID.
- `GET /api/workouts/stats` — Get aggregate metrics (total workouts, total calories, total minutes).
- `POST /api/workouts` — Log a new workout routine.
- `PUT /api/workouts/{id}` — Update workout routine.
- `DELETE /api/workouts/{id}` — Delete workout.

### 5. Goals
- `GET /api/goals` — Get all fitness goals with computed completion percentages.
- `POST /api/goals` — Create a new goal.
- `PUT /api/goals/{id}` — Update goal progress or target.
- `DELETE /api/goals/{id}` — Delete goal.

### 6. Challenges
- `GET /api/challenges` — List all community challenges.
- `GET /api/challenges/my` — List challenges joined by current user.
- `GET /api/challenges/{id}` — Get challenge details.
- `POST /api/challenges` — Admin create new challenge.
- `POST /api/challenges/{id}/join` — Join a challenge.
- `POST /api/challenges/{id}/checkin` — Check in daily progress towards challenge badge.
- `DELETE /api/challenges/{id}` — Delete challenge.

### 7. Progress & Personal Records (PRs)
- `GET /api/progress` — Get all personal record lifts and trophy badges.
- `POST /api/progress` — Record a new PR.
- `GET /api/progress/summary` — Aggregated dashboard telemetry (workouts, minutes, calories, streaks, PRs).

### 8. Admin Panel
- `GET /api/admin/users` — List all user accounts.
- `POST /api/admin/users` — Admin create user.
- `PUT /api/admin/users/{id}` — Admin toggle user status (Active / Suspended) or update role.
- `DELETE /api/admin/users/{id}` — Admin delete user account.
- `GET /api/admin/content` — Curated workout catalog.
- `POST /api/admin/content` — Create curated workout content.
- `DELETE /api/admin/content/{id}` — Remove curated content.
- `GET /api/admin/settings` — Get system settings.
- `PUT /api/admin/settings` — Update system setting.

---

## 🎓 College Viva & Interview Guide (Questions & Answers)

### Q1: What is the layered architecture in Spring Boot?
**Answer:** Layered architecture divides the application into distinct responsibilities:
- **Controller Layer**: Handles incoming HTTP requests and responses.
- **Service Layer**: Contains business logic and calculations.
- **Repository Layer**: Handles database communication using Spring Data JPA.
- **Database (MySQL)**: Stores persistent data.
This separation of concerns makes the code clean, modular, and easy to test and maintain.

### Q2: What is the difference between `@Controller` and `@RestController`?
**Answer:** `@RestController` is a convenience annotation that combines `@Controller` and `@ResponseBody`. In a REST API, every method automatically serializes the returned Java objects directly into JSON rather than rendering an HTML view template.

### Q3: How does Spring Data JPA save development time?
**Answer:** By simply declaring an interface that extends `JpaRepository<Entity, ID>`, Spring automatically generates common database queries (`save()`, `findAll()`, `findById()`, `delete()`) and query methods by method name (like `findByEmail()`) without having to write boilerplate SQL queries.

### Q4: Why do we hash passwords with BCrypt instead of storing plain text?
**Answer:** If the database is compromised, plain-text passwords expose user accounts immediately. BCrypt is a one-way cryptographic hash function that includes a random "salt" and an adjustable work factor, making rainbow table attacks and brute force cracking practically impossible.

### Q5: How does JWT authentication work?
**Answer:**
1. The user logs in with email and password at `/api/auth/login`.
2. The server verifies credentials with `AuthenticationManager` and `BCryptPasswordEncoder`.
3. If valid, the server creates a digital token containing the user's identity signed with a secret key (`HMAC-SHA256`).
4. The client saves the token in `localStorage`.
5. For all subsequent requests, the client sends `Authorization: Bearer <token>`.
6. `JwtAuthenticationFilter` reads and validates the signature on every request without needing a database session.

### Q6: What is CORS and why is it needed?
**Answer:** CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks web pages on one origin (e.g., `http://localhost:5173`) from making HTTP requests to a different origin (e.g., `http://localhost:8080`). We configure CORS in `SecurityConfig` to explicitly permit the React frontend development server.
