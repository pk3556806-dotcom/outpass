package java_backend_reference;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;

// Define a simple class for the incoming JSON data
class LoginRequest {
    String role;
    String username; // This holds USN, Warden Username, or Guard ID
    String password;
}

public class LoginServlet extends HttpServlet {

    private AuthService authService = new AuthService();
    private Gson gson = new Gson(); // Now we will use this!

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        LoginRequest req = null;
        try {
            // 1. Use Gson to deserialize the JSON body from the request
            req = gson.fromJson(request.getReader(), LoginRequest.class);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new LoginResponse(false, "Invalid JSON format")));
            return;
        }
        
        // Check for null fields
        if (req == null || req.role == null || req.username == null || req.password == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new LoginResponse(false, "Missing fields")));
            return;
        }

        Object user = null;
        String role = req.role.toUpperCase();

        switch (role) {
            case "STUDENT":
                user = authService.loginStudent(req.username, req.password);
                break;
            case "WARDEN":
                user = authService.loginWarden(req.username, req.password);
                break;
            case "SECURITY":
                user = authService.loginSecurity(req.username, req.password);
                break;
            default:
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(gson.toJson(new LoginResponse(false, "Invalid role")));
                return;
        }

        // 3. Construct and send the response using Gson
        if (user != null) {
            // Success: Build a response object with relevant data
            LoginResponse successResponse = new LoginResponse(true, "Login successful");
            successResponse.setRole(role);
            
            // Add user-specific data
            if (user instanceof Student) {
                Student student = (Student) user;
                successResponse.setName(student.getName());
                successResponse.setIdentifier(student.getUsn());
            } else if (user instanceof Warden) {
                Warden warden = (Warden) user;
                successResponse.setName(warden.getName());
                successResponse.setIdentifier(warden.getUsername());
            } else if (user instanceof SecurityGuard) {
                SecurityGuard guard = (SecurityGuard) user;
                successResponse.setName(guard.getName());
                successResponse.setIdentifier(guard.getGuardId());
            }

            response.getWriter().write(gson.toJson(successResponse));
        } else {
            // Failure
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(gson.toJson(new LoginResponse(false, "Invalid credentials")));
        }
    }
}