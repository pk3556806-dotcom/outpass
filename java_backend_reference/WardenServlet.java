package java_backend_reference;

import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;

// Class for the incoming JSON data to approve/reject a pass
class PassUpdate {
    long passId;
    String status; // "APPROVED" or "REJECTED"
    String rejectionReason;
}

public class WardenServlet extends HttpServlet {
    
    private PassService passService = new PassService();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // The Warden requests a list of pending passes
        List<Pass> pendingPasses = passService.getPendingPasses();
        
        response.getWriter().write(gson.toJson(pendingPasses));
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PassUpdate update = null;
        try {
            update = gson.fromJson(request.getReader(), PassUpdate.class);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new LoginResponse(false, "Invalid JSON format")));
            return;
        }

        if (update == null || update.passId <= 0 || update.status == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new LoginResponse(false, "Missing required pass update fields.")));
            return;
        }

        boolean success = passService.updatePassStatus(
            update.passId, 
            update.status.toUpperCase(), 
            update.rejectionReason
        );

        if (success) {
            response.getWriter().write(gson.toJson(new LoginResponse(true, "Pass status updated successfully.")));
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(new LoginResponse(false, "Failed to update pass status. Check logs.")));
        }
    }
}