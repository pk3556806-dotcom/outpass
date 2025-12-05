# Outpass Spring Boot Backend - Status & Next Steps

## ⚠️ Current Status: **NOT YET RUNNABLE**

This Spring Boot backend migration is currently a **starter template** with foundational setup files. To make it fully runnable, you need to complete the missing components.

---

## What's Currently Included ✅

### 1. **pom.xml** - Maven Dependencies
- Spring Boot 3.1.5 framework
- Spring Data MongoDB for database operations
- Gson for JSON processing
- All required libraries configured

### 2. **application.properties** - Configuration
- MongoDB connection settings
- Server port configuration (8080)
- Logging levels
- Jackson serialization settings

### 3. **OutpassApplication.java** - Main Entry Point
- Spring Boot application starter class
- CORS configuration for frontend communication
- Ready to bootstrap the application

### 4. **SPRING_BOOT_MIGRATION_GUIDE.md** - Complete Documentation
- Detailed migration instructions
- Entity model specifications
- REST API endpoint definitions
- MongoDB schema examples
- Step-by-step implementation guide

---

## What's MISSING ❌ (Why It Won't Run Yet)

### 1. **Entity Classes** (Critical)
```
src/main/java/com/outpass/entity/
├── Student.java
├── Pass.java
├── Warden.java
├── SecurityGuard.java
├── LoginRequest.java
├── LoginResponse.java
└── PassRequest.java
```

### 2. **Repository Interfaces** (Critical)
```
src/main/java/com/outpass/repository/
├── StudentRepository.java
├── PassRepository.java
├── WardenRepository.java
└── SecurityGuardRepository.java
```

### 3. **Service Classes** (Critical)
```
src/main/java/com/outpass/service/
├── AuthService.java
├── PassService.java
└── SecurityService.java
```

### 4. **Controller/REST Endpoint Classes** (Critical)
```
src/main/java/com/outpass/controller/
├── AuthController.java
├── PassController.java
├── StudentController.java
├── WardenController.java
└── SecurityController.java
```

### 5. **Frontend Files** (Required for full functionality)
```
src/main/resources/static/
├── index.html
├── css/
│   └── *.css files
├── js/
│   └── *.js files (with updated API calls)
└── libs/
    └── library files
```

---

## Quick Start Guide

### Prerequisites
1. **Java 17+** installed
2. **Maven 3.6+** installed
3. **MongoDB** running on `localhost:27017`
4. **Git** for cloning the repository

### Setup Steps

#### Step 1: Clone and Navigate
```bash
git clone https://github.com/pk3556806-dotcom/outpass.git
cd outpass/spring-boot-backend
```

#### Step 2: Install Dependencies
```bash
mvn clean install
```

#### Step 3: Create Missing Entity Classes

Create `src/main/java/com/outpass/entity/Student.java`:
```java
package com.outpass.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "students")
public class Student {
    @Id
    private String usn;
    private String name;
    private String password;
    private String department;
    private int semester;
    private String phone;

    // Getters and Setters
}
```

(Repeat for Pass.java, Warden.java, SecurityGuard.java, etc.)

#### Step 4: Create Repository Interfaces

Create `src/main/java/com/outpass/repository/StudentRepository.java`:
```java
package com.outpass.repository;

import com.outpass.entity.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByUsn(String usn);
}
```

#### Step 5: Create Services

Create `src/main/java/com/outpass/service/AuthService.java`:
```java
package com.outpass.service;

import com.outpass.entity.Student;
import com.outpass.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private StudentRepository studentRepository;

    public Student loginStudent(String usn, String password) {
        return studentRepository.findByUsn(usn)
            .filter(s -> s.getPassword().equals(password))
            .orElse(null);
    }
}
```

#### Step 6: Create REST Controllers

Create `src/main/java/com/outpass/controller/AuthController.java`:
```java
package com.outpass.controller;

import com.outpass.entity.LoginRequest;
import com.outpass.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        // Implementation
    }
}
```

#### Step 7: Start MongoDB
```bash
mongod --dbpath /path/to/data
```

#### Step 8: Run the Application
```bash
mvn spring-boot:run
```

Application will be available at: `http://localhost:8080`

---

## Troubleshooting

### Error: "Cannot instantiate entity class"
→ **Solution**: Ensure all entity classes have default constructors and getters/setters

### Error: "No repository bean found"
→ **Solution**: Verify repository interfaces extend `MongoRepository<T, ID>`

### Error: "MongoDB connection refused"
→ **Solution**: Ensure MongoDB is running: `mongod`

### Error: "404 Not Found" on API calls
→ **Solution**: Verify controller `@RequestMapping` annotations match frontend API calls

---

## File Creation Timeline

| Order | File | Status | Impact |
|-------|------|--------|--------|
| 1 | Entity Classes | ❌ Missing | **BLOCKING** - Core models |
| 2 | Repositories | ❌ Missing | **BLOCKING** - Data access |
| 3 | Services | ❌ Missing | **BLOCKING** - Business logic |
| 4 | Controllers | ❌ Missing | **BLOCKING** - REST endpoints |
| 5 | Frontend Files | ❌ Missing | ⚠️ Needed for UI |

---

## Expected Runtime Behavior (After Completion)

✅ Application starts on port 8080
✅ MongoDB connection established
✅ REST API endpoints available at `/api/**`
✅ Frontend serves from `http://localhost:8080`
✅ Student login works: `POST /api/auth/login`
✅ Pass management endpoints functional
✅ Warden approval system operational
✅ Security guard pass validation working

---

## Integration with Frontend

Once backend is running, frontend JavaScript needs these updates:

```javascript
// OLD (Servlet)
fetch('/LoginServlet', { method: 'POST', body: JSON.stringify(data) })

// NEW (Spring Boot)
fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) })
```

---

## Next Actions

1. ✏️ Create all 7 entity classes
2. ✏️ Create 4 repository interfaces  
3. ✏️ Create 3 service classes
4. ✏️ Create 5 REST controllers
5. ✏️ Copy/integrate frontend files
6. ✏️ Update frontend API calls
7. ✏️ Test all endpoints with Postman
8. ✅ Deploy to production

---

## Support Files

Refer to these for implementation details:
- `SPRING_BOOT_MIGRATION_GUIDE.md` - Complete technical guide
- `pom.xml` - All dependencies included
- `application.properties` - Configuration complete
- Original `java_backend_reference/` - Reference implementation

---

**Estimated Time to Completion**: 2-3 hours (if creating all components)
**Difficulty Level**: Intermediate (straightforward conversion from servlet to Spring Boot)
**Prerequisites Knowledge**: Java, Spring Boot, MongoDB basics
