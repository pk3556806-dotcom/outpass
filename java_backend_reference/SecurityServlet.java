package java_backend_reference;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;

public class SecurityServlet extends HttpServlet {
    
    private PassService passService = new PassService();
    private Gson gson = new Gson();

    /**
     * Handles POST request: Security Guard scans a pass for EXIT or RETURN.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PassScan scan = null;
        try {
            scan = gson.fromJson(request.getReader(), PassScan.class);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new LoginResponse(false, "Invalid JSON format for pass scan.")));
            return;
        }

        if (scan == null || scan.getPassId() == null || scan.getType() == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new LoginResponse(false, "Missing passId or event type.")));
            return;
        }
        
        String eventType = scan.getType().toUpperCase();

        boolean success = passService.recordPassEvent(scan.getPassId(), eventType);

        if (success) {
            String message = eventType.equals("EXIT") ? "Student successfully exited." : "Student successfully returned.";
            response.getWriter().write(gson.toJson(new LoginResponse(true, message)));
        } else {
            // This failure could mean the pass was not found, or status was incorrect (e.g., trying to EXIT a PENDING pass)
            String message = "Pass action failed. Check if the pass is APPROVED or if it has already been used/returned.";
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new LoginResponse(false, message)));
        }
    }
}