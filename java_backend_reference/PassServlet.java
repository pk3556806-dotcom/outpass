package java_backend_reference;

import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;

public class PassServlet extends HttpServlet {
    
    private PassService passService = new PassService();
    private Gson gson = new Gson();

    /**
     * Handles POST request: Student requests a new pass.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PassRequest req = null;
        try {
            req = gson.fromJson(request.getReader(), PassRequest.class);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new LoginResponse(false, "Invalid JSON format for pass request.")));
            return;
        }

        if (req == null || req.getUsn() == null || req.getReason() == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new LoginResponse(false, "Missing required fields (usn, reason, etc.).")));
            return;
        }

        boolean success = passService.createPass(req);

        if (success) {
            response.getWriter().write(gson.toJson(new LoginResponse(true, "Pass requested successfully. Awaiting warden approval.")));
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(new LoginResponse(false, "Failed to create pass. Check server logs.")));
        }
    }
    
    /**
     * Handles GET request: Student views their pass history.
     * Expects USN as a request parameter: /api/pass?usn=4CB24CG010
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String usn = request.getParameter("usn");
        
        if (usn == null || usn.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(gson.toJson(new LoginResponse(false, "Missing 'usn' parameter.")));
            return;
        }

        List<Pass> studentPasses = passService.getPassesByUsn(usn);
        
        response.getWriter().write(gson.toJson(studentPasses));
    }
}