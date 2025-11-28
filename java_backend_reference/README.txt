# Java Backend Reference Code

This folder contains the server-side code requested for the Student Out-Pass System.
Since the prototype running on Replit is a Frontend-Only Mockup (using React + Node.js for preview), this Java code is provided as a reference implementation for you to set up locally.

## Folder Structure

- /database
  - schema.sql        : SQL script to create MySQL database and tables.

- /src/com/campuspass
  - /servlet
    - StudentServlet.java  : Handles login and pass application.
    - WardenServlet.java   : Handles approval/rejection.
    - SecurityServlet.java : Handles QR scanning and validation.
  - /util
    - DBConnection.java    : JDBC connection logic.

## How to Run Locally (VS Code + Tomcat)

1. **Prerequisites**:
   - Install Java JDK (8 or higher).
   - Install Apache Tomcat Server.
   - Install MySQL Server.

2. **Database Setup**:
   - Open MySQL Workbench or command line.
   - Run the script in `database/schema.sql` to create the `campus_pass_db` database.

3. **Project Setup**:
   - Create a "Dynamic Web Project" in Eclipse/IntelliJ OR a Maven project in VS Code.
   - Copy the `src` folder content into your project's Java source folder.
   - Add the MySQL JDBC Driver (mysql-connector-java.jar) to your project's build path / lib folder.
   - Add the `org.json` library for JSON parsing.

4. **Configuration**:
   - Update `src/com/campuspass/util/DBConnection.java` with your local MySQL username and password.

5. **Frontend Integration**:
   - The React frontend currently uses `AuthContext.tsx` and `PassContext.tsx` to mock API calls.
   - To connect to this Java backend, you will need to replace the mock logic in those files with `fetch()` calls to your Tomcat server (e.g., `http://localhost:8080/api/student/login`).

## API Endpoints (Implemented in Servlets)

- POST /api/student/login
- POST /api/student/apply
- POST /api/warden/approve
- POST /api/warden/reject
- POST /api/security/scan
- POST /api/security/mark-used
