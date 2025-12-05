# Spring Boot Backend Migration Guide

This guide provides comprehensive instructions for migrating the Outpass application backend from a servlet-based Java application to Spring Boot with MongoDB.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Entity Models](#entity-models)
3. [Repositories](#repositories)
4. [Services](#services)
5. [Controllers (REST APIs)](#controllers)
6. [Integration with Frontend](#integration-with-frontend)
7. [Running the Application](#running-the-application)

## Project Structure

```
spring-boot-backend/
├── pom.xml (Maven dependencies)
├── src/main/java/com/outpass/
│   ├── OutpassApplication.java (Main class)
│   ├── entity/
│   │   ├── Student.java
│   │   ├── Pass.java
│   │   ├── Warden.java
│   │   ├── SecurityGuard.java
│   │   ├── LoginRequest.java
│   │   ├── LoginResponse.java
│   │   └── PassRequest.java
│   ├── repository/
│   │   ├── StudentRepository.java
│   │   ├── PassRepository.java
│   │   ├── WardenRepository.java
│   │   └── SecurityGuardRepository.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── PassService.java
│   │   └── SecurityService.java
│   └── controller/
│       ├── AuthController.java
│       ├── PassController.java
│       ├── StudentController.java
│       ├── WardenController.java
│       └── SecurityController.java
├── src/main/resources/
│   └── application.properties (Configuration)
└── src/test/java/ (Test classes)
```

## Entity Models

### 1. Student Entity
Migrated from servlet's Student class:
- usn (University Serial Number) - @Id
- name
- password
- department
- semester
- phone

### 2. Pass Entity
Migrated from servlet's Pass class:
- id (Long, auto-increment -> @Id @GeneratedValue)
- passId
- usn
- studentName
- reason
- date
- timeOut
- status (PENDING/APPROVED/REJECTED/USED)
- rejectionReason
- isEmergency
- qrBase64
- usedFlag
- createdAt (Timestamp)
- exitedAt (Timestamp)
- returnedAt (Timestamp)

### 3. Warden Entity
- username - @Id
- name
- password
- department

### 4. SecurityGuard Entity
- guardId - @Id
- name
- password
- shift

## MongoDB Mapping

All entities are annotated with `@Document` for MongoDB:
- Student -> "students" collection
- Pass -> "passes" collection
- Warden -> "wardens" collection
- SecurityGuard -> "security_guards" collection

## Repositories

Using Spring Data MongoDB for CRUD operations:

```java
public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByUsn(String usn);
}
```

Similarly for Pass, Warden, and SecurityGuard repositories.

## Services

### AuthService
- `loginStudent(username, password)` -> returns Student or null
- `loginWarden(username, password)` -> returns Warden or null
- `loginSecurity(username, password)` -> returns SecurityGuard or null

### PassService
- `createPass(PassRequest)` -> creates new pass
- `getPassesByStudent(usn)` -> retrieves student's passes
- `approvePass(passId)` -> warden approves pass
- `rejectPass(passId, reason)` -> warden rejects pass
- `markPassUsed(passId)` -> security marks pass as used
- `scanPass(qrCode)` -> scans QR code

### SecurityService
- `validatePass(passId)` -> validates pass status
- `recordPassUsage(passId, timeOut)` -> records pass usage

## REST API Endpoints

### Authentication
- `POST /api/auth/login` - Login for all roles
  - Request: `{"role": "STUDENT", "username": "...", "password": "..."}`
  - Response: `{"success": true, "role": "...", "name": "..."}`

### Pass Management (Student)
- `POST /api/passes/apply` - Apply for new pass
- `GET /api/passes/my-passes` - Get student's passes
- `GET /api/passes/scan` - Scan QR code

### Pass Approval (Warden)
- `GET /api/warden/pending-passes` - Get pending passes
- `PUT /api/passes/{passId}/approve` - Approve pass
- `PUT /api/passes/{passId}/reject` - Reject pass with reason

### Pass Validation (Security)
- `POST /api/security/validate-pass` - Validate pass using QR code
- `GET /api/security/passes-today` - Get passes for today

## Integration with Frontend

### 1. Update API Endpoints
Change all servlet endpoints to REST endpoints:

```javascript
// Old: POST to /LoginServlet
// New: POST to /api/auth/login

// Old: POST to /PassServlet
// New: POST to /api/passes/apply
```

### 2. CORS Configuration (if needed)
Add in `application.properties`:
```
spring.mvc.cors.allowed-origins=http://localhost:3000
spring.mvc.cors.allowed-methods=GET,POST,PUT,DELETE
```

### 3. Static Content Serving
Place HTML, CSS, JS in `src/main/resources/static/`:
- HTML files in `static/`
- CSS in `static/css/`
- JS in `static/js/`
- Libraries in `static/libs/`

## Step-by-Step Implementation

### Step 1: Setup Spring Boot Project
```bash
mvn clean install
```

### Step 2: Create Entity Classes
Create MongoDB document classes with proper annotations.

### Step 3: Create Repositories
Extend MongoRepository for each entity.

### Step 4: Implement Services
Transfer business logic from servlets to service layer.

### Step 5: Create REST Controllers
Create @RestController classes to replace servlets.

### Step 6: Configure MongoDB
Ensure MongoDB is running locally:
```bash
mongod --dbpath /path/to/db
```

### Step 7: Run Spring Boot Application
```bash
mvn spring-boot:run
```

Application runs on `http://localhost:8080`

### Step 8: Copy Frontend Files
Copy HTML, CSS, JS files from webcontent to `src/main/resources/static/`

### Step 9: Update Frontend JavaScript
Update all API calls to new REST endpoints:
- Change `.jsp` servlet calls to REST endpoints
- Update fetch/AJAX calls to match new API paths
- Ensure JSON request/response formats match

## Key Differences from Servlet Implementation

| Aspect | Servlet | Spring Boot |
|--------|---------|-------------|
| Database | JDBC/MySQL | MongoDB |
| HTTP Mapping | web.xml | @RequestMapping |
| Request Handling | doPost/doGet | @PostMapping/@GetMapping |
| Response Format | JSON (manual) | JSON (automatic) |
| Dependency Injection | Manual | @Autowired |
| Configuration | web.xml | application.properties |

## Dependencies Used

- Spring Boot 3.1.5
- Spring Data MongoDB
- Gson 2.10.1
- Lombok (optional)
- Java 17

## Database Schema (MongoDB)

### Students Collection
```json
{
  "_id": "USN123",
  "name": "John Doe",
  "password": "hashed_password",
  "department": "CSE",
  "semester": 4,
  "phone": "9876543210"
}
```

### Passes Collection
```json
{
  "_id": ObjectId,
  "passId": "PASS001",
  "usn": "USN123",
  "studentName": "John Doe",
  "reason": "Home visit",
  "date": "2025-12-05",
  "timeOut": "18:00",
  "status": "APPROVED",
  "createdAt": ISODate,
  "exitedAt": null,
  "returnedAt": null,
  "isEmergency": false,
  "qrBase64": "base64_encoded_qr_code",
  "usedFlag": false,
  "rejectionReason": null
}
```

## Testing

Test endpoints using Postman or curl:

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"role": "STUDENT", "username": "USN123", "password": "pass123"}'

# Apply for pass
curl -X POST http://localhost:8080/api/passes/apply \
  -H "Content-Type: application/json" \
  -d '{"usn": "USN123", "reason": "Home visit", "date": "2025-12-05", "timeOut": "18:00"}'
```

## Troubleshooting

1. **MongoDB Connection Error**: Ensure MongoDB is running on localhost:27017
2. **Port Conflict**: Change server.port in application.properties
3. **CORS Issues**: Add @CrossOrigin annotation to controllers or configure in properties
4. **404 Errors**: Verify controller mappings and request paths

## Next Steps

1. Implement all entity classes
2. Create repositories and services
3. Build REST controllers
4. Integrate frontend with new APIs
5. Test all endpoints
6. Deploy to production
